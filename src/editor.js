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

function runPythonCode(string) {
    // registerJSModules(); // poista kommentti jos poistat puputesti.py kommentit

    let pythonFileStr = GetPythonFile();
    pyodide.runPython(pythonFileStr);

    pyodide.runPython(string);

    let lista = pyodide.globals.get("liikelista").toJs();
    console.log(lista);
}

function GetPythonFile() {
    let path = "src/puputesti.py";
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

function registerJSModules() {
    pyodide.registerJsModule('bunny_module', { moveBunny });
}