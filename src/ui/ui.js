import * as globals from "../util/globals.js";
import * as fileReader from "../file_reader.js";
import * as api from "../api/api.js";

import { getEditor } from "../input/editor.js"
import { initWorker } from "../event_handler.js";
import { extractErrorDetails } from "../input/py_error_handling.js"
import { disablePlayButton, initializeEditorButtons } from "./ui_editor_buttons.js";
import { initGame } from "../game/game_controller.js";

let eventHandler;
const totalTasks = fileReader.countForTaskFilesInDirectory("/tasks/" + globals.chapterIdentifier);
const totalChapters = fileReader.countForChaptersInDirectory();
let currentChapter = globals.chapterIdentifier;
// const completedTasks = fileReader.tryGetFileAsJson("/completed_tasks/completed.json");

/**
 * Runs ui initialisation functions + atm the event_handlers worker
 */
async function main() {
    initWorker();
    initPage();
    initializeEditorButtons();
    await initGameAndCanvas();

    // Create chapter buttons
}

/**
 * Inserts game canvas to right side of left container and gives it id "game"
 */
async function initGameAndCanvas() {
    let canvas = await initGame();
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
                questionButton.addEventListener("click", globals.setMultipleChoiceCorrect, false);
            }
        });
        let questions = document.getElementsByClassName("multiple-choice-question");

        Array.from(questions).forEach(question => {
            question.addEventListener("click", colorSelectedChoice);
        });
    }
    // set editor code
    window.addEventListener('load', function () {
        getEditor().setValue(globals.task.getEditorCode());
    });

    createTaskButtons();
    createChapterButtons();
    isUserLoggedIn();

    // set theme eventlistener, but first set theme if not set
    if (localStorage.getItem("theme") === null) localStorage.setItem("theme", "Pupu");
    let themeSelectDropdown = document.getElementById("theme-select");
    themeSelectDropdown.value = localStorage.getItem("theme");
    themeSelectDropdown.addEventListener('change', function (event) {
        let selectedValue = event.target.value;
        localStorage.setItem("theme", selectedValue);
        window.location.reload();
    });
    console.log(globals.theme);
}

function isUserLoggedIn() {
    if (localStorage.getItem("token") !== null) {
        document.getElementById("user-container").classList.add("is-hidden");
        document.getElementById("logout-button").classList.remove("is-hidden");
    }
}

function colorSelectedChoice(selectedChoice) {
    let questions = document.getElementsByClassName("multiple-choice-question");

    Array.from(questions).forEach(question => {
        question.classList.remove("selected-choice");   
    });

    selectedChoice.target.classList.add("selected-choice");
}

/**
 * Create buttons for selecting tasks based on how many json files exist in tasks directory.
 * In the future the path should be able to check different directories so we can implement "chapters".
 */
function createTaskButtons() {
    let completedTasksList = api.getCompletedTasks(api.apiUrl);
    const chapter = globals.chapterIdentifier;
    console.log(completedTasksList)

    const numberOfButtons = totalTasks
    const buttonContainer = document.getElementById('buttonTable');
    if (localStorage.getItem("completedTasks") === null) {
        createEmptyTasksCompletedJson()
    }
    let completedTasksStrRaw = localStorage.getItem("completedTasks");
    let completedTasksDict = JSON.parse(completedTasksStrRaw);

    completedTasksList.then(taskList => {
        completedTasksList = taskList.tasks;
        // Create and append buttons
        for (let i = 0; i < numberOfButtons; i++) {
            const button = document.createElement('button');
            let buttonIdText = `chapter${chapter}task${i + 1}`;
            button.id = buttonIdText
            if (completedTasksList.includes(buttonIdText)) {
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
    })
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
export function onTaskComplete(won) {
    const chapterIdentifier = globals.chapterIdentifier;
    const taskIdentifier = globals.taskIdentifier;
    const apiTaskIdentifier = "chapter"+chapterIdentifier+"task"+taskIdentifier;

    if (won) {
        const buttonid = `button-${taskIdentifier}`;
        let button = document.getElementById(buttonid);
        let celebrationBox = document.getElementById("celebration")

        celebrationBox.classList.remove("is-invisible");

        setTimeout(() => {
            celebrationBox.classList.add('is-invisible');
        }, 3000);

        if (button.getAttribute("class") == "button-incompleted") {
            if (localStorage.getItem("completedTasks") === null) {
                createEmptyTasksCompletedJson()
            }
            addCompletedTaskToLocalStorage()
            button.classList.replace("button-incompleted", "button-completed");
        }
        globals.setGameAsWon();
        api.sendTask(api.apiUrl, apiTaskIdentifier);
    } else {
        api.sendTask(api.apiUrl, apiTaskIdentifier);
    }
}

function addCompletedTaskToLocalStorage() {
    let completedTasksDict = JSON.parse(localStorage.getItem("completedTasks"));
    completedTasksDict[currentChapter].push(globals.taskIdentifier);
    localStorage.setItem("completedTasks", JSON.stringify(completedTasksDict));
}


/**
 * Used to get the event handler we are currently using.
 * @returns The event handler we're currently using.
 */
export function getEventHandler() {
    return eventHandler;
}

/**
 * Used to display an error message on the page.
 * @param {*} error The error to display on the page.
 */
export function displayErrorMessage(error) {
    if (typeof error === "string") { console.log(error) } else { console.log(error.message) }
    let errorDetails = extractErrorDetails(error.message);
    if (errorDetails.text === "KeyboardInterrupt") {
        //KeyboardInterrupt error happens when pyodide is interrupted while doing "input()"
        //Do not show this error to user, as it's working as intended.
        return;
    }
    let errorContainer = document.getElementById("error-box");
    errorContainer.classList.toggle("show-error");
    errorContainer.children[0].textContent = '"' + errorDetails.text + '" Rivin ' + errorDetails.line + ' lähistöllä';
    disablePlayButton("error");
}

await main();
