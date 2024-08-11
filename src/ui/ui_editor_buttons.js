import { Constants } from "../game/commonstrings.js";
import { hideAndClearInputBox } from "./inputBox.js";
import { runSingleCommand, postMessage, setMessagePassingState, resetWorker, inputToWorker, themeChangeToWorker } from "../worker_messenger.js";
import { getEditor, resetLineHighlight } from "../input/editor.js";
import { resetAndInitContent, toggleGrid, toggleTrail, setTheme } from "../game/game_controller.js";
import { resetInputHistory } from "./inputBox.js";
import { isWaitingForInput, resetInputWaiting } from "../game/game_input_controller.js";
import { setCurrentTheme } from "../util/globals.js";
import { setDescription, setEditorCode } from "./ui.js";
import { sendTask } from "../api/api.js";
import { runCode } from "../code_runner/code_runner.js";

let _buttonsState;
let startAndPauseButton;
let nextStepButton;
let celebrationBox;
let themeSelectDropdown;

//Button states as const strings:
class States {
    static INITIAL = "initial";
    static RUNNING = "running";
    static PAUSED = "paused";
    static ENDED = "ended";
}

/**
 * Adds events to code execution buttons (run/pause, stop, skip)
 */
export function initializeEditorButtons() {
    _buttonsState = States.INITIAL;
    addEventToButton("editor-run-pause-button", onRunButtonClick);
    addEventToButton("editor-stop-button", onResetButtonClick);
    addEventToButton("editor-skip-button", onNextStepButtonClick);
    addEventToButton("grid-toggle-button", toggleGrid);
    addEventToButton("trail-toggle-button", toggleTrail);
    nextStepButton = document.getElementById("editor-skip-button");
    startAndPauseButton = document.getElementById("editor-run-pause-button");
    celebrationBox = document.getElementById("celebration");
    initThemeSelect();
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
    if (_buttonsState === States.INITIAL) return; //No need to reset
    nextStepButton.disabled = false;
    startAndPauseButton.disabled = false;
    resetNotificationPopUps();
    runButtonSetVisualsToInitial();
    resetErrorText();
    hideAndClearInputBox();
    resetCelebrationBox();
    resetWorker();
    resetAndInitContent();
    resetInputHistory();
    _buttonsState = States.INITIAL;
    setMessagePassingState({ paused: false });
    resetLineHighlight();
    resetInputWaiting();
}

function resetNotificationPopUps() {
    let elements = document.getElementsByClassName("pop-up-notification-show");
    Array.from(elements).forEach(element => {
        element.classList.remove("pop-up-notification-show");
    });
}

function runButtonSetVisualsToInitial() {
    let img = startAndPauseButton.querySelector('img');
    img.src = "src/static/runbutton.png";
    startAndPauseButton.querySelector('#runButtonText').textContent = 'Suorita';
}

function resetCelebrationBox() {
    let containsInvisible = celebrationBox.classList.contains("is-hidden");
    if (!containsInvisible) {
        celebrationBox.classList.add("is-hidden") // hide celebration box
    }
}

function resetErrorText() {
    if (document.getElementById("error").innerHTML !== "") {
        let errorContainer = document.getElementById("error-box");
        errorContainer.classList.toggle("show-error");
        errorContainer.children[0].textContent = "";
    }
}

/**
 * Changes state to pause if running and runs a single command.
 */
function onNextStepButtonClick() {
    if (_buttonsState === States.INITIAL) { //press twice to start and pause
        onRunButtonClick();
        onRunButtonClick();
    }
    if (_buttonsState === States.RUNNING) {
        onRunButtonClick(); //changes state to paused
    }
    if (_buttonsState == States.PAUSED) {
        if(isWaitingForInput) return;
        runSingleCommand();
    }
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
    _buttonsState = States.ENDED;
    buttonNext.disabled = true;
    button.disabled = true;
}

/**
 * enables editor buttons after pyodide has been initialized
 */
export function enableEditorButtons() {
    let buttons = document.getElementsByClassName("editor-button");
    Array.from(buttons).forEach(button => {
        let runButtonText = button.querySelector("#runButtonText");
        if (runButtonText !== null) runButtonText.innerHTML = "Suorita";
        button.disabled = false;
    });
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

    switch (_buttonsState) {
        case States.INITIAL:
            if (localStorage.getItem("token")){
                sendTask();
            }
            //postMessage({ type: 'start', details: getEditor().getValue() });
            runCode(getEditor().getValue());
            break;
        case States.RUNNING:
            if(isWaitingForInput) return;
            setMessagePassingState({ paused: true });
            break;
        case States.PAUSED:
            if(isWaitingForInput) return;
            setMessagePassingState({ paused: false });
            break;

    }
    setRunButtonStateWhenItsPressed(img, runButtonText);
}

function initThemeSelect() {
    let descriptionTargetDiv = document.getElementById("task-description");
    themeSelectDropdown = document.getElementById("theme-select");
    themeSelectDropdown.value = localStorage.getItem("theme");
    themeSelectDropdown.addEventListener('change', function (event) {
        let selectedValue = event.target.value;
        setCurrentTheme(selectedValue);
        themeChangeToWorker()
        setTheme(selectedValue);
        setEditorCode();
        descriptionTargetDiv.innerHTML = ''; // clear content
        setDescription(descriptionTargetDiv);
    });
}

/**
 * sets run button's state depending on what state it's currently in.
 * @param {image} img - a html image element
 * @param {string} state 
 * @param {object} runButtonText - html element
 */
function setRunButtonStateWhenItsPressed(img, runButtonText) {
    switch (_buttonsState) {
        case States.INITIAL:
            img.src = "src/static/pausebutton.png";
            runButtonText.textContent = 'Tauko';
            _buttonsState = States.RUNNING;
            break;
        case States.RUNNING:
            img.src = "src/static/runbutton.png";
            runButtonText.textContent = 'Jatka';
            _buttonsState = States.PAUSED;
            break;
        case States.PAUSED:
            img.src = "src/static/pausebutton.png";
            runButtonText.textContent = 'Tauko';
            _buttonsState = States.RUNNING;
            break;

    }
}