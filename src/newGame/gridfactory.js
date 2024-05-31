import { getNewGridObject } from "./gridobject.js";
import { Grid } from "./grid.js";
import { Constants } from "./commonstrings.js";

//Types for gridobjects
//TODO: make these local so everyone no need to manually type types.
const playerType = "player";

export function getNewGameGrid() {
    let player = getNewGridObject(playerType);
    let newGrid = new Grid(player, 8, 8);
    newGrid.addToGrid(player, 0, 0);
    newGrid.addToGrid(player, 0, 0);
    return newGrid;
};
console.log(Constants.PLAYER_STR);