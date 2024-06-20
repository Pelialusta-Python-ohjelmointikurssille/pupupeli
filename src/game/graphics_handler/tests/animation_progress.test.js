import { AnimationProgress } from '../animations/tweener/animation_progress.js';

describe('AnimationProgress', () => {
    let startFuncMock, finishFuncMock, context, animation;

    beforeEach(() => {
        startFuncMock = jest.fn();
        finishFuncMock = jest.fn();
        context = {};
        animation = new AnimationProgress(10, startFuncMock, finishFuncMock, context, 'testAnimation');
    });

    test('should initialize correctly', () => {
        expect(animation.value).toBe(0);
        expect(animation.time).toBe(10);
        expect(animation.inProgress).toBe(false);
        expect(animation.startfunc).toBe(startFuncMock);
        expect(animation.finishfunc).toBe(finishFuncMock);
        expect(animation.context).toBe(context);
        expect(animation.name).toBe('testAnimation');
    });

    test('should start animation correctly', () => {
        animation.start();
        expect(animation.inProgress).toBe(true);
        expect(startFuncMock).toHaveBeenCalledWith('testAnimation');
    });

    test('should increment correctly', () => {
        animation.start();
        animation.increment(1);
        expect(animation.value).toBeCloseTo(10, 1);
    });

    test('should complete animation and call finish function', () => {
        animation.start();
        animation.increment(10);
        expect(animation.value).toBe(100);
    });

    test('should skip to end correctly', () => {
        animation.start();
        animation.skipToEnd();
        expect(animation.value).toBe(0);
        expect(animation.inProgress).toBe(false);
        expect(finishFuncMock).toHaveBeenCalledWith('testAnimation');
    });

    test('should stop animation correctly', () => {
        animation.start();
        animation.stop();
        expect(animation.value).toBe(0);
        expect(animation.inProgress).toBe(false);
        expect(finishFuncMock).not.toHaveBeenCalled();
    });

    test('should set time correctly', () => {
        animation.setTime(20);
        expect(animation.time).toBe(20);
    });

    test('should not set time if animation is in progress', () => {
        animation.start();
        animation.setTime(20);
        expect(animation.time).toBe(10);
    });

    test('should not set time if time is out of bounds', () => {
        animation.setTime(120);
        expect(animation.time).toBe(10);
        animation.setTime(-10);
        expect(animation.time).toBe(10);
    });
});
