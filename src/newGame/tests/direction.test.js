import { Direction, translatePythonMoveStringToDirection } from '../direction';

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

describe('Translate python move string to direction', () => {
    test('should return Direction.Right for oikea', () => {
        let direction = translatePythonMoveStringToDirection("oikea");
        expect(direction).toBe(Direction.Right);
    });

    test('should return Direction.Left for vasen', () => {
        let direction = translatePythonMoveStringToDirection("vasen");
        expect(direction).toBe(Direction.Left);
    });

    test('should return Direction.Up for ylös', () => {
        let direction = translatePythonMoveStringToDirection("ylös");
        expect(direction).toBe(Direction.Up);
    });

    test('should return Direction.Down for alas', () => {
        let direction = translatePythonMoveStringToDirection("alas");
        expect(direction).toBe(Direction.Down);
    });
});
