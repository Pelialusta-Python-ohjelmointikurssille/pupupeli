import { Direction } from "../../direction.js";
import { Vector2 } from "../../vector.js";

/**
 * The base graphics object. Used to display in-game graphics. All graphics classes must inheret from this base class.
 */
export class GraphicsEntity {
    /**
     * 
     * @param {*} entityUUID A unique ID used identify the object. For example, this is used to refer to the entity when calling it to do an animation. 
     * @param {*} entityHandler A reference to the entity handler that created it.
     * @param {*} pixiContainer A PixiJS container object that is added to pixiJS stage. All graphics should be children of this container.
     * @param {*} sprite A PixiJS sprite object.
     * @param {*} entityData An entityDate object. Contains optional override parameters when this object is created.
     * @param {*} skins An array of EntitySkin objects. A list of available skins for the entity. Used also when switching themes.
     */
    constructor(entityUUID, entityHandler, pixiContainer, sprite, entityData, skins) {
        this.entityUUID = entityUUID;
        this.entityHandler = entityHandler;
        this.container = pixiContainer;
        this.containerStartPosition = new Vector2(this.container.position.x, this.container.position.y);
        this.containerStartScale = this.container.scale;
        this.containerStartAlpha = this.container.alpha;
        this.containerStartRotation = this.container.rotation;
        this.sprite = sprite;
        if (this.sprite != null) {
            this.container.addChild(this.sprite);
        }
        this.entityData = entityData;
        this.skins = skins;
        this.currentSkin = null;
        if (this.skins != null && this.skins.size >= 1) {
            this.currentSkin = this.skins.keys().next().value;
        }
        this.type = "generic";
        this.direction = Direction.Down;
        this.currentAnimation = null;
        this.isReady = true;
        this.updateTextures();
    }

    /**
     * Called when onCreate is called. Handles setting override variables if given using entityData.
     */
    applyEntityData() {
        if (this.entityData == null) return;
        
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
        // Fix entitydata values not being accounted for when resetting
        this.containerStartPosition = new Vector2(this.container.position.x, this.container.position.y);
        this.containerStartScale = this.container.scale;
        this.containerStartAlpha = this.container.alpha;
        this.containerStartRotation = this.container.rotation;
    }

    /**
     * Called when the entity is created by the GraphicsEntityHandler.
     * Tip: if you want to apply changes to variables after onCreate is called,
     * run them after calling super.onCreate in the new onCreate functions.
     */
    onCreate() {
        this.applyEntityData();
    }

    /**
     * Called every frame.
     * @param {*} deltaTime Time between frames in seconds. 
     */
    onUpdate(deltaTime) {
        if (this.currentAnimation == null) return;
        if (this.currentAnimation.inProgress === false) return;
        this.currentAnimation.increment(deltaTime);
    }
    
    /**
     * Called when the entity is destroyed by the GraphicsEntityHandler
     */
    onDestroy() {

    }
    
    /**
     * Skips/Fast forwards the currently playing animation to the end.
     */
    finishAnimationsInstantly() {
        if (this.currentAnimation != null) {
            this.currentAnimation.skipToEnd();
        }
    }

    /**
     * Called when the current animation has started playing.
     */
    onStartAnimation() {
        this.isReady = false;
    }

    /**
     * Called when the current animation has finished playing
     */
    onFinishAnimation() {
        this.isReady = true;

        this.currentAnimation = null;
    }

    /**
     * Used to play a given animation
     * @param {*} animation An animation object that should play.
     */
    doAnimation(animation) {
        this.currentAnimation = animation;
        this.currentAnimation.start();
    }

    /**
     * Reset the variables to initial values when created.
     */
    reset() {
        if (this.currentAnimation != null) {
            this.currentAnimation.stop();
        }
        this.container.rotation = this.containerStartRotation;
        this.container.alpha = this.containerStartAlpha;
        this.container.scale = this.containerStartScale;
        this.container.position.x = this.containerStartPosition.x;
        this.container.position.y = this.containerStartPosition.y;

        this.isReady = true;
        this.currentAnimation = null;
        this.direction = Direction.Down;
        this.updateTextures();
    }

    updateTextures() {
        if (this.skins == null || this.skins.size <= 0 || this.sprite == null) return;

        let tex;
        this.sprite.texture = this.skins.get(this.currentSkin).defaultTexture;
        if (this.direction === Direction.Up && this.skins.get(this.currentSkin).upTexture != null) {
            tex = this.skins.get(this.currentSkin).upTexture;
        }
        if (this.direction === Direction.Down && this.skins.get(this.currentSkin).downTexture != null) {
            tex = this.skins.get(this.currentSkin).downTexture;
        }
        if (this.direction === Direction.Left && this.skins.get(this.currentSkin).leftTexture != null) {
            tex = this.skins.get(this.currentSkin).leftTexture;
        }
        if (this.direction === Direction.Right && this.skins.get(this.currentSkin).rightTexture != null) {
            tex = this.skins.get(this.currentSkin).rightTexture;
        }
        if (tex != null) {
            this.sprite.texture = tex;
        }
    }

    /**
     * Check if the list of skins (this.skins) containes the given theme.
     * @param {string} theme Name of the theme. 
     * @returns A boolean on wether or not a matching skin of the given theme was found.
     */
    hasTheme(theme) {
        let hasThemedSkin = false;
        this.skins.forEach((value) => {
            if (value.theme === theme) {
                hasThemedSkin = true;
            }
        });
        return hasThemedSkin;
    }
    
    /**
     * Sets the current skin to match given theme if possible.
     * @param {string} theme The theme to switch to.
     */
    setTheme(theme) {
        if (this.hasTheme(theme) === false) return;
        this.skins.forEach((value, key) => {
            if (value.theme === theme) {
                this.currentSkin = key;
            }
        });
        this.updateTextures();
    }
}