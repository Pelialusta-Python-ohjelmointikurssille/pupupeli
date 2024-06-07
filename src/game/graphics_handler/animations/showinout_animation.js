import { AnimationProgress } from "../animation_progress.js";

export class ShowInOutAnimation {
    constructor(entity, name, data) {
        this.entity = entity;
        this.data = data;
        this.progress = new AnimationProgress(data.time, this.onStart, this.onFinish, this, name);
        this.inProgress = false;
        this.name = name;
        this.currentAnimation = null;

        this.scaleStart = 0.05;
        this.scaleEnd = 0.95;
    }

    start() {
        this.progress.start();
        this.inProgress = true;
        this.entity.container.alpha = 1;
    }

    increment(deltaTime) {
        if (this.inProgress === false) return;
        this.progress.increment(deltaTime);
        if (this.progress.value < this.scaleStart && this.progress.value > 0) {
            this.entity.container.scale = ((this.progress.value) * (1 / this.scaleStart));
        }
        if (this.progress.value >= this.scaleStart && this.progress.value <= this.scaleEnd) {
            this.entity.container.scale = 1;
        }
        if (this.progress.value > this.scaleEnd) {
            this.entity.container.scale = 1 - ((this.progress.value - this.scaleEnd) * (1/this.scaleEnd));
        }
    }

    stop() {
        this.progress.stop();
        this.inProgress = false;
        this.entity.container.rotation = 0;
        this.entity.container.alpha = 0;
        this.entity.container.scale = 1;
    }

    onStart() {
        this.entity.container.alpha = 1;
        this.entity.onStartAnimation(this.name);
    }

    onFinish() {
        this.entity.container.alpha = 0;
        this.inProgress = false;
        this.entity.onFinishAnimation(this.name);
        this.entity.container.rotation = 0;
        this.entity.container.scale = 1;
    }

    onUpdate(deltaTime) {
        super.onUpdate(deltaTime);
        if (this.currentAnimation != null) {
            this.currentAnimation.increment(deltaTime);
        }
    } 
}