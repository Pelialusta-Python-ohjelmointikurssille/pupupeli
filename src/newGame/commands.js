import { Constants, GetDirectionAsString } from "./commonstrings.js";
//I dont know how to make a Command interface in javascript that has nice syntax, so I just pretend that all classes in this file
//implements the interface Command. That just means that all these classes have the function "execute()" (and later, "undo()").

export class MoveCommand {
    constructor(grid, gridObject, dir, graphicsHandler) {
        this.grid = grid;
        this.gridObject = gridObject;
        this.dir = dir;
        this.graphicsHandler = graphicsHandler;
    }

    execute() {
        let isSuccess = this.grid.moveGridObjectToDir(this.gridObject, this.dir);
        let dirObj = { isSuccess: isSuccess, direction: GetDirectionAsString(this.dir) };
        this.graphicsHandler.doAction(this.gridObject.id, Constants.MOVE_STR, dirObj);

    }

}