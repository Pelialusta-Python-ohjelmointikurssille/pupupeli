import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";
import { GridEntity } from "./grid_entity.js";
import { GraphicsEntity } from "./graphics_entity.js";
import { BackgroundEntity } from "./background_entity.js";
import { GridObjectEntity } from "./grid_object_entity.js";
import { TextBoxEntity } from "./textbox_entity.js";

/**
 * @private
 * @param {string} entityUUID 
 * @returns {GraphicsEntity} A basic GraphicsEntity object for testing
 */
export function createGenericEntity(entityUUID, entityData, graphicsEntityHandler, skins) {
    let sprite = new PIXI.Sprite();
    let entity = new GraphicsEntity(
        entityUUID,
        graphicsEntityHandler,
        new PIXI.Container(),
        null,
        entityData
    );
    return entity;
}

/**
 * @private
 * @param {string} entityUUID 
 * @param {*} entityData 
 * @returns {GridObjectEntity} Player object
 */
export function createGridObject(entityUUID, entityData, graphicsEntityHandler, skins) {
    let sprite = new PIXI.Sprite();
    let entity = new GridObjectEntity(
        entityUUID,
        graphicsEntityHandler,
        new PIXI.Container(),
        sprite,
        entityData
    );
    return entity;
}

/**
 * @private
 * @param {string} entityUUID 
 * @param {*} entityData 
 * @returns  {GridEntity} Grid object to display in game grid
 */
export function createGrid(entityUUID, entityData, graphicsEntityHandler, skins) {
    let sprite = new PIXI.Sprite();
    let entity = new GridEntity(
        entityUUID,
        graphicsEntityHandler,
        new PIXI.Container(),
        null,
        entityData
    );
    return entity;
}

/**
 * @private
 * @param {string} entityUUID 
 * @param {*} entityData 
 * @returns {BackgroundEntity} Background to the grid, rendered behind everything
 */
export function createBackground(entityUUID, entityData, graphicsEntityHandler, skins) {
    let sprite = new PIXI.Sprite();
    let entity = new BackgroundEntity(
        entityUUID,
        graphicsEntityHandler,
        new PIXI.Container(),
        sprite,
        entityData
    );
    return entity;
}

export function createTextBox(entityUUID, entityData, graphicsEntityHandler, skins) {
    let entity = new TextBoxEntity(
        entityUUID,
        graphicsEntityHandler,
        new PIXI.Container(),
        null,
        entityData,
        null
    );
    return entity;
}