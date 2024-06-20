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

export const conditions = task.getConditions();
export const conditionsCleared = [];
export const conditionsNotCleared = [];

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

export function setCurrentGameMode(gameMode) {
    currentGameMode = gameMode;
}

export function getCurrentGameMode() {
    return currentGameMode;
}

export function incrementCollectibles() {
    collectibles.current += 1;
}

export function addClearedConditions(conditionsFromEventHandler) {
    conditionsNotCleared.length = 0;
    conditionsCleared.length = 0; // reset cleared conditions
    conditionsFromEventHandler.forEach(condition => {
        conditionsCleared.push(condition);
    });
}

export function allConditionsCleared() {
    return conditionChecker(conditions, conditionsCleared) && collectibles.current === collectibles.total;
}

/**
 * Checks if all the conditions in conditionsCleared exist in conditionsToClear; if each condition exists in conditionsCleared, returns true.
 * Also returns true if more cleared conditions exist in conditionsCleared than conditionsToClear.
 * Returns false if conditionsCleared doesn't include a condition that's in conditionsToClear, or if any condition in conditionsCleared has a parameter
 * with a higher value than the matching condition in conditionsToClear (i.e. conditionMaxLines check).
 * @param {*} conditionsToClear Array of condition objects.
 * @param {*} conditionsCleared Array of condition objects.
 * @returns boolean
 */
function conditionChecker(conditionsToClear, conditionsCleared) {
    const map1 = new Map();
    for (let obj of conditionsCleared) {
        map1.set(obj.condition, obj.parameter);
    }
    for (let obj of conditionsToClear) {
        const param1 = map1.get(obj.condition);
        const param2 = obj.parameter;

        // is there a condition to clear that isn't cleared?
        if (param1 === undefined) {
            conditionsNotCleared.push(obj.condition);
        }
        // are the truth values the same (= true)
        if (typeof param1 === 'boolean' && typeof param2 === 'boolean') {
            if (param1 !== param2) {
                conditionsNotCleared.push(obj.condition);
            }
        }
        // if the parameter is a number (= conditionMaxLines), is it equal or less than the required amount?
        if (typeof param1 === 'number' && typeof param2 === 'number') {
            if (param1 > param2) {
                conditionsNotCleared.push(obj.condition);
            }
        }
    }

    if (conditionsNotCleared.length > 0) {
        return false;
    } else {
        return true;
    }
}