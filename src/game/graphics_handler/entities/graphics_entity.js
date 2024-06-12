import { Direction } from "../../direction.js";

export class GraphicsEntity {
    constructor(entityUUID, entityHandler, pixiContainer, sprite, entityData, skins) {
        this.entityUUID = entityUUID;
        this.entityHandler = entityHandler;
        this.container = pixiContainer;
        this.sprite = sprite;
        if (this.sprite != null) {
            this.container.addChild(this.sprite);
        }
        this.entityData = entityData;
        this.skins = skins;
        this.currentSkin = null;
        this.currentSkin = this.skins.keys().next().value;
        this.swapTextureToMoveDir(this.direction);
        this.type = "generic";
        this.direction = Direction.Down;
        this.fakeZPosition = 0;
        this.currentAnimation = null;
        this.isReady = true;
    }

    applyEntityData() {
        if (this.entityData != null) {
            if (this.entityData.position != null) {
                this.container.position.x = this.entityData.position.x;
                this.container.position.y = this.entityData.position.y;
            }
            
            if (this.entityData.rotation != null) {
                this.container.rotation = this.entityData.rotation;
            }
            
            if (this.entityData.scale != null) {
                this.container.scale = this.entityData.scale;
            }
            
            if (this.entityData.direction != null) {
                this.direction = this.entityData.direction;
            }
            
            if (this.entityData.size != null && this.sprite != null) {
                this.sprite.width = this.entityData.size.x;
                this.sprite.height = this.entityData.size.y;
            }
        }
    }

    onCreate() {
        this.applyEntityData();
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
        this.direction = Direction.Up;
    }

    swapTextureToMoveDir(dir) {
        if (this.skins != null && this.skins.size > 0) {
            this.sprite.texture = this.skins.get(this.currentSkin).defaultTexture;
        }
        else {
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