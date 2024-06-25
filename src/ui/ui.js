import * as globals from "../util/globals.js";
import * as fileReader from "../file_reader.js";
import * as api from "../api/api.js";
import * as marked from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js"
import { getEditor } from "../input/editor.js"
import { initWorker } from "../worker_messenger.js";
import { extractErrorDetails } from "../input/py_error_handling.js"
import { disablePlayButton, initializeEditorButtons } from "./ui_editor_buttons.js";
import { initGame, setTheme } from "../game/game_controller.js";


const chapterDir = "/tasks/" + globals.chapterIdentifier;
const countTaskResponse = fileReader.countForTaskFilesInDirectory(chapterDir);
const totalTasks = countTaskResponse.count;
const instructionTasks = countTaskResponse.instructionNumbers;

const totalChapters = fileReader.countForChaptersInDirectory();

let currentChapter = globals.chapterIdentifier;
const instructionsStr = "instructions";


/**
 * Runs ui initialisation functions + atm the worker_messenger worker
 */
async function main() {
    initPage(); // creates task json global variable
    if (globals.task.getTaskType() != instructionsStr) {
        initWorker();
        initializeEditorButtons();
        await initGameAndCanvas();
    }

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
    createChapterButtons();
    isUserLoggedIn();
    // checking if task type is instructions
    if (globals.task.getTaskType() != instructionsStr) {
        createGamePage();
    } else {
        createInstructionPage();
    }
}

/**
 * Edits elements of app-conatiner for instruction page
 */
function createGamePage() {
    let descriptionTargetDiv = document.getElementById("task-description");
        setDescription(descriptionTargetDiv);

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
                    questionButton.dataset.correct = true;
                }
            });
            let questions = document.getElementsByClassName("multiple-choice-question");

            Array.from(questions).forEach(question => {
                question.addEventListener("click", colorSelectedChoice);
            });
        }
        // set editor code
        window.addEventListener('load', function () {
            setEditorCode()
            getEditor().clearSelection();
            createTaskButtons(); // must be called here to avoid race condition where token (retrieved from api after login) doesn't exist before the function is called
        });
        let titleTargetDiv = document.getElementById("taskTitle");
        setTitle(titleTargetDiv);

        // set previous/next task button eventlisteners
        Array.from(document.getElementsByClassName("task-navigation-button")).forEach(button => {
            button.addEventListener("click", moveToTask);
        });
}

/**
 * Clears app-container, creates a new one and adds elements for instruction page
 */
function createInstructionPage() {
    const appDiv = document.getElementById("app-container");
    appDiv.classList.add("is-hidden");

    let insAppDiv = document.createElement('div');
    insAppDiv.id = 'instructions-container';
    insAppDiv.classList.add("box");
    insAppDiv.style.flexDirection = "row";
    insAppDiv.style.display = "flex";
    window.addEventListener('load', function () {
        createTaskButtons("instructions"); // must be called here to avoid race condition where token (retrieved from api after login) doesn't exist before the function is called
    });
    const insDiv = document.createElement('div');
    insDiv.id = 'instruction-div';
    
    let insHead = document.createElement('div');
    insHead.id = 'instruction-head';

    let insHeadline = document.createElement('h1');
    
    let instructionTitle = document.createElement('a');
    instructionTitle.id = 'instructionTitle';
    setTitle(instructionTitle);
    
    insHeadline.appendChild(instructionTitle);

    insHead.appendChild(insHeadline);
    
    let insDesc = document.createElement('div');
    setDescription(insDesc);
    insDesc.id = 'instruction-desc';
    
    
    appDiv.insertAdjacentElement("afterend", insAppDiv);
    insAppDiv.appendChild(insDiv);
    insDiv.appendChild(insHead);
    insDiv.appendChild(insDesc);

    // set previous/next task button eventlisteners
    Array.from(document.getElementsByClassName("task-navigation-button")).forEach(button => {
        button.addEventListener("click", moveToTask);
    });
}
/**
 * Sets the text from task.title to given div. Useful since game and instructions tasks use different title div.
 * @param {object} titleDiv | the title div where we want title text as a html element
 */
