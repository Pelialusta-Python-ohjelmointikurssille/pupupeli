import { Renderer } from "./rendering.js";
import { Direction } from "./direction.js";
import { initGrid, addToGrid, moveGridObjectToDir as tryMoveGridObjectToDir } from "./gamegrid.js";
import { getNewGridObject } from "./gridobject.js";


let renderer;
let turnTimer = 0;
/**
 * How many seconds a turn should take.
 * Commands are processed every turn.
 * NOTE: This should take long enough for
 * the player character to be able to move.
 */
const turnTimeSeconds = 0.5;
let commands = [];
var pupu;

/**
 * Dictionary used to transform commands
 * from python to usable movement directions by game logic.
 * This assumes all commands are only movement commands.
 */
let commandDirs = {
    "oikea": Direction.Right,
    "vasen": Direction.Left,
    "alas": Direction.Down,
    "ylös": Direction.Up
}

/**
 * Initializes game logic and PixiJS related logic.
 * Creates objects for grid and the renderer.
 * Adds onUpdate to PixiJS ticker loop that runs every frame.
 * @returns PixiJS app object
 */
export async function InitGame() {
    initGrid(8, 8);
    pupu = getNewGridObject("pupu");
    addToGrid(pupu, 0, 0);
    renderer = await getRenderer();
    await renderer.init();
    renderer.addFunctionToLoop(onUpdate);
    return renderer.pixiApp;
}

/**
 * Gets and creates renderer.
 * Should only be called in InitGame()
 * @returns Renderer object
 */
async function getRenderer() {
    let renderer = new Renderer();
    await renderer.init();
    return renderer;
}

/**
 * Used to set the list of commands for processing by the game.
 * @param {*} list List of commands to be processed.
 * @returns null
 */
export function setCommandList(list) {
    if (list == null || renderer == null) {
        return;
    }
    if (commands.length > 0) return;
    commands = list;
}

/**
 * Runs every frame.
 * @param {*} deltaTime The time since last frame in seconds. Used to make framerate independent logic. 
 */
function onUpdate(deltaTime) {
    if (turnTimer < turnTimeSeconds && commands.length > 0) {
        turnTimer += deltaTime;
    }
    if (turnTimer >= turnTimeSeconds) {
        processTurn();
        turnTimer = 0;
    }
}
/**
 * Runs every x seconds defined by turnTimeSeconds.
 * Used for processing game logic.
 * @returns null
 */
function processTurn () {
    if (commands == null) {
        return;
    }
    if (commands.length <= 0) {
        return;
    }
    let newCommand = commands.shift();
    if (tryMoveGridObjectToDir(pupu, commandDirs[newCommand])) {
        renderer.player.moveToDirection (commandDirs[newCommand]);
    }
}

export function rendererToggleGrid () {
    renderer.toggleGrid();
}
