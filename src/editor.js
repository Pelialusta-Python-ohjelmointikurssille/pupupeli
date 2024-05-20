var editor = ace.edit("editor");
editor.setTheme("ace/theme/dawn");
editor.session.setMode("ace/mode/python");
editor.setOptions({
    autoScrollEditorIntoView: true,
    copyWithEmptySelection: true,
});

main();

var pyodide;

function start() {
    console.log(editor.getValue());
    test(editor.getValue());
}

function test(string) {
    pyodide.runPython(`
        import sys
        sys.version
    `);
    pyodide.runPython(string);
}

async function main() {
    pyodide = await loadPyodide();
}