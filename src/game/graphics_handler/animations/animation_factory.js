import { FailMoveAnimation } from "./fail_move_animation.js";
import { HideAnimation } from "./hide_animation.js";
import { MoveAnimation } from "./move_animation.js";
import { SayAnimation } from "./say_animation.js";
import { ShowInOutAnimation } from "./showinout_animation.js";
import { UnhideAnimation } from "./unhide_animation.js";

export class AnimationFactory {
    constructor() {

    }
    //TODO: Refactor this garbage
    getAnimation(animationId, entity, data) {
        if (animationId === "move") {
            return new MoveAnimation(entity, animationId, data);
        }
        if (animationId === "failmove") {
            return new FailMoveAnimation(entity, animationId, data);
        }
        if (animationId === "hide") {
            return new HideAnimation(entity, animationId, data);
        }
        if (animationId === "unhide") {
            return new UnhideAnimation(entity, animationId, data);
        }
        if (animationId === "say") {
            return new SayAnimation(entity, animationId, data);
        }
        if(animationId === "showinout") {
            return new ShowInOutAnimation(entity, animationId, data);
        }
    }
}