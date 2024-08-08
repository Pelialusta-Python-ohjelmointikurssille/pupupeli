export class WorkerHandler {
    constructor() {
        this.pyodideWorker = null;
        this.pyodideInterruptBuffer = new Uint8Array(new SharedArrayBuffer(1));
        this.workerWaitArray = new Int32Array(new SharedArrayBuffer(4));
    }

    initialize() {
        this.pyodideWorker = new Worker("./web_worker.js");
        this.pyodideWorker.onmessage = (event) => {
            this.pyodideMessageHandler(event)
        };
    }

    pyodideMessageHandler(event) {
        let message = event.data;
    }

    interruptWorker() {
        this.pyodideInterruptBuffer[0] = 2;
    }

    clearWorkerInterrupt() {
        this.pyodideInterruptBuffer[0] = 0;
    }

    haltWorker() {
    }

    unHaltWorker() {
    }

    runCode(script, context) {
    }
}