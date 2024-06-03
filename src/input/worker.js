let pyodide;
let pythonFileStr;
let continuePythonExecution;
let ctr = 0;

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

        pyodide.setStdin({
            stdin: () => {
                return handleInput()
            }
        });
        pythonFileStr = pythonCode;
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

    let word = '';
    for (let i = 0; i < sharedArray.length; i++) {
        if (sharedArray[i] === 0) break;
        word += String.fromCharCode(sharedArray[i]);
    }

    return word
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
    const sab = new SharedArrayBuffer(4);
    const waitArray = new Int32Array(sab, 0, 1);

    switch (command) {
        case "move":
            self.postMessage({ type: 'run', details: { command: command, parameters: parameters }, sab: sab });
            break;
        case "say":
            postError(`Command '${command}' not implemented yet.`);
            break;
        default:
            postError(`Command '${command}' is not a valid command.`);
    }
    Atomics.wait(waitArray, 0, 0);
    ctr++;
    console.log(ctr + " hyppyä");
    continuePythonExecution;
}

/**
 * Runs python code on pyodide.
 * @param {object} pyodide The pyodide object initialized in initializePyodide().
 * @param {string} codeString The input from the editor on the website.
 */
async function runPythonCode(pyodide, codeString) {
    pyodide.runPython(pythonFileStr);
    self.continuePythonExecution = pyodide.runPythonAsync(codeString);
    try {
        await self.continuePythonExecution;
    } catch (error) {
        postError(error.message);
    }
}


/**
 * Helper function to post error messages back to main thread for putting on the page.
 * @param {*} error Either an error object, or a string.
 */
function postError(error) {
    if (typeof (error) === "string") {
        self.postMessage({ type: "error", error: { message: error } })
    } else {
        self.postMessage({ type: "error", error: error });
    }
}
