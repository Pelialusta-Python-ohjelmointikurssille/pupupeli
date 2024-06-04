import { AnimationProgress } from "../animation_progress.js";
import { Vector2 } from "../../vector.js";

export class FailMoveAnimation {
    constructor(gridObject, name, data) {
        this.gridObject = gridObject;
        this.data = data;
        this.progress = new AnimationProgress(data.time, this.onStart, this.onFinish, this, name);
        this.inProgress = false;
        this.name = name;
        this.moveDirection = null;
        if (this.data.direction === "down") {
            this.moveDirection = new Vector2(0, 1);
        }
        if (this.data.direction === "left") {
            this.moveDirection = new Vector2(-1, 0);
        }
        if (this.data.direction === "right") {
            this.moveDirection = new Vector2(1, 0);
        }
        if (this.data.direction === "up") {
            this.moveDirection = new Vector2(0, -1);
        }
    }

    start() {
        this.gridObject.screenPosition = this.gridObject.gridReference.gridToScreenCoordinates(this.gridObject.gridCellPosition);
        this.gridObject.container.x = this.gridObject.screenPosition.x + this.gridObject.fakeZPosition;
        this.gridObject.container.y = this.gridObject.screenPosition.y + this.gridObject.fakeZPosition;
        this.progress.start();
        this.inProgress = true;
    }

    increment(deltaTime) {
        if (this.inProgress === false) return;
        this.progress.increment(deltaTime);
        this.gridObject.fakeZPosition = this.getJumpHeight(this.progress.value);
        if (this.progress.value < 0.5) {
            this.gridObject.container.x = this.gridObject.screenPosition.x + (this.progress.value * 0.75 * this.moveDirection.x * this.gridObject.gridReference.gridScale);
            this.gridObject.container.y = this.gridObject.screenPosition.y + this.gridObject.fakeZPosition + (this.progress.value * 0.75 * this.moveDirection.y * this.gridObject.gridReference.gridScale);   
        }
        if (this.progress.value > 0.5 && this.progress.value < 1) {
            this.gridObject.container.x = this.gridObject.screenPosition.x + ((1 - this.progress.value) * 0.75 * this.moveDirection.x * this.gridObject.gridReference.gridScale);
            this.gridObject.container.y = this.gridObject.screenPosition.y + this.gridObject.fakeZPosition + ((1 - this.progress.value) * 0.75 * this.moveDirection.y * this.gridObject.gridReference.gridScale);   
        }
    }

    stop() {
        this.progress.stop();
        this.inProgress = false;
    }

    onStart() {
        this.gridObject.onStartAnimation(this.name);
    }

    onFinish() {
        this.gridObject.screenPosition = this.gridObject.gridReference.gridToScreenCoordinates(this.gridObject.gridCellPosition);
        this.gridObject.container.x = this.gridObject.screenPosition.x + this.gridObject.fakeZPosition;
        this.gridObject.container.y = this.gridObject.screenPosition.y + this.gridObject.fakeZPosition;
        this.inProgress = false;
        this.gridObject.onFinishAnimation(this.name);
    }

    getJumpHeight(progress) {
        if (progress >= 1) progress = 1;
        return -(Math.sin(Math.PI * progress)**0.75) * this.gridObject.gridReference.gridScale * 0.3;
    }
    
}