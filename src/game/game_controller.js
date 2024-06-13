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
 */
export function commandsDone() {
    if (currentCommand === undefined) {
        console.error("current command undefined");
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

export function notifyGameWon() {
    onTaskComplete();
}

export function setTheme(theme) {
    game.setTheme(theme); 
}

export function toggleGrid() {
    game.toggleGrid();
}