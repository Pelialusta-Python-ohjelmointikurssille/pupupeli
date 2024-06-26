import { AnimationProgress } from "./tweener/animation_progress.js";
import { Vector2 } from "../../vector.js";

export class FailMoveAnimation {
    constructor(pawnEntity, name, data) {
        this.pawnEntity = pawnEntity;
        this.data = data;
        this.progress = new AnimationProgress(data.time, this.onStart, this.onFinish, this, name);
        this.inProgress = false;
        this.name = name;
        this.moveDirection = null;
        if (this.data.direction != null) {
            this.moveDirection = Vector2.FromDirection(this.data.direction);
        }
    }

    start() {
        this.pawnEntity.updatePosition();
        this.progress.start();
        this.inProgress = true;
        this.pawnEntity.direction = this.data.direction
        this.pawnEntity.updateTextures();
    }

    increment(deltaTime) {
        if (this.inProgress === false) return;
        this.progress.increment(deltaTime);
        this.pawnEntity.fakeZPosition = this.getJumpHeight(this.progress.value);
        if (this.progress.value < 50) {
            this.pawnEntity.container.x = (
                this.pawnEntity.screenPosition.x +
                (this.progress.value * 0.01 * 0.75 * this.moveDirection.x * this.pawnEntity.gridReference.gridScale)
            );
            this.pawnEntity.container.y = (
                this.pawnEntity.screenPosition.y +
                this.pawnEntity.fakeZPosition +
                (this.progress.value * 0.01 * 0.75 * this.moveDirection.y * this.pawnEntity.gridReference.gridScale)
            );   
        }
        if (this.progress.value > 50 && this.progress.value < 100) {
            this.pawnEntity.container.x = (
                this.pawnEntity.screenPosition.x +
                ((100 - this.progress.value) * 0.01 * 0.75 * this.moveDirection.x * this.pawnEntity.gridReference.gridScale)
            );
            this.pawnEntity.container.y = (
                this.pawnEntity.screenPosition.y +
                this.pawnEntity.fakeZPosition +
                ((100 - this.progress.value)  * 0.01 * 0.75 * this.moveDirection.y * this.pawnEntity.gridReference.gridScale)
            );   
        }
    }

    skipToEnd() {
        this.progress.skipToEnd();
    }

    stop() {
        this.progress.stop();
        this.inProgress = false;
    }

    onStart() {
        this.pawnEntity.onStartAnimation(this.name);
    }

    onFinish() {
        this.pawnEntity.updatePosition();
        this.inProgress = false;
        this.pawnEntity.onFinishAnimation(this.name);
    }

    getJumpHeight(progress) {
        if (progress >= 100) progress = 100;
        return -(Math.sin(Math.PI * progress * 0.01)**0.75) * this.pawnEntity.gridReference.gridScale * 0.3;
    }
    
}