import { setGameCommand, initGameEventHandler } from "./game/game.js"
import { getUserInput, displayErrorMessage } from "./index.js";

export class EventHandler {
    constructor(webWorker) {
        this.worker = webWorker;
    }

    initalize() {

        // temporary? hack to initialize eventhandler in game.js after index.js
        initGameEventHandler();

        // receives message events from worker.js
        this.worker.onmessage = (event) => {
            switch (event.data.type) {
                case "input":
                    this.sharedArray = new Uint16Array(event.data.sab, 4);
                    this.syncArray = new Int32Array(event.data.sab, 0, 1);
                    getUserInput(true);
                    break;
                case "run":
                    setGameCommand({ data: event.data.data, sab: event.data.sab });
                    break;
                case "error":
                    displayErrorMessage(event.data.error);
                    break;
            }
        }
    }

    receiveMessage(type, message, sab) {
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
        this.receiveMessage(this.lastMessage.type, this.lastMessage.message, this.lastMessage.sab);
    }

    runSingleCommand() {
        // without the line below, spamming "next step" right after resetting will 
        // error and cause the button to stop working due to non-existed lastMessage
        // there's probably a better way to fix this...
        this.receiveMessage("foo", "bar", null);
        
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