import * as globals from "./util/globals.js";
import * as game from "./game/game_controller.js";
import * as fileReader from "./file_reader.js";
import * as editor from "./input/editor.js";
import * as errorHandler from "./input/py_error_handling.js";
import { EventHandler } from "./event_handler.js";
import { Constants } from "./game/commonstrings.js";

/* global ace */

let eventHandler;
let state = { current: "initial" };
let worker = new Worker('/src/input/worker.js');
let initialized = false;
const totalTasks = fileReader.countForTaskFilesInDirectory("/tasks/"+globals.chapterIdentifier);
const totalChapters = fileReader.countForChaptersInDirectory();
let currentChapter = globals.chapterIdentifier;
let currentMarker;
// const completedTasks = fileReader.tryGetFileAsJson("/completed_tasks/completed.json");

/**
 * Runs ui initialisation functions
 */
async function main() {
    initialize();
    initPage();
    addButtonEvents();
    await initGame();
    
     // Create chapter buttons
}

/**
 * Creates worker event handler and posts message to initialise pyodide with python file. On reload, calls to reset worker.
 */
function initialize() {
    eventHandler = new EventHandler(getWorker());

    if (!initialized) {
        console.log("Initializing pyodide worker...")
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
    //copypasted from createTaskButtons function, this could be globals
    //const totalTasks = fileReader.countForFilesInDirectory("/tasks");
    const taskIdentifier = globals.taskIdentifier;
    const chapterIdentifier = globals.chapterIdentifier;
    document.getElementById("task-id").innerHTML = globals.taskIdentifier;

    // Update the href for previous and next task links
    const prevTaskLink = document.querySelector('a[href^="/?task="]:first-child');
    const nextTaskLink = document.querySelector('a[href^="/?task="]:last-child');

    // Changes href of prevtasklink and hides it if no prev task exists
    if (taskIdentifier > 1) {
        prevTaskLink.href = `/?chapter=${chapterIdentifier}&task=${taskIdentifier - 1}`;

        prevTaskLink.style.display = 'inline'; // Ensure it's visible
    } else {
        prevTaskLink.style.display = 'none'; // Hide if on the first task
    }
    const totalTasks = fileReader.countForTaskFilesInDirectory(`/tasks/${globals.chapterIdentifier}`);
    // Changes href of nexttasklink and hides it if no prev task exists
    if (taskIdentifier < totalTasks) {
        nextTaskLink.href = `/?chapter=${chapterIdentifier}&task=${taskIdentifier + 1}`;

        nextTaskLink.style.display = 'inline'; // Ensure it's visible
    } else {
        nextTaskLink.style.display = 'none'; // Hide if on the last task
    }



    // set description
    globals.task.getDescription().forEach((line, i) => {
        line = line === "" ? "<br>" : line;
        if (line === "<br>" && i < 2) return;
        if (i === 0) {
            document.getElementById("task-description").insertAdjacentHTML("beforeend", "<p>" + line + "</p>");
        } else {
            document.getElementById("task-description").insertAdjacentHTML("beforeend", "<div>" + line + "</div>");
        }
    });

    // set multiple choice questions
    let multipleChoiceContainer = document.getElementById("multiple-choice-questions");
    if (globals.task.getMultipleChoiceQuestions().length > 0) {
        multipleChoiceContainer.classList.remove("is-hidden");
        let optionIdCounter = 0;
        globals.task.getMultipleChoiceQuestions().forEach((option) => {
            const optionId = `option-${optionIdCounter++}`;
            multipleChoiceContainer.insertAdjacentHTML("beforeend", `<div class='multiple-choice-question' id='${optionId}'>${option.question}</div>`);

            // if option is correct, add eventlistener which calls onTaskComplete
            if (option.isCorrectAnswer === true) {
                let questionButton = document.getElementById(optionId);
                questionButton.addEventListener("click", onTaskComplete, false);
               }
        });
    }
    // set editor code
    window.addEventListener('load', function () {
        editor.getEditor().setValue(globals.task.getEditorCode());
    });
    
    createTaskButtons();
    createChapterButtons();
    isUserLoggedIn();

    // set theme eventlistener, but first set theme if not set
    if (localStorage.getItem("theme") === null) localStorage.setItem("theme", "Pupu");
    let themeSelectDropdown = document.getElementById("theme-select");
    themeSelectDropdown.value = localStorage.getItem("theme");
    themeSelectDropdown.addEventListener('change', function(event) {
        let selectedValue = event.target.value;
        localStorage.setItem("theme", selectedValue);
        window.location.reload();
    });
    console.log(globals.theme);
}

/**
 * Adds events to code execution buttons (run/pause, stop, skip)
 */
function addButtonEvents() {
    addEventToButton("editor-run-pause-button", onRunButtonClick);
    addEventToButton("editor-stop-button", onResetButtonClick);
    addEventToButton("editor-skip-button", onNextStepButtonClick);
    addEventToButton("grid-toggle-button", game.toggleGrid);

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

function isUserLoggedIn() {
    let userNameContainer = document.getElementById('user-name');
    let userLogContainer = document.getElementById('log-button');
    userNameContainer.innerHTML = ''; // Clear the userContainer
    userLogContainer.innerHTML = ''; // Clear the userContainer
    if (localStorage.getItem("username") !== null) {
        let usernameElement = document.createElement('p');
        userNameContainer.style.width = "300px";
        usernameElement.textContent = "Käyttäjä: " + localStorage.getItem("username");
        let logoutButton = document.createElement('button');
        logoutButton.textContent = "Kirjaudu ulos";
        logoutButton.style.marginBottom = "0px";
        logoutButton.style.height = "30px";
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem("username");
            usernameElement.textContent = "";
            isUserLoggedIn()
        });
        userNameContainer.appendChild(usernameElement) // Append the usernameElement
        userLogContainer.appendChild(logoutButton);
    } else {
        // Create the input elements
        let userInput = document.createElement('input');
        let submitButton = document.createElement('button');
        userNameContainer.style.width = "150px";
        // Set the attributes for the user input
        userInput.setAttribute('type', 'text');
        userInput.setAttribute('id', 'user-input');
        userInput.setAttribute('placeholder', 'Enter user name');

        // Set the attributes for the submit button
        submitButton.style.marginBottom = "0px";
        submitButton.textContent = "Kirjaudu sisään";
        submitButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the form from being submitted
            localStorage.setItem("username", userInput.value);
            isUserLoggedIn()
        });

        // Append the elements to the user container
        userNameContainer.appendChild(userInput);
        userLogContainer.appendChild(submitButton);
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
        createEmptyTasksCompletedJson()
    }
    let completedTasksStrRaw = localStorage.getItem("completedTasks");
    let completedTasksDict = JSON.parse(completedTasksStrRaw);

    // Create and append buttons
    for (let i = 0; i < numberOfButtons; i++) {
        const button = document.createElement('button');
        button.id = `button-${i + 1}`;
        if (completedTasksDict[currentChapter].includes(i + 1)) {
            button.classList.add("button-completed");
        } else {
            button.classList.add("button-incompleted");
        }
        button.innerText = `${i + 1}`;
        button.addEventListener('click', () => {
            window.location.href = `?chapter=${currentChapter}&task=${i + 1}`;
        });
        buttonContainer.appendChild(button);
    }
}

