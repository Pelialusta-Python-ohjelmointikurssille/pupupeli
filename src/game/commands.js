import { Constants, GetDirectionAsString } from "./commonstrings.js";
//implements the interface Command. That just means that all these classes have the function "execute()" (and can easily implement "undo()").
//Stuff to read if interested: 
//    https://refactoring.guru/design-patterns/command
//    https://gameprogrammingpatterns.com/command.html


/**
 * The interface for commands
 * disabling lint here
 */
// eslint-disable-next-line no-unused-vars
const Command = {
    execute: function () { },
    //undo: function () { }, maybe someday
};

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
                let go = gridobjects[i];
                this.graphicsHandler.doAction(go.id, "hide", { time: this.objectHideSpeed });
                this.grid.removeFromGrid(go);
            }
        }
    }

}

export class SayCommand {
    constructor(gridObject, graphicsHandler, sayString) {
        this.gridObject = gridObject;
        this.graphicsHandler = graphicsHandler;
        this.time = 2;
        this.sayString = sayString;
    }

    execute() {
        this.graphicsHandler.doAction(this.gridObject.id, "say", { time: this.time, text: this.sayString });
    }
}

export class AskCommand {
    constructor(gridObject, graphicsHandler, askString) {
        this.gridObject = gridObject;
        this.graphicsHandler = graphicsHandler;
        this.time = 2;
        this.askString = askString;
    }

    execute() {
        this.graphicsHandler.doAction(this.gridObject.id, "ask", { time: this.time, text: this.askString });
    }
}