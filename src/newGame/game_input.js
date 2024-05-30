import { getEventHandler } from "../index.js";
import { Game } from "./new_game.js";

var game;
var currentCommand;
var eventHandler;

export function initGameInput() {
    //DO NOT INIT NEWGAME HERE, but do it for now.
    //IMO, when you make a new new game, give this file the reference
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