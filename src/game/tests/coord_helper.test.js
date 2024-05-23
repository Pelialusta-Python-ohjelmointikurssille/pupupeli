import * as coord_helper from "../coord_helper.js";
import { Vector2 } from "../vector.js";


describe('coord_helper functions', () => {
    test('GridSpaceToScreenSpace returns [50, 50] as center coordinate of (0, 0) cell', () => {
        let screenCoodrdinates = coord_helper.GridSpaceToScreenSpace(0, 0, 300, 300, 3, 3);
        expect(screenCoodrdinates[0]).toBe(50);
        expect(screenCoodrdinates[1]).toBe(50);
    });
    test('GridSpaceToScreenSpace returns [150, 250] as center coordinate of (1, 2) cell', () => {
        let screenCoodrdinates = coord_helper.GridSpaceToScreenSpace(1, 2, 300, 300, 3, 3);
        expect(screenCoodrdinates[0]).toBe(150);
        expect(screenCoodrdinates[1]).toBe(250);
    });

    test('GridVectorToScreenVector returns correct vector', () => {
        let cellVector =  new Vector2(2, 1);
        let gridScreenSizeVector = new Vector2(300, 300);
        let gridSizeVector = new Vector2(3, 3);

        let vector = coord_helper.GridVectorToScreenVector(cellVector, gridScreenSizeVector, gridSizeVector);
        
        expect(vector.x).toBe(250);
        expect(vector.y).toBe(150);
    });

    test('ScreenSpaceToGridSpace returns [0, 0] as grid coordinate of (50, 50)', () => {
        let gridCoordinates = coord_helper.ScreenSpaceToGridSpace(50, 50, 300, 300, 3, 3);
        expect(gridCoordinates[0]).toBe(0)
        expect(gridCoordinates[1]).toBe(0)
    });
});

