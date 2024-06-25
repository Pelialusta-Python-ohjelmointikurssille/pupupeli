import { getNewGridObject } from "./gridobject.js";
import { Grid } from "./grid.js";
import { Constants } from "./commonstrings.js";
import * as globals from "../util/globals.js";

const gridObjectManifest = {
    0: Constants.PLAYER_STR,
    1: "",
    2: Constants.COLLECTIBLE,
    3: Constants.OBSTACLE,
    4: Constants.QUESTION_COLLECTIBLE
}

/**
 * 
 * @returns Returns a newly initialized grid for the current task.
 */
export function getGameTask() {
    const task = globals.task;
    const playerStartPosition = task.getPlayerStartPosition();
    const gridWidth = task.getGridDimensions().width;
    const gridHeight = task.getGridDimensions().height;
    let gridIntTable = globals.task.getGrid();
    let newGrid = getNewGrid(gridWidth, gridHeight, playerStartPosition.y, playerStartPosition.x);

    buildGrid(gridIntTable, newGrid, gridWidth, gridHeight);
    //Send the grid and the gamemode
    return newGrid;
};

/**
 * Creates a new initialized grid with player.
 * @param {*} gridWidth 
 * @param {*} gridHeight 
 * @param {*} playerStartPositionY 
 * @param {*} playerStartPositionX 
 * @returns the newly initialized Grid object
 */
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
            addToGridById(gridIntTable[y][x], grid, x, y);
        }
    }
    grid.saveCurrentStateForReset(); //Important!
}

function addToGridById(objectId, newGrid, x, y) {
    if (objectId === 0 || objectId === 1) return;
    let collectible = getNewGridObject(gridObjectManifest[objectId]);
    newGrid.addToGrid(collectible, x, y);
}