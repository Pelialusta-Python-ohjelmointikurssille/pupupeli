
export class GraphicsEntity {
    constructor(entityUUID, entityHandler, pixiContainer, sprite, entityData, skins) {
        this.entityId = entityUUID;
        this.entityHandler = entityHandler;
        this.container = pixiContainer;
        this.sprite = sprite;
        this.isReady = true;
        this.data = entityData;
        this.type = "null";
        this.skins = skins;
        this.currentSkin = null;
        if (this.skins != null) {
            this.currentSkin = this.skins.keys().next().value;
        }
        this.currentAnimation = null;
        if (this.sprite !== null) {
            this.container.addChild(this.sprite);
        }
    }
    onCreate() {

    }

    onUpdate(deltaTime) {
        if (this.currentAnimation != null) {
            if (this.currentAnimation.inProgress === false) return;
            this.currentAnimation.increment(deltaTime);
        }
    }
    
    onDestroy() {

    }
    
    finishAnimationsInstantly() {
        if (this.currentAnimation != null) {
            this.currentAnimation.skipToEnd();
        }
    }

    onStartAnimation() {
        this.isReady = false;
    }

    onFinishAnimation() {
        this.isReady = true;
        this.currentAnimation = null;
        console.log("FINISH ANIM " + name)
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