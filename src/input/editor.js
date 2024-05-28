import { startWorker } from "../index.js";

//Lint cheese below
/* global ace */

const ACE_LINK = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.34.2/ace.min.js";
let editor;

LoadAce();

function LoadAce() {
    let script = document.createElement("script");
    script.src = ACE_LINK;
    document.head.appendChild(script);
    script.onload = initializeEditor;
}


function initializeEditor() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/dawn");
    editor.session.setMode("ace/mode/python");
    editor.setOptions({
        autoScrollEditorIntoView: true,
        copyWithEmptySelection: true,
    });
    addEventToButton("editor-button");
}


function addEventToButton(id) {
    let buttonInput = document.getElementById(id);
    buttonInput.addEventListener("click", startWorkerButtonEvent, false);
}

function startWorkerButtonEvent() {
    startWorker(editor);
}

export function getEditor() {
    return editor;
}