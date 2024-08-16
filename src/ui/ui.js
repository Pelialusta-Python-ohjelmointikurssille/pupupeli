import * as globals from "../util/globals.js";
import * as api from "../api/api.js";
import * as marked from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js"
import { getEditor } from "../input/editor.js"
import { initWorker } from "../worker_messenger.js";
import { extractErrorDetails } from "../input/py_error_handling.js"
import { disablePlayButton, initializeEditorButtons } from "./ui_editor_buttons.js";
import { initGame, resetAndInitContent, setTheme } from "../game/game_controller.js";
import { conditionsNotCleared } from "../clear_conditions.js";
import { createChapterButtons } from "./ui_buttons.js";
import { checkIfGameWon } from "../clear_conditions.js";
import { resetInputController } from "../game/game_input_controller.js";
import { updateLoginUI } from "./ui_login.js";
import { translateToTheme } from "../util/theme_translator.js";

const instructionsStr = "instructions";
let currentChapter = globals.identifiers.chapterIdentifier;
let currentTask = globals.identifiers.taskIdentifier;
/**
 * Runs ui initialisation functions + atm the worker_messenger worker
 */
async function main() {
    initPage(); // creates task json global variable
    initWorker();
    initializeEditorButtons();
    await initGameAndCanvas();
    loadNextTaskInfo();

    // Move somewhere that makes more sense. Disables scrolling on top of game window.
    document.getElementById("game-container").addEventListener("wheel", (event) => { event.preventDefault() });
}

/**
 * Inserts game canvas to right side of left container and gives it id "game"
 */
async function initGameAndCanvas() {
    let canvas = await initGame();
    document.getElementById("game-container").insertAdjacentElement("afterbegin", canvas);
    canvas.classList.add("is-flex");
    canvas.id = "game";
    setTheme(localStorage.getItem("theme"));
}

/**
 * Inserts information to page elements according to current task. Also adds task select buttons.
 * Game and instructions task types require different elements.
 */
async function initPage() {
    updateLoginUI(); //currently also creates task and chapter buttons
    // checking if current task type is instructions
    createGamePage();
}

/**
 * Edits elements of app-conatiner for instruction page
 */
function createGamePage() {
    let descriptionTargetDiv = document.getElementById("task-description");
    setDescription(descriptionTargetDiv);

    if (globals.task.getMultipleChoiceQuestions().length > 0) {
        setMultipleChoice();
    }

    setEditorCode();

    let titleTargetDiv = document.getElementById("taskTitle");
    setTitle(titleTargetDiv);

    // set previous/next task button eventlisteners
    Array.from(document.getElementsByClassName("task-navigation-button")).forEach(button => {
        button.addEventListener("click", moveToTask);
    });
}

/**
 * Adds multiple choice container to the game page and multiple choice options to the container
 */
function setMultipleChoice() {
    // set multiple choice questions
    let multipleChoiceContainer = document.getElementById("multiple-choice-questions");

    while (multipleChoiceContainer.firstChild) {
        multipleChoiceContainer.removeChild(multipleChoiceContainer.firstChild);
    }

    if (globals.task.getMultipleChoiceQuestions().length === 0) {
        multipleChoiceContainer.classList.add("is-hidden");
    } else {
        multipleChoiceContainer.classList.remove("is-hidden");
        let optionIdCounter = 0;
        globals.task.getMultipleChoiceQuestions().forEach((option) => {
            const optionId = `option-${optionIdCounter++}`;
            multipleChoiceContainer.insertAdjacentHTML("beforeend", `<div class='multiple-choice-question' id='${optionId}'>${option.question}</div>`);

            // if option is correct, add eventlistener which calls onTaskComplete
            if (option.isCorrectAnswer === true) {
                let questionButton = document.getElementById(optionId);
                questionButton.dataset.correct = true;
            }
        });
        let questions = document.getElementsByClassName("multiple-choice-question");

        Array.from(questions).forEach(question => {
            question.addEventListener("click", colorSelectedChoice);
            question.addEventListener("click", checkIfGameWon);
        });
    }
}
/**
 * Sets the text from task.title to given div. Useful since game and instructions tasks use different title div.
 * @param {object} titleDiv | the title div where we want title text as a html element
 */
export function setTitle(titleDiv) {
    let chapterAndTaskNumberPeriod = `${currentChapter}.${currentTask}. `
    let titleStr = chapterAndTaskNumberPeriod + globals.task.getTitle();
    titleDiv.innerHTML = titleStr;
}

