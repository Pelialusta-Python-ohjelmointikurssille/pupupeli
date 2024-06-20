import { HideAnimation } from '../animations/hide_animation';
import { AnimationProgress } from '..//animations/tweener/animation_progress';

jest.mock('../animations/tweener/animation_progress');

describe('HideAnimation', () => {
    let gridObject, name, data, hideAnimation, mockAnimationProgress;

    beforeEach(() => {
        gridObject = {
            screenPosition: { x: 0, y: 0 },
            container: { x: 0, y: 0, rotation: 0, alpha: 1, scale: 1 },
            gridReference: { gridToScreenCoordinates: jest.fn().mockReturnValue({ x: 100, y: 100 }), gridScale: 1 },
            gridPosition: { x: 0, y: 0 },
            fakeZPosition: 0,
            onStartAnimation: jest.fn(),
            onFinishAnimation: jest.fn(),
        };
        name = 'hide';
        data = { time: 1000 };

        mockAnimationProgress = {
            start: jest.fn(),
            increment: jest.fn(),
            skipToEnd: jest.fn(),
            stop: jest.fn(),
            value: 0
        };
        AnimationProgress.mockImplementation(() => mockAnimationProgress);

        hideAnimation = new HideAnimation(gridObject, name, data);
    });

    describe('constructor', () => {
        it('should initialize correctly', () => {
            expect(hideAnimation.gridObject).toBe(gridObject);
            expect(hideAnimation.data).toBe(data);
            expect(hideAnimation.progress).toBe(mockAnimationProgress);
            expect(hideAnimation.inProgress).toBe(false);
            expect(hideAnimation.name).toBe(name);
        });
    });

    describe('start', () => {
        it('should start the animation and update positions', () => {
            hideAnimation.start();
            expect(mockAnimationProgress.start).toHaveBeenCalled();
            expect(hideAnimation.inProgress).toBe(true);
            expect(gridObject.screenPosition).toEqual({ x: 100, y: 100 });
            expect(gridObject.container.x).toBe(100);
            expect(gridObject.container.y).toBe(100);
        });
    });

    describe('increment', () => {
        it('should not increment if animation is not in progress', () => {
            hideAnimation.increment(100);
            expect(mockAnimationProgress.increment).not.toHaveBeenCalled();
        });

        it('should increment the animation progress and update rotation and scale', () => {
            hideAnimation.inProgress = true;
            mockAnimationProgress.value = 75;
            hideAnimation.increment(100);
            expect(mockAnimationProgress.increment).toHaveBeenCalledWith(100);
            expect(gridObject.container.rotation).toBe(10 * 100);
            expect(gridObject.container.scale).toBe(0.5);
        });

        it('should not update rotation and scale if progress is less than or equal to 50', () => {
            hideAnimation.inProgress = true;
            mockAnimationProgress.value = 50;
            hideAnimation.increment(100);
            expect(mockAnimationProgress.increment).toHaveBeenCalledWith(100);
            expect(gridObject.container.rotation).toBe(0);
            expect(gridObject.container.scale).toBe(1);
        });
    });

    describe('stop', () => {
        it('should stop the animation and reset properties', () => {
            hideAnimation.stop();
            expect(mockAnimationProgress.stop).toHaveBeenCalled();
            expect(hideAnimation.inProgress).toBe(false);
            expect(gridObject.container.rotation).toBe(0);
            expect(gridObject.container.alpha).toBe(1);
            expect(gridObject.container.scale).toBe(1);
        });
    });

    describe('skipToEnd', () => {
        it('should skip the animation to the end', () => {
            hideAnimation.skipToEnd();
            expect(mockAnimationProgress.skipToEnd).toHaveBeenCalled();
        });
    });

    describe('onStart', () => {
        it('should call gridObject onStartAnimation and set alpha to 1', () => {
            hideAnimation.onStart();
            expect(gridObject.container.alpha).toBe(1);
            expect(gridObject.onStartAnimation).toHaveBeenCalledWith(name);
        });
    });

    describe('onFinish', () => {
        it('should set alpha to 0 and reset properties', () => {
            hideAnimation.onFinish();
            expect(gridObject.container.alpha).toBe(0);
            expect(hideAnimation.inProgress).toBe(false);
            expect(gridObject.onFinishAnimation).toHaveBeenCalledWith(name);
            expect(gridObject.container.rotation).toBe(0);
            expect(gridObject.container.scale).toBe(1);
        });
    });
});
