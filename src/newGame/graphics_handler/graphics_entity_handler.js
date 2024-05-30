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
            let entity = value;
            let sprite = this.spriteDict.get(key);
            sprite.x = entity.position.x * this.renderer.renderScale.x;
            sprite.y = entity.position.y * this.renderer.renderScale.x;
            sprite.width = entity.width * this.renderer.renderScale.x;
            sprite.height = entity.height * this.renderer.renderScale.x;
            sprite.rotation = entity.rotation;
        });
    }

    createGraphicsEntity(entityId) {
        let sprite = new PIXI.Sprite(this.builtinAssets.characters.bunny_right);
        let width = 100;
        let height = 100;
        let entity = new GraphicsEntity(
            entityId,
            this,
            new Vector2(0, 0),
            new Vector2(width, height),
            0
        );
        this.entityDict.set(entityId, entity);
        this.spriteDict.set(entityId, sprite);
        this.renderer.addSprite(sprite);
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
