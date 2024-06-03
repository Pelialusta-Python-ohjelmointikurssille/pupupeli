import { PixiRenderer } from "./pixi_renderer.js";
import { GraphicsEntitySystem } from "./graphics_entity_handler.js";
import { Vector2 } from "../../newGame/vector.js";

export class GraphicsHandler {
    constructor(width, height, onReadyFunc, onReadyFuncContext) {
        this.gridWidth = width;
        this.gridHeight = height;
        this.renderer = null;
        this.graphicsEntityHandler = null;
        this.isReady = true;
        this.onReadyFunc = onReadyFunc;
        this.onReadyFuncContext = onReadyFuncContext;
    }

    async initialize() {
        console.log("Loading graphics engine...");
        let t1 = new Date().getTime();

        this.renderer = new PixiRenderer();
        await this.renderer.initialize({ screenHeight: 1024, screenWidth: 1024, maxFPS: 60, antialias: true });
        this.graphicsEntityHandler = new GraphicsEntitySystem(
            this.renderer.builtinAssets,
            this.renderer,
            this
        );
        this.renderer.addFunctionToRenderLoop(this.graphicsEntityHandler.updateAllObjects, this.graphicsEntityHandler);
        this.graphicsEntityHandler.createCamera(this.renderer.pixiApp.screen, this.renderer.cameraWorldContainer);

        this.createGrid();

        this.createEntity("bgtest", "background", { bgWidth: this.gridHeight * 128, bgHeight: this.gridWidth * 128});
        //this.createEntity("carrottest", "collectible", { position: new Vector2(1, 2) });

        let t2 = new Date().getTime();
        console.log(`Loading graphics engine took ${t2-t1}ms`);
    }

    doAction(entityId, actionId, actionData) {
        console.log(entityId);
        console.log(actionId);
        console.log(actionData);
        //this.graphicsEntityHandler.getGraphicsEntity(entityId).doAction(actionId, actionData);
        this.graphicsEntityHandler.doAction(entityId, actionId, actionData);
    }

    createEntity(entityId, type, data) {
        this.graphicsEntityHandler.createGraphicsEntity(entityId, type, data);
    }

    destroyEntity(entityId) {
        this.graphicsEntityHandler.destroyGraphicsEntity(entityId);
    }

    getCanvas() {
        return this.renderer.pixiApp.canvas;
    }

    destroyAllEntities() {

    }

    resetAllGridObjects() {
        this.graphicsEntityHandler.resetGridObjects();
    }

    onEntitiesNotReady() {
    }

    onEntitiesReady() {
        if (this.onReadyFunc == null || this.onReadyFuncContext == null) return;
        this.onReadyFunc.call(this.onReadyFuncContext);
    }

    createGrid() {
        this.createEntity("gridenttest", "grid", { gridSize: new Vector2(this.gridWidth, this.gridHeight) });
        if (this.gridWidth > this.gridHeight) {
            this.graphicsEntityHandler.camera.zoomScale = 8 / (this.gridWidth * 1.15);
        }
        else {
            this.graphicsEntityHandler.camera.zoomScale = 8 / (this.gridHeight * 1.15);
        }
    }
}

