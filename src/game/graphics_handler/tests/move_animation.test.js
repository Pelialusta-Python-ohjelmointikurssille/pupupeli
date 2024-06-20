import { MoveAnimation } from '../animations/move_animation.js';
import { AnimationProgress } from '../animations/tweener/animation_progress.js';
import { Vector2 } from '../../vector.js';

jest.mock('../animations/tweener/animation_progress.js');
jest.mock('../../vector.js');

describe('MoveAnimation', () => {
    let pawnEntity;
    let data;
    let moveAnimation;

    beforeEach(() => {
        pawnEntity = {
            updatePosition: jest.fn(),
            updateTextures: jest.fn(),
            onStartAnimation: jest.fn(),
            onFinishMove: jest.fn(),
            onFinishAnimation: jest.fn(),
            screenPosition: { x: 0, y: 0 },
            container: { x: 0, y: 0 },
            gridReference: { gridScale: 1 },
            gridPosition: { x: 0, y: 0 },
        };

        data = {
            time: 1000,
            direction: 45
        };

        Vector2.FromDirection.mockReturnValue({ x: 1, y: 1 });
        moveAnimation = new MoveAnimation(pawnEntity, 'move', data);
    });

    test('constructor initializes correctly', () => {
        expect(moveAnimation.pawnEntity).toBe(pawnEntity);
        expect(moveAnimation.data).toBe(data);
        expect(moveAnimation.name).toBe('move');
        expect(moveAnimation.inProgress).toBe(false);
        expect(moveAnimation.moveDirection).toEqual({ x: 1, y: 1 });
        expect(AnimationProgress).toHaveBeenCalledWith(data.time, moveAnimation.onStart, moveAnimation.onFinish, moveAnimation, 'move');
    });

    test('start method starts the animation', () => {
        moveAnimation.start();
        expect(pawnEntity.updatePosition).toHaveBeenCalled();
        expect(moveAnimation.progress.start).toHaveBeenCalled();
        expect(moveAnimation.inProgress).toBe(true);
        expect(pawnEntity.direction).toBe(data.direction);
        expect(pawnEntity.updateTextures).toHaveBeenCalled();
    });

    test('increment method updates position', () => {
        moveAnimation.start();
        moveAnimation.increment(10);
        expect(moveAnimation.progress.increment).toHaveBeenCalledWith(10);
        expect(pawnEntity.fakeZPosition).toBeDefined();
        expect(pawnEntity.container.x).toBeDefined();
        expect(pawnEntity.container.y).toBeDefined();
    });

    test('stop method stops the animation', () => {
        moveAnimation.start();
        moveAnimation.stop();
        expect(moveAnimation.progress.stop).toHaveBeenCalled();
        expect(moveAnimation.inProgress).toBe(false);
    });

    test('skipToEnd method skips to end of animation', () => {
        moveAnimation.start();
        moveAnimation.skipToEnd();
        expect(moveAnimation.progress.skipToEnd).toHaveBeenCalled();
    });

    test('onStart method triggers onStartAnimation', () => {
        moveAnimation.onStart();
        expect(pawnEntity.onStartAnimation).toHaveBeenCalledWith('move');
    });

    test('onFinish method updates grid position and calls callbacks', () => {
        moveAnimation.start();
        moveAnimation.onFinish();
        expect(pawnEntity.gridPosition.x).toBe(1);
        expect(pawnEntity.gridPosition.y).toBe(1);
        expect(pawnEntity.updatePosition).toHaveBeenCalled();
        expect(moveAnimation.inProgress).toBe(false);
        expect(pawnEntity.onFinishMove).toHaveBeenCalled();
        expect(pawnEntity.onFinishAnimation).toHaveBeenCalledWith('move');
    });

    test('getJumpHeight method calculates correct jump height', () => {
        const height = moveAnimation.getJumpHeight(50);
        expect(height).toBeCloseTo(-0.5 * Math.sin(Math.PI * 0.5) ** 0.75);
    });
});
