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
        this.isPausedByUser = true;
        Atomics.store(this.workerWaitArray, 1, 1);
        Atomics.notify(this.workerWaitArray, 1, 1);
    }

    userUnpause() {
        this.isPausedByUser = false;
        Atomics.store(this.workerWaitArray, 1, 0);
        Atomics.notify(this.workerWaitArray, 1, 0);
    }

    gamePause() {
        this.isPausedByGame = true;
        Atomics.store(this.workerWaitArray, 2, 1);
        Atomics.notify(this.workerWaitArray, 2, 1);
    }

    gameUnpause() {
        this.isPausedByGame = false;
        Atomics.store(this.workerWaitArray, 2, 0);
        Atomics.notify(this.workerWaitArray, 2, 0);
    }

    inputPause() {
        this.isPausedByInput = true;
        Atomics.store(this.workerWaitArray, 3, 1);
        Atomics.notify(this.workerWaitArray, 3, 1);
    }

    inputUnpause() {
        this.isPausedByInput = false;
        Atomics.store(this.workerWaitArray, 3, 0);
        Atomics.notify(this.workerWaitArray, 3, 0);
    }

    lineProcessPause() {
        this.isPausedByLineProcess = true;
        Atomics.store(this.workerWaitArray, 4, 1);
        Atomics.notify(this.workerWaitArray, 4, 1);
    }

    lineProcessUnpause() {
        this.isPausedByLineProcess = false;
        Atomics.store(this.workerWaitArray, 4, 0);
        Atomics.notify(this.workerWaitArray, 4, 0);
    }

    resetPause() {
        this.isPausedByUser = false;
        this.isPausedByGame = false;
        this.isPausedByInput = false;
    }

    isWorkerPaused() {
        return Atomics.load(this.workerWaitArray, 0) === 1;
    }

    pauseWorker() {
        Atomics.store(this.workerWaitArray, 0, 1);
        Atomics.notify(this.workerWaitArray, 0, 1);
    }

    unpauseWorker() {
        Atomics.store(this.workerWaitArray, 0, 0);
        Atomics.notify(this.workerWaitArray, 0, 1);
    }

    #checkWorkerState() {

    }

    #checkPauseState() {
        
    }
}