import {
    createAppearHideAnimation,
    createHideAnimation,
    createPawnFailMoveAnimation,
    createPawnMoveAnimation,
    createUnHideAnimation
} from "../animations/factories/animation_factories.js";

//To avoid string comparisons and to make changing strings easier, (commands.js and tests break if u change strings)
export class AnimationNames {
    static PAWN_MOVE = "pawn_move";
    static PAWN_FAIL_MOVE = "pawn_fail_move";
    static PAWN_HIDE = "hide";
    static PAWN_UNHIDE = "unhide";
    static APPEAR_HIDE = "appear_hide";
}

export const ANIMATIONS = [
    {
        typeName: "pawn_move",
        compatibleEntities: ["pawn"],
        factoryFunction: createPawnMoveAnimation
    },
    {
        typeName: "pawn_fail_move",
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