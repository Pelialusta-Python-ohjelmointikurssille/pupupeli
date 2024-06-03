import { getNewGridObject } from "./gridobject.js";
import { Grid } from "./grid.js";
import { Constants } from "./commonstrings.js";
import * as globals from "../util/globals.js";

export function getNewGameGrid() {
    let player = getNewGridObject(Constants.PLAYER_STR);
    let collectible = getNewGridObject(Constants.COLLECTIBLE);
    let obstacle = getNewGridObject(Constants.OBSTACLE);
    const task = globals.task;
    const playerStartPosition = task.getPlayerStartPosition();

    const gridWidth = task.getGridDimensions().width;
    const gridHeight = task.getGridDimensions().height;

    let newGrid = new Grid(player, gridWidth, gridHeight);

    newGrid.addToGrid(player, playerStartPosition.x, playerStartPosition.y);
    newGrid.addToGrid(collectible, Math.round(newGrid.width / 2), Math.round(newGrid.height / 2));
    newGrid.addToGrid(obstacle, 3, 3);
    newGrid.saveCurrentStateForReset(); //Important!
    return newGrid;
};
