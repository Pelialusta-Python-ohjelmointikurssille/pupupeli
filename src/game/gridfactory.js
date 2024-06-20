import { getNewGridObject } from "./gridobject.js";
import { Grid } from "./grid.js";
import { Constants } from "./commonstrings.js";
import * as globals from "../util/globals.js";
import { GameModeGetCollectibles, GameModeMultipleChoice } from "./gameModes.js";

const gridObjectManifest = {
    0: Constants.PLAYER_STR,
    1: "",
    2: Constants.COLLECTIBLE,
    3: Constants.OBSTACLE,
    4: Constants.QUESTION_COLLECTIBLE
}

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
    buildGrid(gridIntTable, newGrid, gridWidth, gridHeight);
    newGrid.saveCurrentStateForReset(); //Important!
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

/**
 * Builds the grid. Doesn't add Player.
 * @param {array} gridIntTable | double array of grid objects represented by numbers
 * @param {Grid} newGrid 
 * @param {number} width
 * @param {number} height 
 */
function buildGrid(gridIntTable, newGrid, width, height) {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            addToGridById(gridIntTable[y][x], newGrid, x, y);
        }
    }
}

function addToGridById(objectId, newGrid, x, y) {
    if (objectId === 0 || objectId === 1) return;
    let collectible = getNewGridObject(gridObjectManifest[objectId]);
    newGrid.addToGrid(collectible, x, y);
}