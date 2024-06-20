import { createPawnMoveAnimation, createPawnFailMoveAnimation, createHideAnimation, createUnHideAnimation, createAppearHideAnimation } from '../animations/factories/animation_factories.js';
import { FailMoveAnimation } from "../animations/fail_move_animation.js";
import { HideAnimation } from "../animations/hide_animation.js";
import { MoveAnimation } from "../animations/move_animation.js";
import { ShowInOutAnimation } from "../animations/showinout_animation.js";
import { UnhideAnimation } from "../animations/unhide_animation.js";

const animationId = "testAnimationId";
const entity = "testEntity";
const data = { test: "data" };

describe('Animation Factory Functions', () => {
    it('should create an instance of MoveAnimation for createPawnMoveAnimation', () => {
        const animation = createPawnMoveAnimation(animationId, entity, data);
        expect(animation).toBeInstanceOf(MoveAnimation);
        expect(animation.data).toBe(data);
    });

    it('should create an instance of FailMoveAnimation for createPawnFailMoveAnimation', () => {
        const animation = createPawnFailMoveAnimation(animationId, entity, data);
        expect(animation).toBeInstanceOf(FailMoveAnimation);
        expect(animation.data).toBe(data);
    });

    it('should create an instance of HideAnimation for createHideAnimation', () => {
        const animation = createHideAnimation(animationId, entity, data);
        expect(animation).toBeInstanceOf(HideAnimation);
        expect(animation.data).toBe(data);
    });

    it('should create an instance of UnhideAnimation for createUnHideAnimation', () => {
        const animation = createUnHideAnimation(animationId, entity, data);
        expect(animation).toBeInstanceOf(UnhideAnimation);
        expect(animation.data).toBe(data);
    });

    it('should create an instance of ShowInOutAnimation for createAppearHideAnimation', () => {
        const animation = createAppearHideAnimation(animationId, entity, data);
        expect(animation).toBeInstanceOf(ShowInOutAnimation);
        expect(animation.data).toBe(data);
    });
});
