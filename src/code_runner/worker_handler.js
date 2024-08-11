import { tryGetFileAsText } from "../file_reader.js";

const PYTHON_CODE_FILES = new Map([
    ["error_handler.py", "src/python_code/error_handler.py"],
    ["python_tracer.py", "src/python_code/python_tracer.py"],
    ["player.py", "src/python_code/player.py"],
    ["js_bridge.py", "src/python_code/js_bridge.py"]
]);

const PYTHON_SCRIPT_RUNNER = "src/python_code/runner.py";

export class WorkerHandler {
    constructor() {
        this.pyodideWorker = null;
        this.pyodideInterruptBuffer = new Uint8Array(new SharedArrayBuffer(1));
        this.workerWaitArray = new Int32Array(new SharedArrayBuffer(4));
        this.pythonCodeMap;
        this.pythonRunnerCode;
    }

    initialize() {
        this.pyodideWorker = new Worker("/src/code_runner/pyodide_worker.js");
        this.pyodideWorker.onmessage = async (event) => {
            await this.pyodideMessageHandler(event);
        };
        this.pythonCodeMap = this.loadCodeFiles(PYTHON_CODE_FILES);
        this.pythonRunnerCode = tryGetFileAsText(PYTHON_SCRIPT_RUNNER);
    }

    loadCodeFiles(fileDict) {
        let codeMap = new Map();
        fileDict.forEach((value, key) => {
            let content = tryGetFileAsText(value);
            codeMap.set(key, content);
        });
        return codeMap;
    }

    async pyodideMessageHandler(event) {
        let message = event.data;
        if (message.type === "GAMECMD") {
        }
        if (message.type === "ERROR") {
        }
        if (message.type === "SETLINE") {
        }
        if (message.type === "REQUESTINPUT") {
        }
        if (message.type === "INIT_OK") {
            console.log("Initialized pyodide");
            this.pyodideWorker.postMessage({ type: "SETWAITBUFFER", buffer: this.workerWaitArray });
        }
        if (message.type === "WAITBUFFER_OK") {
            console.log("Initialized wait buffer");
            this.pyodideWorker.postMessage({ type: "SETINTERRUPTBUFFER", buffer: this.pyodideInterruptBuffer });
        }
        if (message.type === "INTERRUPTBUFFER_OK") {
            console.log("Initialized interrupt buffer");
            this.pyodideWorker.postMessage({ type: "SETBACKGROUNDCODE", runnerCode: this.pythonRunnerCode, codeMap: this.pythonCodeMap });
        }
        if (message.type === "BACKGROUNDCODE_OK") {
            console.log("Initialized background code");
        }
    }

    interruptWorker() {
        this.pyodideInterruptBuffer[0] = 2;
    }

    clearWorkerInterrupt() {
        this.pyodideInterruptBuffer[0] = 0;
    }

    haltWorker() {
        Atomics.store(this.workerWaitArray, 0, 1);
        Atomics.notify(this.workerWaitArray, 0, 1);
    }

    unHaltWorker() {
        Atomics.store(this.workerWaitArray, 0, 0);
        Atomics.notify(this.workerWaitArray, 0, 1);
    }

    runCode(script) {
        this.clearWorkerInterrupt();
        this.pyodideWorker.postMessage({ type: "RUNCODE", code: script });
    }

    reset() {
        this.clearWorkerInterrupt();
        this.interruptWorker();
        this.pyodideWorker.postMessage({ type: "RESET" });
    }
}