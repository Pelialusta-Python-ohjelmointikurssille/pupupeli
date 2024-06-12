import { sendUserInputToWorker } from "../event_handler.js";
let inputBox = document.getElementById("input-box");

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

/**
 * @param {*} isVisible boolean, if true set box visible. Else, invisible. 
 */
function setUserInputBoxVisibility(isVisible) {
    if (isVisible) {
        inputBox.classList.remove("is-invisible");
        inputBox.addEventListener("keydown", sendUserInputToWorker);
        return;
    }
    inputBox.classList.add("is-invisible");
    inputBox.removeEventListener("keydown", sendUserInputToWorker);
}

/**
 * Sets the text of inputBox to empty.
 */
function clearInputBoxValue() {
    inputBox.value = "";
}