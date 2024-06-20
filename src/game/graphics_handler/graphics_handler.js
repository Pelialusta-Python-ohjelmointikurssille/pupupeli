import { PixiRenderer } from "./pixi_renderer.js";
import { GraphicsEntitySystem } from "./graphics_entity_handler.js";
import { Vector2 } from "../vector.js";
import { GraphicsRegistry } from "./graphics_registry.js";
import { ENTITIES } from "./manifests/entity_manifest.js";
import { ENTITY_SKINS, SKIN_BUNDLES } from "./manifests/skin_manifest.js";
import { ANIMATIONS } from "./manifests/animation_manifest.js";
import { GraphicalInputHandler } from "./graphical_input_handler.js";

/**
 * Used for handling pixiJS integration and drawing/animating sprites.
 */
export class GraphicsHandler {
    /**
     * @param {number} width 
     * @param {number} height 
     * @param {object} onReadyFunc Called when all playing animations have finished
     * @param {object} onReadyFuncContext Context for the onReadyFunc, as in which object should execute the function
     */
    constructor(width, height, onReadyFunc, onReadyFuncContext) {
        this.gridWidth = width;
        this.gridHeight = height;
        this.renderer = null;
        this.graphicsEntityHandler = null;
        this.graphicsRegistry = null;
        this.isReady = true;
        this.onReadyFunc = onReadyFunc;
        this.onReadyFuncContext = onReadyFuncContext;
        this.graphicalInputHandler = null;
    }

    /**
     * Asynchronous initialization of different parts of the graphics.
     * 
     * PixiJS is initialized and renderer created.
     * 
     * Update function added to render loop.
     * 
     * Creates base entities, like camera, background and grid. 
     */
    async initialize() {
        console.log("Loading graphics engine...");
        let t1 = new Date().getTime();

        this.renderer = new PixiRenderer();
        await this.renderer.initialize({ screenHeight: 1024, screenWidth: 1024, maxFPS: 60, antialias: true });
        this.graphicsRegistry = new GraphicsRegistry(this, this.renderer.builtinAssets);
        this.graphicsEntityHandler = new GraphicsEntitySystem(
            this.renderer,
            this,
            this.graphicsRegistry
        );

        this.graphicsRegistry.registerEntityList(ENTITIES);
        this.graphicsRegistry.registerEntitySkinList(ENTITY_SKINS);
        this.graphicsRegistry.registerAnimationList(ANIMATIONS);
        
        this.renderer.addFunctionToRenderLoop(this.graphicsEntityHandler.updateAllEntities, this.graphicsEntityHandler);
        this.graphicsEntityHandler.createCamera(this.renderer.pixiApp.screen, this.renderer.cameraWorldContainer);

        this.graphicalInputHandler = new GraphicalInputHandler(this.renderer, this.graphicsEntityHandler.camera);

        this.createGrid();

        let t2 = new Date().getTime();
        console.log(`Loading graphics engine took ${t2-t1}ms`);
    }

    /**
     * Used to play an animation on a gfx entity.
     * @param {string} entityId The uuid of the gfx entity that should play the given animation. 
     * @param {string} actionId The id of the animation to be played.
     * @param {object} actionData Data related to the animation in object form.
     */
    doAction(entityId, actionId, actionData) {
        this.isReady = false;
        this.graphicsEntityHandler.doAction(entityId, actionId, actionData);
    }

    /**
     * Used to create a gfx entity.
     * @param {string} entityId The entity will be created using the given uuid. 
     * @param {string} type Type of entity
     * @param {object} data Data related to the entity in object form.
     * @param {Array} skins A list of strings. All the skins of the entity. For ease of use when creating, use skin bundles in manifests/skin_manifest.js 
     */
    createEntity(entityId, type, data, skins) {
        this.graphicsEntityHandler.createGraphicsEntity(entityId, type, data, skins);
    }

    /**
     * Used to destroy a gfx entity.
     * @param {string} entityId The uuid of the entity that should be destroyed. 
     */
    destroyEntity(entityId) {
        this.graphicsEntityHandler.destroyGraphicsEntity(entityId);
    }

    /**
     * @returns HTML canvas generated by PixiJS.
     */
    getCanvas() {
        return this.renderer.pixiApp.canvas;
    }

    /**
     * Calls reset on all grid objects. This resets their values back to their initial values.
     */
    resetGridObjects() {
        this.graphicsEntityHandler.resetGridObjects();
    }

    /**
     * Destroys all entities of type "textbox". Used to remove unwanted speech bubbles and the like.
     */
    destroyTextBoxes() {
        this.graphicsEntityHandler.destroyTextBoxes();
    }

    /**
     * Called when entity handler enters the "ready" state.
     */
    onEntitiesReady() {
        if (this.onReadyFunc == null || this.onReadyFuncContext == null) return;
        this.isReady = true;
        this.onReadyFunc.call(this.onReadyFuncContext);
    }

    /**
     * @private 
     * 
     * Creates the grid object.
     */
    createGrid() {
        this.createEntity("gridenttest", "grid", { gridSize: new Vector2(this.gridWidth, this.gridHeight) });
        this.createEntity("bgtest", "background", { size: new Vector2(this.gridWidth * 300, this.gridHeight * 300) } , SKIN_BUNDLES["background"]);
        let gridObject = this.graphicsEntityHandler.getMainGridObject();
        this.graphicsEntityHandler.camera.focusOnAreaMiddle(gridObject.getMiddlePixelPosition(), gridObject.pixelSize);
        this.graphicsEntityHandler.camera.setMinZoom(this.graphicsEntityHandler.camera.zoomScale);
        this.graphicsEntityHandler.camera.minX = (this.gridWidth * 0.25) * 128;
        this.graphicsEntityHandler.camera.minY = (this.gridWidth * 0.25) * 128;
        this.graphicsEntityHandler.camera.maxX = (this.gridWidth * 0.75) * 128;
        this.graphicsEntityHandler.camera.maxY = (this.gridHeight * 0.75) * 128;
    }

    /**
     * Forces all currently playing animations to finish immediately. Used to skip animations to be able to run next command.
     */
    finishAnimationsImmediately() {
        this.graphicsEntityHandler.skipAnimationsAndFinish();
    }

    /**
     * Sets the skin of all entities to follow given theme. If the entity 
     * doesn't have a skin of the corresponding theme, this instruction is ignored.
     * @param {string} theme The theme to be selected. Themes of skins are defined in the skin manifest, under the theme variable.
     */
    setEntityThemes(theme) {
        this.graphicsEntityHandler.setEntityThemes(theme);
    }
    
    /**
     * Sets wether or not the grid visuals are shown. True for showing them, false for hiding them.
     * @param {boolean} isActive 
     */
    setGridState(isActive) {
        let grid = this.graphicsEntityHandler.getMainGridObject();
        if (isActive === true) {
            if (grid.areLinesEnabled === false) {
                grid.createLines();
            }
        } else {
            grid.removeLines();
        }
    }

    getEntity(id) {
        return this.graphicsEntityHandler.getGraphicsEntity(id);
    }
}

