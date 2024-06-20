import { PawnEntityLineDrawer } from '../entities/entityLineDrawer.js';
import { Vector2 } from '../../vector.js';

describe('PawnEntityLineDrawer', () => {
    let mockGraphics;
    let lineDrawer;

    beforeEach(() => {
        mockGraphics = {
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            stroke: jest.fn(),
            clear: jest.fn(),
            alpha: 0,
        };
        lineDrawer = new PawnEntityLineDrawer(mockGraphics);
    });

    test('initial state', () => {
        expect(lineDrawer.moveHistory).toEqual([]);
        expect(lineDrawer.isEnabled).toBe(false);
        expect(mockGraphics.alpha).toBe(0);
    });

    test('onUpdatePawnEntityPosition with less than 2 points', () => {
        lineDrawer.onUpdatePawnEntityPosition(10, 20);
        expect(lineDrawer.moveHistory).toEqual([new Vector2(10, 20)]);
        expect(mockGraphics.moveTo).toHaveBeenCalledWith(10, 20);
        expect(mockGraphics.lineTo).not.toHaveBeenCalled();
        expect(mockGraphics.stroke).not.toHaveBeenCalled();
    });

    test('onUpdatePawnEntityPosition with 2 or more points', () => {
        lineDrawer.onUpdatePawnEntityPosition(10, 20);
        lineDrawer.onUpdatePawnEntityPosition(30, 40);

        expect(lineDrawer.moveHistory).toEqual([new Vector2(10, 20), new Vector2(30, 40)]);
        expect(mockGraphics.moveTo).toHaveBeenCalledWith(10, 20);
        expect(mockGraphics.lineTo).toHaveBeenCalledWith(30, 40);
        expect(mockGraphics.stroke).toHaveBeenCalledWith({ width: 10, color: 0xff0000 });
    });

    test('onPawnEntityReset', () => {
        lineDrawer.onUpdatePawnEntityPosition(10, 20);
        lineDrawer.onPawnEntityReset();
        expect(lineDrawer.moveHistory).toEqual([]);
        expect(mockGraphics.clear).toHaveBeenCalled();
    });

    test('clear', () => {
        lineDrawer.clear();
        expect(mockGraphics.clear).toHaveBeenCalled();
    });

    test('toggle', () => {
        lineDrawer.toggle();
        expect(lineDrawer.isEnabled).toBe(true);
        expect(mockGraphics.alpha).toBe(1);

        lineDrawer.toggle();
        expect(lineDrawer.isEnabled).toBe(false);
        expect(mockGraphics.alpha).toBe(0);
    });
});
