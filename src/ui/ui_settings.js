import * as globals from "../util/globals.js";
import * as api from "../api/api.js";

let settingsButton = document.getElementById("settings-button");
let closeButton = document.getElementById("settings-close-button");
let settingsWindow = document.getElementById("settings-window");
let overlay = document.getElementById("overlay");

function addSettingsButtonListener() {
    settingsButton.addEventListener("click", () => {
        settingsWindow.classList.toggle("is-hidden");
        overlay.classList.toggle("is-visible");
    });
    closeButton.addEventListener("click", () => {
        settingsWindow.classList.toggle("is-hidden");
        overlay.classList.toggle("is-visible");
    });
}

export function settingsTaskProgress() {
    let progressDiv = document.getElementById("task-progress");
    progressDiv.innerHTML = "";
    if (localStorage.getItem("token") ){
        let progressHeader = document.createElement("h2");
        progressHeader.innerText = "Tehtävien edistyminen:";
        progressDiv.appendChild(progressHeader);
        api.getCompletedTasks().then(taskList => {
            let completedTasksList = taskList.tasks;
            let totalTasks = globals.totalTasksbyChapter
            for (let i = 0; i < totalTasks.length; i++) {
                let completedTasks = 0;
                for (let j = 0; j < totalTasks[i]; j++) {
                    let taskId = `chapter${i + 1}task${j + 1}`;
                    if (completedTasksList.includes(taskId)) {
                        completedTasks++;
                    }
                }
                let progress = Math.round((completedTasks / totalTasks[i]) * 100);
                let progressText = document.createElement("p");
                progressText.innerText = `Tehtäväsarja ${i + 1}: ${completedTasks}/${totalTasks[i]}  (${progress}%)`;
                progressDiv.appendChild(progressText);
            }
        });
    } else {
        let progressText = document.createElement("p");
        progressText.innerText = "Kirjaudu sisään nähdäksesi tehtävien edistyminen";
        progressDiv.appendChild(progressText);
    }
}

addSettingsButtonListener();
settingsTaskProgress();
