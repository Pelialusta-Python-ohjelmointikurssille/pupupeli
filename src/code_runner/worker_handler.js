import { tryGetFileAsText } from "../file_reader.js";
import { PauseHandler } from "./pause_handler.js";

const PYTHON_CODE_FILES = new Map([
    ["python_tracer.py", "src/python_code/python_tracer.py"],
    ["player.py", "src/python_code/player.py"],
    ["js_bridge.py", "src/python_code/js_bridge.py"]
]);

const PYTHON_SCRIPT_RUNNER = "src/python_code/runner.py";

const INPUT_CHARACTER_LIMIT = 512;
const BYTES_PER_CHARACTER = 2;

export class WorkerHandler {
    constructor() {
        this.pyodideWorker = null;
        this.pyodideInterruptBuffer = new Uint8Array(new SharedArrayBuffer(1));
        this.sharedInputArray = new Uint16Array(new SharedArrayBuffer(INPUT_CHARACTER_LIMIT * BYTES_PER_CHARACTER)); // For up to 512 utf-16 characters
        this.pythonCodeMap;
        this.pythonRunnerCode;
        this.executeSingleLine = false;

        this.setLineCallbacks = [];
        this.gameCommandCallbacks = [];
        this.resetCallbacks = [];
        this.finishCallbacks = [];
        this.readyCallbacks = [];
        this.inputCallbacks = [];
        this.errorCallbacks = [];
        this.objectCountCallbacks = [];

        this.pauseHandler = new PauseHandler();
    }

    initialize() {
        console.log("[Worker Handler]: Initializing worker handler...");
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
            this.pauseHandler.gamePause();
            if(this.executeSingleLine === true) {
                this.pauseHandler.userPause();
            }
        }
        if (message.type === "ERROR") {
            this.errorCallbacks.forEach(func => {
                func.call(this);
            });
        }
        if (message.type === "SETLINE") {
            console.log(`[Worker Handler]: Processing line ${message.line}`);
            this.setLineCallbacks.forEach(func => {
                func.call(this, message.line);
            });
            if(this.executeSingleLine === true) {
                console.log("USER PAUSE")
                this.pauseHandler.userPause();
            }
            this.pauseHandler.lineProcessUnpause();
        }
        if (message.type === "REQUESTINPUT") {
            console.log(`[Worker Handler]: Worker request input from user`);
            this.inputCallbacks.forEach(func => {
                func.call(this);
            });
        }
        if (message.type === "GETOBJECTCOUNT") {
            console.log(`[Worker Handler]: Worker request amount of objects from game`);
            this.objectCountCallbacks.forEach(func => {
                func.call(this, message.objectType);
            });
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
            console.log("[Worker Handler]: Setting shared input array");
            this.pyodideWorker.postMessage({ type: "SETSHAREDINPUTARRAY", array: this.sharedInputArray });
        }
        if (message.type === "SHAREDINPUTARRAY_OK") {
            console.log("[Worker Handler]: Setting python background code");
            this.pyodideWorker.postMessage({ type: "SETBACKGROUNDCODE", runnerCode: this.pythonRunnerCode, codeMap: this.pythonCodeMap });
        }
        if (message.type === "BACKGROUNDCODE_OK") {
            this.readyCallbacks.forEach(func => {
                func.call(this);
            });
            console.log("[Worker Handler]: Ready");
        }
        if(message.type === "EXECFINISH") {
            this.finishCallbacks.forEach(func => {
                func.call(this);
            });
        }
        if (message.type === "RESET_OK") {
            this.pyodideWorker.postMessage({ type: "RESET_WORKER_OK"});
            this.resetCallbacks.forEach(func => {
                func.call(this);
            });
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

    runCode(script) {
        console.log("[Worker handler]: Running code");
        this.clearWorkerInterrupt();
        this.pyodideWorker.postMessage({ type: "RUNCODE", code: script });
    }

    stepToNextLine() {
        console.log("[Worker handler]: Stepping to next line");
        this.executeSingleLine = true;
        this.pauseHandler.userUnpause();
    }

    onFinishAnimations() {
        console.log("[Worker handler]: Game has finished processing");
        this.pauseHandler.gameUnpause();
    }

    answerInputRequest(userInput) {
        //GIVE INPUT STR
        this.writeStringToSharedArray(userInput);
        this.pauseHandler.inputUnpause();
    }

    answerObjectCountRequest(count) {
        console.log("" + count.toString())
        console.log("ANSWERED")
        this.writeStringToSharedArray("" + count.toString());
        this.pauseHandler.inputUnpause();
    }

    writeStringToSharedArray(string) {
        let stringToWrite = string.toString();
        for (let i = 0; i < this.sharedInputArray.length; i++) {
            if (i >= stringToWrite.length-1) this.sharedInputArray[i] = 0;
            this.sharedInputArray[i] = stringToWrite.charCodeAt(i);
        }
        console.log(`[Worker handler]: Wrote to shared input array: ${this.sharedInputArray}`)
    }

    reset() {
        console.log("[Worker handler]: Resetting...");
        this.executeSingleLine = false;
        this.clearWorkerInterrupt();
        this.pauseHandler.resetPause();
        this.interruptWorker();
        this.pyodideWorker.postMessage({ type: "RESET" });
    }
}