import { getNewGridObject } from "./gridobject.js";
import { Grid } from "./grid.js";
import { Constants } from "./commonstrings.js";
import * as globals from "../util/globals.js";
import { GameModeGetCollectibles } from "./gameModes.js";

/**
 * 
 * @returns Object containing the task: { grid: grid, gameMode: gameMode }
 */
export function getGameTask() {
    //taskFactory or gridfactory?
    let player = getNewGridObject(Constants.PLAYER_STR);
    const task = globals.task;
    const playerStartPosition = task.getPlayerStartPosition();
    const gridWidth = task.getGridDimensions().width;
    const gridHeight = task.getGridDimensions().height;

    let gridIntTable = globals.task.getGrid();
    let newGrid = new Grid(player, gridWidth, gridHeight);

    newGrid.addToGrid(player, playerStartPosition.y, playerStartPosition.x);
    BuildGrid(gridIntTable, newGrid, gridWidth, gridHeight);
    newGrid.saveCurrentStateForReset(); //Important!
    //make new gamemode last, make it here cause the info on gamemode is contained in the json?
    let currentGameMode = new GameModeGetCollectibles(newGrid);
    //Send the grid and the gamemode
    return { grid: newGrid, gameMode: currentGameMode };
};

/**
 * Builds the grid. Doesn't add Player.
 * @param {*} gridIntTable 
 * @param {*} newGrid 
 * @param {*} widht 
 * @param {*} height 
 */
function BuildGrid(gridIntTable, newGrid, widht, height) {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < widht; x++) {
            if (gridIntTable[y][x] === 2) {
                let collectible = getNewGridObject(Constants.COLLECTIBLE);
                newGrid.addToGrid(collectible, x, y);
            } else if (gridIntTable[y][x] === 3) {
                let obstacle = getNewGridObject(Constants.OBSTACLE);
                newGrid.addToGrid(obstacle, x, y);
            }
        }
    }
}
