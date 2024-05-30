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
        this.entityDict = {}
        this.renderer = renderer;
    }

    initialize() {

    }

    updateAllObjects() {

    }

    createGraphicsEntity(entityId) {
        let sprite = new PIXI.Sprite(this.builtinAssets.characters.bunny_right);
        let entity = new GraphicsEntity(entityId, new Vector2(20, 20), sprite);
        this.entityDict[entityId] = entity;
        this.renderer.addSprite(sprite);
        entity.onCreate();
    }

    destroyGraphicsEntity(entityId) {
        
    }

    getGraphicsEntity(entityId) {

    }

    getEntityObjectOfType(entityTypeId) {

    }
}
