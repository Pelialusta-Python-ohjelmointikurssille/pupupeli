import * as globals from "./util/globals.js";
import * as game from "./game/game_controller.js";
import * as fileReader from "./file_reader.js";
import * as editor from "./input/editor.js";
import * as errorHandler from "./input/py_error_handling.js";
import { EventHandler } from "./event_handler.js";
//import { initPyodide } from "./input/worker.js";

let eventHandler;
let state = { current: "initial" };
let worker = new Worker('/src/input/worker.js');
let initialized = false;

async function main() {
    initialize();
    initPage()
    addButtonEvents();
    await initGame();
}

function initialize() {
    //    if (String(typeof eventHandler) === "object") eventHandler.terminateWorker();
    // if (String(typeof eventHandler) === "object") worker.pyodide_py._state.restore_state(pyodideInitialState);
    eventHandler = new EventHandler(getWorker());
    if (!initialized) {
        try {
            let pythonFileStr = fileReader.tryGetFileAsText("./src/python/pelaaja.py");
            eventHandler.postMessage({ type: 'init', details: pythonFileStr });
            initialized = true;
        } catch (error) {
            displayErrorMessage(error);
        }
    } else {
        eventHandler.resetWorker()
    }
}

async function initGame() {
    let canvas = await game.initGame();
    document.getElementById("left-container").insertAdjacentElement("afterend", canvas);
    canvas.classList.add("is-flex");
    canvas.id = "game";
}

async function initPage() {
    // set task identifier
    document.getElementById("task-id").innerHTML = globals.taskIdentifier;

    // set description
    globals.task.getDescription().forEach((line) => {
        line = line === "" ? "<br>" : line;
        document.getElementById("task-description").insertAdjacentHTML("beforeend", "<div>" + line + "</div>");
    });

    // set multiple choice questions
    let multipleChoiceContainer = document.getElementById("multiple-choice-questions");
    if (globals.task.getMultipleChoiceQuestions().length > 0) {
        multipleChoiceContainer.classList.remove("is-hidden");
        globals.task.getMultipleChoiceQuestions().forEach((question) => {
            multipleChoiceContainer.insertAdjacentHTML("beforeend", `<div class='multiple-choice-question'>${question.question}</div>`);
        });
    }
    // set editor code
    window.addEventListener('load', function () {
        editor.getEditor().setValue(globals.task.getEditorCode());
    });

}

function addButtonEvents() {
    addEventToButton("editor-run-pause-button", onRunButtonClick);
    addEventToButton("editor-stop-button", onResetButtonClick);
    addEventToButton("editor-skip-button", onNextStepButtonClick);
    //addEventToButton("grid-toggle-button", game.rendererToggleGrid);

    function addEventToButton(id, func) {
        let buttonInput = document.getElementById(id);
        buttonInput.addEventListener("click", func, false);
    }
}

function onRunButtonClick() {
    let button = document.getElementById("editor-run-pause-button");
    let img = button.querySelector('img');
    let runButtonText = button.querySelector('#runButtonText');
    if (!img) {
        img = document.createElement('img');
        button.appendChild(img);
    }

    switch (state.current) {
        case "initial":
            eventHandler.postMessage({ type: 'start', details: editor.getEditor().getValue() });
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
            case "running":
                img.src = "src/static/runbutton.png";
                runButtonText.textContent = 'Jatka';
                state.current = "paused"
                break;
            case "paused":
                img.src = "src/static/pausebutton.png";
                runButtonText.textContent = 'Tauko';
                state.current = "running"
                break;

        }
    }
}

function onResetButtonClick() {
    if (state.current === "initial") return;
    state.current = "initial";
    let buttonNext = document.getElementById("editor-skip-button");
    let button = document.getElementById("editor-run-pause-button");
    let img = button.querySelector('img');
    img.src = "src/static/runbutton.png";
    button.querySelector('#runButtonText').textContent = 'Suorita';
    buttonNext.disabled = false;
    button.disabled = false;
    if (document.getElementById("error").innerHTML !== "") {
        let errorContainer = document.getElementById("error-box");
        errorContainer.classList.toggle("show-error");
        errorContainer.children[0].textContent = "";
    }
    promptUserInput(true); // hide input box if visible
    initialize(); // has to be before game.resetGame() to initialize eventhandler first
    game.resetGame();
}

function onNextStepButtonClick() {
    onRunButtonClick();
    eventHandler.runSingleCommand();
    if (state.current === "running") onRunButtonClick();
}

function disablePlayButtonsOnFinish(cause = null) {
    let button = document.getElementById("editor-run-pause-button");
    let buttonNext = document.getElementById("editor-skip-button");
    let img = button.querySelector('img');
    let runButtonText = button.querySelector('#runButtonText');
    if (!img) {
        img = document.createElement('img');
        button.appendChild(img);
    }
    img.src = "src/static/resetbutton.png";
    if (cause === "error") {
        runButtonText.textContent = 'Virhe';
    } else {
        runButtonText.textContent = 'Loppu';
    }
    state.current = "ended";
    buttonNext.disabled = true;
    button.disabled = true;
}

/**
 * Used to get the event handler we are currently using.
 * @returns The event handler we're currently using.
 */
export function getEventHandler() {
    return eventHandler;
}

function getWorker() {
    return worker;
}

/**
 * Used to do something after there is no more python code to run.
 * This is probably where we want to check if the user has achieved the win conditions and display some kind
 * of "congratulations, you are a winner" message if so.
 */
export function onFinishLastCommand() {
    disablePlayButtonsOnFinish();
    console.log("Last command finished. Called from index.js.");
}

/**
 * Used to display an error message on the page.
 * @param {*} error The error to display on the page.
 */
export function displayErrorMessage(error) {
    if (typeof error === "string") { console.log(error) } else { console.log(error.message) }
    let errorDetails = errorHandler.extractErrorDetails(error.message);
    let errorContainer = document.getElementById("error-box");
    errorContainer.classList.toggle("show-error");
    errorContainer.children[0].textContent = '"' + errorDetails.text + '" Rivillä: ' + errorDetails.line;
    disablePlayButtonsOnFinish("error");
}

/**
 * Used by event handler twice, first to display the input box, then a second time after the user has entered
 * something into the input box and presses enter; the first time the function doesn't return anything, while
 * the second time it hides the box again and returns the value the user entered in the box.
 * @param {*} inputBoxState Boolean to indicate whether the input box is currently hidden or not.
 * @returns The value in the input box.
 */
export function promptUserInput(inputBoxState) {
    let inputBox = document.getElementById("input-box");
    if (inputBoxState.inputBoxHidden === true) {
        inputBox.classList.remove("is-invisible");
        inputBox.addEventListener("keydown", eventHandler.sendUserInputToWorker);
    } else {
        let inputValue = inputBox.value;
        inputBox.classList.add("is-invisible");
        inputBox.value = "";
        inputBox.removeEventListener("keydown", eventHandler.sendUserInputToWorker);
        return inputValue;
    }
}

await main();
