import { Constants } from "../game/commonstrings.js";
import { hideAndClearInputBox } from "./inputBox.js";
import { toggleGrid } from "../game/game_controller.js";
import { runSingleCommand, postMessage, setMessagePassingState, resetWorker, inputToWorker } from "../event_handler.js";
import { getEditor } from "../input/editor.js";
import { resetGame } from "../game/game_controller.js";
let state = { current: "initial" };

/**
 * Adds events to code execution buttons (run/pause, stop, skip)
 */
export function initializeEditorButtons() {
    addEventToButton("editor-run-pause-button", onRunButtonClick);
    addEventToButton("editor-stop-button", onResetButtonClick);
    addEventToButton("editor-skip-button", onNextStepButtonClick);
    addEventToButton("grid-toggle-button", toggleGrid);
}

/**
     * Adds eventlistener to a given button to trigger given function, used in initialization
     * @param {string} id 
     * @param {function} func 
     */
function addEventToButton(id, func) {
    let buttonInput = document.getElementById(id);
    buttonInput.addEventListener("click", func, false);
}

/**
 * Sets state to initial and resets all task elements to default state.
 * Also resets worker by calling initialize while initialized === true.
 * Does nothing if state is initial.
 */
function onResetButtonClick() {
    inputToWorker(Constants.PYODIDE_INTERRUPT_INPUT); //Special str that interrupt pyodide if it's in handleInput()
    if (state.current === "initial") return;
    state.current = "initial";
    let buttonNext = document.getElementById("editor-skip-button");
    let button = document.getElementById("editor-run-pause-button");
    let img = button.querySelector('img');
    let celebrationBox = document.getElementById("celebration")
    img.src = "src/static/runbutton.png";
    button.querySelector('#runButtonText').textContent = 'Suorita';
    buttonNext.disabled = false;
    button.disabled = false;
    if (document.getElementById("error").innerHTML !== "") {
        let errorContainer = document.getElementById("error-box");
        errorContainer.classList.toggle("show-error");
        errorContainer.children[0].textContent = "";
    }
    hideAndClearInputBox();
    let containsInvisible = celebrationBox.classList.contains("is-invisible");
    if (!containsInvisible) {
        celebrationBox.classList.add("is-invisible") // hide celebration box
    }
    resetWorker();
    resetGame();
}

/**
 * Changes state to paused, runs single command, changes state to running
 */
function onNextStepButtonClick() {
    onRunButtonClick();
    runSingleCommand();
    if (state.current === "running") onRunButtonClick();
}

/**
 * disables run and skip buttons, changes their images and changes state to "ended".
 * If code had an error, button changes text to indicate that.
 * @param {*} cause 
 */
export function disablePlayButton(cause = null) {
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
 * Runs the code or pauses execution and changes the image of run/pause button.
 */
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
            postMessage({ type: 'start', details: getEditor().getValue() });
            break;
        case "running":
            setMessagePassingState({ paused: true });
            break;
        case "paused":
            setMessagePassingState({ paused: false });
            break;

    }
    setButtonState(img, state, runButtonText);
}

/**
 * sets run button's state
 * @param {image} img - a html image element
 * @param {string} state 
 * @param {object} runButtonText - html element
 */
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