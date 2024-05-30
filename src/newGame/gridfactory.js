import { initGrid } from "../game/gamegrid.js";
import { getNewGridObject, addToGrid } from "../game/gridobject.js";

function getNewGameGrid() {
    let doubleArray = CreateDoubleArray(8, 8)
    character = getNewGridObject("pupu")
    addToGrid(character, 0, 0)

    return new Grid(doubleArray, );
};

// write doc for CreateDoubleArray
/** 
 * Creates a double array with the specified dimensions
 * @param {number} width - The width of the array
 * @param {number} height - The height of the array
 * @returns {Array} - The double array
 */
function CreateDoubleArray(widht, height) {
    //js doesn't have double arrays T:Tommi
    let newGrid = [];
    for (let x = 0; x < widht; x++) {
        newGrid[x] = [];
        for (let y = 0; y < height; y++) {
            newGrid[x][y] = new Cell(x, y);
        }
    }
    return newGrid;
}