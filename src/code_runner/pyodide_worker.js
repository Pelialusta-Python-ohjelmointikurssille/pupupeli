importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js");

let waitBuffer;
let pythonRunnerCode;

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
    }
}

async function runCode(code) {
    await pyodideReadyPromise;
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

}

async function setBackgroundCode(runnerCode, codeMap) {
    self.postMessage({type: "BACKGROUNDCODE_OK"});
    codeMap.forEach(async (value, key) => {
        await self.pyodide.FS.writeFile(key, value, { encoding: "utf8" });
    });
    pythonRunnerCode = runnerCode;
}