import { getEventHandler } from "../ui.js";
import { Game } from "./new_game.js";

//This file controls game. 
// - Creates new game instances (Game contains both logic and rendering)
// - handles game command input and output

var game;
var currentCommand;
var eventHandler;

export async function initNewGame() {
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

export function commandsDone() {
    eventHandler.postMessage({ type: "return", details: "returning from game.js", sab: currentCommand.sab });

}

export function getCanvas(){
    game.getCanvas();
}

export function resetGame() {
    game.resetGame();
    eventHandler = getEventHandler();
}