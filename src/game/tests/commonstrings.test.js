import { Constants, GetDirectionAsString } from '../commonstrings.js';
import { Direction } from '../direction.js';

describe('Constants', () => {
    test('should return "player" for PLAYER_STR', () => {
        expect(Constants.PLAYER_STR).toBe('player');
    });

    test('should return "type" for TYPE_STR', () => {
        expect(Constants.TYPE_STR).toBe('type');
    });

    test('should return "grid" for GRID_STR', () => {
        expect(Constants.GRID_STR).toBe('grid');
    });

    test('should return "move" for MOVE_STR', () => {
        expect(Constants.MOVE_STR).toBe('move');
    });

    test('should return "up" for UP_STR', () => {
        expect(Constants.UP_STR).toBe('up');
    });

    test('should return "down" for DOWN_STR', () => {
        expect(Constants.DOWN_STR).toBe('down');
    });

    test('should return "left" for LEFT_STR', () => {
        expect(Constants.LEFT_STR).toBe('left');
    });

    test('should return "right" for RIGHT_STR', () => {
        expect(Constants.RIGHT_STR).toBe('right');
    });

    test('should return "test" for TEST_STR', () => {
        expect(Constants.TEST_STR).toBe('test');
    });
});

describe('GetDirectionAsString', () => {
    test('should return "up" for Direction.Up', () => {
        expect(GetDirectionAsString(Direction.Up)).toBe('up');
    });

    test('should return "down" for Direction.Down', () => {
        expect(GetDirectionAsString(Direction.Down)).toBe('down');
    });

    test('should return "left" for Direction.Left', () => {
        expect(GetDirectionAsString(Direction.Left)).toBe('left');
    });

    test('should return "right" for Direction.Right', () => {
        expect(GetDirectionAsString(Direction.Right)).toBe('right');
    });
});
