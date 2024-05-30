import { getNewGridObject } from "./gridobject.js";
import { Grid } from "./grid.js";

export function getNewGameGrid() {
    let pelaaja = getNewGridObject("pupu");
    let newGrid = new Grid(pelaaja, 8, 8);

    newGrid.addToGrid(pelaaja, 0, 0);
    return newGrid;
};