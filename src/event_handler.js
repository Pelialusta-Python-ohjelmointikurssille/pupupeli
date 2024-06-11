import * as gameController from './game/game_controller.js';
import * as ui from './ui/ui.js'
import * as globals from './util/globals.js';

/**
 * Sends messages to and manages messages from the worker. 
 * Requires the worker as a param when creating.
 */
export class EventHandler {
    constructor(worker) {
        this.worker = worker;
        this.lastMessage = { type: "foo", message: "bar", sab: "baz" }; // necessary for reasons i forgot
        this.sendUserInputToWorker = this.sendUserInputToWorker.bind(this);
        this.isMessagePassingPaused = false; //keep as default, trust me bro
        this.userInputs = []
        // receives messages from worker
        this.worker.onmessage = (message) => {
            message = message.data;
            switch (message.type) {
                case "input":
                    this.sharedArray = new Uint16Array(message.sab, 4);
                    this.syncArray = new Int32Array(message.sab, 0, 1);
                    ui.promptUserInput({ inputBoxHidden: true });
                    break;
                case "command":
                    globals.setCurrentSAB(message.sab);
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
        };
        document.getElementById('editor-stop-button').addEventListener('click', this.resetUserInputs.bind(this));
    }

    /**
     * Logic to handle passing messages to worker depending on various conditions.
     * @param {*} message The message object, usually in the form of { type: "messagetype", details: "messagedata"}, also
     * possibly a shared array buffer if necessary
     */
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

    /**
     * Used to control whether the worker should continue executing further commands or not.
     * @param {*} state An object in the form of { paused: boolean }
     */
    setMessagePassingState(state) {
        this.isMessagePassingPaused = state.paused;
        if (!this.isMessagePassingPaused) {
            this.postMessage({ type: this.lastMessage.type, details: this.lastMessage.message, sab: this.lastMessage.sab });
        }
    }

    /**
     * A somewhat hacky implementation of running just one line of python in the worker.
     * This is a good target for refactoring.
     */
    runSingleCommand() {
        if (!this.isMessagePassingPaused) {
            this.setMessagePassingState({ paused: true });
            return;
        }
        this.setMessagePassingState({ paused: false });
        this.setMessagePassingState({ paused: true });
    }

    /**
     * Called every time the user inputs something in the input box
     * @param {*} event The event when the user inputs something in the input box,
     * in this case, the relevant part is the key the user inputs.
     */
    sendUserInputToWorker(event) {
        if (event.key === 'Enter') {
            this.word = ui.promptUserInput({ inputBoxHidden: false });
            if (this.word) {
                this.userInputs.push(this.word);
                this.displayPreviousInputs();
            }
            this.inputToWorker(this.word);
        }
    }

    inputToWorker(word) {
        if (this.sharedArray === undefined) return;
        for (let i = 0; i < word.length; i++) {
            this.sharedArray[i] = word.charCodeAt(i);
        }
        this.sharedArray[word.length] = 0;

        Atomics.store(this.syncArray, 0, 1);
        Atomics.notify(this.syncArray, 0, 1);
    }

    /**
     * First allows the worker to continue, but then immediately sets the second value in waitArray to 1
     * so that the worker knows to not run any more python code.
     */
    resetWorker() {
        if (globals.getCurrentSAB() === undefined) return;
        const waitArray = new Int32Array(globals.getCurrentSAB(), 0, 2);
        Atomics.store(waitArray, 0, 1); // this is for stopping the wait
        Atomics.notify(waitArray, 0, 1);
        Atomics.store(waitArray, 1, 1); // this is for checking (in worker) if we've reset the game
    }

    /**
     * An event handler internal method that does the actual sending of messages to the handler, and
     * if necessary, telling the worker that it should proceed to the next command
     * @param {*} message The message object, usually in the form of { type: "messagetype", details: "messagedata"}
     */
    #postMessageToWorker(message) {
        this.worker.postMessage({ type: message.type, details: message.details });
        if (message.sab !== null) {
            const waitArray = new Int32Array(globals.getCurrentSAB(), 0, 2);
            Atomics.store(waitArray, 0, message.value);
            Atomics.notify(waitArray, 0, message.value);
        }
    }

    /**
     * An event handler internal method that saves the last executed command in case we need it later.
     * @param {*} message The message object, usually in the form of { type: "messagetype", details: "messagedata"}
     */
    #saveLastMessage(message) {
        this.lastMessage = message;
    }

    displayPreviousInputs() {
        const inputContainer = document.getElementById('input-container')
        inputContainer.innerHTML = '';
        this.userInputs.forEach(input => {
            const inputElement = document.createElement('div');
            inputElement.textContent = input;
            inputContainer.appendChild(inputElement);
        })
    }
    resetUserInputs() {
        this.userInputs = [];
        this.displayPreviousInputs();
        this.resetWorker();
        this.setMessagePassingState({ paused: false });
    }
}