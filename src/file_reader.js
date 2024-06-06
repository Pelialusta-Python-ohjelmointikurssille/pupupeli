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

    export function countForFilesInDirectory(directory) {
        let fileNumber = 1;

        // Check files from 1 to n in a for loop
        while (checkIfFileExists(`${directory}/${fileNumber}.json`) !== null) {
            fileNumber++;
        }

        // The number of files is one less than the first file that was not found
        return fileNumber - 1;
    }

    export function countFilesInDirectory(directory) {
        let low = 1;
        let high = 2;
        let middle;

        // Expand the search range until a file is not found
        while (checkIfFileExists(`${directory}/${high}.json`) !== null) {          
            low = high;
            high *= 2;
            console.log("moi" + high)
        }

        // Perform a binary search to find the last file
        while (low < high) {
            middle = Math.floor((low + high) / 2);

            if (checkIfFileExists(`${directory}/${middle}.json`) !== null) {
                low = middle + 1;
            } else {
                high = middle;
            }
        }

        // The number of files is one less than the first file that was not found
        return low - 1;
    }

    function checkIfFileExists(path) {
        try {
            return tryGetFileAsJson(path);
        } catch (error) {
            console.log("File not found: " + path)
            return null;
        }
    }