import { setGameCommand } from "./game/game.js"

export function initializeWorkerEventHandler(worker) {
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
            setGameCommand(event.data.data);
            console.log("RUNNING COMMANDS FROM INDEX")

        }
    }

}
