import { getNewGridObject } from "./gridobject.js";
import { Grid } from "./grid.js";
import { Constants } from "./commonstrings.js";

export function getNewGameGrid() {
    let player = getNewGridObject(Constants.PLAYER_STR);
    let newGrid = new Grid(player, 8, 8);
    newGrid.addToGrid(player, 0, 0);
    newGrid.addToGrid(player, 0, 0);
    return newGrid;
};