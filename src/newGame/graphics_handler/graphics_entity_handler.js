import { GraphicsEntity } from "./entities/graphics_entity.js";
import { Vector2 } from "../../game/vector.js";
import { GraphicsCameraEntity } from "./graphics_camera_entity.js";
import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";
import { GridEntity } from "./entities/grid_entity.js";
import { GraphicsEntityFactory } from "./graphics_entity_factory.js";



export class GraphicsEntitySystem {
    constructor(builtinAssets, renderer, graphicsHandler) {
        this.builtinAssets = builtinAssets;
        this.entityDict = new Map();
        this.spriteDict = new Map();
        this.gridObject = null;
        this.renderer = renderer;
        this.camera = null;
        this.entityFactory = new GraphicsEntityFactory(this, this.builtinAssets);
        this.isReady = true;
        this.graphicsHandler = graphicsHandler;
    }

    updateAllObjects(deltaTime) {
        this.camera.onUpdate(deltaTime);
        let maybeReady = true;
        this.entityDict.forEach((value, key, map) => {
            value.onUpdate(deltaTime);
            if (value.isReady === false) {
                maybeReady = false;
            }
        });
        if (this.isReady === true && maybeReady === false) {
            this.onEntitiesNotReady();
        } 
        if (this.isReady === false && maybeReady === true) {
            this.onEntitiesReady();
        } 
        this.isReady = maybeReady;
    }

    createCamera(screen, container) {
        this.camera = new GraphicsCameraEntity(container, screen, new Vector2(30, 30));
    }

    createGraphicsEntity(entityId, type, data) {
        let entity = this.entityFactory.createEntity(entityId, type, data);
        if (type === "grid") {
            this.gridObject = entity;
            this.renderer.addToStage(entity.container);
            entity.onCreate();
            return;
        }
        this.entityDict.set(entityId, entity);
        this.renderer.addToStage(entity.container);
        entity.onCreate();
    }

    destroyGraphicsEntity(entityId) {
        this.renderer.removeFromStage(this.entityDict.get(entityId).container);
        this.entityDict.delete(entityId);
    }

    getGraphicsEntity(entityId) {
        return this.entityDict.get(entityId);
    }

    getGridObject() {
        return this.gridObject;
    }

    onEntitiesNotReady() {
        //console.log("NOT READY");
        this.graphicsHandler.onEntitiesNotReady();
    }

    onEntitiesReady() {
        //console.log("NOW READY");
        this.graphicsHandler.onEntitiesReady();
    }

    resetGridObjects() {
        console.log("RESETTING ENTS")
        this.entityDict.forEach((value, key, map) => {
            if (value.type === "player") {
                console.log("RESET ENT player " + value.entityId);
                value.reset();
            }
        });
    }
}
