import 
{
    createBackground,
    createGenericEntity,
    createGridObject,
    createGrid,
    createTextBox,
    createPlayer,
    createCollectible
} from "../entities/factories/entity_factories.js";

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
        factoryFunction: createPlayer
    },
    {
        typeName: "obstacle",
        factoryFunction: createGridObject
    },
    {
        typeName: "collectible",
        factoryFunction: createCollectible
    },
    {
        typeName: "question_collectible",
        factoryFunction: createCollectible
    }
]