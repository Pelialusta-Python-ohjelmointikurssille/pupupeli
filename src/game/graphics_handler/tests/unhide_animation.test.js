import { UnhideAnimation } from '../animations/unhide_animation.js';

jest.mock('../animations/tweener/animation_progress.js', () => {
    return {
        AnimationProgress: jest.fn().mockImplementation((time, onStart, onFinish, context, name) => {
            return {
                start: jest.fn(),
                increment: jest.fn(),
                skipToEnd: jest.fn(),
                stop: jest.fn(),
                value: 0,
                onStart: onStart.bind(context),
                onFinish: onFinish.bind(context),
            };
        }),
    };
});

describe('UnhideAnimation', () => {
    let gridObject;
    let animation;

    beforeEach(() => {
        gridObject = {
            screenPosition: { x: 0, y: 0 },
            gridPosition: { x: 1, y: 1 },
            fakeZPosition: 10,
            container: {
                x: 0,
                y: 0,
                rotation: 0,
                alpha: 0,
            },
            gridReference: {
                gridToScreenCoordinates: jest.fn().mockReturnValue({ x: 100, y: 200 }),
                gridScale: 1
            },
            onStartAnimation: jest.fn(),
            onFinishAnimation: jest.fn(),
        };

        const data = { time: 1000 };
        animation = new UnhideAnimation(gridObject, 'testAnimation', data);
    });

    it('should start the animation', () => {
        animation.start();
        expect(animation.progress.start).toHaveBeenCalled();
        expect(animation.inProgress).toBe(true);
        expect(animation.gridObject.screenPosition).toEqual({ x: 100, y: 200 });
        expect(animation.gridObject.container.x).toBe(110); // screenPosition.x + fakeZPosition
        expect(animation.gridObject.container.y).toBe(210); // screenPosition.y + fakeZPosition
    });

    it('should increment the animation progress', () => {
        animation.inProgress = true;
        animation.increment(16);
        expect(animation.progress.increment).toHaveBeenCalledWith(16);
    });

    it('should stop the animation', () => {
        animation.stop();
        expect(animation.progress.stop).toHaveBeenCalled();
        expect(animation.inProgress).toBe(false);
        expect(animation.gridObject.container.rotation).toBe(0);
        expect(animation.gridObject.container.alpha).toBe(0);
    });

    it('should skip to end', () => {
        animation.skipToEnd();
        expect(animation.progress.skipToEnd).toHaveBeenCalled();
    });

    it('should handle onStart correctly', () => {
        animation.onStart();
        expect(animation.gridObject.container.rotation).toBe(0);
        expect(animation.gridObject.container.alpha).toBe(0);
        expect(animation.gridObject.onStartAnimation).toHaveBeenCalledWith('testAnimation');
    });

    it('should handle onFinish correctly', () => {
        animation.onFinish();
        expect(animation.gridObject.container.alpha).toBe(1);
        expect(animation.inProgress).toBe(false);
        expect(animation.gridObject.onFinishAnimation).toHaveBeenCalledWith('testAnimation');
    });

    it('should calculate jump height correctly', () => {
        const progress = 0.5;
        const expectedJumpHeight = -(Math.sin(Math.PI * progress)**0.75) * gridObject.gridReference.gridScale * 0.5;
        expect(animation.getJumpHeight(progress)).toBe(expectedJumpHeight);
    });
});
