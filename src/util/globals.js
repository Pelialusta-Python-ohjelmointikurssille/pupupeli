import { fetchAllTasks } from "../file_reader.js";
import { loadNextTaskInfo, showPopUpNotification } from "../ui/ui.js";
import { Task } from "../util/task.js";
import { createTaskButtons, updateCurrentChapterButton, updateCurrentTaskButton } from "../ui/ui_buttons.js";

export const allTasks = await fetchAllTasks();

export const identifiers = (function() {
    let _taskIdentifier = 1;
    let _chapterIdentifier = 1;

    // Listener functions
    const taskListener = async () => {
        const stopButton = document.getElementById('editor-stop-button');
        if (stopButton) {
            stopButton.click();
        }
        updateCurrentTaskButton();
        task = Task.fromJSON(allTasks[identifiers.chapterIdentifier - 1][identifiers.taskIdentifier - 1]);
        loadNextTaskInfo();
        updateURL();
    };

    const chapterListener = async (newValue) => {
        identifiers.taskIdentifier = 1;
        updateCurrentChapterButton();
        totalCounts.totalTasks = allTasks[newValue - 1].length;
        createTaskButtons();
    };

    const updateURL = () => {
        const url = new URL(window.location.origin);
        url.searchParams.set('chapter', _chapterIdentifier);
        url.searchParams.set('task', _taskIdentifier);
        history.replaceState(null, '', url);
    };

    const initializeFromURL = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const chapter = parseInt(urlParams.get('chapter'), 10);
        const task = parseInt(urlParams.get('task'), 10);
        let chapterValid = true;
        let taskValid = true;

        if (!urlParams.has('chapter') && !urlParams.has('task')) {
            // No parameters given, default to chapter 1 and task 1
            _chapterIdentifier = 1;
            _taskIdentifier = 1;
            updateURL();
            return;
        }
    
        if (!isNaN(chapter) && chapter > 0 && chapter <= allTasks.length) {
            _chapterIdentifier = chapter;
        } else {
            chapterValid = false;
            _chapterIdentifier = 1;
            _taskIdentifier = 1;
        }
    
        if (!isNaN(task) && task > 0 && task <= allTasks[_chapterIdentifier - 1].length && chapterValid) {
            _taskIdentifier = task;
        } else {
            taskValid = false;
            _taskIdentifier = 1;
        }
    
        if (!chapterValid || !taskValid) {
            showPopUpNotification("task-not-found")
            updateURL();
        }
    };

    // Initialize identifiers from URL on page load
    initializeFromURL();

    return {
        get taskIdentifier() {
            return _taskIdentifier;
        },
        set taskIdentifier(newValue) {
            _taskIdentifier = newValue;
            taskListener(); // Notify listener
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

export const availableThemes = ["pupu", "robo"];
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