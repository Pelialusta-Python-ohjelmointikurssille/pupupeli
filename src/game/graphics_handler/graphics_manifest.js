import 
{
    createBackground,
    createGenericEntity,
    createGridObject,
    createGrid,
    createTextBox
} from "./entities/entity_factories.js";
import {
    createAppearHideAnimation,
    createHideAnimation,
    createPawnFailMoveAnimation,
    createPawnMoveAnimation,
    createUnHideAnimation
} from "./animations/animation_factories.js";
import
{
    createBackgroundGrassSkin,
    createCharacterBunnySkin,
    createCollectibleCarrotSkin,
    createObstacleRockSkin
} from "./entity_skins/entity_skin_factories.js";

export const ENTITIES = [
    {
        typeName: "generic",
        factoryFunction: createGenericEntity
    },
    {
        typeName: "grid",
        factoryFunction: createGrid
    },
    {
        typeName: "background",
        factoryFunction: createBackground
    },
    {
        typeName: "pawn",
        factoryFunction: createGridObject
    },
    {
        typeName: "textbox",
        factoryFunction: createTextBox
    },
    {
        typeName: "player",
        factoryFunction: createGridObject
    },
    {
        typeName: "obstacle",
        factoryFunction: createGridObject
    },
    {
        typeName: "collectible",
        factoryFunction: createGridObject
    }
]

export const ANIMATIONS = [
    {
        typeName: "pawn_move",
        compatibleEntities: ["pawn"],
        factoryFunction: createPawnMoveAnimation
    },
    {
        typeName: "pawn_failmove",
        compatibleEntities: ["pawn"],
        factoryFunction: createPawnFailMoveAnimation
    },
    {
        typeName: "hide",
        compatibleEntities: [],
        factoryFunction: createHideAnimation
    },
    {
        typeName: "unhide",
        compatibleEntities: [],
        factoryFunction: createUnHideAnimation
    },
    {
        typeName: "appear_hide",
        compatibleEntities: [],
        factoryFunction: createAppearHideAnimation
    }
]

export const ENTITY_SKINS = [
    {
        typeName: "skin_character_bunny",
        theme: "bunny",
        factoryFunction: createCharacterBunnySkin
    },
    {
        typeName: "skin_collectible_carrot",
        theme: "bunny",
        factoryFunction: createCollectibleCarrotSkin
    },
    {
        typeName: "skin_obstacle_rock",
        theme: "bunny",
        factoryFunction: createObstacleRockSkin
    },
    {
        typeName: "skin_background_grass",
        theme: "bunny",
        factoryFunction: createBackgroundGrassSkin
    }
]

export const SKIN_BUNDLES = {
    "player": ["skin_character_bunny"],
    "obstacle": ["skin_obstacle_rock"],
    "collectible": ["skin_collectible_carrot"],
    "background": ["skin_background_grass"]
}