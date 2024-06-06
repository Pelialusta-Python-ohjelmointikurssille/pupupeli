
export class GraphicsEntity {
    // data is used by subclasses
    // eslint-disable-next-line no-unused-vars
    constructor(entityId, entityHandler, container, sprite, data) {
        this.entityId = entityId;
        this.entityHandler = entityHandler;
        this.container = container;
        this.sprite = sprite;
        this.isReady = true;
        this.data = data;
        this.type = "base";
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
        console.log("START ANIM " + name)
    }

    onFinishAnimation(name) {
        this.isReady = true;
        console.log("FINISH ANIM " + name)
    }

    doAnimation(animation) {
        console.log(animation.name)
        this.currentAnimation = animation;
        this.currentAnimation.start();
    }
}