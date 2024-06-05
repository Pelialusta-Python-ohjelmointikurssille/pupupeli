import { getNewGridObject } from "./gridobject.js";
import { Grid } from "./grid.js";
import { Constants } from "./commonstrings.js";
import * as globals from "../util/globals.js";

/**
 * Creates Grid object and saves starting state to allow reset. Takes current task and creates grid with positions of player, collectibles and obstacles.
 * @returns {Grid} Freshly initialised grid
 */
export function getGameGrid() {
    let player = getNewGridObject(Constants.PLAYER_STR);
    let collectible = getNewGridObject(Constants.COLLECTIBLE);
    let obstacle = getNewGridObject(Constants.OBSTACLE);
    const task = globals.task;
    const playerStartPosition = task.getPlayerStartPosition();

    const gridWidth = task.getGridDimensions().width;
    const gridHeight = task.getGridDimensions().height;

    let grid = globals.task.getGrid();
    let newGrid = new Grid(player, gridWidth, gridHeight);

    newGrid.addToGrid(player, playerStartPosition.y, playerStartPosition.x);

    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            if (grid[y][x] === 2) {
                collectible = getNewGridObject(Constants.COLLECTIBLE);
                newGrid.addToGrid(collectible, x, y);
            } else if (grid[y][x] === 3) {
                obstacle = getNewGridObject(Constants.OBSTACLE);
                newGrid.addToGrid(obstacle, x, y);
            }
        }
    }

    newGrid.saveCurrentStateForReset(); //Important!
    return newGrid;
};
