
/* global loadPyodide importScripts extractErrorDetails */

var pyodide;
importScripts('https://cdn.jsdelivr.net/pyodide/v0.22.1/full/pyodide.js', 'py_error_handling.js')

/**
 * The worker "message" event handler. This is executed when worker.postMessage(...) is called.
 * @param {object} event The event object received from the worker.postMessage(...) call.
 * Contains the python code that the user inputs in the website editor in "event.data.data", 
 * and the type of event in "event.data.type".
 */
self.onmessage = async function (event) {
    if (event.data.type === 'start') {
        initializePyodide(event.data.data);
    }
}

/**
 * Initializes pyodide and handles what happens when the user puts input()
 * as a part of their python code.
 * @param {string} userInput The text that the user enters in the website editor.
 */
async function initializePyodide(userInput) {
    pyodide = await loadPyodide();

    pyodide.setStdin({
        stdin: () => {
            return handleInput()
        }
    });

    runPythonCode(pyodide, userInput);
}

/**
 * This function determines what happens when user uses input() in their python code in the website.
 * @param {string} message The string from inside the brackets in input().
 * In case of input("hello"), message should be "hello".
 * @returns {string} A string containing the user input.
 */
function handleInput(message) {
    const sab = new SharedArrayBuffer(512 * 2 + 4);
    const sharedArray = new Uint16Array(sab, 4);
    const syncArray = new Int32Array(sab, 0, 1);

    postMessage({ type: 'input', data: message, sab: sab });
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
 */
function runCommand(command, parameters) {
    switch (command) {
        case "move":
            self.postMessage({ type: 'run', data: { command: command, parameters: parameters }})
            break;
        case "say":
            throw Error(`Command '${command}' not implemented yet.`);
        default:
            throw Error(`Command '${command}' is not a valid command.`)
    }
    
}

/**
 * Runs python python code on pyodide.
 * @param {object} pyodide The pyodide object initialized in initializePyodide().
 * @param {string} codeString The input from the editor on the website.
 */
async function runPythonCode(pyodide, codeString) {

    let pythonFileStr = GetFileAsText("../python/pelaaja.py");
    pyodide.runPython(pythonFileStr);

    self.continuePythonExecution = pyodide.runPythonAsync(codeString);
    try {
        await self.continuePythonExecution;
    } catch (error) {
        console.log(error);
    }
}

/**
 * Returns the contents of the file located at the given path as a string.
 * @param {string} path The relative or absolute path of the file to look for.
 * @returns {string} The contents of the file at "path". If no file is found, 
 * throws an Error.
 */
function GetFileAsText(path) {
    let request = new XMLHttpRequest();
    request.open('GET', filepath, false);
    request.send(null);

    if (request.status === 200) {
        return request.responseText;
    } else {
        throw new Error(`Error fetching file: ${path}`);
    }
}