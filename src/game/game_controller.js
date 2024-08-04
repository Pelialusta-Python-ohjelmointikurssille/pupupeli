import { Game } from "./game.js";
import { postMessage } from "../worker_messenger.js";
import { getVariableTrueName } from './commonstrings.js';

//This file controls game. 
// - Creates new game instances (Game contains both logic and rendering)
// - handles game command input and output

var game;
var currentCommand;
const gameDefaultSpeed = 1;
const gameTurboSpeed = 0.2;

/**
 * Initializes the game. It loads the current level using the instuctions from current task and initializes the rendering.
 * @returns pixiApp.canvas, the canvas object that pixi uses, needs to be added to the page.
 */
export async function initGame() {
    game = new Game();
    await game.init();
    return game.getCanvas();
}

//Receives the command, expects a object of type 
// "{ data: data, sab: sab })" 
// where data is ? and sab is an SharedArrayBuffer.
export function giveCommand(dirtyCommand) {
    currentCommand = dirtyCommand; //Do this first, always. Thank you.
    game.receiveInput(dirtyCommand.data.command, dirtyCommand.data.parameters);
}

/**
 * Called by the Game class when game commands are done.
 * Sends a message that commands are done to worker, so it can continue executing. 
 * If currentCommand is undefined, does nothing, so you can make gameController do commands even without sending a message to worker.
 */
export function commandsDone() {
    if (currentCommand === undefined) {
        return;
    }
    postMessage({ type: "return", details: "returning from game.js", sab: currentCommand.sab });
}

/**
* @returns Gets the pixiApp.canvas.
*/
export function getCanvas() {
    game.getCanvas();
}

//Problem: below there are 4 functions that do nothing but call the games functions of the same name.
//Maybe do what they do here, it feels stupid to copypaste docstring.

/**
* Restores the gamestate back to the beginning of the task.
*/
export function resetAndInitContent() {
    game.resetAndInitContent();
}

/**
* Changes theme, currently uses the finnish name of the theme
* @param {*} theme theme to change into in finnish
*/
export function setTheme(theme) {
    game.setTheme(theme);
}

/**
 * Toggles a grid that is drawn to see the grid easier and the indexes of the x and y in the grid
 */
export function toggleGrid() {
    game.toggleGrid();
}

/**
 * Toggles the rendering of the trail on and off. It draws a line representing the route of player in the grid. 
 */
export function toggleTrail() {
    game.toggleTrail();
}

/**
 * 
 * @param {*} type name of the gridobject type as string
 * @returns the number of gridobjects of given type currently on screen
 */
export function getGridObjectsOfTypeLeft(type) {
    type = getVariableTrueName(type);
    if (!type) { //not found
        return -1; //Player will know that object like that didn't exist.
    }
    return game.grid.data.getGridObjectsOfTypeCount(type);
}


/**
 * Makes game create an object, chops the commandParameters to an understandable form for game.
 * @param {*} commandParameters 
 */
export function createObject(commandParameters) {
    let name = commandParameters[0]
    let x = commandParameters[1];
    let y = commandParameters[2];
    name = getVariableTrueName(name);
    game.createNewPlayerCreatedGridObject(name, x, y);
}
/**
 * Makes game destroy an object, chops the commandParameters to an understandable form for game.
 * @param {*} commandParameters 
 */
export function destroyObject(commandParameters) {
    let x = commandParameters[0];
    let y = commandParameters[1];
    game.destroyObject(x, y);
}

export function setTurboSpeedActive(isBool) {
    if (!isBool) {
        game.setSpeedModifier(gameDefaultSpeed); //Default speed
        return;
    }
    game.setSpeedModifier(gameTurboSpeed);
}