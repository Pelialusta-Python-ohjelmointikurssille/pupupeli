import { getNewGridObject } from "./gridobject.js";
import { Grid } from "./grid.js";
import { Constants } from "./commonstrings.js";
import * as globals from "../util/globals.js";
import { GameModeGetCollectibles, GameModeMultipleChoice } from "./gameModes.js";

/**
 * 
 * @returns Object containing the task: { grid: grid, gameMode: gameMode }
 */
export function getGameTask() {
    //taskFactory or gridfactory?
    const task = globals.task;
    const playerStartPosition = task.getPlayerStartPosition();
    const gridWidth = task.getGridDimensions().width;
    const gridHeight = task.getGridDimensions().height;

    let gridIntTable = globals.task.getGrid();
    let newGrid = getNewGrid(gridWidth, gridHeight, playerStartPosition.y, playerStartPosition.x);

    buildGrid(gridIntTable, newGrid, gridWidth, gridHeight);
    //make new gamemode last, make it here cause the info on gamemode is contained in the json?
    let currentGameMode;
    if (task.getMultipleChoiceQuestions().length > 0) {
        currentGameMode = new GameModeMultipleChoice(newGrid);
    } else {
        currentGameMode = new GameModeGetCollectibles(newGrid);
    }
    globals.setCurrentGameMode(currentGameMode);
    //Send the grid and the gamemode
    return { grid: newGrid, gameMode: currentGameMode };
};

function getNewGrid(gridWidth, gridHeight, playerStartPositionY, playerStartPositionX) {
    let player = getNewGridObject(Constants.PLAYER_STR);
    let newGrid = new Grid(player, gridWidth, gridHeight);
    newGrid.addToGrid(player, playerStartPositionY, playerStartPositionX);
    return newGrid;
}

/**
 * Builds the grid. Doesn't add Player.
 * @param {array} gridIntTable | double array of grid objects represented by numbers
 * @param {Grid} grid grid to add the new gridobjects. Expects the dimensions to match the gridIntTable.
 */
function buildGrid(gridIntTable, grid) {
    for (let y = 0; y < grid.height; y++) {
        for (let x = 0; x < grid.width; x++) {
            if (gridIntTable[y][x] === 2) {
                let collectible = getNewGridObject(Constants.COLLECTIBLE);
                grid.addToGrid(collectible, x, y);
            } else if (gridIntTable[y][x] === 3) {
                let obstacle = getNewGridObject(Constants.OBSTACLE);
                grid.addToGrid(obstacle, x, y);
            }
        }
    }
    grid.saveCurrentStateForReset(); //Important!
}
