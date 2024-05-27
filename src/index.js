import { InitGame } from "./game/game.js"

import { initializeWorkerEventHandler } from "./eventhandler.js"

// write doc for main
/**
 * Adds the canvas to the document
 */

async function main() {
    await CreateGameWindow();
}

async function CreateGameWindow() {
    let app = await InitGame();
    let canvas = app.canvas;
    
    document.getElementById("left-container").insertAdjacentElement("afterend", canvas);
    canvas.classList.add("is-flex");
    canvas.id = "game";
}

export function initializeWorker(editor) {
    const worker = new Worker('src/input/pyodide.js');

    initializeWorkerEventHandler(worker);

    worker.postMessage({ type: 'start', data: editor.getValue() });
}

await main();
