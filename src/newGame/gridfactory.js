import { getNewGridObject } from "./gridobject.js";
import { Grid } from "./grid.js";
import { Constants } from "./commonstrings.js";
import * as globals from "../util/globals.js";

export function getNewGameGrid() {
    let player = getNewGridObject(Constants.PLAYER_STR);
    const task = globals.task;
    const playerStartPosition = task.getPlayerStartPosition();

    const gridWidth = task.getGridDimensions().width;
    const gridHeight = task.getGridDimensions().height;

    let newGrid = new Grid(player, gridWidth, gridHeight);

    newGrid.addToGrid(player, playerStartPosition.x, playerStartPosition.y);
    newGrid.saveCurrentStateForReset(); //Important!
    return newGrid;
};
