import { onTaskComplete } from "./ui/ui.js";
import { task, getMultipleChoiceCorrect } from "./util/globals.js";
import { notifyGameWon } from "./game/game_controller.js";

export const conditionsCleared = [];
export const conditions = task.getConditions();
export const conditionsNotCleared = [];

export function checkIfGameWon() {
    if (getMultipleChoiceCorrect()) {
        onTaskComplete();
        notifyGameWon(true);
    } else {
        notifyGameWon(false);
    }
}

export function addClearedConditions(conditionsFromWorkerMessenger) {
    conditionsNotCleared.length = 0;
    conditionsCleared.length = 0; // reset cleared conditions
    conditionsFromWorkerMessenger.forEach(condition => {
        conditionsCleared.push(condition);
    });
}

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
}