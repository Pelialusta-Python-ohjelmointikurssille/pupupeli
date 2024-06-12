import { onUserSendInputToWorker } from "../event_handler.js";
let inputBox = document.getElementById("input-box");
let userInputs = []
let inputContainer = document.getElementById('input-container')

/**
 * Set input box invisible and clears the text.
 */
export function hideAndClearInputBox() {
    setUserInputBoxVisibility(false);
    clearInputBoxValue();
}

/**
 * Set input box visible.
 */
export function showInputBox() {
    setUserInputBoxVisibility(true);
}

export function getInputBoxValue() {
    return inputBox.value;
}

export function resetInputHistory() {
    userInputs = [];
    displayPreviousInputs();
}

/**
 * @param {*} isVisible boolean, if true set box visible. Else, invisible. 
 */
function setUserInputBoxVisibility(isVisible) {
    if (isVisible) {
        inputBox.classList.remove("is-invisible");
        inputBox.addEventListener("keydown", addInputToUserInputs);
        return;
    }
    inputBox.classList.add("is-invisible");
    inputBox.removeEventListener("keydown", addInputToUserInputs);
}

/**
 * Sets the text of inputBox to empty.
 */
function clearInputBoxValue() {
    inputBox.value = "";
}

function addInputToUserInputs(event) {
    if (event.key !== 'Enter') return;
    userInputs.push(inputBox.value);
    displayPreviousInputs();
    onUserSendInputToWorker();
    hideAndClearInputBox();
}

function displayPreviousInputs() {
    inputContainer.innerHTML = '';
    if (userInputs.length <= 0) {
        inputContainer.classList.add("is-hidden");
        return;
    }
    inputContainer.classList.remove("is-hidden");
    userInputs.forEach(input => {
        const inputElement = document.createElement('div');
        inputElement.textContent = input;
        inputContainer.appendChild(inputElement);
    })
}
