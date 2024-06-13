import { AnimationProgress } from "./tweener/animation_progress.js";
import { Vector2 } from "../../vector.js";

export class MoveAnimation {
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
        this.pawnEntity.swapTextureToMoveDir(this.data.direction);
    }

    increment(deltaTime) {
        if (this.inProgress === false) return;
        this.progress.increment(deltaTime);
        this.pawnEntity.fakeZPosition = this.getJumpHeight(this.progress.value);
        this.pawnEntity.container.x = (
            this.pawnEntity.screenPosition.x +
            (this.progress.value * 0.01 * this.moveDirection.x * this.pawnEntity.gridReference.gridScale)
        );
        this.pawnEntity.container.y = (
            this.pawnEntity.screenPosition.y +
            this.pawnEntity.fakeZPosition +
            (this.progress.value * 0.01 * this.moveDirection.y * this.pawnEntity.gridReference.gridScale)
        );
    }

    stop() {
        this.progress.stop();
        this.inProgress = false;
    }

    skipToEnd() {
        this.progress.skipToEnd();
    }

    onStart() {
        this.pawnEntity.onStartAnimation(this.name);
    }

    onFinish() {
        this.pawnEntity.gridPosition.x += this.moveDirection.x;
        this.pawnEntity.gridPosition.y += this.moveDirection.y;
        this.pawnEntity.updatePosition();
        this.inProgress = false;
        
        this.pawnEntity.onFinishAnimation(this.name);
    }

    getJumpHeight(progress) {
        if (progress >= 100) progress = 100;
        return -(Math.sin(Math.PI * progress * 0.01) ** 0.75) * this.pawnEntity.gridReference.gridScale * 0.5;
    }

}