import { answerInput, getUserInputs, resetInputs } from "../game/game_input_controller.js";

let inputBox = document.getElementById("input-box");
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
    resetInputs();
    displayPreviousInputs();
}

/**
 * @param {*} isVisible boolean, if true set box visible. Else, invisible. 
 */
function setUserInputBoxVisibility(isVisible) {
    if (isVisible) {
        inputBox.classList.remove("is-invisible");
        inputBox.addEventListener("keydown", addInputToUserInputs);
        inputBox.focus();
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
    console.log("ANSWER INPUT WITH TEXTBOX");
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
