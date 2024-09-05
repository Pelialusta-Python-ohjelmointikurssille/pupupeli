console.log("[Pyodide Worker]: Importing pyodide...");
// eslint-disable-next-line no-undef
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js");
console.log("[Pyodide Worker]: Finished pyodide import");

let waitBuffer;
let pythonRunnerCode;
let isReadyToRunCode = false;
let loadedScripts = [];
let saveState;
let interruptBuffer;
let isResetting = false;
let sharedInputArray;
let hasUsedInput = false;
let userCode;
let isRunning = false;
let ignorePythonFunctions = false;
let hasFinishedExecution = false;

/**
 * Name of the file containing the user's code that should be written into
 * the virtual file system.
 */
const USER_SCRIPT_NAME = "userscript";
/**
 * Time in seconds for which the python execution should sleep between each line of user code.
 */
const CODE_EXECUTION_DELAY = 0.05;

/**
 * Loads pyodide and sets stdin (input) function.
 * @returns {Promise} Promise of when pyodide has finished loading.
 */
async function loadWorkerPyodide() {
    console.log("[Pyodide Worker]: Initializing pyodide");
    console.time("[Pyodide Worker]: Finished initializing pyodide");
    // eslint-disable-next-line no-undef
    self.pyodide = await loadPyodide();
    console.timeEnd("[Pyodide Worker]: Finished initializing pyodide");
    self.postMessage({type: "INIT_OK"});
    self.pyodide.setStdin({
        stdin: () => {
            return stdInHandler();
        }
    });
    self.pyodide.runPython("");
}

let pyodideReadyPromise = loadWorkerPyodide();

self.onmessage = async (event) => {
    await messageHandler(event);
};

/**
 * Handles messages received from worker handler. Works the same way as in worker handler.
 * The actual message content is stored in event.data
 * 
 * The message type is in event.data.type
 * 
 * The content of the message can vary, for example event.data.buffer or event.data.array
 * @param {*} event 
 */
async function messageHandler(event) {
    let message = event.data;
    if (message.type === "RESET") {
        reset();
    }
    if (message.type === "SETWAITBUFFER") {
        setWaitBuffer(message.buffer);
    }
    if (message.type === "SETINTERRUPTBUFFER") {
        setInterruptBuffer(message.buffer);
    }
    if (message.type === "SETSHAREDINPUTARRAY") {
        setSharedInputArray(message.array);
    }
    if (message.type === "RUNCODE") {
        await runCode(message.code, message.playerName);
    }
    if (message.type === "RESET_WORKER_OK") {
        isResetting = false;
        ignorePythonFunctions = false;
        console.log("[Pyodide Worker]: Finished resetting");
    }
    if(message.type === "SETBACKGROUNDCODE") {
        await setBackgroundCode(message.runnerCode, message.codeMap);
        self.postMessage({type: "BACKGROUNDCODE_OK"});
        isReadyToRunCode = true;
        saveCurrentState();
    }
}

/**
 * Run a given python script using pyodide. 
 * @param {string} code Python code to run.
 * @param {string} playerName Name of the player object. For example "pupu" or "robo".
 * @returns Promise of wether pyodide has finished running the python code.
 */
async function runCode(code, playerName) {
    if (isRunning === true) return;
    hasFinishedExecution = false;
    await pyodideReadyPromise.then(
        async () => {
            isRunning = true;
            userCode = code;
            console.log("[Pyodide Worker]: Running python code");
            if (isReadyToRunCode === false) {
                console.warning("[Pyodide Worker]: Trying to run code before worker is ready to run code, returning early...");
                return;
            }
            console.log("[Pyodide Worker]: Writing user code to virtual file");
            await self.pyodide.FS.writeFile(USER_SCRIPT_NAME+".py", code, { encoding: "utf8" });
            console.log("[Pyodide Worker]: Loading packages from imports");
            await self.pyodide.loadPackagesFromImports(code);
            await loadedScripts.forEach(async (element) => {
                await self.pyodide.loadPackagesFromImports(element);
            });
        
            self.pyodide.globals.set("PLAYER_NAME", playerName);
            self.pyodide.globals.set("CODE_WAIT_TIME", CODE_EXECUTION_DELAY);
            self.pyodide.globals.set("USER_SCRIPT_NAME", USER_SCRIPT_NAME);
        
            console.log("[Pyodide Worker]: Running python code");
            isResetting = false;

            try {
                await self.pyodide.runPythonAsync(pythonRunnerCode);
            }
            catch (e) {
                console.error(e);
            }
        }
    )
    .catch((e) => {
        console.error(e);
    })
    .finally(() => {
        if (isResetting === true) {
            self.postMessage({ type: "RESET_OK" });
        }
    });
       
}

function updateResetStatus() {
    if (ignorePythonFunctions === true || interruptBuffer[0] === 0) return;
    ignorePythonFunctions = true;
}

