import { InitGame } from "./game/game.js"
import { initializeWorkerEventHandler } from "./event_handler.js"

const worker = new Worker('src/input/worker.js');

async function main() {
    await CreateGameWindow();
    initializeWorker()
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
 * If the worker is not null, there is no need to re-initialize it, as we
 * can just use the one we initialized earlier. This means we only need
 * to load pyodide once per page load instead of every time the user runs some code.
 * @param {object} editor The editor object (Ace) received from editor.js.
 * The editor object contains the input of the editor textbox on the site.
 * The input is obtained using editor.getValue() and passed onto the worker.
 */
function initializeWorker() {
    initializeWorkerEventHandler(worker);
    worker.postMessage({ type: 'init' });
}

export function startWorker(editor) {
    worker.postMessage({ type: 'start', data: editor.getValue() });
}

await main();
