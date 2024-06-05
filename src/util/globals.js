import { tryGetFileAsJson } from "../file_reader.js";
import { Task } from "../util/task.js";

export const taskIdentifier = (function () {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.size === 0) return 1;

    const taskIdentifier = parseInt(searchParams.get("task"));
    if (isNaN(taskIdentifier)) return 1;
    return taskIdentifier;
})();

export const task = (function () {
    const path = `/tasks/${taskIdentifier}.json`;
    return Task.fromJSON(tryGetFileAsJson(path));
})();

export const collectibles = { total: task.getTotalCollectibles(), current: 0 };
export const conditions = task.getConditions();
export const conditionsCleared = [];

export let currentSAB;

export let asd = false;

export function setCurrentSAB(sab) {
    currentSAB = sab;
}

export function getCurrentSAB() {
    return currentSAB;
}

export function incrementCollectibles() {
    collectibles.current += 1;
}

export function addClearedConditions(clearedConditions) {

    conditionsCleared.length = 0; // reset cleared conditions
    clearedConditions.forEach(condition => {
        if (condition.condition === "conditionMaxLines") {
            if (conditions.filter(cond => cond.condition === "conditionMaxLines")[0].parameter >= condition.parameter) {
                conditionsCleared.push(condition);
            }
        } else {
            conditionsCleared.push(condition);
        }
    });
}

export function allConditionsCleared() {
    return conditionChecker(conditions, conditionsCleared);
}

/**
 * Checks if all the conditions in conditionsCleared exist in conditionsToClear; if each condition exists in conditionsCleared, returns true.
 * Also returns true if more cleared conditions exist in conditionsCleared than conditionsToClear.
 * Returns false if conditionsCleared doesn't include a condition that's in conditionsToClear, or if any condition in conditionsCleared has a parameter
 * with a higher value than the matching condition in conditionsToClear (i.e. conditionMaxLines check).
 * This is awful and should be redone eventually.
 * @param {*} conditionsToClear Array of condition objects.
 * @param {*} conditionsCleared Array of condition objects.
 * @returns boolean
 */
function conditionChecker(conditionsToClear, conditionsCleared) {
    // check if each key-value pair in conditionsToClear exists in conditionsCleared
    for (let conditionToClear of conditionsToClear) {
        let found = false;
        for (let conditionCleared of conditionsCleared) {
            if (Object.keys(conditionToClear).every(key => conditionCleared.hasOwnProperty(key) && conditionCleared[key] === conditionToClear[key])) {
                found = true;
                break;
            }
        }
        if (!found) return false;
    }

    // check if there are any extra objects in conditionsCleared
    for (let conditionCleared of conditionsCleared) {
        let found = false;
        for (let conditionToClear of conditionsToClear) {
            if (Object.keys(conditionCleared).every(key => conditionToClear.hasOwnProperty(key) && conditionToClear[key] === conditionCleared[key])) {
                found = true;
                break;
            }
        }
        if (!found) {
            // check if conditionCleared has a key with a numeric value lower than in conditionToClear
            for (let key in conditionCleared) {
                if (typeof conditionCleared[key] === 'number' && conditionCleared[key] < conditionsToClear[0][key]) {
                    return false;
                }
            }
        }
    }

    return true;
}