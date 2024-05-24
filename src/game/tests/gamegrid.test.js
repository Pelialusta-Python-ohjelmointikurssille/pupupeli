import { initGrid, moveGridObjectToDir, addToGrid, removeFromGrid, grid, boundaryCheck, ConsoleLogGrid } from '../gamegrid';
import { Cell } from '../cell';

describe('Grid functions', () => {
    let gridObject;

    beforeEach(() => {
        // Initialize the grid with a known state before each test
        initGrid(5, 5);
        gridObject = { cell: null }; // Create a mock gridObject
    });

    test('initGrid initializes the grid with correct dimensions', () => {
        expect(grid.length).toBe(5);
        expect(grid[0].length).toBe(5);
        expect(grid[4][4] instanceof Cell).toBe(true);
    });

    test('addToGrid adds an object to the specified cell', () => {
        addToGrid(gridObject, 2, 3);
        expect(grid[2][3].entities).toContain(gridObject);
        expect(gridObject.cell).toBe(grid[2][3]);
    });


    test('moveGridObjectToDir returns false if gridObject is null', () => {
        gridObject = null;
        expect(moveGridObjectToDir(gridObject, 1, 0)).toBe(false);
    });

    test('moveGridObjectToDir moves the object within bounds', () => {
        addToGrid(gridObject, 2, 2);
        const moved = moveGridObjectToDir(gridObject, 1, 0); // Move right
        expect(moved).toBe(true);
        expect(grid[3][2].entities).toContain(gridObject);
        expect(grid[2][2].entities).not.toContain(gridObject);
    });

    test('moveGridObjectToDir does not move the object out of bounds', () => {
        addToGrid(gridObject, 4, 4);
        const moved = moveGridObjectToDir(gridObject, 1, 0); // Try to move out of bounds
        expect(moved).toBe(false);
        expect(grid[4][4].entities).toContain(gridObject);
        expect(grid[5] && grid[5][4]).toBeUndefined();
    });

    test(('removeFromGrid removes the object from the grid'), () => {
        addToGrid(gridObject, 1, 1);
        expect(grid[1][1].entities).toContain(gridObject);
        removeFromGrid(gridObject);
        expect(grid[1][1].entities).not.toContain(gridObject);
    });

    test(('boundaryCheck returns true for coordinates within bounds'), () => {
        expect(boundaryCheck(0, 0)).toBe(true);
        expect(boundaryCheck(4, 4)).toBe(true);
    });

    test(('boundaryCheck returns false for coordinates out of bounds'), () => {
        expect(boundaryCheck(-1, 0)).toBe(false);
        expect(boundaryCheck(0, -1)).toBe(false);
        expect(boundaryCheck(5, 0)).toBe(false);
        expect(boundaryCheck(0, 5)).toBe(false);
    });
});
