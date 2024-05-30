import { getNewGridObject } from "./gridobject.js";
import { Grid } from "./grid.js";

export function getNewGameGrid() {
    let newGrid = new Grid(CreateDoubleArray(8, 8));
    let pelaaja = getNewGridObject("pupu");
    newGrid.addToGrid(pelaaja, 0, 0);
    consoleDebugDoubleArray(newGrid.doubleArray);
    console.log(newGrid.getWidth() + ", " + newGrid.getHeight());
    return newGrid;
};

// write doc for CreateDoubleArray
/** 
 * Creates a double array with the specified dimensions
 * @param {number} width - The width of the array
 * @param {number} height - The height of the array
 * @returns {Array} - The double array
 */
function CreateDoubleArray(width, height) {
    //js doesn't have double arrays T:Tommi
    let newGrid = [];
    for (let x = 0; x < width; x++) {
        newGrid[x] = new Array(height);
    }
    return newGrid;
}

function consoleDebugDoubleArray(doubleArray) {
    for (let x = 0; x < doubleArray.length; x++) {
        let row = "";
        for (let y = 0; y < doubleArray[0].length; y++) {
            row += doubleArray[x][y] + ", ";
        }
        console.log(row + "\n");
    }
}