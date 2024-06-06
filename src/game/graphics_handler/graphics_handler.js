import { PixiRenderer } from "./pixi_renderer.js";
import { GraphicsEntitySystem } from "./graphics_entity_handler.js";
import { Vector2 } from "../vector.js";

/**
 * Used for handling pixiJS integration and drawing/animating sprites.
 */
export class GraphicsHandler {
    /**
     * @param {number} width 
     * @param {number} height 
     * @param {object} onReadyFunc 
     * @param {object} onReadyFuncContext 
     */
    constructor(width, height, onReadyFunc, onReadyFuncContext) {
        this.gridWidth = width;
        this.gridHeight = height;
        this.renderer = null;
        this.graphicsEntityHandler = null;
        this.isReady = true;
        this.onReadyFunc = onReadyFunc;
        this.onReadyFuncContext = onReadyFuncContext;
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
        this.graphicsEntityHandler = new GraphicsEntitySystem(
            this.renderer,
            this
        );
        this.renderer.addFunctionToRenderLoop(this.graphicsEntityHandler.updateAllEntities, this.graphicsEntityHandler);
        this.graphicsEntityHandler.createCamera(this.renderer.pixiApp.screen, this.renderer.cameraWorldContainer);

        this.createGrid();

        // TODO: create proper grid scaling?
        this.createEntity("bgtest", "background", { bgWidth: this.gridWidth * 128, bgHeight: this.gridHeight * 128});
        //this.createEntity("test", "textbox", {
        //    texture: this.renderer.builtinAssets.ui.speechbubble_9slice,
        //    targetPosition: new Vector2(900, 900),
        //    text: "Hello world."
        //});

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
     */
    createEntity(entityId, type, data) {
        this.graphicsEntityHandler.createGraphicsEntity(entityId, type, data);
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
     * TODO - unimplemented
     */
    destroyAllEntities() {

    }

    /**
     * Calls reset on all grid objects. This resets their values back to their initial values.
     */
    resetGridObjects() {
        this.graphicsEntityHandler.resetGridObjects();
    }

    /**
     * Called when entity handler enters the "not ready" state.
     */
    onEntitiesNotReady() {
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
        if (this.gridWidth > this.gridHeight) {
            this.graphicsEntityHandler.camera.zoomScale = this.gridWidth**0.001 - 0.1;
        }
        else {
            this.graphicsEntityHandler.camera.zoomScale = this.gridHeight**0.001 - 0.1;
        }
    }
}

