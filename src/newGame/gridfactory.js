import { getNewGridObject } from "./gridobject.js";
import { Grid } from "./grid.js";

export function getNewGameGrid() {
    let newGrid = new Grid(8, 8);
    let pelaaja = getNewGridObject("pupu");
    newGrid.addToGrid(pelaaja, 0, 0);
    consoleDebugDoubleArray(newGrid.doubleArray);
    console.log(newGrid.getWidth() + ", " + newGrid.getHeight());
    return newGrid;
};


function consoleDebugDoubleArray(doubleArray) {
    for (let x = 0; x < doubleArray.length; x++) {
        let row = "";
        for (let y = 0; y < doubleArray[0].length; y++) {
            row += doubleArray[x][y] + ", ";
        }
        console.log(row + "\n");
    }
}