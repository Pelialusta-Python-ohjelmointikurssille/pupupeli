import { tryGetFileAsText } from "../file_reader.js";
import { RUNNER_STATES } from "./runner_state.js";

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
        this.runnerState = RUNNER_STATES.PREINIT;
        this.executeSingleLine = false;
    }

    initialize() {
        this.runnerState = RUNNER_STATES.PREINIT;
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
            if (this.executeSingleLine && this.runnerState === RUNNER_STATES.RUNNING) {
                this.haltWorker();
            }
        }
        if (message.type === "REQUESTINPUT") {
            this.runnerState = RUNNER_STATES.WAITING_INPUT;
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
            this.runnerState = RUNNER_STATES.READY;
        }
        if(message.type === "EXECFINISH") {
            console.log("Finished python execution");
            this.runnerState = RUNNER_STATES.ENDED;
        }
        if (message.type === "RESET_OK") {
            console.log("Reset pyodide");
            this.runnerState = RUNNER_STATES.READY;
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
        this.runnerState = RUNNER_STATES.PAUSED;
    }

    unHaltWorker() {
        Atomics.store(this.workerWaitArray, 0, 0);
        Atomics.notify(this.workerWaitArray, 0, 1);
        this.runnerState = RUNNER_STATES.RUNNING;
    }

    runCode(script) {
        this.clearWorkerInterrupt();
        this.pyodideWorker.postMessage({ type: "RUNCODE", code: script });
        this.runnerState = RUNNER_STATES.RUNNING;
    }

    stepToNextLine() {
        this.executeSingleLine = true;
        this.unHaltWorker();
    }

    reset() {
        this.clearWorkerInterrupt();
        this.interruptWorker();
        this.pyodideWorker.postMessage({ type: "RESET" });
    }
}