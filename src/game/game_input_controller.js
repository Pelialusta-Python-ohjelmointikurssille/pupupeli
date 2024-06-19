import { getWorkerMessageState, onUserSendInputToWorker, setMessagePassingState } from "../event_handler.js";
import { displayPreviousInputs, hideAndClearInputBox, showInputBox } from "../ui/inputBox.js";

let userInputs = [];
let isWaitingForPython = false;
export let isWaitingForInput = false;

export function requestInputFromPython() {
    console.log("REQUESTING INPUT IN GAME INPUT CONTROLLER");
    console.log(getWorkerMessageState());
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