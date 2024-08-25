import { WorkerHandler } from "./worker_handler.js";

let handler = new WorkerHandler();

export function initializeRunner() {
    handler.initialize();
}

export function runCode(code, playerName) {
    handler.runCode(code, playerName);
}

export function runUntilNextLine() {
    handler.stepToNextLine();
}

export function resetRunner() {
    handler.reset();
}

export function pauseRunner() {
    handler.executeSingleLine = false;
    handler.pauseHandler.userPause();
}

export function resumeRunner() {
    handler.executeSingleLine = false;
    handler.pauseHandler.userUnpause();
}

export function onGameFinishAnim() {
    handler.onFinishAnimations();
}

export function answerInputRequest(userInput) {
    handler.answerInputRequest(userInput);
}

export function answerObjecCount(count) {
    handler.answerObjectCountRequest(count);
}

export function subscribeToGameCommands(func) {
    handler.gameCommandCallbacks.push(func);
}

export function subscribeToSetLineCallbacks(func) {
    handler.setLineCallbacks.push(func);
}

export function subscribeToResetCallbacks(func) {
    handler.resetCallbacks.push(func);
}

export function subscribeToFinishCallbacks(func) {
    handler.finishCallbacks.push(func);
}

export function subscribeToReadyCallbacks(func) {
    handler.readyCallbacks.push(func);
}

export function subscribeToInputCallbacks(func) {
    handler.inputCallbacks.push(func);
}

export function subscribeToErrorCallbacks(func) {
    handler.errorCallbacks.push(func);
}

export function subscribeToObjectCountCallbacks(func) {
    handler.objectCountCallbacks.push(func);
}
