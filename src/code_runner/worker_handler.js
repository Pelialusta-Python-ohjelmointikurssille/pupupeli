importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js");

let waitBuffer;

async function loadWorkerPyodide() {
    console.log("Loading Pyodide");
    self.pyodide = await loadPyodide();
    console.log("Loaded pyodide");
    let end = new Date();
}

let pyodideReadyPromise = loadWorkerPyodide();

self.onmessage = async (event) => {
    await pyodideReadyPromise;
};

async function runCode(code) {
    await pyodideReadyPromise;
}
