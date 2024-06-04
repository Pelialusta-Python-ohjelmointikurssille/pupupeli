import { GridObject, getNewGridObject } from '../gridobject';
import { Vector2 } from '../vector';

describe('GridObject', () => {
    let originalCrypto;

    beforeAll(() => {
        // Save the original crypto object if it exists
        originalCrypto = global.crypto;

        // Mock global crypto if not defined
        if (!global.crypto) {
            global.crypto = {};
        }

        // Mock crypto.randomUUID
        global.crypto.randomUUID = jest.fn(() => 'mocked-uuid');
    });

    afterAll(() => {
        // Restore the original crypto object
        if (originalCrypto) {
            global.crypto = originalCrypto;
        } else {
            delete global.crypto.randomUUID;
        }
    });

    test('should create a new GridObject with the specified type', () => {
        const type = 'player';
        const gridObject = new GridObject(type);
        
        expect(gridObject.type).toBe(type);
        expect(gridObject.cell).toBe(null);
        expect(gridObject.id).toBe('mocked-uuid');
    });

    test('toString should return the type of the object', () => {
        const type = 'player';
        const gridObject = new GridObject(type);
        
        expect(gridObject.toString()).toBe(type);
    });

    test('getVector2Position should return Vector2(0, 0) if cell is null or undefined', () => {
        const gridObject = new GridObject('player');
        
        let vector = gridObject.getVector2Position();
        expect(vector).toEqual(new Vector2(0, 0));
        
        gridObject.cell = undefined;
        vector = gridObject.getVector2Position();
        expect(vector).toEqual(new Vector2(0, 0));
    });

    test('getVector2Position should return correct Vector2 if cell is defined', () => {
        const gridObject = new GridObject('player');
        gridObject.cell = { x: 5, y: 10 };
        
        const vector = gridObject.getVector2Position();
        expect(vector).toEqual(new Vector2(5, 10));
    });
});

describe('getNewGridObject', () => {
    test('should create a new GridObject with the specified name', () => {
        const name = 'collectible';
        const gridObject = getNewGridObject(name);
        
        expect(gridObject).toBeInstanceOf(GridObject);
        expect(gridObject.type).toBe(name);
    });
});
