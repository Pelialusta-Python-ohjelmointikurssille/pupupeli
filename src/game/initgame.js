import { initGrid, addToGrid, moveGridObjectToDir as tryMoveGridObjectToDir } from "./gamegrid.js";
import { getNewGridObject } from "./gridobject.js";



export function InitGame() {
    var pupu;
    initGrid(8, 8);
    pupu = getNewGridObject("pupu");
    addToGrid(pupu, 0, 0);
    return pupu
}

export function MovePupu(pupu, x, y) {
    return tryMoveGridObjectToDir(pupu, x, y)
}

export default {
    InitGame,
    tryMoveGridObjectToDir
};