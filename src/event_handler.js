import * as gameController from './game/game_controller.js';
import { getInputBoxValue, hideAndClearInputBox, showInputBox } from './ui/inputBox.js';
import { disablePlayButton } from './ui/ui_editor_buttons.js'
import { displayErrorMessage } from './ui/ui.js';
import * as globals from './util/globals.js';
import { tryGetFileAsText } from './file_reader.js';
import { highlightCurrentLine } from './ui/ui.js';

let worker;
let lastMessage = { type: "foo", message: "bar", sab: "baz" }; // necessary for reasons i forgot
let isMessagePassingPaused = false; //keep as default, trust me bro
let sharedArray; //array shared with worker
let syncArray;
let userInputs = []
/**
 * Creates a new worker
 */
export function initWorker() {
    console.log("Initializing pyodide worker...")
    worker = new Worker('/src/input/worker.js');
    worker.onmessage = (message) => {
        message = message.data;
        switch (message.type) {
            case "input":
                sharedArray = new Uint16Array(message.sab, 4);
                syncArray = new Int32Array(message.sab, 0, 1);
                showInputBox();
                break;
            case "command":
                globals.setCurrentSAB(message.sab);
                gameController.giveCommand({ data: message.details, sab: message.sab });
                break;
            case "conditionsCleared":
                globals.addClearedConditions(message.details);
                break;
            case "finish":
                disablePlayButton();
                console.log("Last command finished");
                break;
            case "line":
                highlightCurrentLine(message.details);
                break;
            case "error":
                displayErrorMessage(message.error);
                break;
        }
    }
    try {
        let pythonFileStr = tryGetFileAsText("./src/python/pelaaja.py");
        postMessage({ type: 'init', details: pythonFileStr });
    } catch (error) {
        displayErrorMessage(error);
    }
}

/**
 * Logic to handle passing messages to worker depending on various conditions.
 * @param {*} message The message object, usually in the form of { type: "messagetype", details: "messagedata"}, also
 * possibly a shared array buffer if necessary
 */
export function postMessage(message) {
    if (message.sab === null || message.sab === undefined) {
        postMessageToWorker({ type: message.type, details: message.details, sab: null, value: 0 });
    }
    if (isMessagePassingPaused) {
        saveLastMessage({ type: message.type, details: message.details, sab: message.sab });
        return;
    }
    if (message.type === 'return') {
        postMessageToWorker({ type: message.type, details: message.details, sab: message.sab, value: 1 });
    }
}

/**
 * Used to control whether the worker should continue executing further commands or not.
 * @param {*} state An object in the form of { paused: boolean }
 */
export function setMessagePassingState(state) {
    isMessagePassingPaused = state.paused;
    if (!isMessagePassingPaused) {
        postMessage({ type: lastMessage.type, details: lastMessage.message, sab: lastMessage.sab });
    }
}

/**
 * A somewhat hacky implementation of running just one line of python in the worker.
 * This is a good target for refactoring.
 */
export function runSingleCommand() {
    if (!isMessagePassingPaused) {
        setMessagePassingState({ paused: true });
        return;
    }
    setMessagePassingState({ paused: false });
    setMessagePassingState({ paused: true });
}

/**
 * Called every time the user inputs something in the input box
 * @param {*} event The event when the user inputs something in the input box,
 * in this case, the relevant part is the key the user inputs.
 */
export function sendUserInputToWorker(event) {
    if (event.key === 'Enter') {
        addInputToUserInputs(word);
        word = getInputBoxValue();
        hideAndClearInputBox();
        inputToWorker(word);
    }
}

function addInputToUserInputs() {
    if (word) {
        userInputs.push(this.word);
        displayPreviousInputs();
    }
}

export function inputToWorker(word) {
    if (sharedArray === undefined) return;
    for (let i = 0; i < word.length; i++) {
        sharedArray[i] = word.charCodeAt(i);
    }
    sharedArray[word.length] = 0;

    Atomics.store(syncArray, 0, 1);
    Atomics.notify(syncArray, 0, 1);
}

/**
 * First allows the worker to continue, but then immediately sets the second value in waitArray to 1
 * so that the worker knows to not run any more python code.
 */
export function resetWorker() {
    if (globals.getCurrentSAB() === undefined) return;
    const waitArray = new Int32Array(globals.getCurrentSAB(), 0, 2);
    Atomics.store(waitArray, 0, 1); // this is for stopping the wait
    Atomics.notify(waitArray, 0, 1);
    Atomics.store(waitArray, 1, 1); // this is for checking (in worker) if we've reset the game
}

/**
 * An event handler internal method that does the actual sending of messages to the handler, and
 * if necessary, telling the worker that it should proceed to the next command
 * @param {*} message The message object, usually in the form of { type: "messagetype", details: "messagedata"}
 */
function postMessageToWorker(message) {
    worker.postMessage({ type: message.type, details: message.details });
    if (message.sab !== null) {
        const waitArray = new Int32Array(globals.getCurrentSAB(), 0, 2);
        Atomics.store(waitArray, 0, message.value);
        Atomics.notify(waitArray, 0, message.value);
    }
}

/**
 * An event handler internal method that saves the last executed command in case we need it later.
 * @param {*} message The message object, usually in the form of { type: "messagetype", details: "messagedata"}
 */
function saveLastMessage(message) {
    lastMessage = message;
}

//move to ui!
function displayPreviousInputs() {
    const inputContainer = document.getElementById('input-container')
    inputContainer.innerHTML = '';
    this.userInputs.forEach(input => {
        const inputElement = document.createElement('div');
        inputElement.textContent = input;
        inputContainer.appendChild(inputElement);
    })
}

function resetUserInputs() {
    userInputs = [];
    displayPreviousInputs();
    resetWorker();
    setMessagePassingState({ paused: false });
}