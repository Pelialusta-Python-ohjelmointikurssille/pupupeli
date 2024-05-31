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
        this.animations.set("failmove", new AnimationProgress(0.5, this.onStartAnimation, this.onFinishAnimation, this, "failmove"));
    }

    onCreate() {
        super.onCreate();
    }

    onStartAnimation(name) {
        super.onStartAnimation(name);
    }

    onFinishAnimation(name) {
        super.onFinishAnimation(name);
        if (name === "move") {
            this.gridCellPosition.x += this.moveDirection.x;
            this.gridCellPosition.y += this.moveDirection.y;
        }
        this.isReady = true;
    }

    onUpdate(deltaTime) {
        super.onUpdate(deltaTime);
        if (this.animations.get("move").inProgress === true) {
            this.container.x = (this.screenPosition.x) + (this.animations.get("move").value * this.moveDirection.x * this.gridReference.gridScale);
            this.container.y = (this.screenPosition.y) + this.getJumpHeight(this.animations.get("move").value) + (this.animations.get("move").value * this.moveDirection.y * this.gridReference.gridScale);
        }
        if (this.animations.get("failmove").inProgress === true) {
            if (this.animations.get("failmove").value < 0.5) {
                this.container.x = (this.screenPosition.x) + (this.animations.get("failmove").value * this.moveDirection.x * this.gridReference.gridScale);
                this.container.y = (this.screenPosition.y) + this.getJumpHeight(this.animations.get("failmove").value) + (this.animations.get("failmove").value * this.moveDirection.y * this.gridReference.gridScale);   
            }
            if (this.animations.get("failmove").value > 0.5) {
                this.container.x = (this.screenPosition.x) + ((1 - this.animations.get("failmove").value) * this.moveDirection.x * this.gridReference.gridScale);
                this.container.y = (this.screenPosition.y) + this.getJumpHeight(this.animations.get("failmove").value) + ((1 - this.animations.get("failmove").value) * this.moveDirection.y * this.gridReference.gridScale);   
            }
        }
        if (this.isReady === true) {
            this.screenPosition = this.gridReference.gridToScreenCoordinates(this.gridCellPosition);
            this.container.x = (this.screenPosition.x);
            this.container.y = (this.screenPosition.y);
        }
    }

    doAction(actionId, actionData) {
        if(this.isReady === false) {
            return;
        }
        if (actionId === "move") {
            if (actionData.isSuccess === true) {
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
            } else {
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
                this.animations.get("failmove").start();
                this.isReady = false;
            }
        }
    }

    getJumpHeight(progress) {
        return -(Math.sin(Math.PI * progress)**0.75) * this.gridReference.gridScale * 0.5;
    }

    startMove(dir) {

    }
}


