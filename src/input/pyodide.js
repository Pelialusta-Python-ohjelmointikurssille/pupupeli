
/* global loadPyodide */

var pyodide;

initializePyodide();

async function initializePyodide() {
    pyodide = await loadPyodide();
    pyodide.setStdin();
}


export function runPythonCode(codeString) {
    console.log("Running python code...");

    let pythonFileStr = GetPythonFile();
    pyodide.runPython(pythonFileStr);

    pyodide.runPython(codeString);

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
