import { PixiRenderer } from "./pixi_renderer.js";
import { GraphicsEntitySystem } from "./graphics_entity_handler.js";
import { Vector2 } from "../../game/vector.js";

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
        this.renderer = new PixiRenderer();
        await this.renderer.initialize({ screenHeight: 1024, screenWidth: 1024, maxFPS: 60, antialias: true });
        this.graphicsEntityHandler = new GraphicsEntitySystem(
            this.renderer.builtinAssets,
            this.renderer,
            this
        );
        this.renderer.addFunctionToRenderLoop(this.graphicsEntityHandler.updateAllObjects, this.graphicsEntityHandler);
        this.graphicsEntityHandler.createCamera(this.renderer.pixiApp.screen, this.renderer.cameraWorldContainer);

        this.createEntity("gridenttest", "grid", { gridSize: new Vector2(this.gridWidth, this.gridHeight) });
        //this.createEntity("test2", "player", { position: new Vector2(2, 2) });
        //this.doAction("test2", "move", { direction: "right" });
    }

    doAction(entityId, actionId, actionData) {
        console.log("DO")
        this.graphicsEntityHandler.getGraphicsEntity(entityId).doAction(actionId, actionData);
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

    onEntitiesNotReady() {
        console.log("NOT READY");
    }

    onEntitiesReady() {
        console.log("NOW READY");
        if (this.onReadyFunc == null || this.onReadyFuncContext == null) return;
        this.onReadyFunc.call(this.onReadyFuncContext);
    }
}

