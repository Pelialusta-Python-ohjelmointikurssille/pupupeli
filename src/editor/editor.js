import { TaskTypes } from "../game/commonstrings.js";

function initialize() {
    //refactor later...
    //Uppest buttons
    document.getElementById("createTable").addEventListener("click", createTable);
    document.getElementById("generateTaskOutput").addEventListener("click", generateTaskOutput);
    document.getElementById("save-button").addEventListener("click", downloadOutput);
    document.getElementById("import-task-input").addEventListener("change", importTaskFromJSON);
    //condition buttons
    document.getElementById("conditionUsedWhile").addEventListener("click", () => clickConditionBox("conditionUsedWhile"));
    document.getElementById("conditionUsedFor").addEventListener("click", () => clickConditionBox("conditionUsedFor"));
    document.getElementById("conditionUsedInput").addEventListener("click", () => clickConditionBox("conditionUsedInput"));
    document.getElementById("conditionMaxLines").addEventListener("click", () => clickConditionBox("conditionMaxLines"));
    //Tabs for selected tasktype
    document.getElementById("inputDescription").addEventListener("click", inputButtonsToggler);
    document.getElementById("inputEditorCode").addEventListener("click", inputButtonsToggler);
    document.getElementById("inputMultipleChoice").addEventListener("click", inputButtonsToggler);
    document.getElementById("add-multiple-choice-button").addEventListener("click", addMultipleChoiceQuestion);
    document.getElementById("del-multiple-choice-button").addEventListener("click", delMultipleChoiceQuestion);
    createTable();
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
        // If the selected task type is 'instructions', show the text box and hide the divs
        if (this.value === TaskTypes.instruction) {
            showInstructions()
        } else {
            // Otherwise, hide the text box and show the divs
            hideInstructions()
            if (this.value === TaskTypes.multipleChoice) {
                console.log("multiple");
            }
        }
    });
});
// hides regular view and shows instruction view
function showInstructions() {
    optionsConditionsDiv.style.display = 'none';
    optionsInputDiv.style.display = 'none';
    optionsAppContainer.style.display = 'none';
    optionsAddRemoveDiv.style.display = 'none';
    instructionsInput.style.display = 'block';
    instructionsInput.classList.remove('is-hidden');
    headlines.forEach(headline => {
        headline.style.display = 'none';
    });
}

