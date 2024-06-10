import 
{
    createBackground,
    createGenericEntity,
    createGridObject,
    createGrid,
    createTextBox
} from "./entities/entity_factories.js";

/*
Naming convention:

ent_<type> for general non-ui entities
ent_grid_<type> for entities that are inside a grid
ui_<type> for ui related entities

*/

export class ENTITY_TYPE {
    static get GENERIC() {
        return "ent_generic";
    }
    static get GRID() {
        return "grid"; // rename ent_grid
    }
    static get BACKGROUND() {
        return "background"; // rename to ent_background
    }
    static get GRID_PAWN() {
        return "grid_object"; // rename to ent_grid_pawn
    }
    static get UI_TEXTBOX() {
        return "textbox"; // rename to ui_textbox
    }
    static get TEMP_PLAYER() {
        return "player"; // remove
    }
    static get TEMP_COLLECTIBLE() {
        return "collectible"; // remove
    }
    static get TEMP_OBSTACLE() {
        return "obstacle"; // remove
    }
}

export function registerEntities(graphicsRegistry) {
    graphicsRegistry.registerEntity(ENTITY_TYPE.GENERIC, createGenericEntity);
    graphicsRegistry.registerEntity(ENTITY_TYPE.GRID, createGrid);
    graphicsRegistry.registerEntity(ENTITY_TYPE.BACKGROUND, createBackground);
    graphicsRegistry.registerEntity(ENTITY_TYPE.GRID_PAWN, createGridObject);
    graphicsRegistry.registerEntity(ENTITY_TYPE.TEMP_PLAYER, createGridObject);
    graphicsRegistry.registerEntity(ENTITY_TYPE.TEMP_COLLECTIBLE, createGridObject);
    graphicsRegistry.registerEntity(ENTITY_TYPE.TEMP_COLLECTIBLE, createGridObject);
    graphicsRegistry.registerEntity(ENTITY_TYPE.UI_TEXTBOX, createTextBox); 
}

export function registerAnimations(graphicsRegistry) {

}

export function registerEntitySkins(graphicsRegistry) {
    
}