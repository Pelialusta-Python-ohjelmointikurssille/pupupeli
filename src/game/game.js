import { Renderer } from "./rendering.js";
import { Direction } from "./direction.js";
import { initGrid, addToGrid, moveGridObjectToDir as tryMoveGridObjectToDir } from "./gamegrid.js";
import { getNewGridObject } from "./gridobject.js";
import { passMessageToWorker } from "../event_handler.js";

let renderer;
let turnTimer = 0;
let startedExecution = false;
/**
 * How many seconds a turn should take.
 * Commands are processed every turn.
 * NOTE: This should take long enough for
 * the player character to be able to move.
 */
const turnTimeSeconds = 1;
let currentCommand = null;
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
    renderer.onEndFunc = onEndMoveFunc;
    await renderer.init();
    
    return renderer;
}

/**
 * Used to set the next command to run. 
 * @param {*} command An object literal representing a command to run. Example: 
 * command = {command: "move", parameters: "oikea"} 
 */
export function setGameCommand(command) {
    currentCommand = command;
    console.log("set command")
    if (startedExecution == false) {
        startedExecution = true;
        turnTimer += turnTimeSeconds + 1;
    }
}

/**
 * Runs every frame.
 * @param {*} deltaTime The time since last frame in seconds. Used to make framerate independent logic. 
 */
function onUpdate(deltaTime) {
    if (turnTimer < turnTimeSeconds && currentCommand !== null) {
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
function processTurn() {
    if (currentCommand === null) {
        return;
    }
    let newCommand = currentCommand.data;
    if (tryMoveGridObjectToDir(pupu, commandDirs[newCommand.parameters])) {
        renderer.player.moveToDirection(commandDirs[newCommand.parameters]);
    } else {
        // Prevent bug that stops character movement completely if direction to move is invalid.
        // This is because the character move anim never finishes, so never gives
        // message to give another command.
        // Could be better but works for now.
        onEndMoveFunc();
    }
}

function onEndMoveFunc () {
    passMessageToWorker("return", "returning from game.js", currentCommand.sab)
    currentCommand = null;
    console.log("COMMAND");
}

export function resetGame () {
    initGrid(8, 8);
    pupu = getNewGridObject("pupu");
    addToGrid(pupu, 0, 0);
    turnTimer = 0;
    currentCommand = null;
    renderer.reset();
    startedExecution = false;
}

export function rendererToggleGrid() {
    renderer.toggleGrid();
}