function createEmptyTasksCompletedJson() {
    let tasksCompleted = {};
    for (let i = 1; i <= totalChapters; i++) {
        tasksCompleted[i] = [];
    }
    localStorage.setItem("completedTasks", JSON.stringify(tasksCompleted));
}

function createChapterButtons() {
    const numberOfButtons = totalChapters;
    const selectContainer = document.getElementById('chapterbuttontable');

    for (let i = 0; i < numberOfButtons; i++) {
        const option = document.createElement('option');
        option.id = `chapter-option-${i + 1}`;
        option.value = i + 1;
        option.innerText = `Tehtäväsarja ${i + 1}`;
        selectContainer.appendChild(option);
    }

    selectContainer.value = currentChapter;

    selectContainer.addEventListener('change', (event) => {
        const selectedChapter = event.target.value;
        window.location.href = `/?chapter=${selectedChapter}&task=1`;
    });
} 

/**
 * Turns task button green and saves completion status. The html button's class is changed and the task number is added to localStorage. 
 */
export function onTaskComplete() {
    const taskIdentifier = globals.taskIdentifier;
    const buttonid = `button-${taskIdentifier}`;
    let button = document.getElementById(buttonid);
    let celebrationBox = document.getElementById("celebration")

    celebrationBox.classList.remove("is-invisible");

    if (button.getAttribute("class") == "button-incompleted") {
        if (localStorage.getItem("completedTasks") === null) {
            createEmptyTasksCompletedJson()
        }
        addCompletedTaskToLocalStorage()
        button.classList.replace("button-incompleted", "button-completed");
    }
}

function addCompletedTaskToLocalStorage() {
    let completedTasksDict = JSON.parse(localStorage.getItem("completedTasks"));
    completedTasksDict[currentChapter].push(globals.taskIdentifier);
    localStorage.setItem("completedTasks", JSON.stringify(completedTasksDict));
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
    eventHandler.inputToWorker(Constants.PYODIDE_INTERRUPT_INPUT); //Special str that interrupt pyodide if it's in handleInput()
    if (state.current === "initial") return;
    state.current = "initial";
    let buttonNext = document.getElementById("editor-skip-button");
    let button = document.getElementById("editor-run-pause-button");
    let img = button.querySelector('img');
    let celebrationBox = document.getElementById("celebration")
    img.src = "src/static/runbutton.png";
    button.querySelector('#runButtonText').textContent = 'Suorita';
    globals.setCurrentLine(null);
    buttonNext.disabled = false;
    button.disabled = false;
    if (document.getElementById("error").innerHTML !== "") {
        let errorContainer = document.getElementById("error-box");
        errorContainer.classList.toggle("show-error");
        errorContainer.children[0].textContent = "";
    }
    promptUserInput(true); // hide input box if visible
    let containsInvisible = celebrationBox.classList.contains("is-invisible");
    if (!containsInvisible) {
        celebrationBox.classList.add("is-invisible") // hide celebration box
    }
   
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

/**
 * disables run and skip buttons, changes their images and changes state to "ended".
 * If code had an error, button changes text to indicate that.
 * @param {*} cause 
 */
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

/**
 * Returns worker object
 * @returns {Worker} worker
 */
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
    if (errorDetails.text === "KeyboardInterrupt") {
        //KeyboardInterrupt error happens when pyodide is interrupted while doing "input()"
        //Do not show this error to user, as it's working as intended.
        return;
    }
    let errorContainer = document.getElementById("error-box");
    errorContainer.classList.toggle("show-error");
    errorContainer.children[0].textContent = '"' + errorDetails.text + '" Rivin ' + errorDetails.line + ' lähistöllä';
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

export function highlightCurrentLine(lineNumber) {
    globals.setCurrentLine(lineNumber);
    if (currentMarker !== undefined) {
        editor.getEditor().session.removeMarker(currentMarker);
    }
    currentMarker = editor.getEditor().session.addMarker(new ace.Range(lineNumber-1, 4, lineNumber-1, 5), "executing-line", "fullLine");
}

await main();
