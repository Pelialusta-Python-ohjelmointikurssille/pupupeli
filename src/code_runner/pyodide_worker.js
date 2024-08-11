importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js");

let waitBuffer;
let pythonRunnerCode;
let isReadyToRunCode = false;
let loadedScripts = [];
let saveState;

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
        reset();
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
    self.postMessage({type: "INTERRUPTBUFFER_OK"});
}

function reset() {
    console.log("RESETTING");
    loadedScripts = [];
    pyodide.pyodide_py._state.restore_state(saveState);
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
    console.log(`JS: processed line ${lineNumber}`);
    Atomics.wait(waitBuffer, 0, 1);
}

function onFinishedExecution() {
    self.postMessage({ type: "EXECFINISH" });
}