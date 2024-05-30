import { GraphicsEntity } from "./graphics_entity.js";
import { Vector2 } from "../../game/vector.js";
import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";

const entityTypeDict = {
    "player": "",
    "pickupable": "",
    "obstacle": ""
}

export class GraphicsEntitySystem {
    constructor(builtinAssets, addSpriteFunc, destroySpriteFunc) {
        this.builtinAssets = builtinAssets;
        this.entityDict = {}
        this.addSpriteFunc = addSpriteFunc;
        this.destroySpriteFunc = destroySpriteFunc;
    }

    initialize() {

    }

    updateAllObjects() {

    }

    createGraphicsEntity(entityId) {
        let sprite = new PIXI.Sprite(this.builtinAssets.characters.bunny_right);
        let entity = new GraphicsEntity(entityId, new Vector2(20, 20), sprite);
        this.entityDict[entityId] = entity;
        this.addSpriteFunc(sprite);
        entity.onCreate();
    }

    destroyGraphicsEntity(entityId) {
        
    }

    getGraphicsEntity(entityId) {

    }

    getEntityObjectOfType(entityTypeId) {

    }
}
