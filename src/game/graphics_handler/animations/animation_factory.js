import { FailMoveAnimation } from "./fail_move_animation.js";
import { HideAnimation } from "./hide_animation.js";
import { MoveAnimation } from "./move_animation.js";
import { SayAnimation } from "./say_animation.js";
import { UnhideAnimation } from "./unhide_animation.js";

export class AnimationFactory {
    constructor() {

    }
    //TODO: Refactor this garbage
    getAnimation(animationId, gridObject, data) {
        if (animationId === "move") {
            return new MoveAnimation(gridObject, animationId, data);
        }
        if (animationId === "failmove") {
            return new FailMoveAnimation(gridObject, animationId, data);
        }
        if (animationId === "hide") {
            console.log("CREATE HIDE ANIM")
            return new HideAnimation(gridObject, animationId, data);
        }
        if (animationId === "unhide") {
            return new UnhideAnimation(gridObject, animationId, data);
        }
        if (animationId === "say") {
            return new SayAnimation(gridObject, animationId, data);
        }
    }
}