/**
 * Sets the waitBuffer. 
 * The waitbuffer is used to sleep the worker for example when waiting for
 * input or when the user has paused execution.
 * @param {Int32Array} buffer 
 */
function setWaitBuffer(buffer) {
    console.log("[Pyodide Worker]: Got wait buffer");
    waitBuffer = buffer;
    self.postMessage({type: "WAITBUFFER_OK"});
}

/**
 * Sets the interrupt buffer.
 * 
 * The interrupt buffer is used by pyodide to interrupt execution
 * using a KeyboardInterrupt. When element of index 0 is set to 2, the execution will be interrupted.
 * 
 * After being processed, the element is set back to 0.
 * @param {Uint8Array} buffer 
 */
function setInterruptBuffer(buffer) {
    console.log("[Pyodide Worker]: Got interrupt buffer");
    self.pyodide.setInterruptBuffer(buffer);
    interruptBuffer = buffer;
    self.postMessage({type: "INTERRUPTBUFFER_OK"});
}

/**
 * Reset the worker and python execution.
 * @returns 
 */
function reset() {
    // If we are already resetting, don't try to reset again
    if (isResetting === true) return;
    ignorePythonFunctions = true;
    console.log("[Pyodide Worker]: Resetting...");
    isResetting = true;
    loadedScripts = [];
    if (hasFinishedExecution === true) interruptBuffer[0] = 0; 
    self.pyodide.pyodide_py._state.restore_state(saveState);
    hasUsedInput = false;
    if (isRunning === false || hasFinishedExecution === true) {
        self.postMessage({ type: "RESET_OK" });
    }
    isRunning = false;
}
/**
 * Write python files necessary for running user code to pyodide's virtual file system.
 * @param {string} runnerCode 
 * @param {Map<string, string>} codeMap 
 */
async function setBackgroundCode(runnerCode, codeMap) {
    console.log("[Pyodide Worker]: Got python background code");
    codeMap.forEach(async (value, key) => {
        await self.pyodide.FS.writeFile(key, value, { encoding: "utf8" });
        loadedScripts.push(value);
    });
    pythonRunnerCode = runnerCode;
}

/**
 * Set shared input array. Characters are encoded in UTF-16.
 * This is used for input and object counting.
 * @param {Uint16Array} array 
 */
function setSharedInputArray(array) {
    console.log("[Pyodide Worker]: Got shared input array");
    sharedInputArray = array;
    self.postMessage({type: "SHAREDINPUTARRAY_OK"});
}

/**
 * Reads from shared array, used for input and object counting.
 * Characters are encoded in UTF-16.
 * @returns string containing the contents of the array. 
 */
function readFromSharedArray() {
    let userInput = "";
    for (let i = 0; i < sharedInputArray.length; i++) {
        if (sharedInputArray[i] === 0) break;
        let character = String.fromCharCode(sharedInputArray[i]);
        userInput += character;
    }
    console.log(`[Pyodide Worker]: Read from shared input array: ${userInput}`)
    return userInput;
}

/**
 * Save the current state of pyodide.
 */
function saveCurrentState() {
    console.log("[Pyodide Worker]: Saving current pyodide state");
    saveState = self.pyodide.pyodide_py._state.save_state();
}

/**
 * Used to send commands to game.
 * @param {string} cmd The game command in question, defined in game/commonstrings.js
 * @param {array<string>} params Parameters for the command
 * @returns 
 */
function sendCommand(cmd, params) {
    updateResetStatus();
    if (ignorePythonFunctions === true) return;
    console.log("[Pyodide Worker]: Running game command");
    console.log("[Pyodide Worker]: Sleeping worker");
    Atomics.store(waitBuffer, 0, 1);
    Atomics.store(waitBuffer, 2, 1);
    self.postMessage({ type: "COMMAND", command: cmd, parameters: params });
    Atomics.wait(waitBuffer, 0, 1);
    console.log("[Pyodide Worker]: Worker woke up");
}


// -----------------------------------------------------------------------------------------------------

// JS functions called from python

/**
 * Called by python.
 * 
 * When trace function enters a new line in user code, line number is sent using this to the editor UI.
 * @param {number} lineNumber 
 * @returns 
 */
// eslint-disable-next-line no-unused-vars
function processLine(lineNumber) {
    updateResetStatus();
    console.log(this);
    if (ignorePythonFunctions === true) return;
    if (lineNumber <= 0) return;
    console.log(`[Pyodide Worker]: Processing line ${lineNumber}`);
    console.log("[Pyodide Worker]: Sleeping worker");
    Atomics.store(waitBuffer, 0, 1);
    console.log("STORING TO WAITBUFFER [4] = 1");
    Atomics.store(waitBuffer, 4, 1);
    console.log(waitBuffer);
    self.postMessage({ type: "SETLINE", line: lineNumber });
    Atomics.wait(waitBuffer, 0, 1);
    console.log("[Pyodide Worker]: Worker woke up");
}

