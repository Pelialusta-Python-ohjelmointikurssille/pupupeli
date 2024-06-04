
import { Vector2 } from "../vector.js";
import { Cell } from "../../game/cell.js";
import { Grid } from "../grid.js";

Vector2.FromDirection = jest.fn();

describe('Grid class', () => {
    let grid
    let gridObject;

    beforeEach(() => {
        gridObject = { cell: null };
        grid = new Grid(gridObject, 5, 5);
    });

    test('constructor initializes the grid with correct dimensions', () => {
        expect(grid.width).toBe(5);
        expect(grid.height).toBe(5);
        expect(grid.doubleArray.length).toBe(5);
        expect(grid.doubleArray[0].length).toBe(5);
        expect(grid.doubleArray[4][4] instanceof Cell).toBe(true);
    });

    test('addToGrid adds an object to the specified cell', () => {
        grid.addToGrid(gridObject, 2, 3);
        expect(grid.doubleArray[2][3].entities).toContain(gridObject);
        expect(gridObject.cell).toBe(grid.doubleArray[2][3]);
    });

    test('moveGridObjectToDir returns false if gridObject is null', () => {
        gridObject = null;
        expect(grid.moveGridObjectToDir(gridObject, 'right')).toBe(false);
    });

    test('moveGridObjectToDir moves the object within bounds', () => {
        grid.addToGrid(gridObject, 2, 2);
        Vector2.FromDirection.mockReturnValue({ x: 1, y: 0 });
        const moved = grid.moveGridObjectToDir(gridObject, 'right'); 
        expect(moved).toBe(true);
        expect(grid.doubleArray[3][2].entities).toContain(gridObject);
        expect(grid.doubleArray[2][2].entities).not.toContain(gridObject);
    });

    test('moveGridObjectToDir does not move the object out of bounds', () => {
        grid.addToGrid(gridObject, 4, 4);
        Vector2.FromDirection.mockReturnValue({ x: 1, y: 0 });
        const moved = grid.moveGridObjectToDir(gridObject, 'right'); 
        expect(moved).toBe(false);
        expect(grid.doubleArray[4][4].entities).toContain(gridObject);
        expect(grid.doubleArray[5] && grid.doubleArray[5][4]).toBeUndefined();
    });

    test('removeFromGrid removes the object from the grid', () => {
        grid.addToGrid(gridObject, 1, 1);
        expect(grid.doubleArray[1][1].entities).toContain(gridObject);
        grid.removeFromGrid(gridObject);
        expect(grid.doubleArray[1][1].entities).not.toContain(gridObject);
    });

    test('boundaryCheck returns true for coordinates within bounds', () => {
        expect(grid.boundaryCheck(0, 0)).toBe(true);
        expect(grid.boundaryCheck(4, 4)).toBe(true);
    });

    test('boundaryCheck returns false for coordinates out of bounds', () => {
        expect(grid.boundaryCheck(-1, 0)).toBe(false);
        expect(grid.boundaryCheck(0, -1)).toBe(false);
        expect(grid.boundaryCheck(5, 0)).toBe(false);
        expect(grid.boundaryCheck(0, 5)).toBe(false);
    });

    test('CreateDoubleArray creates a double array of correct dimensions', () => {
        const doubleArray = grid.CreateDoubleArray(5, 5);
        expect(doubleArray.length).toBe(5);
        expect(doubleArray[0].length).toBe(5);
        expect(doubleArray[0][0]).toBeInstanceOf(Cell);
    });

    // tests for resetgrid fuction
    test('resetGrid removes all objects from the grid', () => {
        grid.addToGrid(gridObject, 1, 1);
        grid.resetGrid();
        expect(grid.doubleArray[1][1].entities).toEqual([]);
    });

    test('getObjectsAtGridPosition returns the objects at the specified cell', () => {
        grid.addToGrid(gridObject, 1, 1);
        expect(grid.getObjectsAtGridPosition(1, 1)).toContain(gridObject);
    });

    test('obstacleCheck returns true if there are no obstacles at the cell', () => {
        expect(grid.obstacleCheck(1, 1)).toBe(true);
    });

    test('obstacleCheck returns false if there is an obstacle at the cell', () => {
        grid.addToGrid({ type: 'obstacle' }, 1, 1);
        expect(grid.obstacleCheck(1, 1)).toBe(false);
    });

    // test for consoleDebug function
    test('consoleDebug prints the grid to the console', () => {
        // Mock console.log
        console.log = jest.fn();

        grid.addToGrid(gridObject, 1, 1);
        grid.consoleDebug();

        expect(console.log).toHaveBeenCalledTimes(5);
    });

    test('getAdjacentObjectsAtDir returns the objects at the adjacent cell', () => {
        grid.addToGrid(gridObject, 1, 1);
        grid.addToGrid(gridObject, 2, 1);
        expect(grid.getAdjacentObjectsAtDir(1, 1, 'right')).toContain(gridObject);
    });
});