function setTitle(titleDiv) {
    let chapterAndTaskNumberPeriod = `${globals.chapterIdentifier}.${globals.taskIdentifier}. `
    let titleStr = chapterAndTaskNumberPeriod + globals.task.getTitle();
    titleDiv.innerHTML = titleStr;
}

export function setEditorCode() {
    getEditor().setValue(globals.task.getEditorCode());
}

/**
 * Sets the text from task.description to given div. Useful since game and instructions tasks use different description div.
 * @param {object} descriptionDiv | the description div where we want description text as a html element
 */
export function setDescription(descriptionDiv){
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

function isUserLoggedIn() {
    if (localStorage.getItem("username") !== null) {
        document.getElementById("logged-in-as-user").innerText = localStorage.getItem("username");
    }
    if (localStorage.getItem("token") !== null) {
        document.getElementById("logout-button").classList.remove("is-hidden");
        document.getElementById("logged-in-as-container").classList.remove("is-hidden");
    } else {
        document.getElementById("user-container").classList.remove("is-hidden");
    }
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
 * Create buttons for selecting tasks based on how many json files exist in tasks directory.
 * In the future the path should be able to check different directories so we can implement "chapters".
 */
function createTaskButtons(str="") {
    const buttonContainer = document.getElementById('buttonTable');
    buttonContainer.innerHTML = ''

    if (localStorage.getItem("token") !== null) { // user is logged in
        api.getCompletedTasks().then(taskList => {
            let completedTasksList = taskList.tasks;
            // Create and append buttons
            for (let i = 0; i < totalTasks; i++) {
                const button = document.createElement('button');
                let taskNumber = i+1;
            // if task is task, increase tasknumber.
            // if task is instruction, increase instructionnumber and dont increase tasknumber.
            if (instructionTasks.includes(taskNumber)) {
                button.innerText = `${taskNumber}i`;
            } else {
                button.innerText = `${taskNumber}`;
            }

            let buttonIdText = `chapter${currentChapter}task${i + 1}`;
                button.id = buttonIdText
                if (currentChapter === globals.chapterIdentifier && i+1 === globals.taskIdentifier) {
                    button.classList.add("button-current-task")
                }
                if (completedTasksList.includes(buttonIdText)) {
                    button.classList.add("button-completed");
                } else {
                    button.classList.add("button-incompleted");
                }
                    button.addEventListener('click', () => {
                    window.location.href = `?chapter=${currentChapter}&task=${i + 1}`;
                });
                buttonContainer.appendChild(button);
            }
            if (str === "instructions") {
            onTaskComplete(true);
        }
    });
    } else { // user is not logged in
        for (let i = 0; i < totalTasks; i++) {
            const button = document.createElement('button');
            let taskNumber = i+1;
            let buttonIdText = `chapter${currentChapter}task${i + 1}`;
            button.id = buttonIdText
            button.classList.add("button-incompleted");
            if (instructionTasks.includes(taskNumber)) {
                button.innerText = `${taskNumber}i`;
            } else {
                button.innerText = `${taskNumber}`;
            }
            button.addEventListener('click', () => {
                window.location.href = `?chapter=${currentChapter}&task=${i + 1}`;
            });
            buttonContainer.appendChild(button);
        }
    }
}

function createChapterButtons() {
    const selectContainer = document.getElementById('chapterbuttontable');

    selectContainer.innerHTML = '';

    if (localStorage.getItem("token") !== null) {
        api.getCompletedTasks().then(taskList => {
            let completedTasksList = taskList.tasks;
            for (let i = 0; i < totalChapters; i++) {
                const button = document.createElement('button');
                button.id = `chapter-button-${i + 1}`;
                button.value = i + 1;
                button.innerText = `Tehtäväsarja ${i + 1}`;
                if (currentChapter === i + 1) button.classList.add("button-current-chapter")
                //Check if 
                let currentTotalTasks = fileReader.countForTaskFilesInDirectory("/tasks/" + (i + 1)).count;
                let allTasksCompleted = true;
                for (let j = 0; j < currentTotalTasks; j++) {
                    let taskId = `chapter${i + 1}task${j + 1}`;
                    if (!completedTasksList.includes(taskId)) {
                        allTasksCompleted = false;
                        break;
                    }
                }

                if (allTasksCompleted) {
                    button.classList.add("button-completed");
                } else {
                    button.classList.add("button-incompleted");
                }

                button.addEventListener('click', () => {
                    currentChapter = i + 1;
                    console.log(currentChapter)
                    window.location.href = `/?chapter=${currentChapter}&task=1`;
                });
                selectContainer.appendChild(button);
            }
        })
    } else {
        for (let i = 0; i < totalChapters; i++) {
            const button = document.createElement('button');
            button.id = `chapter-button-${i + 1}`;
            button.value = i + 1;
            button.innerText = `Tehtäväsarja ${i + 1}`;
            if (currentChapter === i + 1) button.classList.add("button-current-chapter")

            button.addEventListener('click', () => {
                currentChapter = i + 1;
                console.log(currentChapter)
                window.location.href = `/?chapter=${currentChapter}&task=1`;
            });
            selectContainer.appendChild(button);
        }
    } 
}


/**
 * a function that turns the current button green and sends a PUSH request to the api indicating the user has completed a task
 * @param {boolean} won a boolean indicating whether the task was completed successfully or not
 */


export function onTaskComplete(won) {
    const apiTaskIdentifier = "chapter" + globals.chapterIdentifier + "task" + globals.taskIdentifier;

    if (won) {
        const buttonid = apiTaskIdentifier;
        let button = document.getElementById(buttonid);
        if (globals.task.getTaskType() != instructionsStr) {
        celebration();
        }
        if (button.classList.contains("button-incompleted")) {
            button.classList.replace("button-incompleted", "button-completed");
        }
        globals.setGameAsWon();
        api.sendTask(apiTaskIdentifier).then(() => {
            createChapterButtons();
        });
    } else {
        let errorMessage = "<h2>Voi juku, et vielä läpäissyt tasoa koska:<ol>";
        if (!globals.getMultipleChoiceCorrect()) errorMessage += "\n<li>monivalintatehtävän vastaus oli väärä</li>"
        globals.conditionsNotCleared.forEach(failedCondition => {
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
                    errorMessage += "\n<li>et käyttänyt input-toiminnallisuutta</li>"
                    break;
                case "conditionMaxLines":
                    errorMessage += "\n<li>vastauksessasi oli liian monta riviä</li>"
                    break;
            }
        })
        errorMessage += "</ol></h2>";

        document.getElementById("condition-failed").innerHTML = errorMessage;
        showPopUpNotification("condition-failed");
        
        api.sendTask(apiTaskIdentifier);
    }
}

/**
 * a function used by the previous/next task buttons on the page
 */
function moveToTask(event) {
    let currentTask = globals.taskIdentifier;
    let which = event.target.value;
    if (currentTask === 1 && which === "previous") return;

    switch (which) {
        case "previous":
            window.location.href = `/?chapter=${currentChapter}&task=${currentTask-1}`;
            break;
        case "next":
            window.location.href = `/?chapter=${currentChapter}&task=${currentTask+1}`;
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
    let errorContainer = document.getElementById("error-box");
    errorContainer.classList.toggle("show-error");
    errorContainer.children[0].textContent = '"' + errorDetails.text + '" Rivin ' + errorDetails.line + ' lähistöllä';
    disablePlayButton("error");
}

await main();
