import { extractErrorDetails } from "./py_error_handling.js"

/* global loadPyodide */

var pyodide;

initializePyodide();

async function initializePyodide() {
    pyodide = await loadPyodide();
    pyodide.setStdin();
}


export function runPythonCode(codeString) {
    let pythonFileStr = GetPythonFile();
    pyodide.runPython(pythonFileStr);
    try {
        pyodide.runPython(codeString);
    } catch (error) {
        // Catch and display the error as an alert
        let errorDetails = extractErrorDetails(error.message);

        // Display the error type and line number as an alert
        document.getElementById("error").innerHTML = `Voi ei! \n \n Virhe: \n ${errorDetails.type} \n \n Rivillä: \n ${errorDetails.line}`
    }
    let lista = pyodide.globals.get("liikelista").toJs();
    return lista;
}

function GetPythonFile() {
    let path = "src/pythonfiles/puputesti.py";
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