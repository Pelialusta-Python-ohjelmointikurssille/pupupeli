import { tryGetFileAsText } from "../file_reader.js";
import { PauseHandler } from "./pause_handler.js";

/**
Dictionary of all the python files that are used in running Python.

Key: Name of the file to be written into the virtual file system.

Value: Path to the actual file that should be loaded.
*/
const PYTHON_CODE_FILES = new Map([
    ["python_tracer.py", "src/python_code/python_tracer.py"],
    ["player.py", "src/python_code/player.py"],
    ["js_bridge.py", "src/python_code/js_bridge.py"],
    ["condition_checker.py", "src/python_code/condition_checker.py"]
]);

/**
 * File to the python code runner module that imports all of the other python modules,
 * including user written code.
 */
const PYTHON_SCRIPT_RUNNER = "src/python_code/runner.py";

const INPUT_CHARACTER_LIMIT = 512;
// UTF-16 uses 16 bits to represent characters.
const BYTES_PER_CHARACTER = 2;

/**
Class that handles communication with the worker. 
*/
export class WorkerHandler {
    constructor() {
        this.pyodideWorker = null;
        this.pyodideInterruptBuffer = new Uint8Array(new SharedArrayBuffer(1));
        this.sharedInputArray = new Uint16Array(new SharedArrayBuffer(INPUT_CHARACTER_LIMIT * BYTES_PER_CHARACTER)); 
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

    /**
    * Creates web worker and loads python code from files.
    * These files are later written into the virtual filesystem in the worker for pyodide.
    * 
    * @param {string} workerPath Path to the js file that is loaded as a web worker.
    */
    initialize(workerPath) {
        console.log("[Worker Handler]: Initializing worker handler...");
        this.pyodideWorker = new Worker(workerPath);
        this.pyodideWorker.onmessage = async (event) => {
            await this.pyodideMessageHandler(event);
        };
        console.log("[Worker Handler]: Loading python base code files...");
        this.pythonCodeMap = this.loadCodeFiles(PYTHON_CODE_FILES);
        this.pythonRunnerCode = tryGetFileAsText(PYTHON_SCRIPT_RUNNER);
        console.log("[Worker Handler]: Loaded code files");
    }

    /**
     * Load files from a map.
     * @param {Map<string, string>} fileDict A map of filenames and paths to said files.
     * @returns {Map<string, string>} A map of filenames and contents.
     */
    loadCodeFiles(fileDict) {
        let codeMap = new Map();
        fileDict.forEach((value, key) => {
            let content = tryGetFileAsText(value);
            codeMap.set(key, content);
        });
        return codeMap;
    }

    /**
     * Function that handles worker postMessage events received from worker.
     * 
     * The actual message content is stored in event.data
     * 
     * The message type is in event.data.type
     * 
     * The content of the message can vary, for example event.data.command or event.data.objectType
     * 
     * @param {*} event 
     */
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
                func.call(this, message.errorInfo);
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
                func.call(this, message.clearedConditions);
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

    /**
     * Sets the interrupt buffer to 2 to trigger a KeyboardInterrupt in pyodide.
     * If processed correctly, will be set back to 0 when pyodide is done.
     */
    interruptWorker() {
        console.log("[Worker handler]: Interrupting pyodide worker with buffer");
        this.pyodideInterruptBuffer[0] = 2;
    }

    /**
     * Sets the interrupt buffer back to 0. 
     * If pyodide has processed the KeyboardInterrupt correctly, buffer should reset itself automatically.
     * This is only used as a precaution in case pyodide fails to process the interrupt correctly.
     */
    clearWorkerInterrupt() {
        console.log("[Worker handler]: Clearing interrupt buffer");
        this.pyodideInterruptBuffer[0] = 0;
    }

    /**
     * Runs a given snippet of code in pyodide.
     * 
     * @param {string} script Python script to run.
     * @param {string} playerName Name of the player object. Can be for example "pupu" or "robo". Used to reference player object
     * in the python script.
     */
    runCode(script, playerName) {
        console.log("[Worker handler]: Running code");
        this.clearWorkerInterrupt();
        this.pyodideWorker.postMessage({ type: "RUNCODE", code: script, playerName: playerName });
    }

    /**
     * Steps execution to the next line and then pauses when line has been processed.
     */
    stepToNextLine() {
        console.log("[Worker handler]: Stepping to next line");
        this.executeSingleLine = true;
        this.pauseHandler.userUnpause();
    }

    /**
     * Should be called when the game has finished processing animations.
     * Sets the game pause flag in pause handler to false, so that the code can continue processing.
     */
    onFinishAnimations() {
        console.log("[Worker handler]: Game has finished processing");
        this.pauseHandler.gameUnpause();
    }

    /**
     * Called by game/ui, userInput is player written input from textbox.
     * Writes to the shared array between handler and worker then unpauses the input pause.
     * This shared array is then read by the web worker and given to the python program.
     * 
     * Maximum length of the user's text is set by INPUT_CHARACTER_LIMIT
     * @param {string} userInput 
     */
    answerInputRequest(userInput) {
        this.writeStringToSharedArray(userInput);
        this.pauseHandler.inputUnpause();
    }

    /**
     * Called by game/ui, count is the number of objects found by the game.
     * Writes to the shared array between handler and worker then unpauses the input pause.
     * This shared array is then read by the web worker and given to the python program.
     * 
     * Maximum length of the number(converted to text) is set by INPUT_CHARACTER_LIMIT
     * @param {number} count 
     */
    answerObjectCountRequest(count) {
        console.log("" + count.toString())
        console.log("ANSWERED")
        this.writeStringToSharedArray("" + count.toString());
        this.pauseHandler.inputUnpause();
    }

    /**
     * Writes a given string to shared array. Pretty much the same as the old worker.
     * @param {string} stringToWrite 
     */
    writeStringToSharedArray(stringToWrite) {
        let stringToWrite = stringToWrite.toString();
        for (let i = 0; i < this.sharedInputArray.length; i++) {
            if (i >= stringToWrite.length-1) this.sharedInputArray[i] = 0;
            this.sharedInputArray[i] = stringToWrite.charCodeAt(i);
        }
        console.log(`[Worker handler]: Wrote to shared input array: ${this.sharedInputArray}`)
    }

    /**
     * Resets the handler. Clears handler and pause handler values. Lastly sends reset message to worker.
     * 
     * The worker may take some time to reset even if the handler itself has reset.
     * When the worker has finished resetting, it will sen the RESET_OK message.
     */
    reset() {
        console.log("[Worker handler]: Resetting...");
        this.executeSingleLine = false;
        //this.clearWorkerInterrupt();
        this.pauseHandler.resetPause();
        this.interruptWorker();
        this.pyodideWorker.postMessage({ type: "RESET" });
    }
}