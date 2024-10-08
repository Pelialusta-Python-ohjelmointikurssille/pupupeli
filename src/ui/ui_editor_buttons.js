import { TaskTypes } from "../game/commonstrings.js";
import { hideAndClearInputBox } from "./inputBox.js";
import { getEditor, resetLineHighlight, setEditorTextFromCodeBlocks } from "../input/editor.js";
import { resetAndInitContent, toggleGrid, toggleTrail, setTheme, setTurboSpeedActive } from "../game/game_controller.js";
import { resetInputHistory } from "./inputBox.js";
import { isWaitingForInput, resetInputWaiting } from "../game/game_input_controller.js";
import { setCurrentTheme } from "../util/globals.js";
import { setDescription, setEditorCode, toggleErrorVisibility } from "./ui.js";
import { sendTask } from "../api/api.js";
import { runCode, resetRunner, pauseRunner, resumeRunner, runUntilNextLine, subscribeToReadyCallbacks, subscribeToFinishCallbacks, subscribeToErrorCallbacks, subscribeToResetCallbacks } from "../code_runner/code_runner.js";

import { task } from "../util/globals.js";

let _buttonsState;
let startAndPauseButton;
let nextStepButton;
let resetButton;
let celebrationBox;
let themeSelectDropdown;
let turboButton;
let isResetting = false;
let isRunning = false;

//Button states as const strings:
class States {
    static INITIAL = "initial";
    static RUNNING = "running";
    static PAUSED = "paused";
    static ENDED = "ended";
}
let isTurboActive = false;

subscribeToReadyCallbacks(enableEditorButtons);
subscribeToFinishCallbacks(() => { disablePlayButton(); isRunning = false; });
subscribeToErrorCallbacks(() => { disablePlayButton("error"); isRunning = false; });
subscribeToResetCallbacks(() => { 
    isResetting = false;
    isRunning = false;
    resetEditorUIState();
    resetButton.disabled = false;
});

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
    addEventToButton("editor-turbo-button", toggleTurbo);
    nextStepButton = document.getElementById("editor-skip-button");
    startAndPauseButton = document.getElementById("editor-run-pause-button");
    resetButton = document.getElementById("editor-stop-button");
    celebrationBox = document.getElementById("celebration");
    turboButton = document.getElementById("editor-turbo-button");
    initThemeSelect();
}

/**
     * Adds eventlistener to a given button to trigger given function, used in initialization
     * @param {string} id 
     * @param {function} func 
     */
//If were just gonna take a refrence of every button, this function is kind of unnecessary.
function addEventToButton(id, func) {
    let buttonInput = document.getElementById(id);
    buttonInput.addEventListener("click", func, false);
}

function toggleTurbo() {
    isTurboActive = !isTurboActive;
    if (isTurboActive) {
        turboButton.style.backgroundColor = "yellow";
    } else {
        turboButton.style.backgroundColor = "white";
    }
    setTurboSpeedActive(isTurboActive);
}

function resetEditorUIState() {
    nextStepButton.disabled = false;
    startAndPauseButton.disabled = false;
    resetNotificationPopUps();
    runButtonSetVisualsToInitial();
    resetErrorText();
    hideAndClearInputBox();
    resetCelebrationBox();
    
    resetInputHistory();
    _buttonsState = States.INITIAL;
    //setMessagePassingState({ paused: false });
    resetLineHighlight();
    
}

/**
 * Sets state to initial and resets all task elements to default state.
 * Also resets worker by calling initialize while initialized === true.
 * Does nothing if state is initial.
 */
function onResetButtonClick() {
    if (isResetting === true) return;
    isResetting = true;
    resetButton.disabled = true;
    resetRunner();
    resetAndInitContent();
    resetInputHistory();
    resetInputWaiting();
    if (isRunning === false) {
        resetEditorUIState();
        isResetting = false;
        resetButton.disabled = false;
    } else {
        disablePlayButton("reset");
        
    }
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
        toggleErrorVisibility(false)
        let errorContainer = document.getElementById("error")
        errorContainer.textContent = "";
    }
    if (document.getElementById("warning").innerHTML !== "") {
        toggleErrorVisibility(false)
        let warningContainer = document.getElementById("warning")
        warningContainer.textContent = "";
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
        runUntilNextLine();
        //runSingleCommand();
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
    } else if (cause === "reset"){
        runButtonText.textContent = "Ladataan..."
    } 
    else {
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
    isRunning = true;
    switch (_buttonsState) {
        case States.INITIAL:
            if (task.taskType === TaskTypes.codeBlockMoving) setEditorTextFromCodeBlocks();
            if (localStorage.getItem("token")){
                sendTask();
            }
            //postMessage({ type: 'start', details: getEditor().getValue() });
            runCode(getEditor().getValue(), localStorage.getItem("theme").toLowerCase());
            break;
        case States.RUNNING:
            if(isWaitingForInput) return;
            //setMessagePassingState({ paused: true });
            pauseRunner();
            break;
        case States.PAUSED:
            if(isWaitingForInput) return;
            //setMessagePassingState({ paused: false });
            resumeRunner();
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
        //themeChangeToWorker()
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