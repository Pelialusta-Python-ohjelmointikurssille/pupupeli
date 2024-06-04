import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";
import { GridEntity } from "./entities/grid_entity.js";
import { GraphicsEntity } from "./entities/graphics_entity.js";
import { PlayerEntity } from "./entities/player_entity.js";
import { BackgroundEntity } from "./entities/background_entity.js";
import { GridObjectEntity } from "./entities/grid_object_entity.js";
import { Constants } from "../commonstrings.js";


export class GraphicsEntityFactory {
    constructor(graphicsEntityHandler, builtinAssets) {
        this.graphicsEntityHandler = graphicsEntityHandler;
        this.builtinAssets = builtinAssets;
    }

    createEntity(entityId, type, data) {
        if (type === "test") {
            return this.createBasicEntity(entityId);
        }
        if (type === "grid") {
            return this.createGrid(entityId, data);
        }
        if (type === "player") {
            return this.createPlayer(entityId, data);
        }
        if (type === "background") {
            return this.createBackground(entityId, data);
        }
        if (type === "collectible") {
            return this.createCollectible(entityId, data);
        }
        if (type === Constants.OBSTACLE) {
            return this.createObstacle(entityId, data);
        }
    }

    createBasicEntity(entityId) {
        let sprite = new PIXI.Sprite(this.builtinAssets.characters.bunny_right);
        let entity = new GraphicsEntity(
            entityId,
            this.graphicsEntityHandler,
            new PIXI.Container(),
            sprite,
            null
        );
        return entity;
    }

    createPlayer(entityId, data) {
        let sprite = new PIXI.Sprite(this.builtinAssets.characters.bunny_right);
        let entity = new GridObjectEntity(
            entityId,
            this.graphicsEntityHandler,
            new PIXI.Container(),
            sprite,
            data
        );
        entity.container.zIndex = 1;
        return entity;
    }

    createGrid(entityId, data) {
        let entity = new GridEntity(
            entityId,
            this.graphicsEntityHandler,
            new PIXI.Container(),
            null,
            data
        );
        return entity;
    }

    createBackground(entityId, data) {
        let sprite = new PIXI.Sprite(this.builtinAssets.backgrounds.background_grass);
        let entity = new BackgroundEntity(
            entityId,
            this.graphicsEntityHandler,
            new PIXI.Container(),
            sprite,
            data
        );
        return entity;
    }

    createCollectible(entityId, data) {
        let sprite = new PIXI.Sprite(this.builtinAssets.collectibles.carrot);
        let entity = new GridObjectEntity(
            entityId,
            this.graphicsEntityHandler,
            new PIXI.Container(),
            sprite,
            data
        );
        entity.container.zIndex = 3;
        return entity;
    }

    createObstacle(entityId, data) {
        let sprite = new PIXI.Sprite(this.builtinAssets.obstacles.rock);
        let entity = new GridObjectEntity(
            entityId,
            this.graphicsEntityHandler,
            new PIXI.Container(),
            sprite,
            data
        );
        return entity;
    }

}