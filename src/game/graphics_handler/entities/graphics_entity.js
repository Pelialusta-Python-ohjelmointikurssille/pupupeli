
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
        if (this.skins != null && this.skins.size > 0) {
            this.currentSkin = this.skins.keys().next().value;
            this.sprite.texture = this.skins.get(this.currentSkin).defaultTexture;
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

    swapTextureToMoveDir(dir) {
        let tex;
        if (dir === "up" && this.skins.get(this.currentSkin).upTexture != null) {
            tex = this.skins.get(this.currentSkin).upTexture;
        }
        if (dir === "down" && this.skins.get(this.currentSkin).upTexture != null) {
            tex = this.skins.get(this.currentSkin).downTexture;
        }
        if (dir === "left" && this.skins.get(this.currentSkin).upTexture != null) {
            tex = this.skins.get(this.currentSkin).leftTexture;
        }
        if (dir === "right" && this.skins.get(this.currentSkin).upTexture != null) {
            tex = this.skins.get(this.currentSkin).rightTexture;
        }
        if (tex !== undefined) {
            this.sprite.texture = tex;
        }
    }

}