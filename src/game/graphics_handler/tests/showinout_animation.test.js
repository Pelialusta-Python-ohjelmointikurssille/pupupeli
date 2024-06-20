import { ShowInOutAnimation } from '../animations/showinout_animation.js';

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

describe('ShowInOutAnimation', () => {
    let entity;
    let animation;

    beforeEach(() => {
        entity = {
            container: {
                alpha: 0,
                scale: 1,
                rotation: 0,
            },
            onStartAnimation: jest.fn(),
            onFinishAnimation: jest.fn(),
        };

        const data = { time: 1000 };
        animation = new ShowInOutAnimation(entity, 'testAnimation', data);
    });

    it('should start the animation', () => {
        animation.start();
        expect(animation.progress.start).toHaveBeenCalled();
        expect(animation.inProgress).toBe(true);
        expect(animation.entity.container.alpha).toBe(1);
    });

    it('should increment the animation progress correctly', () => {
        animation.inProgress = true;

        // Case: value < scaleStart
        animation.progress.value = 2;
        animation.increment(16);
        expect(animation.entity.container.scale).toBe((2 * (1 / animation.scaleStart)));

        // Case: scaleStart <= value <= scaleEnd
        animation.progress.value = 50;
        animation.increment(16);
        expect(animation.entity.container.scale).toBe(1);

        // Case: value > scaleEnd
        animation.progress.value = 96;
        animation.increment(16);
        expect(animation.entity.container.scale).toBe(1 - ((96 - animation.scaleEnd) * (1 / animation.scaleEnd)));
    });

    it('should skip to end', () => {
        animation.skipToEnd();
        expect(animation.progress.skipToEnd).toHaveBeenCalled();
    });

    it('should stop the animation', () => {
        animation.stop();
        expect(animation.progress.stop).toHaveBeenCalled();
        expect(animation.inProgress).toBe(false);
        expect(animation.entity.container.rotation).toBe(0);
        expect(animation.entity.container.alpha).toBe(0);
        expect(animation.entity.container.scale).toBe(1);
    });

    it('should handle onStart correctly', () => {
        animation.onStart();
        expect(animation.entity.container.alpha).toBe(1);
        expect(animation.entity.onStartAnimation).toHaveBeenCalledWith('testAnimation');
    });

    it('should handle onFinish correctly', () => {
        animation.onFinish();
        expect(animation.entity.container.alpha).toBe(0);
        expect(animation.inProgress).toBe(false);
        expect(animation.entity.onFinishAnimation).toHaveBeenCalledWith('testAnimation');
        expect(animation.entity.container.rotation).toBe(0);
        expect(animation.entity.container.scale).toBe(1);
    });

    it('should update current animation', () => {
        const mockAnimation = {
            increment: jest.fn(),
        };
        animation.currentAnimation = mockAnimation;

        animation.onUpdate(16);
        expect(mockAnimation.increment).toHaveBeenCalledWith(16);
    });
});
