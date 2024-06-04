import { AnimationProgress } from "../move_tween.js";
import { Vector2 } from "../../vector.js";

export class UnhideAnimation {
    constructor(gridObject, name, data) {
        this.gridObject = gridObject;
        this.data = data;
        this.progress = new AnimationProgress(data.time, this.onStart, this.onFinish, this, name);
        this.inProgress = false;
        this.name = name;
    }

    start() {
        this.progress.start();
        this.inProgress = true;
        this.gridObject.screenPosition = this.gridObject.gridReference.gridToScreenCoordinates(this.gridObject.gridCellPosition);
        this.gridObject.container.x = this.gridObject.screenPosition.x + this.gridObject.fakeZPosition;
        this.gridObject.container.y = this.gridObject.screenPosition.y + this.gridObject.fakeZPosition;
    }

    increment(deltaTime) {
        if (this.inProgress === false) return;
        this.progress.increment(deltaTime);
    }

    stop() {
        this.progress.stop();
        this.inProgress = false;
        this.gridObject.container.rotation = 0;
        this.gridObject.container.alpha = 0;
    }

    onStart() {
        this.gridObject.container.rotation = 0;
        this.gridObject.container.alpha = 0;
        this.gridObject.onStartAnimation(this.name);
    }

    onFinish() {
        this.gridObject.container.alpha = 1;
        this.inProgress = false;
        this.gridObject.onFinishAnimation(this.name);
    }

    getJumpHeight(progress) {
        if (progress >= 1) progress = 1;
        return -(Math.sin(Math.PI * progress)**0.75) * this.gridObject.gridReference.gridScale * 0.5;
    }
    
}