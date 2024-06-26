import { FailMoveAnimation } from '../animations/fail_move_animation';
import { AnimationProgress } from '../animations/tweener/animation_progress';
import { Vector2 } from '../../vector';

jest.mock('../animations/tweener/animation_progress');
jest.mock('../../vector');

describe('FailMoveAnimation', () => {
    let pawnEntity, name, data, failMoveAnimation, mockAnimationProgress;

    beforeEach(() => {
        pawnEntity = {
            updatePosition: jest.fn(),
            onStartAnimation: jest.fn(),
            onFinishAnimation: jest.fn(),
            screenPosition: { x: 0, y: 0 },
            container: { x: 0, y: 0 },
            gridReference: { gridScale: 1 },
            fakeZPosition: 0,
            updateTextures: jest.fn()
        };
        name = 'failMove';
        data = { time: 1000, direction: 'NORTH' };

        Vector2.FromDirection.mockReturnValue({ x: 1, y: 0 });

        mockAnimationProgress = {
            start: jest.fn(),
            increment: jest.fn(),
            skipToEnd: jest.fn(),
            stop: jest.fn(),
            value: 0
        };
        AnimationProgress.mockImplementation(() => mockAnimationProgress);

        failMoveAnimation = new FailMoveAnimation(pawnEntity, name, data);
    });

    describe('constructor', () => {
        it('should initialize correctly', () => {
            expect(failMoveAnimation.pawnEntity).toBe(pawnEntity);
            expect(failMoveAnimation.data).toBe(data);
            expect(failMoveAnimation.progress).toBe(mockAnimationProgress);
            expect(failMoveAnimation.inProgress).toBe(false);
            expect(failMoveAnimation.name).toBe(name);
            expect(failMoveAnimation.moveDirection).toEqual({ x: 1, y: 0 });
        });

        it('should set moveDirection to null if direction is not provided', () => {
            data.direction = null;
            failMoveAnimation = new FailMoveAnimation(pawnEntity, name, data);
            expect(failMoveAnimation.moveDirection).toBeNull();
        });
    });

    describe('start', () => {
        it('should start the animation', () => {
            failMoveAnimation.start();
            expect(pawnEntity.updatePosition).toHaveBeenCalled();
            expect(mockAnimationProgress.start).toHaveBeenCalled();
            expect(failMoveAnimation.inProgress).toBe(true);
        });
    });

    describe('increment', () => {
        it('should not increment if animation is not in progress', () => {
            failMoveAnimation.increment(100);
            expect(mockAnimationProgress.increment).not.toHaveBeenCalled();
        });

        it('should increment the animation progress and update pawnEntity position', () => {
            failMoveAnimation.inProgress = true;
            mockAnimationProgress.value = 25;
            failMoveAnimation.increment(100);
            expect(mockAnimationProgress.increment).toHaveBeenCalledWith(100);
            expect(pawnEntity.fakeZPosition).toBe(failMoveAnimation.getJumpHeight(25));
            expect(pawnEntity.container.x).toBe(0.1875);
            expect(pawnEntity.container.y).toBe(pawnEntity.fakeZPosition);
        });

        it('should handle progress value between 50 and 100', () => {
            failMoveAnimation.inProgress = true;
            mockAnimationProgress.value = 75;
            failMoveAnimation.increment(100);
            expect(mockAnimationProgress.increment).toHaveBeenCalledWith(100);
            expect(pawnEntity.fakeZPosition).toBe(failMoveAnimation.getJumpHeight(75));
            expect(pawnEntity.container.x).toBe(0.1875);
            expect(pawnEntity.container.y).toBe(pawnEntity.fakeZPosition);
        });
    });

    describe('skipToEnd', () => {
        it('should skip the animation to the end', () => {
            failMoveAnimation.skipToEnd();
            expect(mockAnimationProgress.skipToEnd).toHaveBeenCalled();
        });
    });

    describe('stop', () => {
        it('should stop the animation', () => {
            failMoveAnimation.stop();
            expect(mockAnimationProgress.stop).toHaveBeenCalled();
            expect(failMoveAnimation.inProgress).toBe(false);
        });
    });

    describe('onStart', () => {
        it('should call pawnEntity onStartAnimation', () => {
            failMoveAnimation.onStart();
            expect(pawnEntity.onStartAnimation).toHaveBeenCalledWith(name);
        });
    });

    describe('onFinish', () => {
        it('should update position and call pawnEntity onFinishAnimation', () => {
            failMoveAnimation.onFinish();
            expect(pawnEntity.updatePosition).toHaveBeenCalled();
            expect(failMoveAnimation.inProgress).toBe(false);
            expect(pawnEntity.onFinishAnimation).toHaveBeenCalledWith(name);
        });
    });

    describe('getJumpHeight', () => {
        it('should calculate the correct jump height', () => {
            const height = failMoveAnimation.getJumpHeight(50);
            expect(height).toBeCloseTo(-0.3 * Math.sin(Math.PI * 0.5)**0.75);
        });

        it('should cap progress at 100', () => {
            const height = failMoveAnimation.getJumpHeight(150);
            expect(height).toBeCloseTo(-0.3 * Math.sin(Math.PI * 1)**0.75);
        });
    });
});
