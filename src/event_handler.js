import * as gameController from './newGame/game_controller.js';
import * as ui from './ui.js'
import * as globals from './util/globals.js';

export class EventHandler {
    constructor() {
        this.worker = new Worker('src/input/worker.js');
        this.lastMessage = { type: "foo", message: "bar", sab: "baz" }; // necessary for reasons i forgot
        this.sendUserInputToWorker = this.sendUserInputToWorker.bind(this);

        // receives messages from worker
        this.worker.onmessage = (message) => {
            message = message.data;
            switch (message.type) {
                case "input":
                    this.sharedArray = new Uint16Array(message.sab, 4);
                    this.syncArray = new Int32Array(message.sab, 0, 1);
                    ui.promptUserInput({ inputBoxHidden: true });
                    break;
                case "run":
                    gameController.giveCommand({ data: message.details, sab: message.sab });
                    break;
                case "conditionCleared":
                    globals.addClearedCondition(message.details);
                    break;
                case "finish":
                    ui.onFinishLastCommand();
                    break;
                case "error":
                    ui.displayErrorMessage(message.error);
                    break;
            }
        }
    }

    terminateWorker() {
        this.worker.terminate();
    }

    postMessage(message) {
        if (message.sab === null || message.sab === undefined) {
            this.#postMessageToWorker({ type: message.type, details: message.details, sab: null, value: 0 });
        }
        if (this.isMessagePassingPaused) {
            this.#saveLastMessage({ type: message.type, details: message.details, sab: message.sab });
            return;
        }
        if (message.type === 'return') {
            this.#postMessageToWorker({ type: message.type, details: message.details, sab: message.sab, value: 1 });
        }
    }

    setMessagePassingState(state) {
        this.isMessagePassingPaused = state.paused;
        if (!this.isMessagePassingPaused) {
            this.postMessage({ type: this.lastMessage.type, details: this.lastMessage.message, sab: this.lastMessage.sab });
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
            this.word = ui.promptUserInput({ inputBoxHidden: false });
            for (let i = 0; i < this.word.length; i++) {
                this.sharedArray[i] = this.word.charCodeAt(i);
            }
            this.sharedArray[this.word.length] = 0;

            Atomics.store(this.syncArray, 0, 1);
            Atomics.notify(this.syncArray, 0, 1);
        }
    }

    #postMessageToWorker(message) {
        this.worker.postMessage({ type: message.type, details: message.details });
        if (message.sab !== null) {
            const waitArray = new Int32Array(message.sab, 0, 1);
            Atomics.store(waitArray, 0, message.value);
            Atomics.notify(waitArray, 0, message.value);
        }
    }

    #saveLastMessage(message) {
        this.lastMessage = message;
    }
}