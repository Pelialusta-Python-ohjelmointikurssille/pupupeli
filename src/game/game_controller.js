import { onTaskComplete } from "../ui/ui.js";
import { Game } from "./game.js";
import { postMessage } from "../event_handler.js";

//This file controls game. 
// - Creates new game instances (Game contains both logic and rendering)
// - handles game command input and output

var game;
var currentCommand;


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

export function getCanvas() {
    game.getCanvas();
}

export function resetGame() {
    game.resetGame();
}

export function notifyGameWon(won) {
    onTaskComplete(won);
}

export function setTheme(theme) {
    game.setTheme(theme);
}

export function toggleGrid() {
    game.toggleGrid();
}

export function toggleTrail() {
    game.toggleTrail();
}

export function createObject(commandParameters) {
    let name = commandParameters[0]
    let x = commandParameters[1];
    let y = commandParameters[2];
    game.createNewPlayerCreatedGridObject(name, x, y);
}

export function destroyObject(commandParameters) {
    let x = commandParameters[0];
    let y = commandParameters[1];
    game.destroyObject(x, y);
}