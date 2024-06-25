import { answerInput, getUserInputs, resetInputs } from "../game/game_input_controller.js";

let inputBox = document.getElementById("input-box");
let inputBoxSendButton = document.getElementById("input-box-send-button");
let inputContainer = document.getElementById('input-container')

/**
 * Set input box hidden and clears the text.
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
    resetInputs();
    displayPreviousInputs();
}

/**
 * @param {*} isVisible boolean, if true set box visible. Else, hidden. 
 */
function setUserInputBoxVisibility(isVisible) {
    if (isVisible) {
        inputBox.classList.remove("is-hidden");
        inputBoxSendButton.classList.remove("is-hidden");
        inputBox.addEventListener("keydown", addInputToUserInputs);
        inputBoxSendButton.addEventListener("click", onInputSendButtonClick, false);
        inputBox.focus();
        return;
    }
    inputBox.classList.add("is-hidden");
    inputBoxSendButton.classList.add("is-hidden");
    inputBox.removeEventListener("keydown", addInputToUserInputs);
    inputBoxSendButton.removeEventListener("click", onInputSendButtonClick, false);
}

/**
 * Sets the text of inputBox to empty.
 */
function clearInputBoxValue() {
    inputBox.value = "";
}

function addInputToUserInputs(event) {
    if (event.key !== 'Enter') return;
    answerInput(inputBox.value);
}

function onInputSendButtonClick() {
    answerInput(inputBox.value);
}

export function displayPreviousInputs() {
    inputContainer.innerHTML = '';
    if (getUserInputs().length <= 0) {
        inputContainer.classList.add("is-hidden");
        return;
    }
    inputContainer.classList.remove("is-hidden");
    getUserInputs().forEach(input => {
        const inputElement = document.createElement('div');
        inputElement.textContent = input;
        inputContainer.appendChild(inputElement);
    })
}
