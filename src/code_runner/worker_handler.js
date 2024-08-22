import { tryGetFileAsText } from "../file_reader.js";
import { PauseHandler } from "./pause_handler.js";
import { RUNNER_STATES } from "./runner_state.js";

const PYTHON_CODE_FILES = new Map([
    ["python_tracer.py", "src/python_code/python_tracer.py"],
    ["player.py", "src/python_code/player.py"],
    ["js_bridge.py", "src/python_code/js_bridge.py"]
]);

const PYTHON_SCRIPT_RUNNER = "src/python_code/runner.py";

export class WorkerHandler {
    constructor() {
        this.pyodideWorker = null;
        this.pyodideInterruptBuffer = new Uint8Array(new SharedArrayBuffer(1));
        this.pythonCodeMap;
        this.pythonRunnerCode;
        this.runnerState = RUNNER_STATES.PREINIT;
        this.executeSingleLine = false;

        this.setLineCallbacks = [];
        this.gameCommandCallbacks = [];
        this.resetCallbacks = [];
        this.finishCallbacks = [];
        this.readyCallbacks = [];

        this.pauseHandler = new PauseHandler();
    }

    initialize() {
        console.log("[Worker Handler]: Initializing worker handler...");
        this.runnerState = RUNNER_STATES.PREINIT;
        this.pyodideWorker = new Worker("/src/code_runner/pyodide_worker.js");
        this.pyodideWorker.onmessage = async (event) => {
            await this.pyodideMessageHandler(event);
        };
        console.log("[Worker Handler]: Loading python base code files...");
        this.pythonCodeMap = this.loadCodeFiles(PYTHON_CODE_FILES);
        this.pythonRunnerCode = tryGetFileAsText(PYTHON_SCRIPT_RUNNER);
        console.log("[Worker Handler]: Loaded code files");
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
        if (message.type === "COMMAND") {
            console.log("[Worker Handler]: Running command");
            this.gameCommandCallbacks.forEach(func => {
                func.call(this, message.command, message.parameters);
            });
        }
        if (message.type === "ERROR") {
        }
        if (message.type === "SETLINE") {
            console.log(`[Worker Handler]: Processing line ${message.line}`);
            this.setLineCallbacks.forEach(func => {
                func.call(this, message.line);
            });
            if (this.executeSingleLine === false) {
                console.log("[Worker Handler]: Unhalting since not executing in single line mode");
                this.unHaltWorker();
            }
        }
        if (message.type === "REQUESTINPUT") {
        }
        if (message.type === "INIT_OK") {
            console.log("[Worker Handler]: Setting wait buffer");
            this.pyodideWorker.postMessage({ type: "SETWAITBUFFER", buffer: this.pauseHandler.workerWaitArray });
        }
        if (message.type === "WAITBUFFER_OK") {
            console.log("[Worker Handler]: Setting interrupt buffer");
            this.pyodideWorker.postMessage({ type: "SETINTERRUPTBUFFER", buffer: this.pyodideInterruptBuffer });
        }
        if (message.type === "INTERRUPTBUFFER_OK") {
            console.log("[Worker Handler]: Setting python background code");
            this.pyodideWorker.postMessage({ type: "SETBACKGROUNDCODE", runnerCode: this.pythonRunnerCode, codeMap: this.pythonCodeMap });
        }
        if (message.type === "BACKGROUNDCODE_OK") {
            this.runnerState = RUNNER_STATES.READY;
            this.readyCallbacks.forEach(func => {
                func.call(this);
            });
            console.log("[Worker Handler]: Ready");
        }
        if(message.type === "EXECFINISH") {
            this.runnerState = RUNNER_STATES.ENDED;
            this.finishCallbacks.forEach(func => {
                func.call(this);
            });
        }
        if (message.type === "RESET_OK") {
            this.pyodideWorker.postMessage({ type: "RESET_WORKER_OK"});
            this.resetCallbacks.forEach(func => {
                func.call(this);
            });
            this.runnerState = RUNNER_STATES.READY;
            console.log("[Worker handler]: Finished resetting");
        }
    }

    interruptWorker() {
        console.log("[Worker handler]: Interrupting pyodide worker with buffer");
        this.pyodideInterruptBuffer[0] = 2;
    }

    clearWorkerInterrupt() {
        console.log("[Worker handler]: Clearing interrupt buffer");
        this.pyodideInterruptBuffer[0] = 0;
    }

    haltWorker() {
        console.log("[Worker handler]: Sleeping worker");
        this.pauseHandler.pauseWorker();
        this.runnerState = RUNNER_STATES.PAUSED;
    }

    unHaltWorker() {
        console.log("[Worker handler]: Waking worker");
        this.pauseHandler.unpauseWorker();
        this.runnerState = RUNNER_STATES.RUNNING;
    }

    runCode(script) {
        console.log("[Worker handler]: Running code");
        this.clearWorkerInterrupt();
        this.pyodideWorker.postMessage({ type: "RUNCODE", code: script });
        this.runnerState = RUNNER_STATES.RUNNING;
    }

    stepToNextLine() {
        console.log("[Worker handler]: Stepping to next line");
        this.executeSingleLine = true;
        this.unHaltWorker();
    }

    onFinishAnimations() {
        console.log("[Worker handler]: Game has finished processing");
        if (this.executeSingleLine === false) {
            this.unHaltWorker();
        }
    }

    reset() {
        console.log("[Worker handler]: Resetting...");
        this.executeSingleLine = false;
        this.clearWorkerInterrupt();
        this.unHaltWorker();
        this.interruptWorker();
        this.pyodideWorker.postMessage({ type: "RESET" });
    }
}