const PYODIDE_INTERRUPT_INPUT = "pyodide_interrupt_input_666"
let pyodide;
let pythonFileStr;
let continuePythonExecution;
let saveState;
let resetFlag = false;
let codeString;
let interruptBuffer = new Uint8Array(new SharedArrayBuffer(1));
//remember to update this when new commands are added
const validCommands = ["move", "say", "ask"];

// eslint-disable-next-line no-undef
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.0/full/pyodide.js");

/**
 * The worker "message" event handler. This is executed when worker.postMessage(...) is called.
 * @param {object} event The event object received from the worker.postMessage(...) call.
 * Contains the python code that the user inputs in the website editor in "event.data.details", 
 * and the type of event in "event.data.type".
 */
self.onmessage = async function (event) {
    let message = event.data
    if (message.type === 'init') {
        initializePyodide(message.details);
    }
    if (message.type === 'start') {
        setResetFlag(false);
        runPythonCode(pyodide, message.details);
    }
}

/**
 * Initializes pyodide and handles what happens when the user puts input()
 * as a part of their python code.
 * @param {string} pythonCode The text that the user enters in the website editor.
 */
async function initializePyodide(pythonCode) {
    if (pyodide === undefined) {
        // eslint-disable-next-line no-undef
        pyodide = await loadPyodide();
        saveState = pyodide.pyodide_py._state.save_state(); // we save pyodide initial state to restore if needed

        pyodide.setStdin({
            stdin: () => {
                return handleInput()
            }
        });
        pythonFileStr = pythonCode;
        pyodide.setInterruptBuffer(interruptBuffer);
        console.log("Initialized pyodide worker");
    }
}

/**
 * This function determines what happens when user uses input() in their python code in the website.
 * @returns {string} A string containing the user input.
 */
function handleInput() {
    const sab = new SharedArrayBuffer(512 * 2 + 4);
    const sharedArray = new Uint16Array(sab, 4);
    const syncArray = new Int32Array(sab, 0, 1);

    postMessage({ type: 'input', details: "", sab: sab });
    Atomics.wait(syncArray, 0, 0);
    let word = getStringFromSharedArray(sharedArray);
    console.log("worker received word: " + word);
    //special case where we want to reset python if it's waiting for input.
    //We interrupt pyodide and and send message that we are finished.
    //This sends out an error but it's a friend, not an enemy.
    //https://pyodide.org/en/stable/usage/streams.html#handling-keyboard-interrupts
    //KeyboardInterrupt should probably be handled somehow. 
    if (word === PYODIDE_INTERRUPT_INPUT) {
        interruptBuffer[0] = 2;
        console.log("v Intended error: pyodide interrupted while in stdin v");
        pyodide.checkInterrupt();
        console.log("^ Intended error: pyodide interrupted while in stdin ^")
        postMessage({ type: 'finish' });
    }
    return word;
}

function getStringFromSharedArray(sharedArray) {
    let word = '';
    for (let i = 0; i < sharedArray.length; i++) {
        if (sharedArray[i] === 0) break;
        word += String.fromCharCode(sharedArray[i]);
    }
    return word;
}

/**
 * Delivers commands to execute to the event handler. Can be extended with more commands 
 * by adding more cases to the switch statement.
 * @param {string} command The command to execute. Examples: "move", "say", ...
 * @param {string} parameters The parameters for the command. Examples: "oikea", "vasen", 
 * "Onneksi olkoon! Voitit pelin!"
 * lint is disabled, since this function is only ran from the python code.
 */
// eslint-disable-next-line no-unused-vars
function runCommand(command, parameters) {
    const sab = new SharedArrayBuffer(8);
    const waitArray = new Int32Array(sab, 0, 2);
    if (validCommands.includes(command)) {
        //Posted to eventHandler
        self.postMessage({ type: 'command', details: { command: command, parameters: parameters }, sab: sab });
    } else {
        postError(`Command '${command}' is not a valid command.`);
    }
    Atomics.wait(waitArray, 0, 0);

    // waitarray[1] will be "1" if resetWorker() is called in event handler, otherwise 0
    if (waitArray[1] === 0) {
        try {
            continuePythonExecution;
        } catch (error) {
            postError(error.message);
        }
    } else {
        console.log("Worker on resetattu!");
        try {
            setResetFlag(true);
            continuePythonExecution;
        } catch (error) {
            postError(error.message);
        }
    }
}

