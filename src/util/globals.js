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
            let maxLinesCondition = conditions.filter(cond => cond.condition === "conditionMaxLines")[0];
            if (typeof maxLinesCondition !== 'undefined' && maxLinesCondition.parameter >= condition.parameter) {
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
 * @param {*} conditionsToClear Array of condition objects.
 * @param {*} conditionsCleared Array of condition objects.
 * @returns boolean
 */
function conditionChecker(conditionsToClear, conditionsCleared) {
    const map1 = new Map();
    for (let obj of conditionsToClear) {
        map1.set(obj.condition, obj.parameter);
    }

    for (let obj of conditionsCleared) {
        const param1 = map1.get(obj.condition);
        const param2 = obj.parameter;

        if (param1 === undefined) {
            return false;
        } else if (typeof param1 === 'boolean' && typeof param2 === 'boolean') {
            if (param1 !== param2) {
                return false;
            }
        } else if (typeof param1 === 'number' && typeof param2 === 'number') {
            if (param1 < param2) {
                return false;
            }
        }
    }

    return true;
}