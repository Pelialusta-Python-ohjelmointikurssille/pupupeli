/**
 * Returns the contents of the file located at the given path as a string.
 * @param {string} path The relative or absolute path of the file to look for.
 * @returns {string} The contents of the file at "path". If no file is found, 
 * throws an Error.
 */
export function tryGetFileAsText(path) {
    let fileAsString;

    if (path === undefined) {
        throw new Error("No file path given");
    }

    let request = new XMLHttpRequest();
    request.open('GET', path, false);
    request.send(null);

    if (request.status === 200) {
        fileAsString = request.responseText;
    } else {
        throw new Error(`Error fetching file: ${path}`);
    }

    return fileAsString
}

/**
 * Returns the parsed contents of a json file
 * @param {string} path 
 * @returns {json} File's contents as json 
 */
export function tryGetFileAsJson(path) {
    let response;

    if (path === undefined) {
        throw new Error("No file path given");
    }

    let request = new XMLHttpRequest();
    request.open('GET', path, false);
    request.send(null);

    if (request.status === 200) {
        response = request.responseText;
    } else {
        throw new Error(`Error fetching file: ${path}`);
    }

    const result = JSON.parse(response);
    return result;
}