import * as globals from "../util/globals.js";
import * as fileReader from "../file_reader.js";
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
    game.setTheme(localStorage.getItem("theme"));
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
                questionButton.addEventListener("click", onTaskComplete, false);
            }
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
        game.setTheme(selectedValue);
        //window.location.reload();
    });
    console.log(globals.theme);
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
    errorContainer.children[0].textContent = '"' + errorDetails.text + '" Rivillä: ' + errorDetails.line;
    disablePlayButton("error");
}

await main();
