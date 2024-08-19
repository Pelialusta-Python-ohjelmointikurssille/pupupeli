import { displayPreviousInputs, hideAndClearInputBox, showInputBox } from "../ui/inputBox.js";

let userInputs = [];
let isWaitingForPython = false;
export let isWaitingForInput = false;

export function requestInputFromPython() {
    isWaitingForPython = true;
    isWaitingForInput = true;
    showInputBox();
}

export function requestInputFromGame() {
    showInputBox();
    isWaitingForInput = true;
}

export function answerInput(inputString) {
    if (isWaitingForPython) {
        isWaitingForPython = false;
    } else {
    }
    isWaitingForInput = false;
    userInputs.push(inputString);
    displayPreviousInputs();
    hideAndClearInputBox();
}

export function getUserInputs() {
    return userInputs;
}

export function resetInputs() {
    userInputs = [];
}

export function resetInputWaiting() {
    isWaitingForInput = false;
}

export function resetInputController() {
    console.log("TOTALLY RESET INPUTS")
    resetInputs();
    resetInputWaiting();
    hideAndClearInputBox();
}