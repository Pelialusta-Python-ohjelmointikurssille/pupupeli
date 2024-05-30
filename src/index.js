import { InitGame, resetGame, rendererToggleGrid } from "./game/game.js"
import { EventHandler } from "./event_handler.js";
import { getEditor } from "./input/editor.js";
import { tryGetFileAsText } from "./file_reader.js";
import { extractErrorDetails } from "./input/py_error_handling.js"

let worker;
let eventHandler;

async function main() {
    await createGameWindow();
    addEventToButton("editor-run-pause-button", onRunButtonClick);
    addEventToButton("editor-stop-button", onResetButtonClick);
    addEventToButton("editor-skip-button", onNextStepButtonClick);
    addEventToButton("grid-toggle-button", rendererToggleGrid);
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
    if (String(typeof worker) === "object") {
        worker.terminate();
    }
    worker = new Worker('src/input/worker.js');
    eventHandler = new EventHandler(worker);
    eventHandler.initalize();

    let pythonFileStr;
    let fileReadMessage = tryGetFileAsText("./src/python/pelaaja.py");

    if (fileReadMessage.isSuccess) {
        pythonFileStr = fileReadMessage.result;
        worker.postMessage({ type: 'init', data: pythonFileStr });
    } else {
        displayErrorMessage(fileReadMessage.result);
        return;
    }
}

export function getEventHandler() {
    return eventHandler;
}

export function runPythonCommands() {
    worker.postMessage({ type: 'start', data: getEditor().getValue() });
}

function addEventToButton(id, func) {
    let buttonInput = document.getElementById(id);
    buttonInput.addEventListener("click", func, false);
}

let state = { current: "initial" };

function onRunButtonClick() {
    let button = document.getElementById("editor-run-pause-button");
    let img = button.querySelector('img');
    let runButtonText = button.querySelector('#runButtonText');
    if (!img) {
        img = document.createElement('img');
        button.appendChild(img);
    }

    // set button state
    console.log("Current state: " + state.current);
    switch (state.current) {
        case "initial":
            runPythonCommands();
            break;
        case "running":
            eventHandler.setMessagePassingState({ paused: true });
            break;
        case "paused":
            eventHandler.setMessagePassingState({ paused: false });
            break;

    }
    setButtonState(img, state, runButtonText);

    function setButtonState(img, state, runButtonText) {
        switch (state.current) {
            case "initial":
                img.src = "src/static/pausebutton.png";
                runButtonText.textContent = 'Tauko';
                state.current = "running"
                break;
            case "paused":
                img.src = "src/static/pausebutton.png";
                runButtonText.textContent = 'Tauko';
                state.current = "running"
                break;
            case "running":
                img.src = "src/static/runbutton.png";
                runButtonText.textContent = 'Jatka';
                state.current = "paused"
                break;
        }
    }
}

function onResetButtonClick() {
    if (state.current === "initial") return;
    let button = document.getElementById("editor-run-pause-button");
    let img = button.querySelector('img');
    img.src = "src/static/runbutton.png";
    button.querySelector('#runButtonText').textContent = 'Suorita';
    console.log("document.getElementById('error').innerHTML: " + document.getElementById("error").innerHTML);
    if (document.getElementById("error").innerHTML !== "") {
        let errorContainer = document.getElementById("error-box");
        console.log("resetting error");
        errorContainer.classList.toggle("show-error");
        errorContainer.children[0].textContent = "";
    }
    resetGame();
    state.current = "initial";
    initializeWorker();
}

function onNextStepButtonClick() {
    onRunButtonClick();
    eventHandler.runSingleCommand();
    if (state.current === "running") onRunButtonClick();
}

export function onFinishLastCommand() {
    // do something after finishing last command. should probably
    // figure out if the player has achieved the victory conditions
    // at this point?
    onRunButtonClick() // change button from "play" to "pause"
    console.log("Last command finished. Called from index.js.")
}

export function displayErrorMessage(error) {
    let errorDetails = extractErrorDetails(error.message);
    let errorContainer = document.getElementById("error-box");
    errorContainer.classList.toggle("show-error");
    errorContainer.children[0].textContent = '"' + errorDetails.text + '" Rivillä: ' + errorDetails.line;
    onRunButtonClick();
}

export function promptUserInput(inputBoxState) {
    let inputBox = document.getElementById("input-box");
    if (inputBoxState.inputBoxHidden === true) {
        inputBox.classList.toggle("is-invisible");
        inputBox.addEventListener("keydown", eventHandler.sendUserInputToWorker);
    } else {
        let inputValue = inputBox.value;
        inputBox.classList.toggle("is-invisible");
        inputBox.value = "";
        inputBox.removeEventListener("keydown", eventHandler.sendUserInputToWorker);
        return inputValue;
    }
}

await main();
