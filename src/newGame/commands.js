import { Direction } from "./direction.js";

//I dont know how to make a Command interface in javascript that has nice syntax, so I just pretend that all classes in this file
//implements the interface Command. That just means that all these classes have the function "execute()" (and later, "undo()").

export class MoveCommand {
    constructor(grid, gridObject, dir) {
        this.grid = grid;
        this.gridObject = gridObject;
        this.dir = dir;
    }

    execute() {
        console.log("command executing!");
        this.grid.moveGridObjectToDir(this.gridObject, this.dir);
    }

}