import { moveBunny } from "./index.js"

var pyodide;
var editor;

initializePyodide();
initializeEditor();

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

export function onClickRunCodeButton() {
    runPythonCode(editor.getValue());
}

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

function registerJSModules() {
    pyodide.registerJsModule('bunny_module', { moveBunny });
}