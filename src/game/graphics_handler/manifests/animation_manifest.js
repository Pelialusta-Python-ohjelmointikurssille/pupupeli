import {
    createAppearHideAnimation,
    createHideAnimation,
    createPawnFailMoveAnimation,
    createPawnMoveAnimation,
    createUnHideAnimation
} from "../animations/animation_factories.js";

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