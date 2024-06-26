import {
    createBackgroundGrassSkin,
    createBackgroundMetalSkin,
    createCharacterBunnySkin,
    createCharacterRobotSkin,
    createCollectibleCarrotSkin,
    createCollectibleWrenchSkin,
    createObstacleRockSkin,
    createObstacleWellSkin,
    createQuestionCollectibleBunnySkin,
    createQuestionCollectibleRobotSkin,
    createSpeechBubbleBunnySkin,
    createSpeechBubbleRobotSkin
} from "../entity_skins/factories/entity_skin_factories.js";

import { ThemeNames } from "../../commonstrings.js";

export const ENTITY_SKINS = [
    //bunny theme starts here:
    {
        typeName: "skin_character_bunny",
        theme: ThemeNames.BUNNY,
        factoryFunction: createCharacterBunnySkin
    },
    {
        typeName: "skin_collectible_carrot",
        theme: ThemeNames.BUNNY,
        factoryFunction: createCollectibleCarrotSkin
    },
    {
        typeName: "skin_obstacle_rock",
        theme: ThemeNames.BUNNY,
        factoryFunction: createObstacleRockSkin
    },
    {
        typeName: "skin_background_grass",
        theme: ThemeNames.BUNNY,
        factoryFunction: createBackgroundGrassSkin
    },
    {
        typeName: "skin_ui_speechbubble_bunny",
        theme: ThemeNames.BUNNY,
        factoryFunction: createSpeechBubbleBunnySkin
    },
    {
        typeName: "skin_collectible_question_bunny",
        theme: ThemeNames.BUNNY,
        factoryFunction: createQuestionCollectibleBunnySkin
    },
    //Robot theme starts here
    {
        typeName: "skin_character_robot",
        theme: ThemeNames.ROBOT,
        factoryFunction: createCharacterRobotSkin
    },
    {
        typeName: "skin_collectible_wrench",
        theme: ThemeNames.ROBOT,
        factoryFunction: createCollectibleWrenchSkin
    },
    {
        typeName: "skin_obstacle_well",
        theme: ThemeNames.ROBOT,
        factoryFunction: createObstacleWellSkin
    },
    {
        typeName: "skin_background_metal",
        theme: ThemeNames.ROBOT,
        factoryFunction: createBackgroundMetalSkin
    },
    {
        typeName: "skin_ui_speechbubble_robot",
        theme: ThemeNames.ROBOT,
        factoryFunction: createSpeechBubbleRobotSkin
    },
    {
        typeName: "skin_collectible_question_robot",
        theme: ThemeNames.ROBOT,
        factoryFunction: createQuestionCollectibleRobotSkin
    }
    //To make new theme, copypaste an existing theme above here and rename the types (have to be unique). 
    //Additionally, make and add factory functions to them 
    // ----------------------------------------------------------
]

export const SKIN_BUNDLES = {
    "player": ["skin_character_bunny", "skin_character_robot"],
    "obstacle": ["skin_obstacle_rock", "skin_obstacle_well"],
    "collectible": ["skin_collectible_carrot", "skin_collectible_wrench"],
    "background": ["skin_background_grass", "skin_background_metal"],
    "speech_bubble": ["skin_ui_speechbubble_bunny", "skin_ui_speechbubble_robot"],
    "question_collectible": ["skin_collectible_question_bunny", "skin_collectible_question_robot"]
}