const WAIT_BUFFER_ARRAY_LENGTH = 5;

export class PauseHandler {
    constructor() {
        this.workerWaitArray = new Int32Array(new SharedArrayBuffer(WAIT_BUFFER_ARRAY_LENGTH * 4));
        /*
        [
            0/1, (1 = worker paused)
            0/1, (1 = paused by user)
            0/1, (1 = paused by game)
            0/1, (1 = paused by input)
            0/1 (1 = paused by line process)
        ]
        */
        this.isPausedByUser = false;
        this.isPausedByGame = false;
        this.isPausedByInput = false;
        this.isPausedByLineProcess = false;
    }

    userPause() {
        console.log("[Pause Handler]: Paused by user");
        this.isPausedByUser = true;
        Atomics.store(this.workerWaitArray, 1, 1);
        this.#checkPauseState();
    }

    userUnpause() {
        console.log("[Pause Handler]: Unpaused by user");
        this.isPausedByUser = false;
        Atomics.store(this.workerWaitArray, 1, 0);
        this.#checkPauseState();
    }

    gamePause() {
        console.log("[Pause Handler]: Paused by game");
        this.isPausedByGame = true;
        this.#checkPauseState();
    }

    gameUnpause() {
        console.log("[Pause Handler]: Unpaused by game");
        this.isPausedByGame = false;
        Atomics.store(this.workerWaitArray, 2, 0);
        this.#checkPauseState();
    }

    inputPause() {
        console.log("[Pause Handler]: Paused by input");
        this.isPausedByInput = true;
        Atomics.store(this.workerWaitArray, 3, 1);
        this.#checkPauseState();
    }

    inputUnpause() {
        console.log("[Pause Handler]: Unpaused by input");
        this.isPausedByInput = false;
        Atomics.store(this.workerWaitArray, 3, 0);
        this.#checkPauseState();
    }

    lineProcessPause() {
        console.log("[Pause Handler]: Paused by line process");
        this.isPausedByLineProcess = true;
        Atomics.store(this.workerWaitArray, 4, 1);
        this.#checkPauseState();
    }

    lineProcessUnpause() {
        console.log("[Pause Handler]: Unpaused by line process");
        this.isPausedByLineProcess = false;
        console.log("SETTING [4] to 0")
        let v = Atomics.store(this.workerWaitArray, 4, 0);
        console.log(v);
        console.log(this.workerWaitArray)
        this.#checkPauseState();
    }

    resetPause() {
        console.log("[Pause Handler]: Resetting pause state");
        this.userUnpause();
        this.gameUnpause();
        this.inputUnpause();
        this.lineProcessUnpause();
    }

    isWorkerPaused() {
        return Atomics.load(this.workerWaitArray, 0) === 1;
    }

    #pauseWorker() {
        console.log("[Pause Handler]: Pausing worker");
        if (this.isWorkerPaused() === false) {
            Atomics.store(this.workerWaitArray, 0, 1);
            Atomics.notify(this.workerWaitArray, 0);
        }
    }

    #unpauseWorker() {
        console.log("[Pause Handler]: Unpausing worker");
        if (this.isWorkerPaused() === true) {
            Atomics.store(this.workerWaitArray, 0, 0);
            Atomics.notify(this.workerWaitArray, 0);
        }
    }

    #updatePauseStateFromBuffer() {
        this.isPausedByUser = Atomics.load(this.workerWaitArray, 1) === 1;
        this.isPausedByGame = Atomics.load(this.workerWaitArray, 2) === 1;
        this.isPausedByInput = Atomics.load(this.workerWaitArray, 3) === 1;
        this.isPausedByLineProcess = Atomics.load(this.workerWaitArray, 4) === 1;
        console.log(this.workerWaitArray);
        console.log("Updating state");
    }

    #checkPauseState() {
        console.log(this);
        this.#updatePauseStateFromBuffer();
        if (
            this.isPausedByUser === false &&
            this.isPausedByGame === false &&
            this.isPausedByInput === false &&
            this.isPausedByLineProcess === false
        ) {
            this.#unpauseWorker();
        } else {
            if(this.isWorkerPaused === true) return;
            this.#pauseWorker();
        }
        console.log(this);
    }
}