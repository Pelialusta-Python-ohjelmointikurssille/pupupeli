import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";
import { GridEntity } from "./entities/grid_entity.js";
import { GraphicsEntity } from "./entities/graphics_entity.js";
import { BackgroundEntity } from "./entities/background_entity.js";
import { GridObjectEntity } from "./entities/grid_object_entity.js";
import { Constants } from "../commonstrings.js";
import { TextBoxEntity } from "./entities/textbox_entity.js";

/**
 * Class that manages creation of different entities
 */
export class GraphicsEntityFactory {
    /**
     * 
     * @param {GraphicsEntityHandler} graphicsEntityHandler Reference to GraphicsEntityHandler
     * @param {*} builtinAssets Reference to the builtin assets bundle in PixiRenderer
     */
    constructor(graphicsEntityHandler, builtinAssets) {
        this.graphicsEntityHandler = graphicsEntityHandler;
        this.builtinAssets = builtinAssets;
    }

    /**
     * Create an entity using this method.
     * @param {string} entityId 
     * @param {string} type 
     * @param {object} data 
     * @returns 
     */
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
        if(type === "textbox") {
            return this.createTextBox(entityId, data)
        }
    }

    /**
     * @private
     * @param {string} entityId 
     * @returns {GraphicsEntity} A basic GraphicsEntity object for testing
     */
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

    /**
     * @private
     * @param {string} entityId 
     * @param {*} data 
     * @returns {GridObjectEntity} Player object
     */
    createPlayer(entityId, data) {
        let tex_down = this.builtinAssets.characters.bunny_down;
        let tex_right = this.builtinAssets.characters.bunny_right;
        let tex_left = this.builtinAssets.characters.bunny_left;
        let tex_up = this.builtinAssets.characters.bunny_up;
        let sprite = new PIXI.Sprite(tex_right);
        let entity = new GridObjectEntity(
            entityId,
            this.graphicsEntityHandler,
            new PIXI.Container(),
            sprite,
            data
        );
        entity.setDirectionTextures({ down: tex_down, right: tex_right, left: tex_left, up: tex_up });
        entity.container.zIndex = 1;
        return entity;
    }

    /**
     * @private
     * @param {string} entityId 
     * @param {*} data 
     * @returns  {GridEntity} Grid object to display in game grid
     */
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

    /**
     * @private
     * @param {string} entityId 
     * @param {*} data 
     * @returns {BackgroundEntity} Background to the grid, rendered behind everything
     */
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

    /**
     * @private
     * @param {string} entityId 
     * @param {*} data 
     * @returns {GridObjectEntity} Collectible object, such as carrots
     */
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

    /**
     * @private
     * @param {string} entityId 
     * @param {*} data 
     * @returns {GridObjectEntity} Obstacle, like rocks
     */
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

    createTextBox(entityId, data) {
        let texture = this.builtinAssets.ui.speechbubble_9slice;
        let entity = new TextBoxEntity(
            entityId,
            this.graphicsEntityHandler,
            new PIXI.Container(),
            null,
            data,
            texture
        );
        entity.type = "textbox"
        return entity;
    }
}