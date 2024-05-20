var editor = ace.edit("editor");
editor.setTheme("ace/theme/dawn");
editor.session.setMode("ace/mode/python");
editor.setOptions({
    autoScrollEditorIntoView: true,
    copyWithEmptySelection: true,
});

function start() {
    console.log(editor.getValue());
}