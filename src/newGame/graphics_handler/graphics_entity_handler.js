import { GraphicsEntity } from "./graphics_entity.js";
import { Vector2 } from "../../game/vector.js";
import { GraphicsCameraEntity } from "./graphics_camera_entity.js";
import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";
import { GridEntity } from "./entities/grid_entity.js";
import { GraphicsEntityFactory } from "./graphics_entity_factory.js";



export class GraphicsEntitySystem {
    constructor(builtinAssets, renderer) {
        this.builtinAssets = builtinAssets;
        this.entityDict = new Map();
        this.spriteDict = new Map();
        this.renderer = renderer;
        this.camera = null;
        this.entityFactory = new GraphicsEntityFactory(this, this.builtinAssets);
    }

    updateAllObjects(deltaTime) {
        this.camera.onUpdate(deltaTime);
        this.entityDict.forEach((value, key, map) => {
            value.onUpdate(deltaTime);
        });
    }

    createCamera(screen, container) {
        this.camera = new GraphicsCameraEntity(container, screen, new Vector2(0, 0));
    }

    createGraphicsEntity(entityId, type, data) {
        let entity = this.entityFactory.createEntity(entityId, type, data);
        this.entityDict.set(entityId, entity);
        this.renderer.addToStage(entity.container);
        entity.onCreate();
    }

    destroyGraphicsEntity(entityId) {
        this.renderer.removeFromStage(this.entityDict.get(entityId).container);
        this.entityDict.delete(entityId);
    }
}
