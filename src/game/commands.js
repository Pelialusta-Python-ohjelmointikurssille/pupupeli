import { Constants, GetDirectionAsString } from "./commonstrings.js";
//I dont know how to make a Command interface in javascript that has nice syntax, so I just pretend that all classes in this file
//implements the interface Command. That just means that all these classes have the function "execute()" (and can easily implemet "undo()").
//Stuff to read if interested: 
//    https://refactoring.guru/design-patterns/command
//    https://gameprogrammingpatterns.com/command.html

/**
 * MoveCommand is created to execute the MoveCommand action in game logic and rendering.
 * Call execute() to complete the command. 
 * @grid The current grid used.
 * @gridObject The gridObject that is going to move.
 * @dir Direction the gridobject will move to. Use Direction from direction.js.
 * @graphicsHandler The current GraphicsHandler used.
 */
export class MoveCommand {
    constructor(grid, gridObject, dir, graphicsHandler) {
        this.grid = grid;
        this.gridObject = gridObject;
        this.dir = dir;
        this.graphicsHandler = graphicsHandler;
        this.moveStartPos = this.gridObject.getVector2Position();
        this.moveSpeed = 0.35;
        this.objectHideSpeed = 0.6;
    }

    /**
     * Executes the MoveCommand using the variables given in the constructor.
     */
    execute() {
        let isSuccess = this.grid.moveGridObjectToDir(this.gridObject, this.dir);
        if (isSuccess) this.#checkForObjects();
        let dirObj = { direction: GetDirectionAsString(this.dir), time: this.moveSpeed };
        if (isSuccess) {
            this.graphicsHandler.doAction(this.gridObject.id, Constants.MOVE_STR, dirObj);
        } else {
            this.graphicsHandler.doAction(this.gridObject.id, "failmove", dirObj);
        }

    }

    /**
     * Used to check the cell we are entering to see if anything happens. For example, collectibles are picked up.
     * Assumes that we are entering that cell.
     */
    #checkForObjects() {
        let gridobjects = this.grid.getAdjacentObjectsAtDir(this.moveStartPos.x, this.moveStartPos.y, this.dir);
        for (let i = 0; i < gridobjects.length; i++) {
            if (gridobjects[i].type === Constants.COLLECTIBLE) {
                go = gridobjects[i];
                this.graphicsHandler.doAction(go, "hide", { time: this.objectHideSpeed });
                this.grid.removeFromGrid(go);
            }
        }
    }

}