// eslint-disable-next-line no-unused-vars
function sendLine(line) {
    if (!resetFlag) {
        self.postMessage({ type: 'line', details: line });
    }
}

/**
 * Runs python code on pyodide.
 * @param {object} pyodide The pyodide object initialized in initializePyodide().
 * @param {string} codeString The input from the editor on the website.
 */
async function runPythonCode(pyodide, codeString) {
    let codeStringLined;
    let codeStringTest;
    codeStringTest = removeInputs(codeString);
    codeStringTest = indentString(codeStringTest);
    pyodide.runPython(pythonFileStr);
    codeStringLined = addLineNumberOutputs(codeString);
    console.log("Started running code...");
    self.continuePythonExecution = pyodide.runPythonAsync(codeStringTest + '\n' + codeStringLined);

    try {
        await self.continuePythonExecution;
        await checkClearedConditions(codeString);

        try {
            // reset pyodide state to where we saved it earlier after all commands are done
            interruptBuffer[0] = 0;
            pyodide.pyodide_py._state.restore_state(saveState);
        } catch (error) {
            postError(error.message);
        }

        // no more python left to run; let the event handler know
        postMessage({ type: 'finish' });
    } catch (error) {
        // also reset pyodide state on errors/exceptions such as when we reset the game mid-execution
        pyodide.pyodide_py._state.restore_state(saveState);
        postError(error.message);
    }
}

async function checkClearedConditions(codeString) {
    let clearedConditions = [];
    clearedConditions.push({ condition: "conditionUsedWhile", parameter: await pyodide.runPythonAsync(`check_while_usage("""${codeString}""")`) });
    clearedConditions.push({ condition: "conditionUsedFor", parameter: await pyodide.runPythonAsync(`check_for_usage("""${codeString}""")`) });
    clearedConditions.push({ condition: "conditionMaxLines", parameter: codeString.split("\n").filter(line => line.trim() !== "").length });
    clearedConditions = clearedConditions.filter(condition => condition.parameter !== false);
    self.postMessage({ type: 'conditionsCleared', details: clearedConditions });
}

function removeInputs(codeString) {
    return codeString.replace(/input\(/g, 'mock_input(');
}

function indentString(str, indent = '    ') {  // Default indentation is 4 spaces
    if (str === "") return "";
    codeString = str.split('\n').map(line => indent + line).join('\n');
    codeString = "def test_string():\n" + codeString;
    return codeString;
}

function addLineNumberOutputs(codeString) {
    if (codeString === undefined) return;
    let lines = codeString.split('\n');
    lines = lines.map((line, index) => {
        const indentation = line.match(/^\s*/)[0];
        const trimmedLine = line.trim();

        // Check if the line starts with 'else:' or 'elif:' or 'except' or 'finally'
        if (trimmedLine.startsWith('else:') || trimmedLine.startsWith('elif:') || trimmedLine.startsWith('except') || trimmedLine.startsWith('finally')){
            return line;
        }
        // Check if the line is empty, contains only whitespace, or is a comment
        else if (trimmedLine === '' || trimmedLine.startsWith('#')) {
            return line;
        } else {
            return `${indentation}pupu.rivi(${index + 1})\n${line}`;
        }
    });
    codeString = lines.join('\n');
    // Prepend the new line of text to codeString
    codeString = "pupu = Pelaaja()\n" + codeString;
    return codeString;
}

function setResetFlag(value) {
    resetFlag = value;
    pyodide.globals.set("reset_flag", resetFlag);
}

/**
 * Helper function to post error messages back to main thread for putting on the page.
 * @param {*} error Either an error object, or a string.
 */
function postError(error) {
    if (error.includes("Interpreter was reset")) return;
    if (typeof (error) === "string") {
        self.postMessage({ type: 'error', error: { message: error } })
    } else {
        self.postMessage({ type: 'error', error: error });
    }
}