/**
 * Called from python when the program finishes execution without interruption.
 * 
 * Not called when user resets program.
 * @param {boolean} usedWhileLoop Wether the user used a while loop in the code or not.
 * @param {boolean} usedForLoop Wether the user used a for loop in the code or not.
 * @returns 
 */
// eslint-disable-next-line no-unused-vars
function onFinishedExecution(usedWhileLoop, usedForLoop) {
    hasFinishedExecution = true;
    if (ignorePythonFunctions === true) return;
    let clearedConditions = [];
    clearedConditions.push({ condition: "conditionUsedWhile", parameter: usedWhileLoop });
    clearedConditions.push({ condition: "conditionUsedFor", parameter: usedForLoop });
    clearedConditions.push({ condition: "conditionMaxLines", parameter: userCode.split("\n").filter(line => line.trim() !== "").length });
    clearedConditions.push({ condition: "conditionUsedInput", parameter: hasUsedInput });
    clearedConditions = clearedConditions.filter(condition => condition.parameter !== false);
    self.postMessage({ type: "EXECFINISH", clearedConditions: clearedConditions });
}

/**
 * Called by python when calling a game command, for example moving.
 * @param {string} cmd The game command in question, defined in game/commonstrings.js
 * @param {string} param Parameter for the command, for example the direction of a move command.
 * @returns 
 */
// eslint-disable-next-line no-unused-vars
function runCommand(cmd, param) {
    updateResetStatus();
    if (ignorePythonFunctions === true) return;
    sendCommand(cmd, [param]);
}

/**
 * Called from python. Sends a message to the game to create an object.
 * @param {string} objectType Type of object, defined in game/commonstrings.js
 * @param {number} x 
 * @param {number} y 
 */
// eslint-disable-next-line no-unused-vars
function createObject(objectType, x, y) {
    sendCommand("create_obj", [objectType, x, y]);
}

/**
 * Called from python. Sends a message to the game to destroy any object at the specified coordinates.
 * @param {*} x 
 * @param {*} y 
 */
// eslint-disable-next-line no-unused-vars
function destroyObject(x, y) {
    sendCommand("destroy_obj", [x, y]);
}

/**
 * Called form python to get the number of objects of a certain type.
 * 
 * Works the same as an input request, except the response is the number of objects found.
 * @param {*} objectType Type of object, defined in game/commonstrings.js
 * @returns 
 */
// eslint-disable-next-line no-unused-vars
function getObjectCount(objectType) {
    self.postMessage({ type: "GETOBJECTCOUNT", objectType: objectType });
    //Make the worker sleep.
    Atomics.store(waitBuffer, 0, 1);
    //This doesn't make it sleep, but used by the pause handler to know why the worker is asleep.
    Atomics.store(waitBuffer, 3, 1);
    Atomics.wait(waitBuffer, 0, 1);
    self.pyodide.checkInterrupt();
    return readFromSharedArray();
}

/**
 * Called by python. Sends information about an error if one was encountered.
 * @param {number} lineNumber Line number error occured at.
 * @param {string} errorMessage Condensed error message.
 * @param {string} errorType Type of error, for example SyntaxError
 * @param {string} fullMessage Contains the full error message with traceback.
 */
// eslint-disable-next-line no-unused-vars
function processErrorInfo(lineNumber, errorMessage, errorType, fullMessage) {
    isRunning = false;
    self.postMessage({ type: "ERROR", errorInfo: { line: lineNumber, type: errorType, message: errorMessage, fullMessage: fullMessage } });
}

/**
 * Called from python if python catches a KeyboardInterrupt. This starts the resetting process for the worker.
 */
// eslint-disable-next-line no-unused-vars
function resetFromPython() {
    console.log("[Pyodide Worker]: Python asked for reset");
    reset();
}

/**
 * 
 * @returns The code the user wrote that was run.
 */
// eslint-disable-next-line no-unused-vars
function getSourceCode() {
    return userCode;
}

/**
 * Called when python asks for input. 
 * 
 * First a message is sent to the handler that a response to input is requested.
 * 
 * Then the worker puts itself asleep by writing to the wait buffer.
 * @returns User input that was written into the shared array.
 */
function stdInHandler() {
    self.pyodide.checkInterrupt();
    hasUsedInput = true;
    self.postMessage({ type: "REQUESTINPUT" });
    //Makes the worker sleep
    Atomics.store(waitBuffer, 0, 1);
    //This doesn't make it sleep, but used by the pause handler to know why the worker is asleep.
    Atomics.store(waitBuffer, 3, 1);
    Atomics.wait(waitBuffer, 0, 1);
    self.pyodide.checkInterrupt();
    return readFromSharedArray();
}
