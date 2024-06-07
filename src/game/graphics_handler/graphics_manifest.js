import 
{
    createBackground,
    createGenericEntity,
    createGridObject,
    createGrid,
    createTextBox
} from "./entities/entity_factories.js";


export function registerEntities(graphicsRegistry) {
    graphicsRegistry.registerEntity("ent_generic", createGenericEntity);
    graphicsRegistry.registerEntity("ent_grid", createGrid);
    graphicsRegistry.registerEntity("ent_background", createBackground);
    graphicsRegistry.registerEntity("ent_gridobject", createGridObject);
    graphicsRegistry.registerEntity("ui_textbox", createTextBox); 
}

export function registerAnimations(graphicsRegistry) {

}

export function registerEntitySkins(graphicsRegistry) {
    
}