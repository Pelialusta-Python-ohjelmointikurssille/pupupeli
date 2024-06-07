
export class GraphicsEntity {
    constructor(entityUUID, entityHandler, pixiContainer, sprite, entityData) {
        this.entityId = entityUUID;
        this.entityHandler = entityHandler;
        this.container = pixiContainer;
        this.sprite = sprite;
        this.isReady = true;
        this.data = entityData;
        this.type = "null";
        if (this.sprite !== null) {
            this.container.addChild(this.sprite);
        }
    }
    onCreate() {

    }

    onUpdate(deltaTime) {
        if (this.currentAnimation != null) {
            this.currentAnimation.increment(deltaTime);
        }
    }
    
    onDestroy() {

    }

    onStartAnimation(name) {
        this.isReady = false;
    }

    onFinishAnimation(name) {
        this.isReady = true;
    }

    doAnimation(animation) {
        this.currentAnimation = animation;
        this.currentAnimation.start();
    }

    reset() {
        if (this.currentAnimation != null) {
            this.currentAnimation.stop();
        }
        this.container.rotation = 0;
        this.container.alpha = 1;
        this.isReady = true;
        this.currentAnimation = null;
    }
}