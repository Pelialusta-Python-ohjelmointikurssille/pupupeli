import { WorkerHandler } from "./worker_handler.js";

let handler = new WorkerHandler();
handler.initialize();

export function initializeRunner() {

}

export function runCode(code, theme) {
    handler.runCode(code);
}

export function runUntilNextLine() {

}

export function resetRunner() {
    handler.reset();
}

export function pauseRunner() {

}

export function resumeRunner() {

}
