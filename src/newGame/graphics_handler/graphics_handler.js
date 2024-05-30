import { PixiRenderer } from "./pixi_renderer.js";
import { GraphicsEntitySystem } from "./graphics_entity_handler.js";

export class GraphicsHandler {
    constructor() {
        this.renderer = null;
        this.graphicsEntitySystem = null;
        this.isReady = true;
    }

    async initialize() {
        this.renderer = new PixiRenderer();
        let n = await this.renderer.initialize({screenHeight: 640, screenWidth: 640, maxFPS: 60, antialias: true});
        this.graphicsEntitySystem = new GraphicsEntitySystem(
            this.renderer.builtinAssets,
            this.renderer.addSprite,
            this.renderer.destroySprite
        );
        this.graphicsEntitySystem.initialize();
        this.renderer.addFunctionToRenderLoop(this.graphicsEntitySystem.updateAllObjects);
        //this.createEntity("testent");
    }

    doAction(entityId, actionId, actionData) {
        this.graphicsEntitySystem.getGraphicsEntity(entityId).doAnimation(actionId, actionData);
    }

    createEntity(entityId) {
        this.graphicsEntitySystem.createGraphicsEntity(entityId);
    }

    destroyEntity(entityId) {
        this.graphicsEntitySystem.destroyGraphicsEntity(entityId);
    }
    
    getCanvas () {
        console.log(this.renderer.pixiApp.canvas)
        return this.renderer.pixiApp.canvas;
    }
}

