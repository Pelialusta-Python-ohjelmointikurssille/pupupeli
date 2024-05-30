import { GraphicsEntity } from "./graphics_entity.js";
import { Vector2 } from "../../game/vector.js";
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
    }

    initialize() {

    }

    updateAllObjects(deltaTime) {
        this.entityDict.forEach((value, key, map) => {
            value.onUpdate(deltaTime);
        });
    }

    createGraphicsEntity(entityId, size) {
        let sprite = new PIXI.Sprite(this.builtinAssets.characters.bunny_right);
        let container = new PIXI.Container();
        let entity = new GraphicsEntity(
            entityId,
            this,
            container,
            sprite,
            size
        );
        this.entityDict.set(entityId, entity);
        this.spriteDict.set(entityId, sprite);
        container.addChild(sprite);
        this.renderer.addSprite(container);
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
