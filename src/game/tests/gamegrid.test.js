import { initGrid, moveGridObjectToDir, addToGrid, grid } from '../gamegrid';
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
});
