import { addMultipleChoiceQuestion, generateTaskOutput } from "./editor.js";
import { createTable, importGrid } from "./editorGridHandler.js";

export function importTaskFromJSON() {
    const fileInput = document.getElementById("import-task-input");
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        const tx = document.querySelectorAll("textarea:not(#output-field)");
        reader.onload = function (e) {
            let task = JSON.parse(e.target.result);
            createTable(false, true, task.grid[0].length, task.grid.length);

            importTitle(task.title);
            importTaskType(task.taskType);
            importEnableAddRemove(task.enableAddRemove);
            importConditions(task.conditions);
            importDescription(task.description, task.taskType);
            importEditorCode(task.editorCode);
            importGrid(task.grid);
            importMultipleChoice(task.multipleChoiceQuestions);

            // send fake input to textareas to resize them
            tx.forEach(inputBox => {
                inputBox.dispatchEvent(new Event("input"));
            });

            generateTaskOutput();
        }

        reader.readAsText(file);
    }
}

function importTitle(title) {
    let taskTitle = document.getElementById("task-title-input");
    taskTitle.value = title;
}

function importTaskType(taskType) {
    let taskTypeRadios = document.getElementsByName("taskType");

    for (let i = 0; i < taskTypeRadios.length; i++) {
        if (taskTypeRadios[i].value === taskType) {
            taskTypeRadios[i].click();
        }
    }
}

function importEnableAddRemove(enableAddRemove) {
    let checkbox = document.getElementById("enable-add-remove-checkbox");
    if (enableAddRemove) {
        checkbox.checked = true;
    } else {
        checkbox.checked = false;
    }
}


function importConditions(conditions) {
    document.getElementById("options-conditions").querySelectorAll(".checkbox-container").forEach(element => {
        element.childNodes[0].checked = false;
        element.classList.remove("active");
    })

    for (let i = 0; i < conditions.length; i++) {
        if (conditions[i].condition === "conditionMaxLines") {
            if (conditions[i].parameter !== false) {
                document.getElementById(conditions[i].condition).checked = true;
                document.getElementById(conditions[i].condition).parentNode.classList.add("active");
                document.getElementById("maxLinesInput").value = conditions[i].parameter;
            }
        } else if (conditions[i].parameter !== false) {
            document.getElementById(conditions[i].condition).checked = true;
            document.getElementById(conditions[i].condition).parentNode.classList.add("active");
        }
    }
}

function importDescription(description, taskType) {
    let taskInput;
    if (taskType != "instructions") {
        taskInput = document.getElementById("task-input");
    } else {
        taskInput = document.getElementById("instructions-input");
    }
    taskInput.value = "";

    for (let i = 0; i < description.length; i++) {
        taskInput.value += (i === description.length - 1) ? description[i] : description[i] + "\n";
    }
}

function importEditorCode(editorCode) {
    let editorCodeInput = document.getElementById("editor-input");
    editorCodeInput.value = "";

    for (let i = 0; i < editorCode.length; i++) {
        editorCodeInput.value += (i === editorCode.length - 1) ? editorCode[i] : editorCode[i] + "\n";
    }
}

function importMultipleChoice(questions) {
    // clear old questions
    document.getElementById("multiple-choice-container").innerHTML = "\n";
    // add new questions
    questions.forEach(question => {
        addMultipleChoiceQuestion(question);
    })
}