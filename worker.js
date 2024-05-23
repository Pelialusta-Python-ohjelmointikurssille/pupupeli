// worker.js
self.importScripts('https://cdn.jsdelivr.net/pyodide/v0.22.1/full/pyodide.js');

self.onmessage = async function (e) {
    if (!self.pyodide) {
        self.pyodide = await loadPyodide();
    }
    let array = e.data;
    
    self.pyodide.globals.set('array', array);

    // Convert the array to Python list and run some Pyodide code
    self.pyodide.runPython(`
        array.reverse()
    `);

    let res = self.pyodide.globals.get('array');

    // Send the result back to the main thread
    self.postMessage(res);
};