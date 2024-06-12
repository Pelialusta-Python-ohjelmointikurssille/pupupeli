import { Vector2 } from "../vector.js";
import { GraphicsCamera } from "./graphics_camera.js";

/**
 * Manages all instantiated gfx entities.
 */
export class GraphicsEntitySystem {
    /**
     * 
     * @param {PixiRenderer} renderer PixiRenderer object reference
     * @param {GraphicsHandler} graphicsHandler GraphicsHandler object reference
     */
    constructor(renderer, graphicsHandler, graphicsRegistry) {
        this.builtinAssets = renderer.builtinAssets;
        this.entityDict = new Map();
        this.spriteDict = new Map();
        this.renderer = renderer;
        this.camera = null;
        //this.entityFactory = new GraphicsEntityFactory(this, this.builtinAssets);
        this.isReady = true;
        this.graphicsHandler = graphicsHandler;
        this.graphicsRegistry = graphicsRegistry;
        this.mainGridEntityUUID = "";
    }

    /**
     * Called every frame. Updates all gfx entities.
     * @param {number} deltaTime Frame delta in seconds
     */
    updateAllEntities(deltaTime) {
        this.camera.onUpdate(deltaTime);
        let maybeReady = true;
        this.entityDict.forEach((value) => {
            value.onUpdate(deltaTime);
            if (value.isReady === false) {
                maybeReady = false;
            }
        });
        // Checks if transitioned from or to the ready state.
        if (this.isReady === true && maybeReady === false) {
            this.onEntitiesNotReady();
        }
        if (this.isReady === false && maybeReady === true) {
            this.onEntitiesReady();
        }
        this.isReady = maybeReady;
    }

    /**
     * Creates the camera object.
     */
    createCamera() {
        this.camera = new GraphicsCamera(this.renderer.cameraWorldContainer, this.renderer.pixiApp.screen, new Vector2(0, 0));
    }

    /**
      * Used to create a gfx entity.
      * @param {string} entityId The entity will be created using the given uuid. 
      * @param {string} type Type of entity
      * @param {object} data Data related to the entity in object form.
      */
    createGraphicsEntity(entityId, type, data, skins) {
        let entity = this.graphicsRegistry.createEntity(entityId, type, data, skins);
        if (type === "grid") {
            this.mainGridEntityUUID = entityId;
        }
        this.entityDict.set(entityId, entity);
        this.renderer.addToStage(entity.container);
        entity.onCreate();
    }

    /**
     * Used to destroy a gfx entity.
     * @param {string} entityId The uuid of the entity that should be destroyed. 
     */
    destroyGraphicsEntity(entityId) {
        this.renderer.removeFromStage(this.entityDict.get(entityId).container);
        this.entityDict.delete(entityId);
    }

    /**
     * Used to play an animation on a gfx entity.
     * @param {string} entityId The uuid of the gfx entity that should play the given animation. 
     * @param {string} actionId The id of the animation to be played.
     * @param {object} actionData Data related to the animation in object form.
     */
    doAction(entityId, animationId, animationData) {
        let entity = this.getGraphicsEntity(entityId);
        let animation = this.graphicsRegistry.createAnimation(animationId, animationData, entity);
        entity.doAnimation(animation);
    }

    /**
     * 
     * @param {string} entityId The uuid of the graphics entity
     * @returns A graphics entity object.
     */
    getGraphicsEntity(entityId) {
        return this.entityDict.get(entityId);
    }

    /**
     * @returns Main grid object
     */
    getMainGridObject() {
        return this.getGraphicsEntity(this.mainGridEntityUUID);
    }

    /**
     * Called when entity handler enters the "not ready" state.
     */
    onEntitiesNotReady() {
        this.graphicsHandler.onEntitiesNotReady();
    }

    /**
     * Called when entity handler enters the "ready" state.
     */
    onEntitiesReady() {
        this.graphicsHandler.onEntitiesReady();
    }

    /**
     * Calls reset on all grid objects. This resets their values back to their initial values.
     */
    resetGridObjects() {
        this.entityDict.forEach((value) => {
            value.reset();
        });
    }

    skipAnimationsAndFinish() {
        this.entityDict.forEach((value) => {
            value.finishAnimationsInstantly();
        });
    }

    destroyTextBoxes() {
        this.entityDict.forEach((value, key) => {
            if (value.type === "textbox"){
                this.destroyGraphicsEntity(key);
            }
        });
    }
    
    setEntityThemes(theme) {
        this.entityDict.forEach((value) => {
            value.setTheme(theme);
        });
    }
}
