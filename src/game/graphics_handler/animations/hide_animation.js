import { AnimationProgress } from "./tweener/animation_progress.js";

export class HideAnimation {
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
        this.gridObject.screenPosition = this.gridObject.gridReference.gridToScreenCoordinates(this.gridObject.gridPosition);
        this.gridObject.container.x = this.gridObject.screenPosition.x + this.gridObject.fakeZPosition;
        this.gridObject.container.y = this.gridObject.screenPosition.y + this.gridObject.fakeZPosition;
    }

    increment(deltaTime) {
        if (this.inProgress === false) return;
        this.progress.increment(deltaTime);
        if (this.progress.value > 0.5) {
            this.gridObject.container.rotation += 10 * deltaTime;
            this.gridObject.container.scale = 1 - ((this.progress.value - 0.5) * 2);
        }
    }

    stop() {
        this.progress.stop();
        this.inProgress = false;
        this.gridObject.container.rotation = 0;
        this.gridObject.container.alpha = 1;
        this.gridObject.container.scale = 1;
    }

    skipToEnd() {
        this.progress.skipToEnd();
    }

    onStart() {
        this.gridObject.container.alpha = 1;
        this.gridObject.onStartAnimation(this.name);
    }

    onFinish() {
        this.gridObject.container.alpha = 0;
        this.inProgress = false;
        this.gridObject.onFinishAnimation(this.name);
        this.gridObject.container.rotation = 0;
        this.gridObject.container.scale = 1;
    }

    getJumpHeight(progress) {
        if (progress >= 1) progress = 1;
        return -(Math.sin(Math.PI * progress)**0.75) * this.gridObject.gridReference.gridScale * 0.5;
    }
    
}