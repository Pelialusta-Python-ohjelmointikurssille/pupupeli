import { Constants, GetDirectionAsString } from "./commonstrings.js";
//I dont know how to make a Command interface in javascript that has nice syntax, so I just pretend that all classes in this file
//implements the interface Command. That just means that all these classes have the function "execute()" (and later, "undo()").

export class MoveCommand {
    constructor(grid, gridObject, dir, graphicsHandler) {
        this.grid = grid;
        this.gridObject = gridObject;
        this.dir = dir;
        this.graphicsHandler = graphicsHandler;
        this.moveStartPos = this.gridObject.getVector2Position();
    }

    execute() {
        let isSuccess = this.grid.moveGridObjectToDir(this.gridObject, this.dir);
        if (isSuccess) this.checkForObjects();
        let dirObj = { direction: GetDirectionAsString(this.dir), time: 0.6};
        if (isSuccess) {
            this.graphicsHandler.doAction(this.gridObject.id, Constants.MOVE_STR, dirObj);
        } else {
            this.graphicsHandler.doAction(this.gridObject.id, "failmove", dirObj);
        }

    }

    /**
     * Used to check the cell we are entering to see if anything happens.
     */
    checkForObjects() {
        let gridobjects = this.grid.getAdjacentObjectsAtDir(this.moveStartPos.x, this.moveStartPos.y, this.dir);
        for (let i = 0; i < gridobjects.length; i++) {
            if (gridobjects[i].type === Constants.COLLECTIBLE) {
                this.graphicsHandler.doAction(gridobjects[i].id, "hide", {time : 0.3});
                this.grid.removeFromGrid(gridobjects[i]);
            }
        }
    }

}