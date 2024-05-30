import { PixiRenderer } from "./pixi_renderer.js";
import { GraphicsEntitySystem } from "./graphics_entity_handler.js";

export class GraphicsHandler {
    constructor() {
        this.renderer = null;
        this.graphicsEntitySystem = null;
    }

    async initialize() {
        this.renderer = new PixiRenderer();
        await this.renderer.initialize({screenHeight: 640, screenWidth: 640, maxFPS: 60, antialias: true});
        this.graphicsEntitySystem = new GraphicsEntitySystem();
        this.graphicsEntitySystem.initialize();
        this.renderer.addFunctionToRenderLoop(this.graphicsEntitySystem.updateAllObjects);
    }
}

