import { runPythonCode} from "./pyodide.js"

//Lint cheese below
/* global ace */
//because below doesn't work
//import * as ace from "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.14/ace.js";

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
    let buttonID = "editor-button";
    //CreateButton(buttonID, "Suorita");
    addEventToButton(buttonID);
    console.log("initialized Editor");
}

//Use when you figure out how to add button to an div or make a div in js
//function CreateButton(id, innerText) {
//    let button = document.createElement("button");
//    button.id = id;
//    button.innerText = innerText;
//    document.body.appendChild(button);
//}

function addEventToButton(id) {
    let buttonInput = document.getElementById(id);
    buttonInput.addEventListener("click", function () {runPythonCode(editor.getValue()) }, false);
}
