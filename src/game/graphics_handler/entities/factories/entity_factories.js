import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";
import { GridEntity } from "../grid_entities/grid_entity.js";
import { GraphicsEntity } from "../graphics_entity.js";
import { BackgroundEntity } from "../background_entity.js";
import { PawnEntity } from "../grid_entities/pawn_entity.js";
import { TextBoxEntity } from "../ui_entities/textbox_entity.js";
import { PawnEntityLineDrawer } from "../entityLineDrawer.js";

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
        sprite,
        entityData,
        skins
    );
    if (entityData.zIndex != null) {
        entity.container.zIndex = entityData.zIndex;
    } else {
        entity.container.zIndex = 5;
    }
    return entity;
}

/**
 * @private
 * @param {string} entityUUID 
 * @param {*} entityData 
 * @returns {PawnEntity} Player object
 */
export function createGridObject(entityUUID, entityData, graphicsEntityHandler, skins) {
    let sprite = new PIXI.Sprite();
    let entity = new PawnEntity(
        entityUUID,
        graphicsEntityHandler,
        new PIXI.Container(),
        sprite,
        entityData,
        skins
    );
    if (entityData.zIndex != null) {
        entity.container.zIndex = entityData.zIndex;
    } else {
        entity.container.zIndex = 5;
    }
    entity.type = "generic";
    return entity;
}

export function createPlayer(entityUUID, entityData, graphicsEntityHandler, skins) {
    let sprite = new PIXI.Sprite();
    let entity = new PawnEntity(
        entityUUID,
        graphicsEntityHandler,
        new PIXI.Container(),
        sprite,
        entityData,
        skins
    );
    let lineDrawer = new PawnEntityLineDrawer(new PIXI.Graphics(), new PIXI.Container());
    entity.addLineDrawer(lineDrawer);
    if (entityData.zIndex != null) {
        entity.container.zIndex = entityData.zIndex;
    } else {
        entity.container.zIndex = 10;
    }
    entity.type = "pawn";
    return entity;
}

export function createCollectible(entityUUID, entityData, graphicsEntityHandler, skins) {
    let sprite = new PIXI.Sprite();
    let entity = new PawnEntity(
        entityUUID,
        graphicsEntityHandler,
        new PIXI.Container(),
        sprite,
        entityData,
        skins
    );
    if (entityData.zIndex != null) {
        entity.container.zIndex = entityData.zIndex;
    } else {
        entity.container.zIndex = 15;
    }
    entity.type = "pawn";
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
        sprite,
        entityData,
        skins
    );
    if (entityData.zIndex != null) {
        entity.container.zIndex = entityData.zIndex;
    } else {
        entity.container.zIndex = -10;
    }
    entity.type = "grid";
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
        entityData,
        skins
    );
    if (entityData.zIndex != null) {
        entity.container.zIndex = entityData.zIndex;
    } else {
        entity.container.zIndex = -20;
    }
    entity.type = "background";
    return entity;
}

export function createTextBox(entityUUID, entityData, graphicsEntityHandler, skins) {
    let sprite = new PIXI.NineSliceSprite({
        texture: skins.values().next().value.defaultTexture,
        leftWidth: 64,
        topHeight: 64,
        rightWidth: 64,
        bottomHeight: 64,
    });
    let entity = new TextBoxEntity(
        entityUUID,
        graphicsEntityHandler,
        new PIXI.Container(),
        sprite,
        entityData,
        skins
    );
    if (entityData.zIndex != null) {
        entity.container.zIndex = entityData.zIndex;
    } else {
        entity.container.zIndex = 1000;
    }
    entity.type = "textbox";
    return entity;
}