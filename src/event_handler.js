import { setGameCommand, initGameEventHandler } from "./game/game.js"
import { extractErrorDetails } from "./input/py_error_handling.js"
import { getUserInput } from "./index.js";

let worker;
//Pause variables
let isMessagePassingPaused = false;
let lastMessage;
let sharedArray;
let syncArray;
let word = "";

export class EventHandler {
    constructor(webWorker) {
        this.worker = webWorker;
    }

    initializeWorkerEventHandler() {

        initGameEventHandler();

        this.worker.onmessage = (event) => {
            if (event.data.type === 'input') {
                this.sharedArray = new Uint16Array(event.data.sab, 4);
                this.syncArray = new Int32Array(event.data.sab, 0, 1);

                getUserInput(true);
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

    passMessageToWorker(type, message, sab) {
        if (sab === null) {
            this.PostMessageToWorker(type, message, null, 0);
        }
        if (this.isMessagePassingPaused) {
            this.saveLastMessage(type, message, sab);
            return;
        }
        if (type === 'return') {
            //1 = continue the worker
            this.PostMessageToWorker(type, message, sab, 1);
        }
    }

    saveLastMessage(type, message, sab) {
        this.lastMessage = {
            type: type,
            message: message,
            sab: sab
        }
    }

    pauseMessageWorker() {
        this.isMessagePassingPaused = true;
    }

    unPauseMessageWorker() {
        this.isMessagePassingPaused = false;
        this.passMessageToWorker(this.lastMessage.type, this.lastMessage.message, this.lastMessage.sab);
    }

    runSingleCommand() {
        if (!this.isMessagePassingPaused) {
            this.pauseMessageWorker();
            return;
        }

        this.unPauseMessageWorker();
        this.pauseMessageWorker();

    }

    PostMessageToWorker(type, message, sab, value) {
        this.worker.postMessage({ type: type, message: message });
        if (sab !== null) {
            const waitArray = new Int32Array(sab, 0, 1);
            Atomics.store(waitArray, 0, value);
            Atomics.notify(waitArray, 0, value);
        }
    }

    sendUserInputToWorker(event) {
        if (event.key === 'Enter') {
            this.word = getUserInput(false);
            for (let i = 0; i < this.word.length; i++) {
                this.sharedArray[i] = this.word.charCodeAt(i);
            }
            this.sharedArray[this.word.length] = 0;

            Atomics.store(this.syncArray, 0, 1);
            Atomics.notify(this.syncArray, 0, 1);
        }
    }
}