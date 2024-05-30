import { PixiRenderer } from "./pixi_renderer.js";
import { GraphicsEntitySystem } from "./graphics_entity_handler.js";
import { Vector2 } from "../../game/vector.js";

export class GraphicsHandler {
    constructor(width, height) {
        this.gridWidth = width;
        this.gridHeight = height;
        this.renderer = null;
        this.graphicsEntitySystem = null;
        this.isReady = true;
    }

    async initialize() {
        this.renderer = new PixiRenderer();
        await this.renderer.initialize({ screenHeight: 640, screenWidth: 640, maxFPS: 60, antialias: true });
        this.graphicsEntitySystem = new GraphicsEntitySystem(
            this.renderer.builtinAssets,
            this.renderer
        );
        this.graphicsEntitySystem.initialize();
        this.renderer.addFunctionToRenderLoop(this.graphicsEntitySystem.updateAllObjects, this.graphicsEntitySystem);
        this.createEntity("gridenttest", new Vector2(this.gridWidth, this.gridHeight));
        this.graphicsEntitySystem.createCamera(this.renderer.pixiApp.screen, this.renderer.cameraWorldContainer);
    }

    doAction(entityId, actionId, actionData) {
        this.graphicsEntitySystem.getGraphicsEntity(entityId).doAnimation(actionId, actionData);
    }

    createEntity(entityId, size) {
        this.graphicsEntitySystem.createGraphicsEntity(entityId, size);
    }

    destroyEntity(entityId) {
        this.graphicsEntitySystem.destroyGraphicsEntity(entityId);
    }

    getCanvas() {
        return this.renderer.pixiApp.canvas;
    }
}

