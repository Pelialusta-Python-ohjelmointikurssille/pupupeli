
/* global loadPyodide importScripts extractErrorDetails */

var pyodide;
importScripts('https://cdn.jsdelivr.net/pyodide/v0.22.1/full/pyodide.js', 'py_error_handling.js')

self.onmessage = async function (event) {
    if (event.data.type === 'start') {
        initializePyodide(event.data);
    }
}

async function initializePyodide(event) {
    pyodide = await loadPyodide();

    pyodide.setStdin({ stdin: () => { 
        return handleInput()
    }});

    runPythonCode(pyodide, event.data);
}

function handleInput(message) {
    const sab = new SharedArrayBuffer(512 * 2 + 4);
    const sharedArray = new Uint16Array(sab, 4);
    const syncArray = new Int32Array(sab, 0, 1);

    postMessage({type: 'input', data: message, sab: sab});
    Atomics.wait(syncArray, 0, 0);

    let word = '';
    for (let i = 0; i < sharedArray.length; i++) {
        if (sharedArray[i] === 0) break;
        word += String.fromCharCode(sharedArray[i]);
    }

    return word
}

async function runPythonCode(pyodide, codeString) {

    let pythonFileStr = GetPythonFile();
    pyodide.runPython(pythonFileStr);

    self.continuePythonExecution = pyodide.runPythonAsync(codeString);
    try {
        await self.continuePythonExecution;
    } catch (error) {
        console.log(extractErrorDetails(error));
    }

    let lista = pyodide.globals.get("liikelista").toJs();
    self.postMessage({type: 'run', data: lista});
}

function GetPythonFile() {
    let path = "../pythonfiles/puputesti.py";
    return GetFileAsText(path);
}

function GetFileAsText(filepath) {
    let request = new XMLHttpRequest();
    request.open('GET', filepath, false); // false = ei async
    request.send(null);

    if (request.status === 200) {
        return request.responseText;
    } else {
        throw new Error(`Error fetching file: ${filepath}`);
    }
}