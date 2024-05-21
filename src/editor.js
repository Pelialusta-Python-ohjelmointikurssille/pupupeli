// write doc for this file
/**
 * This file contains the code for the editor and Python code execution
 */
var pyodide;
var editor;

initializePyodide();
initializeEditor();

// write doc for main
/**
 * Initializes the Pyodide module
 */
async function initializePyodide() {
    pyodide = await loadPyodide();
    pyodide.setStdin();
}

function initializeEditor() {
    console.log("initialized Editor");
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/dawn");
    editor.session.setMode("ace/mode/python");
    editor.setOptions({
        autoScrollEditorIntoView: true,
        copyWithEmptySelection: true,
    });
}

// write doc for start
/**
 * Starts the Python code execution
 */
function onClickRunCodeButton() {
    runPythonCode(editor.getValue());
}


// write doc for test
/**
 * Tests the Python code
 * @param {string} string - The Python code to run
 */
async function runPythonCode(string) {
    let pythonFileStr = await GetPythonFile();
    pyodide.runPython(pythonFileStr);

    pyodide.runPython(string);

    let lista = pyodide.globals.get("liikelista").toJs()

    console.log(lista)
}

async function GetPythonFile() {
    let path = "src/puputesti.py";
    return await GetFileAsText(path); 
}

async function GetFileAsText(filepath) {
    const response = await fetch(filepath);
    const pythonText = await response.text();
    return pythonText;
  }