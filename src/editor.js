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
    registerJSModules()
    pyodide.runPython(`
        import sys, js
        from bunny_module import moveBunny
    `);
    pyodide.runPython(string);
}

function registerJSModules() {
    pyodide.registerJsModule('bunny_module', { moveBunny });
}