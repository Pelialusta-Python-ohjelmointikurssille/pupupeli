/**
 * Returns the contents of the file located at the given path as a string.
 * @param {string} path The relative or absolute path of the file to look for.
 * @returns {string} The contents of the file at "path". If no file is found, 
 * throws an Error.
 */
export function tryGetFileAsText(path) {
    var fileReadMessage = {
        isSuccess : false,
        result : ""
    }

    if (path === undefined) {
        fileReadMessage.result = `No file path given`;
        return fileReadMessage;
    }

    let request = new XMLHttpRequest();
    request.open('GET', path, false);
    request.send(null);

    if (request.status === 200) {
        fileReadMessage.isSuccess = true;
        fileReadMessage.result = request.responseText;
    } else {
        fileReadMessage.result = `Error fetching file: ${path}`;
    }
    return fileReadMessage;
}

export function tryGetFileAsJson(path) {
    let response;

    let request = new XMLHttpRequest();
    request.open('GET', path, false);
    request.send(null);

    if (request.status === 200) {
        response = request.responseText;
    } else {
        // error handling can be added
        // console.log(`Error fetching file: ${path}`)
    }

    const result = JSON.parse(response);

    return result;
}