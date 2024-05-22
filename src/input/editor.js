import { runPythonCode} from "./pyodide.js"



const ACE_LINK = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.14/ace.js";
var editor;

LoadAce();

function LoadAce() {
    let script = document.createElement("script");
    script.src = ACE_LINK;
    script.onload = initializeEditor;
    document.head.appendChild(script);
}


function initializeEditor() {
    console.log("initialized Editor");
    console.log(ace);
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
