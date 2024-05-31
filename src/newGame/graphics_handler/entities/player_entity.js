import { GraphicsEntity } from "./graphics_entity.js";
import { Vector2 } from "../../../game/vector.js";
import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";
import { AnimationProgress } from "../move_tween.js";
import { GridObjectEntity } from "./grid_object_entity.js";

export class PlayerEntity extends GridObjectEntity {
    constructor(entityId, entityHandler, container, sprite, data) {
        super(entityId, entityHandler, container, sprite, data);
        this.moveDirection = new Vector2(0, 0);
        this.animations.set("move", new AnimationProgress(0.5, this.onStartAnimation, this.onFinishAnimation, this, "move"));
    }

    onCreate() {
        super.onCreate();
    }

    onStartAnimation(name) {
        super.onStartAnimation(name);
    }

    onFinishAnimation(name) {
        super.onFinishAnimation(name);
        this.gridCellPosition.x += this.moveDirection.x;
        this.gridCellPosition.y += this.moveDirection.y;
        this.isReady = true;
    }

    onUpdate(deltaTime) {
        super.onUpdate(deltaTime);
        if (this.animations.get("move").inProgress === true) {
            this.container.x = (this.screenPosition.x) + (this.animations.get("move").value * this.moveDirection.x * this.gridReference.gridScale);
            this.container.y = (this.screenPosition.y) + this.getJumpHeight(this.animations.get("move").value) + (this.animations.get("move").value * this.moveDirection.y * this.gridReference.gridScale);
        }
        if (this.animations.get("move").inProgress === false) {
            this.screenPosition = this.gridReference.gridToScreenCoordinates(this.gridCellPosition);
            this.container.position.x = this.screenPosition.x;
            this.container.position.y = this.screenPosition.y;
        }
    }

    doAction(actionId, actionData) {
        if (actionId === "move") {
            if (actionData.direction === "down") {
                this.moveDirection = new Vector2(0, 1)
            }
            if (actionData.direction === "left") {
                this.moveDirection = new Vector2(-1, 0)
            }
            if (actionData.direction === "right") {
                this.moveDirection = new Vector2(1, 0)
            }
            if (actionData.direction === "up") {
                this.moveDirection = new Vector2(0, -1)
            }
            this.animations.get("move").start();
            this.isReady = false;
        }
    }

    getJumpHeight(progress) {
        return -(Math.sin(Math.PI * progress)**0.75) * this.gridReference.gridScale * 0.5;
    }

    startMove(dir) {

    }
}


