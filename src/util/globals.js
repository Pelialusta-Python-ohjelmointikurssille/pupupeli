import { tryGetFileAsJson } from "../file_reader.js";
import { Task } from "../util/task.js";

/**
 * returns the current task's identifier by parsing the URL and retrieving the value for key "task"
 */
export const taskIdentifier = (function () {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.size === 0) return 1;

    const taskIdentifier = parseInt(searchParams.get("task"));
    if (isNaN(taskIdentifier)) return 1;
    return taskIdentifier;
})();

/**
 * returns the current chapter's identifier by parsing the URL and retrieving value for key "chapter"
 */
export const chapterIdentifier = (function () {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.size === 0) return 1;

    const chapterIdentifier = parseInt(searchParams.get("chapter"));
    if (isNaN(chapterIdentifier)) return 1;
    return chapterIdentifier
})();

/**
 * returns the matching task object for the page using the chapter and task identifiers
 */
export const task = (function () {
    const path = `/tasks/${chapterIdentifier}/${taskIdentifier}.json`;
    return Task.fromJSON(tryGetFileAsJson(path));
})();

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