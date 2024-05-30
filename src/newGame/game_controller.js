import { getEventHandler } from "../index.js";
import { Game } from "./new_game.js";

//This file controls game. 
// - Creates new game instances (both logic and rendering)
// - receives commands and output with the game

var game;
var currentCommand;
var eventHandler;

export function initNewGame() {
    game = new Game();
    eventHandler = getEventHandler();
}

//Receives the command, expects a object of type 
// "{ data: data, sab: sab })" 
// where data is ? and sab is an SharedArrayBuffer.
export function giveCommand(command) {
    currentCommand = command;
    if (!game)  game = new Game();
    console.log(command);
    commandsDone()
}

export function commandsDone() {
    eventHandler.receiveMessage("return", "returning from game.js", currentCommand.sab);
}