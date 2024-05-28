import { setGameCommand } from "./game/game.js"
import { extractErrorDetails } from "./input/py_error_handling.js"

let worker;
//Pause variables
let isMessagePassingPaused = false;
var lastMessage;

export function initializeWorkerEventHandler(webWorker) {
    worker = webWorker;

    worker.onmessage = (event) => {
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
        }
        if (event.data.type === 'run') {
            setGameCommand({ data: event.data.data, sab: event.data.sab });
        }

        // message is error?
        if (event.data.error) {
            document.getElementById("error").innerHTML = extractErrorDetails(event.data.error.message).type;
        }
    }
}

export function passMessageToWorker(type, message, sab) {
    if (isMessagePassingPaused) {
        saveLastMessage(type, message, sab);
        return;
    }
    if (type === 'return') {
        //1 = continue the worker
        PostMessageToWorker(type, message, sab, 1);
    }
}

function saveLastMessage(type, message, sab) {
    lastMessage = {
        type: type,
        message: message,
        sab: sab
    }
}

export function pauseMessageWorker() {
    isMessagePassingPaused = true;
}

export function unPauseMessageWorker() {
    isMessagePassingPaused = false;
    passMessageToWorker(lastMessage.type, lastMessage.message, lastMessage.sab);
}

export function runSingleCommand() {
    if (!isMessagePassingPaused) {
        pauseMessageWorker();
        return;
    }

    unPauseMessageWorker();
    pauseMessageWorker();

}

function PostMessageToWorker(type, message, sab, value) {
    worker.postMessage({ type: type, message: message });
    const waitArray = new Int32Array(sab, 0, 1);
    Atomics.store(waitArray, 0, value);
    Atomics.notify(waitArray, 0, value);
}
