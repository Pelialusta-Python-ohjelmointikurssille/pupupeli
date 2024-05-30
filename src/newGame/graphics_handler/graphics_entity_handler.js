import { GraphicsEntity } from "./graphics_entity.js";
import { Vector2 } from "../../game/vector.js";
import { GraphicsCameraEntity } from "./graphics_camera_entity.js";
import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";

const entityTypeDict = {
    "player": "",
    "pickupable": "",
    "obstacle": ""
}

export class GraphicsEntitySystem {
    constructor(builtinAssets, renderer) {
        this.builtinAssets = builtinAssets;
        this.entityDict = new Map();
        this.spriteDict = new Map();
        this.renderer = renderer;
        this.camera = null;
    }

    initialize() {

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

    createGraphicsEntity(entityId, size) {
        let sprite = new PIXI.Sprite(this.builtinAssets.characters.bunny_right);
        let entity = new GraphicsEntity(
            entityId,
            this,
            new PIXI.Container(),
            sprite,
            size
        );
        this.entityDict.set(entityId, entity);
        this.spriteDict.set(entityId, sprite);
        entity.container.addChild(sprite);
        this.renderer.addSprite(entity.container);
        entity.onCreate();
    }

    destroyGraphicsEntity(entityId) {
        this.entityDict.delete(entityId);
        this.renderer.destroySprite(this.spriteDict.get(entityId));
        this.spriteDict.delete(entityId);
    }

    getGraphicsEntity(entityId) {

    }

    getEntityObjectOfType(entityTypeId) {

    }
}
