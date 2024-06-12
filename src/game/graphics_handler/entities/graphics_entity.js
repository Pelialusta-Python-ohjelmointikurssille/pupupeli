import { Direction } from "../../direction.js";

export class GraphicsEntity {
    constructor(entityUUID, entityHandler, pixiContainer, sprite, entityData, skins) {
        this.entityId = entityUUID;
        this.entityHandler = entityHandler;
        this.container = pixiContainer;
        this.sprite = sprite;
        this.isReady = true;
        this.data = entityData;
        this.type = "generic";
        this.direction = "down";
        this.skins = skins;
        this.fakeZPosition = 0;
        this.currentSkin = null;
        this.currentSkin = this.skins.keys().next().value;
        this.swapTextureToMoveDir(this.direction);
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
        if (this.skins != null && this.skins.size > 0) {
            this.sprite.texture = this.skins.get(this.currentSkin).defaultTexture;
        }
        else {
            console.log(this.type);
            return;
        }
        
        let tex;
        if (dir === Direction.Up && this.skins.get(this.currentSkin).upTexture != null) {
            tex = this.skins.get(this.currentSkin).upTexture;
        }
        if (dir === Direction.Down && this.skins.get(this.currentSkin).downTexture != null) {
            tex = this.skins.get(this.currentSkin).downTexture;
        }
        if (dir === Direction.Left && this.skins.get(this.currentSkin).leftTexture != null) {
            tex = this.skins.get(this.currentSkin).leftTexture;
        }
        if (dir === Direction.Right && this.skins.get(this.currentSkin).rightTexture != null) {
            tex = this.skins.get(this.currentSkin).rightTexture;
        }
        if (tex !== undefined) {
            this.sprite.texture = tex;
        }
        this.direction = dir;
    }

    hasTheme(theme) {
        let hasThemedSkin = false;
        this.skins.forEach((value) => {
            if (value.theme === theme) {
                hasThemedSkin = true;
            }
        });
        return hasThemedSkin;
    }
    
    setTheme(theme) {
        if (this.hasTheme(theme) === false) return;
        this.skins.forEach((value, key) => {
            if (value.theme === theme) {
                this.currentSkin = key;
            }
        });
        this.swapTextureToMoveDir(this.direction);
    }
}