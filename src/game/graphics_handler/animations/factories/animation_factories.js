import { FailMoveAnimation } from "../fail_move_animation.js";
import { HideAnimation } from "../hide_animation.js";
import { MoveAnimation } from "../move_animation.js";
import { ShowInOutAnimation } from "../showinout_animation.js";
import { UnhideAnimation } from "../unhide_animation.js";

export function createPawnMoveAnimation(animationId, entity, data) {
    return new MoveAnimation(entity, animationId, data);
}

export function createPawnFailMoveAnimation(animationId, entity, data) {
    return new FailMoveAnimation(entity, animationId, data);
}

export function createHideAnimation(animationId, entity, data) {
    return new HideAnimation(entity, animationId, data);
}

export function createUnHideAnimation(animationId, entity, data) {
    return new UnhideAnimation(entity, animationId, data);
}

export function createAppearHideAnimation(animationId, entity, data) {
    return new ShowInOutAnimation(entity, animationId, data);
}
