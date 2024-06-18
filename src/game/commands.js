import { Constants } from "./commonstrings.js";
import { SKIN_BUNDLES } from "./graphics_handler/manifests/skin_manifest.js";
import { Vector2 } from "./vector.js";
import { AnimationNames } from "./graphics_handler/manifests/animation_manifest.js";
//Trying to implement the Command pattern in javascript. Interfaces in JS are so janky that I just made classes.
//Maybe do a base Command class and extend that, if you want. 
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
    constructor(grid, gridObject, dir, graphicsHandler, game) {
        this.grid = grid;
        this.gridObject = gridObject;
        this.dir = dir;
        this.graphicsHandler = graphicsHandler;
        this.game = game;
        this.moveStartPos = this.gridObject.getVector2Position();
        this.moveSpeed = 0.4;
        this.objectHideSpeed = 0.6;
    }

    /**
     * Executes the MoveCommand using the variables given in the constructor.
     */
    execute() {
        let isSuccess = this.grid.moveGridObjectToDir(this.gridObject, this.dir);
        if (isSuccess) this.#checkForObjects();
        let dirObj = { direction: this.dir, time: this.moveSpeed };
        if (isSuccess) {
            this.graphicsHandler.doAction(this.gridObject.id, AnimationNames.PAWN_MOVE, dirObj);
        } else {
            this.graphicsHandler.doAction(this.gridObject.id, AnimationNames.PAWN_FAIL_MOVE, dirObj);
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
                this.graphicsHandler.doAction(go.id, AnimationNames.PAWN_HIDE, { time: this.objectHideSpeed });
                
                this.grid.removeFromGrid(go);
            }
            if (gridobjects[i].type === Constants.QUESTION_COLLECTIBLE) {
                let go = gridobjects[i];
                this.graphicsHandler.doAction(go.id, AnimationNames.PAWN_HIDE, { time: this.objectHideSpeed });
                
                this.game.askQuestionMessage("HELLO?");
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
        // TEMPORARY HACK!! REPLACE THIS!
        //this.graphicsHandler.doAction(this.gridObject.id, "say", { time: this.time, text: this.sayString });

        this.graphicsHandler.destroyTextBoxes();
        let textboxId = crypto.randomUUID().toString();
        this.graphicsHandler.createEntity(
            textboxId,
            "textbox",
            {
                targetPosition: new Vector2(this.gridObject.cell.x * 128 + 64, this.gridObject.cell.y * 128 + 64),
                text: this.sayString
            },
            SKIN_BUNDLES["speech_bubble"]
        );
        this.graphicsHandler.doAction(textboxId, AnimationNames.APPEAR_HIDE, { time: 2 });
    }
}

export class AskCommand {
    constructor(gridObject, graphicsHandler, askString) {
        this.gridObject = gridObject;
        this.graphicsHandler = graphicsHandler;
        this.time = 0.1;
        this.askString = askString;
    }

    execute() {
        // TEMPORARY HACK!! REPLACE THIS!
        //this.graphicsHandler.doAction(this.gridObject.id, "say", { time: this.time, text: this.sayString });
        this.graphicsHandler.destroyTextBoxes();
        let textboxId = crypto.randomUUID().toString();
        this.graphicsHandler.createEntity(
            textboxId,
            "textbox",
            {
                position: new Vector2(512, 980),
                size: new Vector2(1000, 200),
                targetPosition: new Vector2(this.gridObject.cell.x * 128 + 64, this.gridObject.cell.y * 128 + 64),
                text: this.askString
            },
            SKIN_BUNDLES["speech_bubble"]
        );
        //this.graphicsHandler.doAction(textboxId, "ask", { time: 2 });
    }
}