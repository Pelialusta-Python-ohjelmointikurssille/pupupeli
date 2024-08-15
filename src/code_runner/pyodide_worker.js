importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js");

let waitBuffer;
let pythonRunnerCode;
let isReadyToRunCode = false;
let loadedScripts = [];
let saveState;
let interruptBuffer;
let resetting = false;

const USER_SCRIPT_NAME = "userscript.py";

async function loadWorkerPyodide() {
    self.pyodide = await loadPyodide();
    self.postMessage({type: "INIT_OK"});
}

let pyodideReadyPromise = loadWorkerPyodide();

self.onmessage = async (event) => {
    await messageHandler(event);
};

async function messageHandler(event) {
    await pyodideReadyPromise;
    let message = event.data;
    if (message.type === "SETWAITBUFFER") {
        setWaitBuffer(message.buffer);
    }
    if (message.type === "SETINTERRUPTBUFFER") {
        setInterruptBuffer(message.buffer);
    }
    if (message.type === "RUNCODE") {
        await runCode(message.code);
    }
    if (message.type === "RESET") {
        console.log("RESETTING FROM HANDLER TO WORKER OG")
        reset();
    }
    if (message.type === "RESET_WORKER_OK") {
        resetting = false;
    }
    if(message.type === "SETBACKGROUNDCODE") {
        await setBackgroundCode(message.runnerCode, message.codeMap);
        saveState = pyodide.pyodide_py._state.save_state();
        isReadyToRunCode = true;
        self.postMessage({type: "BACKGROUNDCODE_OK"});
    }
}

async function runCode(code) {
    if (isReadyToRunCode === false) return;
    await self.pyodide.FS.writeFile(USER_SCRIPT_NAME, code, { encoding: "utf8" });
    await self.pyodide.loadPackagesFromImports(code);
    await loadedScripts.forEach(async (element) => {
        await self.pyodide.loadPackagesFromImports(element);
    });
    await self.pyodide.runPythonAsync(pythonRunnerCode);
}

function setWaitBuffer(buffer) {
    waitBuffer = buffer;
    self.postMessage({type: "WAITBUFFER_OK"});
}

function setInterruptBuffer(buffer) {
    pyodide.setInterruptBuffer(buffer);
    interruptBuffer = buffer;
    self.postMessage({type: "INTERRUPTBUFFER_OK"});
}

function reset() {
    console.log("RESETTING");
    loadedScripts = [];
    pyodide.pyodide_py._state.restore_state(saveState);
    self.postMessage({ type: "RESET_OK" });
}

async function setBackgroundCode(runnerCode, codeMap) {
    codeMap.forEach(async (value, key) => {
        await self.pyodide.FS.writeFile(key, value, { encoding: "utf8" });
        loadedScripts.push(value);
    });
    pythonRunnerCode = runnerCode;
}

// JS functions called from python

function processLine(lineNumber) {
    if(resetting) return;
    if (lineNumber <= 0) return;
    console.log("=========================================================0")
    console.log(`Worker process line ${lineNumber}`);
    self.postMessage({ type: "SETLINE", line: lineNumber });
    console.log("HALTING FROM WORKER")
    Atomics.store(waitBuffer, 0, 1);
    Atomics.notify(waitBuffer, 0, 1);
    Atomics.wait(waitBuffer, 0, 1);
    console.log(`WORKER AFTER LINE PROCESS WAIT ${lineNumber}`);
    console.log("=========================================================0")
}

function onFinishedExecution() {
    self.postMessage({ type: "EXECFINISH" });
}

function runCommand(cmd, params) {
    if(resetting) return;
    console.log("=========================================================0")
    console.log(`WORKER CMD: ${cmd}(${params})`);
    self.postMessage({ type: "COMMAND", command: cmd, parameters: params });
    Atomics.store(waitBuffer, 0, 1);
    Atomics.notify(waitBuffer, 0, 1);
    Atomics.wait(waitBuffer, 0, 1);
    console.log("=========================================================0")
}

function createObject(objectType, x, y) {
    
}

function destroyObject(x, y) {

}

function getInt(variableName) {

}

function processErrorInfo() {

}

function resetFromPython() {
    resetting = true;
    console.log("EXITING PYTHON")
    interruptBuffer[0] = 2;
    reset();
}