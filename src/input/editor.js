import { runGameCommands, toggleGrid } from "../index.js";

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
    let buttonID = "editor-button";
    //CreateButton(buttonID, "Suorita");
    addEventToButton(buttonID);

    // Toggle grid nappi, voi muuttaa missä annetaan event
    document.getElementById("grid-toggle-button").addEventListener("click", toggleGrid, false);
}


function addEventToButton(id) {
    let buttonInput = document.getElementById(id);
    buttonInput.addEventListener("click", onClickCodeButton, false);
}

function onClickCodeButton() {
    const worker = new Worker('src/input/pyodide.js');

    worker.onmessage = function (event) {
        if (event.data.type === 'input') {
            const sharedArray = new Uint16Array(event.data.sab, 4);
            const syncArray = new Int32Array(event.data.sab, 0, 1);

            const word = prompt(event.data.message);

            for (let i = 0; i < word.length; i++) {
                sharedArray[i] = word.charCodeAt(i);
            }
            sharedArray[word.length] = 0;

            Atomics.store(syncArray, 0, 1);
            Atomics.notify(syncArray, 0, 1);
        } else if (event.data.type === 'run') {
            runGameCommands(event.data.data);
        }
    }

    worker.postMessage({ type: 'start', data: editor.getValue() });
}