export async function setEditorCode() {
    let editorCode = "";
    if (localStorage.getItem("token")) {
        api.getTask().then((task) => {
            editorCode = translateToTheme(task.data);
        if (editorCode === "") {
            editorCode = globals.task.getEditorCode();
        }
        getEditor().setValue(editorCode);
        getEditor().clearSelection();
    });
    } else {
        editorCode = globals.task.getEditorCode();
        getEditor().setValue(editorCode);
        getEditor().clearSelection();
    }
}

/**
 * Sets the text from task.description to given div. Useful since game and instructions tasks use different description div.
 * @param {object} descriptionDiv | the description div where we want description text as a html element
 */
export function setDescription(descriptionDiv) {
    // set description
    globals.task.getDescription().forEach((line) => {
        line = line === "" ? "<br>" : line;
        descriptionDiv.insertAdjacentHTML("beforeend", "<div>" + marked.parse(line) + "</div>");
    });
}

export function enableEditorButtons() {
    let buttons = document.getElementsByClassName("editor-button");
    Array.from(buttons).forEach(button => {
        button.disabled = false;
    });
}

function colorSelectedChoice(selectedChoice) {
    let questions = document.getElementsByClassName("multiple-choice-question");
    globals.setMultipleChoiceCorrect(selectedChoice);

    Array.from(questions).forEach(question => {
        question.classList.remove("selected-choice");
    });

    selectedChoice.target.classList.add("selected-choice");
}

/**
 * a function that turns the current button green and sends a PUSH request to the api indicating the user has completed a task
 * @param {boolean} isWon a boolean indicating whether the task was completed successfully or not
 */


export function onTaskComplete(isWon) {
    const apiTaskIdentifier = "chapter" + currentChapter + "task" + currentTask;
    if (isWon) {
        const buttonid = apiTaskIdentifier;
        let button = document.getElementById(buttonid);
        if (globals.task.getTaskType() != instructionsStr) {
            celebration();
        }
        if (button.classList.contains("button-incompleted")) {
            button.classList.replace("button-incompleted", "button-completed");
        }
        globals.setGameAsWon();
        api.sendTask().then(() => {
            createChapterButtons();
        });
    } else {
        let errorMessage = "<h2>Voi juku, et vielä läpäissyt tasoa koska:<ol>";
        if (!globals.getMultipleChoiceCorrect()) errorMessage += "\n<li>monivalintatehtävän vastaus oli väärä</li>"
        conditionsNotCleared.forEach(failedCondition => {
            switch (failedCondition) {
                case "conditionCollectAllCollectibles":
                    errorMessage += "\n<li>et kerännyt kaikkia tarvittavia asioita</li>"
                    break;
                case "conditionUsedFor":
                    errorMessage += "\n<li>et käyttänyt for-silmukkaa</li>"
                    break;
                case "conditionUsedWhile":
                    errorMessage += "\n<li>et käyttänyt while-silmukkaa</li>"
                    break;
                case "conditionUsedInput":
                    errorMessage += "\n<li>et käyttänyt input-toiminnallisuutta (esim. pupu.kysy())</li>"
                    break;
                case "conditionMaxLines":
                    errorMessage += "\n<li>vastauksessasi oli liian monta riviä</li>"
                    break;
            }
        })
        errorMessage += "</ol></h2>";

        document.getElementById("condition-failed").innerHTML = errorMessage;
        showPopUpNotification("condition-failed");

        api.sendTask();
    }
}

/**
 * a function used by the previous/next task buttons on the page
 */
export function moveToTask(event) {
    let which = event.target.value;
    if (globals.identifiers.taskIdentifier === 1 && which === "previous") return;
    if (globals.identifiers.taskIdentifier === globals.totalCounts.totalTasks && which === "next") return;

    switch (which) {
        case "previous":
            globals.identifiers.taskIdentifier = globals.identifiers.taskIdentifier - 1;
            break;
        case "next":
            globals.identifiers.taskIdentifier = globals.identifiers.taskIdentifier + 1;
            break;
    }
}

function celebration() {
    let celebrationBox = document.getElementById("celebration")
    const container = document.getElementById('celebration-confetti-container');
    for (let i = 0; i < 30; i++) {
        const celebrationConfetti = createCelebrationConfetti();
        container.appendChild(celebrationConfetti);

        // Remove the confetti after animation completes to prevent memory leaks
        celebrationConfetti.addEventListener('animationend', () => {
            container.removeChild(celebrationConfetti);
        });
    }
    celebrationBox.classList.remove("is-hidden");

    setTimeout(() => {
        celebrationBox.classList.add('is-hidden');
    }, 3000);
}

