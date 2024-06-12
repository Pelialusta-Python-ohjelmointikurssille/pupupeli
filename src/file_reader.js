

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

/**
 * Returns count of tasks json files in directory. This is used for creating the right number of buttons in ui.
 * This function's while loop depends on catching an error to stop, so it causes 404 file not found each run.
 * If another way is found, it might be preferred.
 * @param {string} dirPath - path to the directory 
 * @returns {number} fileNumber - count of files in directory
 */
export function countForTaskFilesInDirectory(dirPath) {
    let fileNumber = 1;

    // Check files from 1 to n in a for loop
    // loop stops when an error is caught
    while (checkIfFileExists(`${dirPath}/${fileNumber}.json`) !== null) {
        fileNumber++;
    }
    // The number of files is one less than the first file that was not found
    return fileNumber - 1;
}


export function countForChaptersInDirectory() {
    let chapterNumber = 1
    while (checkIfFileExists(`/tasks/${chapterNumber}/1.json`) !== null) {
        chapterNumber ++;
    }

    return chapterNumber - 1;
}

/**
 * Returns result if task json file exists, null if doesnt
 * @param {string} path - path to json file
 * @returns {json|null} result or null
 */
export function checkIfFileExists(path) {
    try {
        return tryGetFileAsJson(path);
    } catch {
        return null;
    }
}
