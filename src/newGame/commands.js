import { Direction } from "./direction.js";

//I dont know how to make a Command interface in javascript that has nice syntax, so I just pretend that all classes in this file
//implements the interface Command. That just means that all these calsses have the function "execute()" (and later, "undo()").

export function getMoveCommand() {

}

export class MoveCommand {
    constructor(grid, gridObject, dir) {
        console.log("lol " + dir);
    }

}