function createCelebrationConfetti() {
    const celebrationConfetti = document.createElement('div');
    celebrationConfetti.classList.add('celebration-confetti');

    // Randomize the confetti color
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    celebrationConfetti.style.setProperty('--color', randomColor);

    // Randomize the initial position and animation duration
    const randomLeft = Math.random() * 100;
    const randomDuration = Math.random() * 2 + 2; // Between 2 and 4 seconds
    celebrationConfetti.style.left = `${randomLeft}vw`;
    celebrationConfetti.style.animationDuration = `${randomDuration}s`;

    return celebrationConfetti;
}

/**
 * briefly displays a popup informing the user they have failed to log in
 */
export function showPopUpNotification(elementId) {
    let element = document.getElementById(elementId);
    if (elementId === "login-failed") {
        setTimeout(() => {
            element.classList.remove("pop-up-notification-show-login");
        }, 6000);
        element.classList.add("pop-up-notification-show-login");
    } else if (elementId === "task-not-found"){
        setTimeout(() => {
            element.classList.remove("pop-up-notification-show");
        }, 6000);
        element.classList.add("pop-up-notification-show");
    } else {
        element.classList.add("pop-up-notification-show");
    }
}

/**
 * Used to display an error message on the page.
 * @param {*} error The error to display on the page.
 */
export function displayErrorMessage(error) {
    if (typeof error === "string") { console.log(error) } else { console.log(error.message) }
    let errorDetails = extractErrorDetails(error.message);
    if (errorDetails.text === "KeyboardInterrupt") return; // intended error; do not display to user
    let errorContainer = document.getElementById("error");
    toggleErrorVisibility(true)
    errorContainer.textContent = '"' + errorDetails.text + '" Rivin ' + errorDetails.line + ' lähistöllä';
    disablePlayButton("error");
}

export function displayWarningMessage(message) {
    console.warn(message);
    let errorContainer = document.getElementById("warning");
    toggleErrorVisibility(true)
    errorContainer.textContent = message;
}

export function toggleErrorVisibility(toggle) {
    let errorDiv = document.getElementById("error-box");
    if (toggle) {
        errorDiv.classList.add("show-error");
    } else {
        errorDiv.classList.remove("show-error");
    }
}

export function loadNextTaskInfo() {
    currentChapter = globals.identifiers.chapterIdentifier;
    currentTask = globals.identifiers.taskIdentifier;
    const appContDiv = document.getElementById("app-container");
    const insContDiv = document.getElementById("instructions-container");

    if (globals.task.getTaskType() === instructionsStr) {
        appContDiv.classList.add("is-hidden");
        insContDiv.classList.remove("is-hidden");
        loadIstructionTask();
    } else {
        appContDiv.classList.remove("is-hidden");
        insContDiv.classList.add("is-hidden");
    }

    let descriptionTargetDiv = document.getElementById("task-description");
    while (descriptionTargetDiv.firstChild) {
        descriptionTargetDiv.removeChild(descriptionTargetDiv.firstChild);
    }
    setDescription(descriptionTargetDiv);
    setMultipleChoice();
    setEditorCode();

    let titleTargetDiv = document.getElementById("taskTitle");
    setTitle(titleTargetDiv);
    resetAndInitContent();
    resetInputController();
};

function loadIstructionTask() {
    loadIstructionLeft();
}

function loadIstructionLeft() {
    const leftDiv = document.getElementById('left-instructions-container');
    leftDiv.innerHTML = '';
    
    let insHead = document.createElement('div');
    insHead.id = 'instruction-head';
    insHead.classList.add('center-content');

    let insHeadline = document.createElement('h2');
    
    let instructionTitle = document.createElement('a');
    instructionTitle.id = 'instructionTitle';
    setTitle(instructionTitle);
    
    insHeadline.appendChild(instructionTitle);

    insHead.appendChild(insHeadline);
    
    let insDesc = document.createElement('div');
    setDescription(insDesc);
    insDesc.id = 'instruction-desc';

    leftDiv.appendChild(insHead);
    leftDiv.appendChild(insDesc);
    onTaskComplete(true);
}


main();
