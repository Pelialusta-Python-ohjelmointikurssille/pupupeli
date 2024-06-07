import * as globals from "./util/globals.js";
import * as game from "./game/game_controller.js";
import * as fileReader from "./file_reader.js";
import * as editor from "./input/editor.js";
import * as errorHandler from "./input/py_error_handling.js";
import { EventHandler } from "./event_handler.js";

let eventHandler;
let state = { current: "initial" };
let worker = new Worker('/src/input/worker.js');
let initialized = false;
const totalTasks = fileReader.countForFilesInDirectory("/tasks");

/**
 * Runs ui initialisation functions
 */
async function main() {
    initialize();
    initPage()
    addButtonEvents();
    await initGame();
}

/**
 * Creates worker event handler and posts message to initialise pyodide with python file. On reload, calls to reset worker.
 */
function initialize() {
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

/**
 * Inserts game canvas to right side of left container and gives it id "game"
 */
async function initGame() {
    let canvas = await game.initGame();
    document.getElementById("left-container").insertAdjacentElement("afterend", canvas);
    canvas.classList.add("is-flex");
    canvas.id = "game";
}

/**
 * Inserts information to page elements according to current task. Also adds task select buttons.
 */
async function initPage() {
    // Set task identifier
    const taskIdentifier = globals.taskIdentifier;
    document.getElementById("task-id").innerHTML = taskIdentifier;

    // Update the href for previous and next task links
    const prevTaskLink = document.querySelector('a[href^="/?task="]:first-child');
    const nextTaskLink = document.querySelector('a[href^="/?task="]:last-child');

    // Changes href of prevtasklink and hides it if no prev task exists
    if (taskIdentifier > 1) {
        prevTaskLink.href = `/?task=${taskIdentifier - 1}`;
        prevTaskLink.style.display = 'inline'; // Ensure it's visible
    } else {
        prevTaskLink.style.display = 'none'; // Hide if on the first task
    }

    // Changes href of nexttasklink and hides it if no prev task exists
    if (taskIdentifier < totalTasks) {
        nextTaskLink.href = `/?task=${taskIdentifier + 1}`;
        nextTaskLink.style.display = 'inline'; // Ensure it's visible
    } else {
        nextTaskLink.style.display = 'none'; // Hide if on the last task
    }

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
    createTaskButtons();

}

/**
 * Adds events to code execution buttons (run/pause, stop, skip)
 */
function addButtonEvents() {
    addEventToButton("editor-run-pause-button", onRunButtonClick);
    addEventToButton("editor-stop-button", onResetButtonClick);
    addEventToButton("editor-skip-button", onNextStepButtonClick);
    //addEventToButton("grid-toggle-button", game.rendererToggleGrid);

    /**
     * Adds eventlistener to a given button to trigger given function
     * @param {string} id 
     * @param {function} func 
     */
    function addEventToButton(id, func) {
        let buttonInput = document.getElementById(id);
        buttonInput.addEventListener("click", func, false);
    }
}

/**
 * Create buttons for selecting tasks based on how many json files exist in tasks directory.
 * In the future the path should be able to check different directories so we can implement "chapters".
 */
function createTaskButtons() {
    const numberOfButtons = totalTasks
    const buttonContainer = document.getElementById('buttonTable');
    if (localStorage.getItem("completedTasks") === null) {
        let completedTasksStr = "";
        localStorage.setItem("completedTasks", completedTasksStr)
    }
    let completedTasksStr = localStorage.getItem("completedTasks");
    let completedTasksArr = completedTasksStr.split(",");


    // Create and append buttons
    for (let i = 0; i < numberOfButtons; i++) {
        const button = document.createElement('button');
        button.id = `button-${i + 1}`;
        if (completedTasksArr.includes(`${i + 1}`)) {
            button.classList.add("button-completed");
        } else {
            button.classList.add("button-incompleted");
        }
        button.innerText = `${i + 1}`;
        button.class
        button.addEventListener('click', () => {
            window.location.href = `?task=${i + 1}`;
        });
        buttonContainer.appendChild(button);
    }
}

/**
 * Turns task button green and saves completion status. The html button's class is changed and the task number is added to localStorage. 
 */
export function onTaskComplete() {
    const taskIdentifier = globals.taskIdentifier;
    const buttonid = `button-${taskIdentifier}`;
    let button = document.getElementById(buttonid);

    if (button.getAttribute("class") == "button-incompleted") {
        let completedTasksStr = localStorage.getItem("completedTasks");
        button.classList.replace("button-incompleted", "button-completed");

        let completedTasksArr = completedTasksStr.split(",");

        completedTasksArr.push(taskIdentifier);

        completedTasksStr = completedTasksArr.join(",")
        localStorage.setItem("completedTasks", completedTasksStr);
    }
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
}

/**
 * Sets state to initial and resets all task elements to default state.
 * Also resets worker by calling initialize while initialized === true.
 * Does nothing if state is initial.
 */
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

/**
 * Changes state to paused, runs single command, changes state to running
 */
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
    console.log("Last command finished");
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
