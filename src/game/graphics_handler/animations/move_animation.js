import { AnimationProgress } from "../animation_progress.js";
import { Vector2 } from "../../vector.js";
import { Constants } from "../../commonstrings.js";

export class MoveAnimation {
    constructor(gridObject, name, data) {
        this.gridObject = gridObject;
        this.data = data;
        this.progress = new AnimationProgress(data.time, this.onStart, this.onFinish, this, name);
        this.inProgress = false;
        this.name = name;
        this.moveDirection = null;
        if (this.data.direction === Constants.DOWN_STR) {
            this.moveDirection = new Vector2(0, 1);
        }
        if (this.data.direction === Constants.LEFT_STR) {
            this.moveDirection = new Vector2(-1, 0);
        }
        if (this.data.direction === Constants.RIGHT_STR) {
            this.moveDirection = new Vector2(1, 0);
        }
        if (this.data.direction === Constants.UP_STR) {
            this.moveDirection = new Vector2(0, -1);
        }
    }

    start() {
        this.gridObject.screenPosition = this.gridObject.gridReference.gridToScreenCoordinates(this.gridObject.gridCellPosition);
        this.gridObject.container.x = this.gridObject.screenPosition.x + this.gridObject.fakeZPosition;
        this.gridObject.container.y = this.gridObject.screenPosition.y + this.gridObject.fakeZPosition;
        this.progress.start();
        this.inProgress = true;
        this.gridObject.swapTextureToMoveDir(this.data.direction);
    }

    increment(deltaTime) {
        if (this.inProgress === false) return;
        this.progress.increment(deltaTime);
        this.gridObject.fakeZPosition = this.getJumpHeight(this.progress.value);
        this.gridObject.container.x = this.gridObject.screenPosition.x + (this.progress.value * this.moveDirection.x * this.gridObject.gridReference.gridScale);
        this.gridObject.container.y = this.gridObject.screenPosition.y + this.gridObject.fakeZPosition + (this.progress.value * this.moveDirection.y * this.gridObject.gridReference.gridScale);
    }

    stop() {
        this.progress.stop();
        this.inProgress = false;
    }

    skipToEnd() {
        this.progress.skipToEnd();
    }

    onStart() {
        this.gridObject.onStartAnimation(this.name);
    }

    onFinish() {
        this.gridObject.gridCellPosition.x += this.moveDirection.x;
        this.gridObject.gridCellPosition.y += this.moveDirection.y;
        this.gridObject.screenPosition = this.gridObject.gridReference.gridToScreenCoordinates(this.gridObject.gridCellPosition);
        this.gridObject.container.x = this.gridObject.screenPosition.x + this.gridObject.fakeZPosition;
        this.gridObject.container.y = this.gridObject.screenPosition.y + this.gridObject.fakeZPosition;
        this.inProgress = false;
        
        this.gridObject.onFinishAnimation(this.name);
        console.log(`FINISH ANIM move on player`);
        console.log(this.gridObject.container.position);
        console.log(this.progress.value)
        console.log(this.gridObject.fakeZPosition)
    }

    getJumpHeight(progress) {
        if (progress >= 1) progress = 1;
        return -(Math.sin(Math.PI * progress) ** 0.75) * this.gridObject.gridReference.gridScale * 0.5;
    }

}