import { getNewGridObject } from "./gridobject.js";
import { Grid } from "./grid.js";

//Types for gridobjects
//TODO: make these local so everyone no need to manually type types.
const playerType = "Player";

export function getNewGameGrid() {
    let player = getNewGridObject(playerType);
    let newGrid = new Grid(player, 8, 8);

    newGrid.addToGrid(player, 0, 0);
    return newGrid;
};