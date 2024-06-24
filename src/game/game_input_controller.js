import { onUserSendInputToWorker, setMessagePassingState } from "../worker_messenger.js";
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
    setMessagePassingState({ paused: true });
}

export function answerInput(inputString) {
    if (isWaitingForPython) {
        isWaitingForPython = false;
    } else {
        setMessagePassingState({ paused: false });
    }
    isWaitingForInput = false;
    userInputs.push(inputString);
    displayPreviousInputs();
    onUserSendInputToWorker(inputString);
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