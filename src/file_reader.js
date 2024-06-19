

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
    while (checkIfFileExists(`${dirPath}/${fileNumber}.json`)) {
        fileNumber++;
    }
    // The number of files is one less than the first file that was not found
    return fileNumber - 1;
}


export function countForChaptersInDirectory(env = "") {
    let chapterNumber = 1
    if (env === "test") {
        // eslint-disable-next-line no-undef
        while (checkIfFileExists(__dirname + `/tests/mocks/chapter_mock/${chapterNumber}/1.json`)) {
            chapterNumber++;
        }
    } else {
        while (checkIfFileExists(`/tasks/${chapterNumber}/1.json`)) {
            chapterNumber++;
        }
    }
    return chapterNumber - 1;
}

/**
 * Checks if file at path exists. 
 * @param {*} path path as string
 * @returns true if found, false if not found.
 */
export function checkIfFileExists(path) {
    //XMLHttpRequest Error: 
    //"HEAD http://localhost:8000/tasks/x/x.json 404 (File not found)""
    //cannot be hidden from console, don't try.
    let request = new XMLHttpRequest();
    request.open('HEAD', path, false);
    request.send();
    return request.status != 404;
}
