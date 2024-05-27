import { initializeWorker } from "../index.js";

//Lint cheese below
/* global ace */

const ACE_LINK = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.14/ace.js";
var editor;

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


function addEventToButton(id) {
    let buttonInput = document.getElementById(id);
    buttonInput.addEventListener("click", onClickCodeButton, false);
}

function onClickCodeButton() {
    initializeWorker(editor);
}