// hides instruction view and shows regular view
function hideInstructions() {
    instructionsInput.style.display = 'none';
    optionsConditionsDiv.style.display = 'flex';
    optionsInputDiv.style.display = 'flex';
    optionsAppContainer.style.display = 'flex';
    optionsAddRemoveDiv.style.display = 'flex';
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

function createTable(isLoad, isImport = false, width = 8, height = 8) {
    let gridDimensions;
    if (isImport) {
        gridDimensions = {
            width: width,
            height: height
        };
    } else {
        gridDimensions = {
            width: document.getElementById("grid-width-input").value,
            height: document.getElementById("grid-height-input").value
        };
    }
    const table = document.getElementById("editor-table");

    // empty the table in case user generates multiple times without reloading page
    table.innerHTML = '';

    for (let x = 0; x < gridDimensions.height; x++) {
        table.appendChild(document.createElement("tr"));
        for (let y = 0; y < gridDimensions.width; y++) {
            let cell = table.children[x].appendChild(document.createElement("td"));
            cell.dataset.value = "1";
            cell.innerHTML = '<img src="/src/static/game_assets/backgrounds/background_grass.png"></img>';


            cell.addEventListener('click', function () {
                //Case 1 is is the default value, grass.
                //Case 0 is reserved for player, so we skip it
                this.dataset.value++;
                if (this.dataset.value > _maxImageIndex) this.dataset = 1;
                this.innerHTML = getImage(this.dataset.value);
            });
        }
    }

    let cells = table.getElementsByTagName("td");

    Array.from(cells).forEach(cell => {
        cell.addEventListener("contextmenu", function (event) {
            event.preventDefault();
            Array.from(cells).forEach(c => {
                if (c.dataset.value === "0") {
                    c.dataset.value = "1";
                    c.innerHTML = '<img src="/src/static/game_assets/backgrounds/background_grass.png"></img>'
                }
            });

            this.dataset.value = "0";
            this.innerHTML = '<img src="/src/static/game_assets/characters/bunny_right.png"></img>';
        });
    });
}

function createGridFromTable() {
    const table = document.getElementById('editor-table');
    const rows = table.rows;
    const grid = [];

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells;
        const rowArray = [];

        for (let j = 0; j < cells.length; j++) {
            rowArray.push(cells[j].dataset.value);
        }

        grid.push(rowArray);
    }

    return grid;
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

function generateTaskOutput() {
    console.log(document.querySelector('#task-title-input').value);
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

    switch (event.target.value) {
        case "inputDescription":
            typeIndicator.innerHTML = "Tehtävän kuvaus:";
            if (taskInput.classList.contains("is-hidden")) taskInput.classList.toggle("is-hidden");
            if (!editorInput.classList.contains("is-hidden")) editorInput.classList.toggle("is-hidden");
            if (!multipleChoiceContainer.classList.contains("is-hidden")) {
                multipleChoiceContainer.classList.toggle("is-hidden");
                multipleChoiceAddButton.classList.toggle("is-hidden");
                multipleChoiceDelButton.classList.toggle("is-hidden");
                multipleChoiceContainer.classList.toggle("is-flex");
            }
            break;
        case "inputEditorCode":
            typeIndicator.innerHTML = "Editorin koodi:";
            if (!taskInput.classList.contains("is-hidden")) taskInput.classList.toggle("is-hidden");
            if (editorInput.classList.contains("is-hidden")) editorInput.classList.toggle("is-hidden");
            if (!multipleChoiceContainer.classList.contains("is-hidden")) {
                multipleChoiceContainer.classList.toggle("is-hidden");
                multipleChoiceAddButton.classList.toggle("is-hidden");
                multipleChoiceDelButton.classList.toggle("is-hidden");
                multipleChoiceContainer.classList.toggle("is-flex");
            }
            break;
        case "inputMultipleChoice":
            typeIndicator.innerHTML = "Monivalinta vaihtoehdot:";
            if (!taskInput.classList.contains("is-hidden")) taskInput.classList.toggle("is-hidden");
            if (!editorInput.classList.contains("is-hidden")) editorInput.classList.toggle("is-hidden");
            if (multipleChoiceContainer.classList.contains("is-hidden")) {
                multipleChoiceContainer.classList.toggle("is-hidden");
                multipleChoiceAddButton.classList.toggle("is-hidden");
                multipleChoiceDelButton.classList.toggle("is-hidden");
                multipleChoiceContainer.classList.toggle("is-flex");
            }
            break;
    }
}

function addMultipleChoiceQuestion(question = null) {
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

// import related functions
function importTaskFromJSON() {
    const fileInput = document.getElementById("import-task-input");
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            let task = JSON.parse(e.target.result);
            console.log(task.grid.length)
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

    function importTitle(title) {
        let taskTitle = document.getElementById("task-title-input");
        taskTitle.value = title;
    }

    function importTaskType(taskType) {
        let taskTypeRadios = document.getElementsByName("taskType");

        for (let i = 0; i < taskTypeRadios.length; i++) {
            if (taskTypeRadios[i].value === taskType) {
                taskTypeRadios[i].checked = true;
                if (taskType === "instructions") {
                    showInstructions();
                } else {
                    hideInstructions();
                }
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

    function importGrid(grid) {
        const table = document.getElementById("editor-table");
        let cells = table.getElementsByTagName("td");
        let ctr = 0;

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                cells[ctr].dataset.value = grid[i][j];
                ctr++;
            }
        }

        for (let i = 0; i < cells.length; i++) {
            cells[i].innerHTML = getImage(cells[i].dataset.value);
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
}

//Change this value if you add more images to the switch statement in getImage() below
var _maxImageIndex = 3;
//IMPORTANT! "maxImageIndex" above must be the same as the max value used in the switch statement below
/**
 * Get the image path by using the value it represents in gamecode when it creates the grid in game logic.
 * Remember that if you change the values below, change the values of "gridObjectManifest" in gridfactory.js.
 * They must be the same.
 */
function getImage(value) {
    //Player is 0, grass is 1 and is used as the default
    switch (value) {
        case '0':
            return '<img src="/src/static/game_assets/characters/bunny_right.png"></img>';
        case '2':
            return '<img src="/src/static/game_assets/collectibles/carrot.png"></img>';
        case '3':
            return '<img src="/src/static/game_assets/obstacles/rock.png"></img>';
        default:
            return '<img src="/src/static/game_assets/backgrounds/background_grass.png"></img>';
    }
}

initialize();
