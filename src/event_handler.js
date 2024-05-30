import { setGameCommand, initGameEventHandler } from "./game/game.js"
import { promptUserInput, displayErrorMessage, onFinishLastCommand } from "./index.js";

export class EventHandler {
    constructor(webWorker) {
        this.worker = webWorker;
        this.lastMessage = {type: "foo", message: "bar", sab: "baz"};
        this.sendUserInputToWorker = this.sendUserInputToWorker.bind(this);
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
                    promptUserInput({ inputBoxHidden: true });
                    break;
                case "run":
                    setGameCommand({ data: event.data.data, sab: event.data.sab });
                    break;
                case "finish":
                    onFinishLastCommand();
                    break;
                case "error":
                    displayErrorMessage(event.data.error);
                    break;
            }
        }
    }

    receiveMessage(type, message, sab) {
        if (sab === null) {
            this.postMessageToWorker(type, message, null, 0);
        }
        if (this.isMessagePassingPaused) {
            this.saveLastMessage(type, message, sab);
            return;
        }
        if (type === 'return') {
            //1 = continue the worker
            this.postMessageToWorker(type, message, sab, 1);
        }
    }

    saveLastMessage(type, message, sab) {
        this.lastMessage = {
            type: type,
            message: message,
            sab: sab
        }
    }

    setMessagePassingState(state) {
        this.isMessagePassingPaused = state.paused;
        if (!this.isMessagePassingPaused) {
            this.receiveMessage(this.lastMessage.type, this.lastMessage.message, this.lastMessage.sab);
        }
    }

    runSingleCommand() {
        if (!this.isMessagePassingPaused) {
            this.setMessagePassingState({ paused: true });

            return;
        }

        this.setMessagePassingState({ paused: false });
        this.setMessagePassingState({ paused: true });

    }

    postMessageToWorker(type, message, sab, value) {
        this.worker.postMessage({ type: type, message: message });
        if (sab !== null) {
            const waitArray = new Int32Array(sab, 0, 1);
            Atomics.store(waitArray, 0, value);
            Atomics.notify(waitArray, 0, value);
        }
    }

    sendUserInputToWorker(event) {
        if (event.key === 'Enter') {
            this.word = promptUserInput({ inputBoxHidden: false });
            for (let i = 0; i < this.word.length; i++) {
                this.sharedArray[i] = this.word.charCodeAt(i);
            }
            this.sharedArray[this.word.length] = 0;

            Atomics.store(this.syncArray, 0, 1);
            Atomics.notify(this.syncArray, 0, 1);
        }
    }
}