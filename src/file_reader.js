

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
 * @returns {number|array} fileNumber - count of files in directory | instructionNumbers - which files were instructions
 */
export function countForTaskFilesInDirectory(dirPath) {
    let fileNumber = 1;
    let instructionNumbers = [];

    // Check files from 1 to n in a for loop
    // loop stops when an error is caught
    while (true) {
        let file = checkIfFileExists(`${dirPath}/${fileNumber}.json`);
        if ( file === null ) { break; }

        if (file.taskType === "instructions") {
            instructionNumbers.push(fileNumber);
        }

        fileNumber++;
    }
    // The number of files is one less than the first file that was not found
    return {count: fileNumber-1, instructionNumbers: instructionNumbers};
}


export function countForChaptersInDirectory(env="") {
    let chapterNumber = 1
    if (env === "test") {
        // eslint-disable-next-line no-undef
        while (checkIfFileExists(__dirname + `/tests/mocks/chapter_mock/${chapterNumber}/1.json`) !== null) {
            chapterNumber ++;
        }
    } else {
        while (checkIfFileExists(`/tasks/${chapterNumber}/1.json`) !== null) {
            chapterNumber ++;
        }
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

// Assuming tasksInit.json is accessible at a certain URL
const tasksInitUrl = '/tasks/tasksInit.json';

// Function to load the tasksInit structure
async function loadTasksInit() {
  const response = await fetch(tasksInitUrl);
  return response.json();
}

// Function to fetch all task files and store them
export async function fetchAllTasks() {
    const tasksInit = await loadTasksInit();
    const tasksContent = [];
  
    // Convert chapter keys to integers and sort them
    const chapters = Object.keys(tasksInit).map(chapter => parseInt(chapter.replace('Chapter', ''))).sort((a, b) => a - b);
  
    for (const chapter of chapters) {
      const chapterIndex = chapter - 1; // Arrays are 0-indexed
      tasksContent[chapterIndex] = [];
  
      // Assuming task names are 'Task1', 'Task2', etc., and tasks are sorted in order
      const tasks = Object.keys(tasksInit[`Chapter${chapter}`]).map(task => parseInt(task.replace('Task', ''))).sort((a, b) => a - b);
  
      for (const task of tasks) {
        const taskIndex = task - 1; // Arrays are 0-indexed
        const taskFile = tasksInit[`Chapter${chapter}`][`Task${task}`];
        const taskResponse = await fetch(`/tasks/${chapter}/${taskFile}`);
        const taskData = await taskResponse.json(); // Assuming the task files are in JSON format
        tasksContent[chapterIndex][taskIndex] = taskData;
        }
    }

  return tasksContent;
}