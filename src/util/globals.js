import { tryGetFileAsJson } from "../file_reader.js";
import { Task } from "../util/task.js";

export const taskIdentifier = (function () {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.size === 0) return 1;

    const taskIdentifier = parseInt(searchParams.get("task"));
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

export const theme = localStorage.getItem("theme");

export function setCurrentSAB(sab) {
    currentSAB = sab;
}

export function getCurrentSAB() {
    return currentSAB;
}

export function incrementCollectibles() {
    collectibles.current += 1;
}

export function addClearedCondition(condition) {
    conditionsCleared.push(condition);
}