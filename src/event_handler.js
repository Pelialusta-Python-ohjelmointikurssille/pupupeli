import { setGameCommand } from "./game/game.js"
import { extractErrorDetails } from "./input/py_error_handling.js"

let worker;

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
    if (type === 'return') {
        worker.postMessage({ type: type, message: message });
        const waitBuffer = new Int32Array(sab, 0, 1);
        Atomics.store(waitBuffer, 0, 1);
        Atomics.notify(waitBuffer, 0, 1);
    }
}
