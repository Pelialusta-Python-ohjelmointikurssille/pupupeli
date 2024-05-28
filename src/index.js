import { InitGame } from "./game/game.js"
import { onClickCodeButton } from "./input/editor.js";
import { initializeWorkerEventHandler, pauseMessageWorker, unPauseMessageWorker, sendUserInputToWorker } from "./event_handler.js"

const worker = new Worker('src/input/worker.js');

async function main() {
    await CreateGameWindow();
    addEventToButton("editor-run-pause-button", onRunButtonClick);
    addEventToButton("editor-stop-button", onResetButtonClick);
    addEventToButton("editor-skip-button", onSkipButtonClick);
    initializeWorker()
}

async function CreateGameWindow() {
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

export function startWorker(editor) {
    worker.postMessage({ type: 'start', data: editor.getValue() });
}

function addEventToButton(id, func) {
    let buttonInput = document.getElementById(id);
    buttonInput.addEventListener("click", func, false);
}

let play = false;
let started = false;
let runButtonText = null;

function onRunButtonClick() {
    let button = document.getElementById("editor-run-pause-button");
    let img = button.querySelector('img');
    runButtonText = button.querySelector('#runButtonText');
    if (!img) {
        img = document.createElement('img');
        button.appendChild(img);
    }
    if (started === false) {
        console.log("SUORITA");
        started = true;
        play = true;
        img.src = "src/static/pausebutton.png";
        runButtonText.textContent = 'Tauko';
        onClickCodeButton();
    }
    else if (play === false) {
        console.log("JATKA");
        play = true;
        img.src = "src/static/pausebutton.png";
        runButtonText.textContent = 'Tauko';
        unPauseMessageWorker();
    }
    else {
        console.log("TAUKO");
        play = false;
        img.src = "src/static/runbutton.png";
        runButtonText.textContent = 'Jatka';
        pauseMessageWorker();
    }
}

function onResetButtonClick() {
    let button = document.getElementById("editor-run-pause-button");
    let img = button.querySelector('img');
    img.src = "src/static/runbutton.png";
    runButtonText.textContent = 'Suorita';
    console.log("RESET")
    play = false;
    started = false;
}

function onSkipButtonClick() {
    console.log("SKIP")
}

export function getUserInput(is_init) {
    let inputBox = document.getElementById("input-box");
    if (is_init) {
        inputBox.classList.toggle("is-invisible");
        inputBox.addEventListener("keydown", (event) => {
            if (event.key === 'Enter') {
                sendUserInputToWorker();
            }
        });

    } else {
        let inputValue = document.getElementById("input-box").value;
        inputBox.classList.toggle("is-invisible");
        return inputValue;
    }
}

await main();
