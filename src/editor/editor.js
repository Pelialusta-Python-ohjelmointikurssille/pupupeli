import { TaskTypes } from "../game/commonstrings.js";
import { importTaskFromJSON } from "./editorJsonHandler.js";
import { createTable, createGridFromTable } from "./editorGridHandler.js";

let multipleChoiceButton = document.getElementById("inputMultipleChoice");
let inputCodeBlocksButton = document.getElementById("inputCodeBlocks");
let inputDescriptionButton = document.getElementById("inputDescription");

function initialize() {
    //Uppest buttons
    document.getElementById("createTable").addEventListener("click", createTable);
    document.getElementById("generateTaskOutput").addEventListener("click", generateTaskOutput);
    document.getElementById("save-button").addEventListener("click", downloadOutput);
    document.getElementById("import-task-input").addEventListener("change", ImportTask);
    //condition buttons
    document.getElementById("conditionUsedWhile").addEventListener("click", () => clickConditionBox("conditionUsedWhile"));
    document.getElementById("conditionUsedFor").addEventListener("click", () => clickConditionBox("conditionUsedFor"));
    document.getElementById("conditionUsedInput").addEventListener("click", () => clickConditionBox("conditionUsedInput"));
    document.getElementById("conditionMaxLines").addEventListener("click", () => clickConditionBox("conditionMaxLines"));
    //Tabs for selected tasktype
    inputDescriptionButton.addEventListener("click", inputButtonsToggler);
    document.getElementById("inputEditorCode").addEventListener("click", inputButtonsToggler);
    multipleChoiceButton.addEventListener("click", inputButtonsToggler);
    inputCodeBlocksButton.addEventListener("click", inputButtonsToggler);
    document.getElementById("add-multiple-choice-button").addEventListener("click", addMultipleChoiceQuestion);
    document.getElementById("del-multiple-choice-button").addEventListener("click", delMultipleChoiceQuestion);
    createTable();
}

function ImportTask() {
    importTaskFromJSON();
}

// Get all the radio buttons
let taskTypeRadios = document.querySelectorAll('input[name="taskType"]');

// Get the divs
let optionsConditionsDiv = document.getElementById('options-conditions');
let optionsInputDiv = document.getElementById('options-input');
let optionsAddRemoveDiv = document.getElementById('task-enable-add-remove');
let optionsAppContainer = document.getElementById('app-container');
let instructionsInput = document.getElementById('instructions-input');
let headlines = document.querySelectorAll('.headline');

// Add the event listener to each radio button
taskTypeRadios.forEach(radio => {
    radio.addEventListener('change', function () {
        //hide all
        hideInstructions();
        multipleChoiceButton.classList.add('is-hidden');
        inputCodeBlocksButton.classList.add('is-hidden');
        //un-hide those that are needed
        if (this.value === TaskTypes.instruction) {
            showInstructions()
        } else if (this.value === TaskTypes.multipleChoice) {
            multipleChoiceButton.classList.remove('is-hidden');
        } else if (this.value == TaskTypes.codeBlockMoving) {
            inputCodeBlocksButton.classList.remove('is-hidden');
        }
        inputDescriptionButton.click();
    });
});
// hides regular view and shows instruction view
function showInstructions() {
    optionsConditionsDiv.style.display = 'none';
    optionsInputDiv.style.display = 'none';
    optionsAppContainer.style.display = 'none';
    optionsAddRemoveDiv.style.display = 'none';
    //instructionsInput.style.display = 'block'; //Oli turha??
    instructionsInput.classList.remove('is-hidden');
    headlines.forEach(headline => {
        headline.style.display = 'none';
    });
}

// hides instruction view and shows regular view
function hideInstructions() {
    optionsConditionsDiv.style.display = 'flex';
    optionsInputDiv.style.display = 'flex';
    optionsAppContainer.style.display = 'flex';
    optionsAddRemoveDiv.style.display = 'flex';
    //instructionsInput.style.display = 'none'; //Oli turha??
    instructionsInput.classList.add('is-hidden');
    headlines.forEach(headline => {
        headline.style.display = 'block';
    });
}

