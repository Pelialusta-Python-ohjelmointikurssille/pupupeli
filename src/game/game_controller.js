import { getEventHandler, onTaskComplete } from "../ui.js";
import { Game } from "./game.js";

//This file controls game. 
// - Creates new game instances (Game contains both logic and rendering)
// - handles game command input and output

var game;
var currentCommand;
var eventHandler;


export async function initGame() {
    game = new Game();
    await game.init();
    eventHandler = getEventHandler();
    return game.getCanvas();
}

//Receives the command, expects a object of type 
// "{ data: data, sab: sab })" 
// where data is ? and sab is an SharedArrayBuffer.
export function giveCommand(dirtyCommand) {
    game.receiveInput(dirtyCommand.data.command, dirtyCommand.data.parameters);
    currentCommand = dirtyCommand;
}

/**
 * Called by the Game class when game commands are done. 
 */
export function commandsDone() {
    console.log("command: " + currentCommand);
    if (currentCommand == null) return;
    eventHandler.postMessage({ type: "return", details: "returning from game.js", sab: currentCommand.sab });
}

export function getCanvas() {
    game.getCanvas();
}

export function resetGame() {
    game.resetGame();
    eventHandler = getEventHandler();
}

export function notifyGameWon() {
    onTaskComplete();
}

export function toggleGrid() {
    game.toggleGrid();
}