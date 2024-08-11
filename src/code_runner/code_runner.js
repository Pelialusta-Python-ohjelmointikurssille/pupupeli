import { WorkerHandler } from "./worker_handler.js";

let handler = new WorkerHandler();
handler.initialize();

export function initializeRunner() {

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
    handler.haltWorker();
}

export function resumeRunner() {
    handler.unHaltWorker();
}
