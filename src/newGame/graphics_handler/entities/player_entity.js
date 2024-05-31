import { GraphicsEntity } from "./graphics_entity.js";
import { Vector2 } from "../../../game/vector.js";
import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";
import { MoveTween } from "../move_tween.js";
import { GridObjectEntity } from "./grid_object_entity.js";

export class PlayerEntity extends GridObjectEntity {
    constructor(entityId, entityHandler, container, sprite, data) {
        super(entityId, entityHandler, container, sprite, data);
        this.mvtween = new MoveTween(0.8, this.onFinishTween, this);
        this.gridReference = entityHandler.getGridObject();
        this.moveDirection = new Vector2(0, 0);
        this.gridCellPosition = data.position;
    }

    getJumpHeigh(progress) {
        return -(Math.sin(Math.PI * progress)**0.75) * 80 * 0.5;
    }

    onCreate() {
        super.onCreate();
        this.sprite.anchor.set(0.5);
        this.sprite.height = 64;
        this.sprite.width = 64;
        this.sprite.x += 40;
        this.sprite.y += 40;
    }

    onFinishTween() {
        this.gridCellPosition.x += this.moveDirection.x;
        this.gridCellPosition.y += this.moveDirection.y;
    }

    onUpdate(deltaTime) {
        super.onUpdate(deltaTime);
        this.mvtween.increment(deltaTime);
        if (this.mvtween.value <= 1 && this.mvtween.inProgress === true) {
            this.container.x = (this.gridCellPosition.x * 80) + (this.mvtween.value * 80 * this.moveDirection.x);
            this.container.y = (this.gridCellPosition.y * 80) + this.getJumpHeigh(this.mvtween.value) + (this.mvtween.value * 80 * this.moveDirection.y);
        }
        if (this.mvtween.inProgress == false) {
            this.container.x = this.gridCellPosition.x * 80;
            this.container.y = this.gridCellPosition.y * 80;
        }
    }

    doAction(actionId, actionData) {
        if (actionId == "move") {
            if (actionData.direction == "down") {
                this.moveDirection = new Vector2(0, 1)
            }
            if (actionData.direction == "left") {
                this.moveDirection = new Vector2(-1, 0)
            }
            if (actionData.direction == "right") {
                this.moveDirection = new Vector2(1, 0)
            }
            if (actionData.direction == "up") {
                this.moveDirection = new Vector2(0, -1)
            }
            this.mvtween.start();
        }
    }

    startMove(dir) {

    }
}


