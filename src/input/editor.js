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
    //Create "run code" button
    //let buttonID = "editor-button";
    //CreateButton(buttonID, "Suorita");
    //addEventToButton(buttonID);

    // Toggle grid nappi, voi muuttaa missä annetaan event
    //document.getElementById("grid-toggle-button").addEventListener("click", toggleGrid, false);
}

export function getEditor() {
    return editor;
}
