import { WorkerHandler } from "./worker_handler.js";

let handler = new WorkerHandler();
handler.initialize();

export function runCode(code) {
    handler.runCode(code);
}