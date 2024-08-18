import { TaskTypes } from "../game/commonstrings.js";
import { importTaskFromJSON, generateTaskOutput } from "./editorJsonHandler.js";
import { createTable } from "./editorGridHandler.js";

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
    document.getElementById("add-codeBlock").addEventListener("click", addCodeBlock);
    document.getElementById("del-codeBlock").addEventListener("click", delCodeBlock);
    createTable();
}

function ImportTask() {
    importTaskFromJSON();
    //aa ei vissiin tarvii muuta?
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

function clickConditionBox(targetName) {
    let target = document.getElementById(targetName);
    target.classList.toggle('checked');
    target.parentNode.classList.toggle('active');
}

function inputButtonsToggler(event) {
    //Refactor this someday, even better if move to new file
    let taskInput = document.getElementById("task-input");
    let editorInput = document.getElementById("editor-input");
    let multipleChoiceContainer = document.getElementById("multiple-choice-container");
    let multipleChoiceAddButton = document.getElementById("add-multiple-choice-button");
    let multipleChoiceDelButton = document.getElementById("del-multiple-choice-button");
    let inputCodeBlocksContainer = document.getElementById("code-blocks-container");
    let inputCodeBlocksAddButton = document.getElementById("add-codeBlock");
    let inputCodeBlocksDelButton = document.getElementById("del-codeBlock");
    let typeIndicator = document.getElementById("box-type-indicator");
    taskInput.classList.add("is-hidden");
    editorInput.classList.add("is-hidden");
    multipleChoiceContainer.classList.add("is-hidden");
    multipleChoiceAddButton.classList.add("is-hidden");
    multipleChoiceDelButton.classList.add("is-hidden");
    inputCodeBlocksContainer.classList.add("is-hidden");
    inputCodeBlocksAddButton.classList.add("is-hidden");
    inputCodeBlocksDelButton.classList.add("is-hidden");
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
        case "inputCodeBlocks":
            inputCodeBlocksContainer.classList.remove("is-hidden");
            inputCodeBlocksAddButton.classList.remove("is-hidden");
            inputCodeBlocksDelButton.classList.remove("is-hidden");
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

export function addCodeBlock(string = null) {
    let codeBlocksContainer = document.getElementById("code-blocks-container");
    let codeBlock = document.createElement("div");
    codeBlock.classList.add("multiple-choice", "is-flex", "is-flex-column");
    if (string === null) {
        codeBlock.innerHTML = `<input type='text' id='code-block-input-box' placeholder='Koodirivi'>`;
    } else {
        codeBlock.innerHTML = `<input type='text' id='code-block-input-box' value=${string}>`;
    }
    codeBlocksContainer.insertAdjacentElement("beforeend", codeBlock);
}

function delCodeBlock() {
    let codeBlocksContainer = document.getElementById("code-blocks-container");
    codeBlocksContainer.childNodes[codeBlocksContainer.childNodes.length - 1].remove();
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
