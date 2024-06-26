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
<<<<<<< HEAD
}

/**
 * a function used to add cleared conditions to a list of cleared conditions
 * @param {*} conditionsFromEventHandler An array of condition objects, for example [{ condition: "conditionUsedWhile", parameter: true }]
 */
export function addClearedConditions(conditionsFromEventHandler) {
    conditionsNotCleared.length = 0;
    conditionsCleared.length = 0; // reset cleared conditions
    conditionsFromEventHandler.forEach(condition => {
        conditionsCleared.push(condition);
    });
}

/**
 * a function used to check if all conditions are cleared and all collectibles are collected
 * @returns true if all conditions are cleared and collectibles are collected, otherwise false
 */
export function allConditionsCleared() {
    let otherConditions = conditionChecker(conditions, conditionsCleared);
    let collectiblesCondition = collectibles.current === collectibles.total;
    if (!collectiblesCondition) conditionsNotCleared.push("conditionCollectAllCollectibles");
    return otherConditions && collectiblesCondition;
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
=======
>>>>>>> main
}