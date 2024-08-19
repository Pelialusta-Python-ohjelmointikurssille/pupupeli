import { WorkerHandler } from "./worker_handler.js";

let handler = new WorkerHandler();

export function initializeRunner() {
    handler.initialize();
}

export function runCode(code, theme) {
    handler.runCode(code);
}

export function runUntilNextLine() {
    handler.stepToNextLine();
}

export function resetRunner() {
    handler.reset();
}

export function pauseRunner() {
    //handler.executeSingleLine = false;
    //handler.pauseUser();
}

export function resumeRunner() {
    //handler.executeSingleLine = false;
    //handler.resumeUser();
}

export function onGameFinishAnim() {
    handler.onFinishAnimations();
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
