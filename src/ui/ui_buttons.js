import * as api from "../api/api.js";
import * as globals from "../util/globals.js";
import { setTitle, setDescription, moveToTask, onTaskComplete } from "./ui.js";

/**
 * Clears app-container, creates a new one and adds elements for instruction page
 */
export function createInstructionPage() {
    //Commenting fixes lint, is this even used?
    //const taskIdentifier = globals.taskIdentifier;
    //const chapterIdentifier = globals.chapterIdentifier;
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
 * Create buttons for selecting tasks based on how many json files exist in tasks directory.
 * In the future the path should be able to check different directories so we can implement "chapters".
 */
export function createTaskButtons(str = "") {
    const buttonContainer = document.getElementById('buttonTable');
    buttonContainer.innerHTML = ''
    const currentChapter = globals.identifiers.chapterIdentifier;
    if (localStorage.getItem("token") !== null) { // user is logged in
        api.getCompletedTasks().then(taskList => {
            let completedTasksList = taskList.tasks;
            // Create and append buttons
            for (let i = 0; i < globals.totalCounts.totalTasks; i++) {
                const button = document.createElement('button');
                let taskNumber = i + 1;
                // if task is task, increase tasknumber.
                // if task is instruction, increase instructionnumber and dont increase tasknumber.
                button.innerText = `${taskNumber}`;

                let buttonIdText = `chapter${currentChapter}task${i + 1}`;
                button.id = buttonIdText
                if (i + 1 === 1) {
                    button.classList.add("button-current-task")
                }
                if (completedTasksList.includes(buttonIdText)) {
                    button.classList.add("button-completed");
                } else {
                    button.classList.add("button-incompleted");
                }
                button.addEventListener('click', () => {
                    globals.identifiers.taskIdentifier = i + 1;
                });
                buttonContainer.appendChild(button);
            }
            if (str === "instructions") {
                onTaskComplete(true);
            }
        });
    } else { // user is not logged in
        for (let i = 0; i < globals.totalCounts.totalTasks; i++) {
            const button = document.createElement('button');
            let taskNumber = i + 1;
            let buttonIdText = `chapter${currentChapter}task${i + 1}`;
            button.id = buttonIdText;
            button.classList.add("button-incompleted");
            button.innerText = `${taskNumber}`;
            button.addEventListener('click', () => {
                globals.identifiers.taskIdentifier = i + 1;
            });
            buttonContainer.appendChild(button);
        }
    }
}

/**
 * Creates chapter buttons and appends them to the 'chapterbuttontable' container.
 * If the user is logged in, it will fetch the list of completed tasks from the API and mark the chapters
 * as completed or incompleted based on the task completion status.
 */
export function createChapterButtons() {
    const selectContainer = document.getElementById('chapterbuttontable');
    selectContainer.innerHTML = '';
    if (localStorage.getItem("token") !== null) {
        api.getCompletedTasks().then(taskList => {
            let completedTasksList = taskList.tasks;
            for (let i = 0; i < globals.totalCounts.totalChapters; i++) {
                const button = document.createElement('button');
                button.id = `chapter-button-${i + 1}`;
                button.value = i + 1;
                button.innerText = `Tehtäväsarja ${i + 1}`;
                if (i + 1 === 1) button.classList.add("button-current-chapter")
                let currentTotalTasks = globals.totalTasksbyChapter[i];
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
                    globals.identifiers.chapterIdentifier = i + 1;
                });
                selectContainer.appendChild(button);
            }
        })
    } else {
        for (let i = 0; i < globals.totalCounts.totalChapters; i++) {
            const button = document.createElement('button');
            button.id = `chapter-button-${i + 1}`;
            button.value = i + 1;
            button.innerText = `Tehtäväsarja ${i + 1}`;
            if (i + 1 === 1) {
                button.classList.add("button-current-chapter")
            }
            button.addEventListener('click', () => {
                globals.identifiers.chapterIdentifier = i + 1;
            });
            selectContainer.appendChild(button);
        }
    }
}

export function updateCurrentTaskButton() {
    const currentTask = globals.identifiers.taskIdentifier;
    const buttonContainer = document.getElementById('buttonTable');
    const buttons = buttonContainer.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
        if (i + 1 === currentTask) {
            buttons[i].classList.add("button-current-task");
        } else {
            buttons[i].classList.remove("button-current-task");
        }
    }
}

export function updateCurrentChapterButton() {
    const currentChapter = globals.identifiers.chapterIdentifier;
    const buttonContainer = document.getElementById('chapterbuttontable');
    const buttons = buttonContainer.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
        if (i + 1 === currentChapter) {
            buttons[i].classList.add("button-current-chapter");
        } else {
            buttons[i].classList.remove("button-current-chapter");
        }
    }
}