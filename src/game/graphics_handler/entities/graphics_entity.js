
export class GraphicsEntity {
    constructor(entityId, entityHandler, container, sprite, data) {
        this.entityId = entityId;
        this.entityHandler = entityHandler;
        this.container = container;
        this.sprite = sprite;
        this.isReady = true;
        this.data = data;
        this.type = "base";
        this.currentAnimation = null;
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

    finishAnimationsInstantly() {
        if (this.currentAnimation != null) {
            
            this.currentAnimation.onFinish();
            this.currentAnimation.stop();
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