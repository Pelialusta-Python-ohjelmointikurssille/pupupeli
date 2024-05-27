import { InitGame } from "./game/game.js"
import { initializeWorkerEventHandler } from "./event_handler.js"

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

/**
 * This function initializes the web worker that is used to run the python
 * interpreter (pyodide) on a separate thread from the rest of the game code.
 * The function also initializes the event handler that's responsible for
 * the rest of the communication between the worker and the game logic,
 * and passes the worker object onto the  event handler.
 * @param {object} editor The editor object (Ace) received from editor.js.
 * The editor object contains the input of the editor textbox on the site.
 * The input is obtained using editor.getValue() and passed onto the worker.
 */
export function initializeWorker(editor) {
    const worker = new Worker('src/input/worker.js');

    initializeWorkerEventHandler(worker);

    worker.postMessage({ type: 'start', data: editor.getValue() });
}

await main();
