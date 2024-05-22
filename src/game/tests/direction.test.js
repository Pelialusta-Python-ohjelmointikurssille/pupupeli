import { Direction } from '../direction';

describe('Direction', () => {
    test('should return 0 for Up', () => {
        expect(Direction.Up).toBe(0);
    });

    test('should return 1 for Right', () => {
        expect(Direction.Right).toBe(1);
    });

    test('should return 2 for Down', () => {
        expect(Direction.Down).toBe(2);
    });

    test('should return 3 for Left', () => {
        expect(Direction.Left).toBe(3);
    });
});
