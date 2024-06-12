import
{
    createBackgroundGrassSkin,
    createCharacterBunnySkin,
    createCollectibleCarrotSkin,
    createObstacleRockSkin
} from "../entity_skins/entity_skin_factories.js";

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