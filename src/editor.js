// write doc for this file
/**
 * This file contains the code for the editor and Python code execution
 */
var editor = ace.edit("editor");
editor.setTheme("ace/theme/dawn");
editor.session.setMode("ace/mode/python");
editor.setOptions({
    autoScrollEditorIntoView: true,
    copyWithEmptySelection: true,
});

main();

var pyodide;

// write doc for start
/**
 * Starts the Python code execution
 */
function start() {
    console.log(editor.getValue());
    test(editor.getValue());
}

// write doc for test
/**
 * Tests the Python code
 * @param {string} string - The Python code to test
 */
function test(string) {
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

function moveBunny(direction) {
    console.log("bunny moved " + direction);
}

// write doc for main
/**
 * Initializes the Pyodide module
 */
async function main() {
    pyodide = await loadPyodide();
}