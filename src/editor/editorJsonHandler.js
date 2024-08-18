import { addMultipleChoiceQuestion, addCodeBlock } from "./editor.js";
import { createTable, importGrid, createGridFromTable } from "./editorGridHandler.js";

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
            importCodeBlocks(task.codeBlocks);

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

export function generateTaskOutput() {
    let taskTitle = document.querySelector('#task-title-input').value;
    let selectedTaskType = document.querySelector('input[name="taskType"]:checked').value;
    const taskDescriptionLines = [];
    if (selectedTaskType === 'instructions') {
        document.getElementById('instructions-input').value.split("\n").forEach((line) => {
            taskDescriptionLines.push(line);
        });
    } else {
        document.getElementById("task-input").value.split("\n").forEach((line) => {
            taskDescriptionLines.push(line);
        });
    }

    // use Level class to get json output
    let output = new Level(taskDescriptionLines, getTitle(), getEnableAddRemove(),
        getTaskType(), getEditorCode(), getMultipleChoices(), getCodeBlocks(), createGridFromTable(), getConditions());
    let outputField = document.getElementById("output-field");
    outputField.value = customJSONStringify(output);
    // need to fire input event to resize output field
    // outputField.dispatchEvent(new Event("input"));

    // show save button after generating task output
    const save_button = document.getElementById("save-button");
    if (save_button.classList.contains("is-hidden")) save_button.classList.toggle("is-hidden");

    // check if array consists of single characters only (relevant for printing our grid nicely)
    function isSingleCharArray(array) {
        return Array.isArray(array) && array.every(item => typeof item === 'string' && item.length === 1);
    }

    // replacer function for JSON.stringify
    function stringifyReplacer(key, value) {
        if (isSingleCharArray(value)) {
            return `[${value.join(',')}]`;
        }
        return value;
    }

    // remove extra quotes around the single-character arrays
    function customJSONStringify(obj) {
        return JSON.stringify(obj, (key, value) => {
            let replacedValue = stringifyReplacer(key, value);
            if (typeof replacedValue === 'string' && replacedValue.startsWith('[')) {
                return replacedValue;
            }
            return value;
        }, 2).replace(/"(\[.*?\])"/g, '$1');
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

function importCodeBlocks(codeBlocks) {
    //clear, then add
    document.getElementById("code-blocks-container").innerHTML = "\n";
    codeBlocks.forEach(codeblock => {
        addCodeBlock(codeblock);
    })
}

class Level {
    constructor(description, taskTitle, enableAddRemove, taskType, editorCode, multipleChoiceQuestions, codeBlocks, grid, conditions) {
        this.title = taskTitle;
        this.taskType = taskType;
        this.enableAddRemove = enableAddRemove;
        this.description = description;
        this.editorCode = editorCode;
        this.multipleChoiceQuestions = multipleChoiceQuestions;
        this.codeBlocks = codeBlocks;
        this.grid = grid;
        this.conditions = conditions;
    }
}

function getConditions() {
    let conditions = [];
    let conditionElements = document.getElementsByClassName("checkbox");
    for (let x = 0; x < conditionElements.length; x++) {
        if (conditionElements[x].value === "conditionMaxLines") {
            let maxLinesValue = conditionElements[x].checked ? conditionElements[x].nextElementSibling.children[0].value : false;
            conditions.push({ condition: conditionElements[x].value, parameter: maxLinesValue });
        } else {
            conditions.push({ condition: conditionElements[x].value, parameter: conditionElements[x].checked });
        }
    }
    return conditions;
}

function getMultipleChoices() {
    let multipleChoices = document.getElementById("multiple-choice-container").childNodes;
    let multipleChoiceArray = []

    for (let i = 1; i < multipleChoices.length; i++) {
        multipleChoiceArray.push({ question: multipleChoices[i].childNodes[0].value, isCorrectAnswer: multipleChoices[i].childNodes[1].childNodes[0].checked });
    }

    return multipleChoiceArray;
}

function getCodeBlocks() {
    let codeBlocks = document.getElementById("code-blocks-container").childNodes;
    let multipleChoiceArray = []

    for (let i = 1; i < codeBlocks.length; i++) {
        multipleChoiceArray.push(codeBlocks[i].childNodes[0].value);
    }

    return multipleChoiceArray;
}

function getEditorCode() {
    const editorCodeLines = [];
    document.getElementById("editor-input").value.split("\n").forEach((line) => {
        editorCodeLines.push(line);
    });
    return editorCodeLines;
}

function getTitle() {
    let titleLine = document.querySelector("#task-title-input").value;
    return titleLine;
}

function getTaskType() {
    let typeLine = document.querySelector('input[name="taskType"]:checked').value;
    return typeLine;
}

function getEnableAddRemove() {
    let enableAddRemove = document.getElementById("enable-add-remove-checkbox").checked;
    return enableAddRemove;
}