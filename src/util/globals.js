import { fetchAllTasks } from "../file_reader.js";
import { loadNextTaskInfo } from "../ui/ui.js";
import { Task } from "../util/task.js";
import { createTaskButtons, updateCurrentChapterButton, updateCurrentTaskButton } from "../ui/ui_buttons.js";

export const allTasks = await fetchAllTasks();
console.log(allTasks);

export const identifiers = (function() {
    let _taskIdentifier = 1;
    let _chapterIdentifier = 1;

    // Listener functions
    const taskListener = async (newValue) => {
        console.log(`New taskIdentifier: ${newValue}`);
        updateCurrentTaskButton();
        task = Task.fromJSON(allTasks[identifiers.chapterIdentifier - 1][identifiers.taskIdentifier - 1]);
        loadNextTaskInfo();
        // Create a function to load new task on Pixi and call it here <-- Riku
        // Maybe also some game logic updates to here to reflect new task if needeed <-- Tommi
    };

    const chapterListener = async (newValue) => {
        console.log(`New chapterIdentifier: ${newValue}`);
        identifiers.taskIdentifier = 1;
        updateCurrentChapterButton();
        totalCounts.totalTasks = allTasks[newValue - 1].length;
        createTaskButtons();
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
    let _totalChapters = allTasks.length;
    let _totalTasks = allTasks[identifiers.chapterIdentifier - 1].length;

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

/**
 * returns the matching task object for the page using the chapter and task identifiers
 */
export let task = Task.fromJSON(allTasks[identifiers.chapterIdentifier - 1][identifiers.taskIdentifier - 1]);

export const collectibles = { total: task.getTotalCollectibles(), current: 0 };
export const obstacles = { total: task.getTotalCollectibles(), current: 0 };

export let currentSAB;
export let isGameWon = 0;
export let multipleChoiceCorrect = false;

export const theme = localStorage.getItem("theme");

export function setGameAsWon() {
    isGameWon = 1;
}

export const totalTasksbyChapter = allTasks.map(chapter => chapter.length);

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