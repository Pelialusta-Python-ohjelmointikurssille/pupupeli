console.log("[Pyodide Worker]: Importing pyodide...");
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js");
console.log("[Pyodide Worker]: Finished pyodide import");

let waitBuffer;
let pythonRunnerCode;
let isReadyToRunCode = false;
let loadedScripts = [];
let saveState;
let interruptBuffer;
let resetting = false;
let sharedInputArray;

const USER_SCRIPT_NAME = "userscript.py";

async function loadWorkerPyodide() {
    console.log("[Pyodide Worker]: Initializing pyodide");
    console.time("[Pyodide Worker]: Finished initializing pyodide");
    self.pyodide = await loadPyodide();
    console.timeEnd("[Pyodide Worker]: Finished initializing pyodide");
    self.postMessage({type: "INIT_OK"});
    self.pyodide.setStdin({
        stdin: () => {
            return stdInHandler();
        }
    });
}

let pyodideReadyPromise = loadWorkerPyodide();

self.onmessage = async (event) => {
    await messageHandler(event);
};

async function messageHandler(event) {
    await pyodideReadyPromise;
    let message = event.data;
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
        await runCode(message.code);
    }
    if (message.type === "RESET") {
    }
    if (message.type === "RESET_WORKER_OK") {
        resetting = false;
        console.log("[Pyodide Worker]: Finished resetting");
    }
    if(message.type === "SETBACKGROUNDCODE") {
        await setBackgroundCode(message.runnerCode, message.codeMap);
        self.postMessage({type: "BACKGROUNDCODE_OK"});
        isReadyToRunCode = true;
        saveCurrentState();
    }
}

async function runCode(code) {
    console.log("[Pyodide Worker]: Running python code");
    if (isReadyToRunCode === false) {
        console.warning("[Pyodide Worker]: Trying to run code before worker is ready to run code, returning early...");
        return;
    }
    console.log("[Pyodide Worker]: Writing user code to virtual file");
    await self.pyodide.FS.writeFile(USER_SCRIPT_NAME, code, { encoding: "utf8" });
    console.log("[Pyodide Worker]: Loading packages from imports");
    await self.pyodide.loadPackagesFromImports(code);
    await loadedScripts.forEach(async (element) => {
        await self.pyodide.loadPackagesFromImports(element);
    });
    console.log("[Pyodide Worker]: Running python code");
    await self.pyodide.runPythonAsync(pythonRunnerCode);
}

function setWaitBuffer(buffer) {
    console.log("[Pyodide Worker]: Got wait buffer");
    waitBuffer = buffer;
    self.postMessage({type: "WAITBUFFER_OK"});
}

function setInterruptBuffer(buffer) {
    console.log("[Pyodide Worker]: Got interrupt buffer");
    pyodide.setInterruptBuffer(buffer);
    interruptBuffer = buffer;
    self.postMessage({type: "INTERRUPTBUFFER_OK"});
}

function reset() {
    console.log("[Pyodide Worker]: Resetting...");
    loadedScripts = [];
    pyodide.pyodide_py._state.restore_state(saveState);
    self.postMessage({ type: "RESET_OK" });
}

async function setBackgroundCode(runnerCode, codeMap) {
    console.log("[Pyodide Worker]: Got python background code");
    codeMap.forEach(async (value, key) => {
        await self.pyodide.FS.writeFile(key, value, { encoding: "utf8" });
        loadedScripts.push(value);
    });
    pythonRunnerCode = runnerCode;
}

function setSharedInputArray(array) {
    console.log("[Pyodide Worker]: Got shared input array");
    sharedInputArray = array;
    self.postMessage({type: "SHAREDINPUTARRAY_OK"});
}

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

function saveCurrentState() {
    console.log("[Pyodide Worker]: Saving current pyodide state");
    saveState = pyodide.pyodide_py._state.save_state();
}

// JS functions called from python

function processLine(lineNumber) {
    if(resetting) return;
    if (lineNumber <= 0) return;
    console.log(`[Pyodide Worker]: Processing line ${lineNumber}`);
    self.postMessage({ type: "SETLINE", line: lineNumber });
    console.log("[Pyodide Worker]: Sleeping worker");
    Atomics.store(waitBuffer, 0, 1);
    Atomics.store(waitBuffer, 4, 1);
    Atomics.wait(waitBuffer, 0, 1);
    console.log("[Pyodide Worker]: Worker woke up");
}

function onFinishedExecution() {
    self.postMessage({ type: "EXECFINISH" });
}

function sendCommand(cmd, params) {
    if(resetting) return;
    console.log("[Pyodide Worker]: Running game command");
    self.postMessage({ type: "COMMAND", command: cmd, parameters: params });
    console.log("[Pyodide Worker]: Sleeping worker");
    Atomics.store(waitBuffer, 0, 1);
    Atomics.store(waitBuffer, 2, 1);
    Atomics.wait(waitBuffer, 0, 1);
    console.log("[Pyodide Worker]: Worker woke up");
}

function runCommand(cmd, param) {
    if(resetting) return;
    sendCommand(cmd, [param]);
}

function createObject(objectType, x, y) {
    sendCommand("create_obj", [objectType, x, y]);
}

function destroyObject(x, y) {
    sendCommand("destroy_obj", [x, y]);
}

function getInt(variableName) {

}

function processErrorInfo() {

}

function resetFromPython() {
    console.log("[Pyodide Worker]: Python asked for reset");
    resetting = true;
    reset();
}

// Input handler

function stdInHandler() {
    self.postMessage({ type: "REQUESTINPUT" });
    Atomics.store(waitBuffer, 0, 1);
    Atomics.store(waitBuffer, 3, 1);
    Atomics.wait(waitBuffer, 0, 1);
    self.pyodide.checkInterrupt();
    return readFromSharedArray();
}
