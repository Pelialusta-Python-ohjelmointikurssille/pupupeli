import { moveBunny } from "./index.js"

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