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

export const ASSETS = {
    bundles: [
        {
            name: "characters",
            assets: [
                {
                    alias: "bunny_down",
                    src: "src/static/game_assets/bunny_front.png"
                },
                {
                    alias: "bunny_right",
                    src: "src/static/game_assets/bunny_right.png"
                },
                {
                    alias: "bunny_left",
                    src: "src/static/game_assets/bunny_left.png"
                },
                {
                    alias: "bunny_up",
                    src: "src/static/game_assets/bunny_back.png"
                },
                {
                    alias: "robot_down",
                    src: "src/static/game_assets/robot_front.png"
                },
                {
                    alias: "robot_right",
                    src: "src/static/game_assets/robot_right.png"
                },
                {
                    alias: "robot_left",
                    src: "src/static/game_assets/robot_left.png"
                },
                {
                    alias: "robot_up",
                    src: "src/static/game_assets/robot_back.png"
                }
            ]
        },
        {
            name: "backgrounds",
            assets: [
                {
                    alias: "background_grass",
                    src: "src/static/game_assets/background_grass.png"
                },
                {
                    alias: "background_metal",
                    src: "src/static/game_assets/background_metal.png"
                }
            ]
        },
        {
            name: "fonts",
            assets: [
                {
                    /*
                    Apache License
                    Version 2.0, January 2004
                    http://www.apache.org/licenses/
                    Mainly just placeholder font for testing font loading.
                    */
                    alias: "builtin_roboto_light",
                    src: "src/static/game_assets/Roboto-Light.ttf",
                    data: { family: 'Roboto Light' }

                }
            ]
        },
        {
            name: "collectibles",
            assets: [
                {
                    alias: "carrot",
                    src: "src/static/game_assets/carrot.png"
                },
                {
                    alias: "wrench",
                    src: "src/static/game_assets/wrench.png"
                }
            ]
        },
        {
            name: "obstacles",
            assets: [
                {
                    alias: "rock",
                    src: "src/static/game_assets/Kivi3.png"
                },
                {
                    alias: "well",
                    src: "src/static/game_assets/well.png"
                }
            ]
        },
        {
            name: "ui",
            assets: [
                {
                    alias: "speechbubble_9slice",
                    src: "src/static/game_assets/speechbubblenineslice.png"
                }
            ]
        },
        
    ]
}

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