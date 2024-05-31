import { GraphicsEntity } from "./graphics_entity.js";
import { Vector2 } from "../../../game/vector.js";
import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";
import { MoveTween } from "../move_tween.js";
import { GridObjectEntity } from "./grid_object_entity.js";

export class PlayerEntity extends GridObjectEntity {
    constructor(entityId, entityHandler, container, sprite, data) {
        super(entityId, entityHandler, container, sprite, data);
        this.moveDirection = new Vector2(0, 0);
        this.gridCellPosition = new Vector2(0, 0);
        if (data == null) {
            return;
        }
        if (data.position == null) {
            return;
        }
        this.gridCellPosition = data.position;
    }

    onCreate() {
        super.onCreate();
    }

    onFinishAnimation() {
        this.gridCellPosition.x += this.moveDirection.x;
        this.gridCellPosition.y += this.moveDirection.y;
    }

    onUpdate(deltaTime) {
        super.onUpdate(deltaTime);
        if (this.animProgress.value <= 1 && this.animProgress.inProgress === true) {
            this.container.x = (this.gridCellPosition.x * 80) + (this.animProgress.value * 80 * this.moveDirection.x);
            this.container.y = (this.gridCellPosition.y * 80) + this.getJumpHeigh(this.animProgress.value) + (this.animProgress.value * 80 * this.moveDirection.y);
        }
        if (this.animProgress.inProgress == false) {
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
            this.animProgress.start();
        }
    }

    getJumpHeigh(progress) {
        return -(Math.sin(Math.PI * progress)**0.75) * 80 * 0.5;
    }

    startMove(dir) {

    }
}


