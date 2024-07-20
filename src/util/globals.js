import { tryGetFileAsJson, fetchAllTasks } from "../file_reader.js";
import { loadNextTask } from "../ui/ui.js";
import { Task } from "../util/task.js";

export const identifiers = (function() {
    let _taskIdentifier = 1;
    let _chapterIdentifier = 1;

    // Listener functions
    const taskListener = async (newValue) => { // Mark function as async
        console.log(`New taskIdentifier: ${newValue}`);
        task = fetchTask(); // Wait for fetchTask to complete
        loadNextTask(); // Then load the next task
    };

    const chapterListener = async (newValue) => { // Mark function as async
        console.log(`New chapterIdentifier: ${newValue}`);
        task = fetchTask(); // Wait for fetchTask to complete
        loadNextTask(); // Then load the next task
    };

    return {
        get taskIdentifier() {
            return _taskIdentifier;
        },
        set taskIdentifier(newValue) {
            _taskIdentifier = newValue;
            taskListener(newValue); // Notify listener
        },
        get chapterIdentifier() {
            return _chapterIdentifier;
        },
        set chapterIdentifier(newValue) {
            _chapterIdentifier = newValue;
            chapterListener(newValue); // Notify listener
        }
    };
})();

export const totalCounts = (function() {
    let _totalTasks;
    let _totalChapters;

    return {
        get totalTasks() {
            return _totalTasks;
        },
        set totalTasks(newValue) {
            _totalTasks = newValue;
        },
        get totalChapters() {
            return _totalChapters;
        },
        set totalChapters(newValue) {
            _totalChapters = newValue;
        }
    };
})();

export const allTasks = fetchAllTasks();
console.log(allTasks);


export function fetchTask() {
    console.log(`Fetching task ${identifiers.taskIdentifier} from chapter ${identifiers.chapterIdentifier}`);
    const path = `/tasks/${identifiers.chapterIdentifier}/${identifiers.taskIdentifier}.json`;
    console.log(Task.fromJSON(tryGetFileAsJson(path)));
    return Task.fromJSON(tryGetFileAsJson(path));
}

/**
 * returns the matching task object for the page using the chapter and task identifiers
 */
export let task = fetchTask();

export const collectibles = { total: task.getTotalCollectibles(), current: 0 };
export const obstacles = { total: task.getTotalCollectibles(), current: 0 };

export let currentSAB;
export let isGameWon = 0;
export let multipleChoiceCorrect = false;

export const theme = localStorage.getItem("theme");

export function setGameAsWon() {
    isGameWon = 1;
}

export function setMultipleChoiceCorrect(isCorrect = true) {
    if (isCorrect.target.dataset.correct) {
        multipleChoiceCorrect = isCorrect;
    } else {
        multipleChoiceCorrect = false;
    }
}

export function getMultipleChoiceCorrect() {
    if (task.getMultipleChoiceQuestions().length > 0) {
        return multipleChoiceCorrect;
    }
    return true; //default in any other gamemode
}

export function setCurrentSAB(sab) {
    currentSAB = sab;
}

export function getCurrentSAB() {
    return currentSAB;
}

/**
 * retrieves the current theme, or if there is no theme set, the default Pupu theme
 * @returns a string representing the current theme
 */
export function getCurrentTheme() {
    if (localStorage.getItem("theme") === null) {
        console.log("No theme set, setting to Pupu");
        localStorage.setItem("theme", "Pupu");
        return ("Pupu")
    } else {
        return localStorage.getItem("theme");
    }
}

export function setCurrentTheme(theme) {
    localStorage.setItem("theme", theme);
}

export function incrementCollectibles() {
    collectibles.current += 1;
}