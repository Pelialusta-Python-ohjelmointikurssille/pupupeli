import { initGrid, addToGrid, moveGridObjectToDir as tryMoveGridObjectToDir } from "./gamegrid.js";
import { getNewGridObject } from "./gridobject.js";


// write doc for InitGame
/** 
 * Initializes the game grid and creates a new Pupu object
 * @returns {Object} - The new Pupu object
 */
export function InitGame() {
    var pupu;
    initGrid(8, 8);
    pupu = getNewGridObject("pupu");
    addToGrid(pupu, 0, 0);
    return pupu
}

// write doc for MovePupu
/** 
 * Moves the Pupu object in the specified direction
 * @param {Object} pupu - The Pupu object to move
 * @param {number} x - The x direction to move
 * @param {number} y - The y direction to move
 * @returns {boolean} - True if the object was moved, false if it was not
 */
export function MovePupu(pupu, x, y) {
    return tryMoveGridObjectToDir(pupu, x, y)
}

// q: What does the below code do?
// a: The below code initializes the game grid and creates a new Pupu object. 
// It also provides a function to move the Pupu object in the specified direction.
export default {
    InitGame,
    tryMoveGridObjectToDir
};