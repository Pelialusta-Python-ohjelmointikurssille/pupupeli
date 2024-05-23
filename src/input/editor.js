// import { runPythonCode} from "./pyodide.js"
import { runGameCommands } from "../index.js";

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
}


function addEventToButton(id) {
    let buttonInput = document.getElementById(id);
    buttonInput.addEventListener("click", onClickCodeButton, false);
}

function onClickCodeButton () {
    // should print "Running in the main thread"
    if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
        console.log("Running inside a Web Worker");
    } else {
        console.log("Running in the main thread (1)");
    }

    const worker = new Worker('src/input/pyodide.js');

    worker.onmessage = function (e) {
        if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
            console.log("Running inside a Web Worker");
        } else {
            console.log("Running in the main thread (2)");
        }    
        runGameCommands(e.data);
    }

    worker.postMessage(editor.getValue());
}