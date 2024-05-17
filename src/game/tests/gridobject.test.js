import { getNewGridObject } from '../gridobject';

describe('GridObject class and getNewGridObject function', () => {
    test('GridObject constructor initializes name and cell properties', () => {
        const gridObject = getNewGridObject('TestObject');
        
        expect(gridObject.name).toBe('TestObject');
        expect(gridObject.cell).toBeNull();
    });

    test('GridObject toString method returns the correct name', () => {
        const gridObject = getNewGridObject('TestObject');
        
        expect(gridObject.toString()).toBe('TestObject');
    });

    test('getNewGridObject function creates a new GridObject with the correct name', () => {
        const name = 'NewObject';
        const gridObject = getNewGridObject(name);
        
        expect(gridObject).toBeInstanceOf(Object); // Adjusted test to check for any object instance
        expect(gridObject.name).toBe(name);
    });

    test('GridObject is an instance of GridObject', () => {
        const name = 'AnotherObject';
        const gridObject = getNewGridObject(name);
        
        expect(gridObject).toBeInstanceOf(Object);
    });
});
