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
     * @param {GraphicsRegistry} graphicsRegistry Registry that holds information about animations, entities and skins. Contains the factories needed to create them.
     */
    constructor(renderer, graphicsHandler, graphicsRegistry) {
        this.builtinAssets = renderer.builtinAssets;
        this.entityDict = new Map();
        this.spriteDict = new Map();
        this.renderer = renderer;
        this.camera = null;
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
        //if (this.isReady === true && maybeReady === false) {
        //}
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
      * @param {Array} skins A list of strings. All the skins of the entity. For ease of use when creating, use skin bundles in manifests/skin_manifest.js 
      */
    createGraphicsEntity(entityId, type, data, skins) {
        let entity = this.graphicsRegistry.createEntity(entityId, type, data, skins);
        if (type === "grid") {
            this.mainGridEntityUUID = entityId;
        }
        this.entityDict.set(entityId, entity);
        
        entity.onCreate();
        if (type === "textbox" && entity.useWorldCoordinates === false) {
            this.renderer.addToUI(entity.container);
        } else {
            this.renderer.addToStage(entity.container);
        }
    }

    /**
     * Used to destroy a gfx entity.
     * @param {string} entityId The uuid of the entity that should be destroyed. 
     */
    destroyGraphicsEntity(entityId) {
        this.renderer.removeFromStage(this.entityDict.get(entityId).container);
        this.renderer.removeFromUI(this.entityDict.get(entityId).container);
        this.entityDict.delete(entityId);
    }

    /**
     * Used to play an animation on a gfx entity.
     * @param {string} entityId The uuid of the gfx entity that should play the given animation. 
     * @param {string} animationId The id of the animation to be played.
     * @param {object} animationData Data related to the animation in object form.
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
     * @returns Main grid object of type GridEntity.
     */
    getMainGridObject() {
        return this.getGraphicsEntity(this.mainGridEntityUUID);
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

    /**
     * Skips and finishes all currently running animations. Used to skip animations to be able to run next command.
     */
    skipAnimationsAndFinish() {
        this.entityDict.forEach((value) => {
            value.finishAnimationsInstantly();
        });
    }

    /**
     * Destroys all entities of type "textbox". Used to remove unwanted speech bubbles and the like.
     */
    destroyTextBoxes() {
        this.entityDict.forEach((value, key) => {
            if (value.type === "textbox"){
                this.destroyGraphicsEntity(key);
            }
        });
    }
    
    /**
     * Sets the skin of all entities to follow given theme. If the entity 
     * doesn't have a skin of the corresponding theme, this instruction is ignored.
     * @param {string} theme The theme to be selected. Themes of skins are defined in the skin manifest, under the theme variable.
     */
    setEntityThemes(theme) {
        this.entityDict.forEach((value) => {
            value.setTheme(theme);
        });
    }
}
