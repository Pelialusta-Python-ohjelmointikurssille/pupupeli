// src/game/tests/cell.test.js
import { Cell } from "../cell.js";

describe('Cell', () => {
    let cell;

    beforeEach(() => {
        cell = new Cell(1, 2);
    });

    test('should initialize with given x and y coordinates', () => {
        expect(cell.x).toBe(1);
        expect(cell.y).toBe(2);
        expect(cell.entities).toEqual([]);
    });

    test('toString should return coordinates when entities is empty', () => {
        expect(cell.toString()).toBe('(1, 2)');
    });

    test('toString should return entities as string when entities is not empty', () => {
        cell.entities.push('entity1');
        expect(cell.toString()).toBe('entity1');
        
        cell.entities.push('entity2');
        expect(cell.toString()).toBe('entity1,entity2');
    });

    test('getEntities should return the entities array', () => {
        expect(cell.getEntities()).toBe(cell.entities);
    });
});
