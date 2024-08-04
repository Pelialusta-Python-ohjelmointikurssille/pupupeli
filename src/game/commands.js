import { Constants } from "./commonstrings.js";
import { SKIN_BUNDLES } from "./graphics_handler/manifests/skin_manifest.js";
import { Vector2 } from "./vector.js";
import { AnimationNames } from "./graphics_handler/manifests/animation_manifest.js";
import { requestInputFromGame } from "./game_input_controller.js";
import { getRandomUUID } from "./uuid_generator.js";
//Trying to implement the Command pattern in javascript. Interfaces in JS are so janky that I just made classes.
//Maybe do a base Command class and extend that, if you want. 
//    https://refactoring.guru/design-patterns/command
//    https://gameprogrammingpatterns.com/command.html
//Idea is that the command is given everything it needs in constructor,
//and then executed in execute(). Then it's easy to add undo in the future if needed, because you can save the objects executed in order.
//Currently there are couple of commands (creating and destroying objects) that aren't done this way, but undo function was never asked
//by the customer either.

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
        this.moveSpeed = 0.4;
        this.objectHideSpeed = 0.6;
        this.moveSpeedModifier = 1;
    }

    /**
     * Executes the MoveCommand using the variables given in the constructor.
     */
    execute(speedModifier) {
        this.moveSpeedModifier = speedModifier;
        let isSuccess = this.grid.moveGridObjectToDir(this.gridObject, this.dir);
        if (isSuccess) this.reactToObjects();
        let dirObj = { direction: this.dir, time: this.moveSpeed * speedModifier};
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
    reactToObjects() {
        let gridobjects = this.grid.getAdjacentObjectsAtDir(this.moveStartPos.x, this.moveStartPos.y, this.dir);
        for (let i = 0; i < gridobjects.length; i++) {
            if (gridobjects[i].type === Constants.COLLECTIBLE) {
                this.reactToCollectibles(gridobjects[i]);
            }
            else if (gridobjects[i].type === Constants.QUESTION_COLLECTIBLE) {
                this.reactToQuestionCollectible(gridobjects[i]);
            }
        }
    }

    /**
     * Handles what happens when player moves to a cell containing a collectible
     * @param {*} collectibleGO 
     */
    reactToCollectibles(collectibleGO) {
        this.graphicsHandler.doAction(collectibleGO.id, AnimationNames.PAWN_HIDE, { time: this.objectHideSpeed * this.moveSpeedModifier });
        this.grid.removeFromGrid(collectibleGO);
    }

    /**
     * Handles what happens when player moves to a cell containing a Question Collectible
     * @param {*} go 
     */
    reactToQuestionCollectible(go) {
        this.graphicsHandler.doAction(go.id, AnimationNames.PAWN_HIDE, { time: this.objectHideSpeed * this.moveSpeedModifier });
        this.grid.removeFromGrid(go);

        requestInputFromGame();
        this.graphicsHandler.destroyTextBoxes();
        let textboxId = crypto.randomUUID().toString();
        this.graphicsHandler.createEntity(
            textboxId,
            "textbox",
            {
                position: new Vector2(512, 940),
                size: new Vector2(1000, 200),
                targetPosition: new Vector2(this.gridObject.cell.x * 128 + 64, this.gridObject.cell.y * 128 + 64),
                text: "Testikysymys?",
                alignTextTop: true,
                useWorldCoordinates: false
            },
            SKIN_BUNDLES["speech_bubble"]
        );
    }

}

/**
 * Handles drawing a speech bubble above the player containing the sayString
 */
export class SayCommand {
    constructor(gridObject, graphicsHandler, sayString) {
        this.gridObject = gridObject;
        this.graphicsHandler = graphicsHandler;
        this.time = 2;
        this.sayString = sayString;
    }

    execute(speedModifier) {
        this.graphicsHandler.destroyTextBoxes();
        let textboxId = getRandomUUID();
        this.graphicsHandler.createEntity(
            textboxId,
            "textbox",
            {
                targetPosition: new Vector2(this.gridObject.cell.x * 128 + 64, this.gridObject.cell.y * 128 + 64),
                text: this.sayString
            },
            SKIN_BUNDLES["speech_bubble"]
        );
        this.graphicsHandler.doAction(textboxId, AnimationNames.APPEAR_HIDE, { time: 2 * speedModifier });
    }
}

/**
 * Handles drawing a speech bubble above the player containing askString and asking player for input
 */
export class AskCommand {
    constructor(gridObject, graphicsHandler, askString) {
        this.gridObject = gridObject;
        this.graphicsHandler = graphicsHandler;
        this.time = 0.1;
        this.askString = askString;
    }

    execute(speedModifier) {
        this.graphicsHandler.destroyTextBoxes();
        let textboxId = getRandomUUID();
        this.graphicsHandler.createEntity(
            textboxId,
            "textbox",
            {
                position: new Vector2(512, 915),
                size: new Vector2(1000, 200),
                targetPosition: new Vector2(this.gridObject.cell.x * 128 + 64, this.gridObject.cell.y * 128 + 64),
                text: this.askString,
                alignTextTop: true,
                useWorldCoordinates: false
            },
            SKIN_BUNDLES["speech_bubble"]
        );
    }
}