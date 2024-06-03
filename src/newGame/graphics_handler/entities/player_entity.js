import { GraphicsEntity } from "./graphics_entity.js";
import { Vector2 } from "../../../newGame/vector.js";
import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";
import { AnimationProgress } from "../move_tween.js";
import { GridObjectEntity } from "./grid_object_entity.js";

export class PlayerEntity extends GridObjectEntity {
    constructor(entityId, entityHandler, container, sprite, data) {
        super(entityId, entityHandler, container, sprite, data);
        this.moveDirection = new Vector2(0, 0);
        this.animations.set("move", new AnimationProgress(0.5, this.onStartAnimation, this.onFinishAnimation, this, "move"));
        this.animations.set("failmove", new AnimationProgress(0.5, this.onStartAnimation, this.onFinishAnimation, this, "failmove"));
        this.type = "player";
    }

    onCreate() {
        super.onCreate();
        this.screenPosition = this.gridReference.gridToScreenCoordinates(this.gridCellPosition);
        this.container.x = this.screenPosition.x + this.fakeZPosition;
        this.container.y = this.screenPosition.y + this.fakeZPosition;
        this.sprite.y -= this.gridReference.gridScale * 0.1;
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
        this.screenPosition = this.gridReference.gridToScreenCoordinates(this.gridCellPosition);
        this.container.x = (this.screenPosition.x);
        this.container.y = (this.screenPosition.y);
    }

    onUpdate(deltaTime) {
        super.onUpdate(deltaTime);
        if (this.animations.get("move").inProgress === true) {
            this.fakeZPosition = this.getJumpHeight(this.animations.get("move").value);
            this.container.x = this.screenPosition.x + (this.animations.get("move").value * this.moveDirection.x * this.gridReference.gridScale);
            this.container.y = this.screenPosition.y + this.fakeZPosition + (this.animations.get("move").value * this.moveDirection.y * this.gridReference.gridScale);
        }
        if (this.animations.get("failmove").inProgress === true) {
            this.fakeZPosition = this.getJumpHeight(this.animations.get("failmove").value);
            if (this.animations.get("failmove").value < 0.5) {
                this.container.x = this.screenPosition.x + (this.animations.get("failmove").value * 0.5 * this.moveDirection.x * this.gridReference.gridScale);
                this.container.y = this.screenPosition.y + this.fakeZPosition + (this.animations.get("failmove").value*  0.5 * this.moveDirection.y * this.gridReference.gridScale);   
            }
            if (this.animations.get("failmove").value > 0.5 && this.animations.get("failmove").value < 1) {
                this.container.x = this.screenPosition.x + ((1 - this.animations.get("failmove").value)* 0.5 * this.moveDirection.x * this.gridReference.gridScale);
                this.container.y = this.screenPosition.y + this.fakeZPosition + ((1 - this.animations.get("failmove").value) * 0.5 * this.moveDirection.y * this.gridReference.gridScale);   
            }
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
        if (progress >= 1) progress = 1;
        return -(Math.sin(Math.PI * progress)**0.75) * this.gridReference.gridScale * 0.5;
    }

    startMove(dir) {

    }
}