class Level {
    constructor(description, taskTitle, enableAddRemove, taskType, editorCode, multipleChoiceQuestions, grid, conditions) {
        this.title = taskTitle;
        this.taskType = taskType;
        this.enableAddRemove = enableAddRemove;
        this.description = description;
        this.editorCode = editorCode;
        this.multipleChoiceQuestions = multipleChoiceQuestions;
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
    let output = new Level(taskDescriptionLines, getTitle(), getEnableAddRemove(), getTaskType(), getEditorCode(), getMultipleChoices(), createGridFromTable(), getConditions());
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

function clickConditionBox(targetName) {
    let target = document.getElementById(targetName);
    target.classList.toggle('checked');
    target.parentNode.classList.toggle('active');
}

function inputButtonsToggler(event) {
    let taskInput = document.getElementById("task-input");
    let editorInput = document.getElementById("editor-input");
    let multipleChoiceContainer = document.getElementById("multiple-choice-container");
    let multipleChoiceAddButton = document.getElementById("add-multiple-choice-button");
    let multipleChoiceDelButton = document.getElementById("del-multiple-choice-button");
    let typeIndicator = document.getElementById("box-type-indicator");
    taskInput.classList.add("is-hidden");
    editorInput.classList.add("is-hidden");
    multipleChoiceContainer.classList.add("is-hidden");
    multipleChoiceAddButton.classList.add("is-hidden");
    multipleChoiceDelButton.classList.add("is-hidden");
    switch (event.target.value) {
        case "inputDescription":
            typeIndicator.innerHTML = "Tehtävän kuvaus:";
            taskInput.classList.remove("is-hidden");
            break;
        case "inputEditorCode":
            typeIndicator.innerHTML = "Editorin koodi:";
            editorInput.classList.remove("is-hidden");
            break;
        case "inputMultipleChoice":
            typeIndicator.innerHTML = "Monivalinta vaihtoehdot:";
            multipleChoiceContainer.classList.remove("is-hidden");
            multipleChoiceAddButton.classList.remove("is-hidden");
            multipleChoiceDelButton.classList.remove("is-hidden");
            break;
    }
}

export function addMultipleChoiceQuestion(question = null) {
    let multipleChoiceContainer = document.getElementById("multiple-choice-container");
    let multipleChoiceElement = document.createElement("div");
    multipleChoiceElement.classList.add("multiple-choice", "is-flex", "is-flex-column");
    if (question === null) {
        multipleChoiceElement.innerHTML = `<input type='text' id='multiple-choice-input-box' placeholder='Lisää vastaus'><div class='multiple-choice-input'><input name='multipleChoice${multipleChoiceContainer.childNodes.length - 1}' type='checkbox'><label for='multipleChoice${multipleChoiceContainer.childNodes.length - 1} style="line-height: 20px;'>Oikea vastaus?</label></div>`;
    } else {
        if (question.isCorrectAnswer) {
            multipleChoiceElement.innerHTML = `<input type='text' id='multiple-choice-input-box' placeholder='Lisää vastaus' value=${question.question}><div class='multiple-choice-input'><input name='multipleChoice${multipleChoiceContainer.childNodes.length - 1}' type='checkbox' checked><label for='multipleChoice${multipleChoiceContainer.childNodes.length - 1} style="line-height: 20px;'>Oikea vastaus?</label></div>`;
        } else {
            multipleChoiceElement.innerHTML = `<input type='text' id='multiple-choice-input-box' placeholder='Lisää vastaus' value=${question.question}><div class='multiple-choice-input'><input name='multipleChoice${multipleChoiceContainer.childNodes.length - 1}' type='checkbox'><label for='multipleChoice${multipleChoiceContainer.childNodes.length - 1} style="line-height: 20px;'>Oikea vastaus?</label></div>`;
        }
    }
    multipleChoiceContainer.insertAdjacentElement("beforeend", multipleChoiceElement);
}

function delMultipleChoiceQuestion() {
    let multipleChoiceContainer = document.getElementById("multiple-choice-container");
    multipleChoiceContainer.childNodes[multipleChoiceContainer.childNodes.length - 1].remove();
}

// creates a downloadable file from the text in the output field
function downloadOutput() {
    let text = document.getElementById("output-field").value;
    let blob = new Blob([text], { type: "text/plain" });
    let anchor = document.createElement("a");
    anchor.download = "output.json";
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target = "_blank";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

// autoresize for textareas
const tx = document.querySelectorAll("textarea:not(#output-field)");
for (let i = 0; i < tx.length; i++) {
    tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
    tx[i].addEventListener("input", OnInput, false);
}

function OnInput() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + "px";
}

initialize();
