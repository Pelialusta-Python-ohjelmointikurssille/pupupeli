import { InitGame } from "./game/game.js"
import { getEditor } from "./input/editor.js";
import { initializeWorkerEventHandler, pauseMessageWorker, unPauseMessageWorker, runSingleCommand } from "./event_handler.js"

const worker = new Worker('src/input/worker.js');

async function main() {
    await createGameWindow();
    addEventToButton("editor-run-pause-button", onRunButtonClick);
    addEventToButton("editor-stop-button", onResetButtonClick);
    addEventToButton("editor-skip-button", nextStepButtonClick);
    initializeWorker();
}

async function createGameWindow() {
    let app = await InitGame();
    let canvas = app.canvas;

    document.getElementById("left-container").insertAdjacentElement("afterend", canvas);
    canvas.classList.add("is-flex");
    canvas.id = "game";
}

/**
 * This function initializes the web worker that is used to run the python
 * interpreter (pyodide) on a separate thread from the rest of the game code.
 * The function also initializes the event handler that's responsible for
 * the rest of the communication between the worker and the game logic,
 * and passes the worker object onto the  event handler.
 * If the worker is not null, there is no need to re-initialize it, as we
 * can just use the one we initialized earlier. This means we only need
 * to load pyodide once per page load instead of every time the user runs some code.
 * @param {object} editor The editor object (Ace) received from editor.js.
 * The editor object contains the input of the editor textbox on the site.
 * The input is obtained using editor.getValue() and passed onto the worker.
 */
function initializeWorker() {
    initializeWorkerEventHandler(worker);
    worker.postMessage({ type: 'init' });
}

export function runPythonCommands() {
    worker.postMessage({ type: 'start', data: getEditor().getValue() });
}

function addEventToButton(id, func) {
    let buttonInput = document.getElementById(id);
    buttonInput.addEventListener("click", func, false);
}

let runButtonText = null;

//Button states
const defaultState = "defaultState";
const runningState = "runningState";
const pausedState = "pausedState";
let currentState;
currentState = defaultState;

function onRunButtonClick() {
    let button = document.getElementById("editor-run-pause-button");
    let img = button.querySelector('img');
    runButtonText = button.querySelector('#runButtonText');
    if (!img) {
        img = document.createElement('img');
        button.appendChild(img);
    }
    //Set buttons state
    console.log("Current state: " + currentState);
    switch (currentState) {
        case defaultState:
            setRunningStateVisual(img);
            runPythonCommands();
            break;
        case runningState:
            setPausedStateVisual(img);
            pauseMessageWorker();
            break;
        case pausedState:
            setRunningStateVisual(img);
            unPauseMessageWorker();
            break;
    }
}

function setRunningStateVisual(img) {
    console.log("SUORITA");
    img.src = "src/static/pausebutton.png";
    runButtonText.textContent = 'Tauko';
    currentState = runningState;
}

function setPausedStateVisual(img) {
    console.log("TAUKO");
    img.src = "src/static/runbutton.png";
    runButtonText.textContent = 'Jatka';
    currentState = pausedState;
}

function onResetButtonClick() {
    if (currentState === defaultState) return;
    let button = document.getElementById("editor-run-pause-button");
    let img = button.querySelector('img');
    img.src = "src/static/runbutton.png";
    runButtonText.textContent = 'Suorita';
    console.log("RESET")
    currentState = defaultState;
}

function nextStepButtonClick() {
    onRunButtonClick();
    runSingleCommand();
    if (currentState === runningState) onRunButtonClick();
}

await main();
