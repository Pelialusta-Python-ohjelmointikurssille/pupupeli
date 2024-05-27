import { InitGame, setCommandList } from "./game/game.js"

// write doc for main
/**
 * Adds the canvas to the document
 */

async function main() {
    await CreateGameWindow();
    addEventToButton("editor-run-pause-button", onRunButtonClick);
    addEventToButton("editor-stop-button", onResetButtonClick);
}

async function CreateGameWindow() {
    let app = await InitGame();
    let canvas = app.canvas;
    
    document.getElementById("left-container").insertAdjacentElement("afterend", canvas);
    canvas.classList.add("is-flex");
    canvas.id = "game";
}

export function runGameCommands(list) {
    setCommandList(list);
    console.log("RUNNING COMMANDS FROM INDEX")
}

export function initializeWorker(editor) {
    const worker = new Worker('src/input/pyodide.js');

    worker.onmessage = function (event) {
        if (event.data.type === 'input') {
            const sharedArray = new Uint16Array(event.data.sab, 4);
            const syncArray = new Int32Array(event.data.sab, 0, 1);

            const word = prompt(event.data.message);

            for (let i = 0; i < word.length; i++) {
                sharedArray[i] = word.charCodeAt(i);
            }
            sharedArray[word.length] = 0;

            Atomics.store(syncArray, 0, 1);
            Atomics.notify(syncArray, 0, 1);
        } else if (event.data.type === 'run') {
            runGameCommands(event.data.data);
        }
    }

    worker.postMessage({ type: 'start', data: editor.getValue() });
}

function addEventToButton(id, func) {
    let buttonInput = document.getElementById(id);
    buttonInput.addEventListener("click", func, false);
}

let play = false;

function onRunButtonClick () {
    let button = document.getElementById("editor-run-pause-button");
    let img = button.querySelector('img');
    if (!img) {
        img = document.createElement('img');
        button.appendChild(img);
    }
    if (play === false) {
        console.log("RUN");
        play = true;
        img.src = "src/static/pausebutton.png";
    }
    else {
        console.log("PAUSE");
        play = false;
        img.src = "src/static/runbutton.png";
    }
}

function onResetButtonClick () {
    console.log("RESET")
}

await main();
