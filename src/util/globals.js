import { tryGetFileAsJson } from "../file_reader.js";
import { Task } from "../util/task.js";

export const taskIdentifier = (function () {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.size === 0) return 1;

    const taskIdentifier = parseInt(searchParams.get("task"));
    if (isNaN(taskIdentifier)) return 1;
    return taskIdentifier;
})();

export const chapterIdentifier = (function () {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.size === 0) return 1;

    const chapterIdentifier = parseInt(searchParams.get("chapter"));
    if (isNaN(chapterIdentifier)) return 1;
    return chapterIdentifier
})();

export const task = (function () {
    const path = `/tasks/${chapterIdentifier}/${taskIdentifier}.json`;
    return Task.fromJSON(tryGetFileAsJson(path));
})();

//not sexy to count every object in the grid every time you want the total amount... (task.getTotalCollectibles())
export const collectibles = { total: task.getTotalCollectibles(), current: 0 };
export const obstacles = { total: task.getTotalCollectibles(), current: 0 };

export let currentSAB;
export let currentGameMode;

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
    if (currentGameMode.name === "GameModeMultipleChoice") {
        return multipleChoiceCorrect
    } else {
        return true; // ignore check if gamemode isn't multiple choice
    }
}

export function setCurrentSAB(sab) {
    currentSAB = sab;
}

export function getCurrentSAB() {
    return currentSAB;
}

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

export function setCurrentGameMode(gameMode) {
    currentGameMode = gameMode;
}

export function getCurrentGameMode() {
    return currentGameMode;
}

export function incrementCollectibles() {
    collectibles.current += 1;
}