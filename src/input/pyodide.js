
/* global loadPyodide */

//var pyodide;
self.importScripts('https://cdn.jsdelivr.net/pyodide/v0.22.1/full/pyodide.js');

self.onmessage = async function (event) {
    if (event.data.type === 'start') {
        await initializePyodide(event.data);
    } else if (event.data.type === 'input') {
        const userInput = event.data.input;
        pyodide.globals.set('user_input', userInput);
        self.continuePythonExecution;
    }
}

async function initializePyodide(event) {
    pyodide = await loadPyodide();
    runPythonCode(pyodide, event.data);
}

async function handleInput(input) {
    await postMessage({type: 'prompt', data: input});
}

async function runPythonCode(pyodide, codeString) {
    let pythonFileStr = GetPythonFile();
    pyodide.runPython(pythonFileStr);

    self.continuePythonExecution = pyodide.runPythonAsync(codeString);
    try {
        await self.continuePythonExecution;
    } catch (error) {
        // Catch and display the error as an alert
        let errorDetails = extractErrorDetails(error.message);
        // Display the error type and line number as an alert
        //alert(`Voi ei! \n \n Virhe: \n ${errorDetails.type} \n \n Rivillä: \n ${errorDetails.line}`);
        console.log(error); // alert ei toimi webworkereissa?

        self.postMessage(errorDetails);
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

function extractErrorDetails(errorMessage) {
    const regex = /File .*?, line (\d+)/g;
    let match;
    let lastLineReference;

    while ((match = regex.exec(errorMessage)) !== null) {
        lastLineReference = match[1];
    }
    const lineNumberMatch = lastLineReference;

    const lines = errorMessage.split('\n');
    const errorTypeMatch = lines[lines.length - 2];

    if (errorTypeMatch && lineNumberMatch) {
        return { type: errorTypeMatch, line: lineNumberMatch };
    } else {
        return { type: "Unknown Error", line: "Unknown Line" };
    }
}