import { MoveCommand } from '../commands';
import { Constants, GetDirectionAsString } from '../commonstrings';

// Mock dependencies
const mockGrid = {
    moveGridObjectToDir: jest.fn(),
    getAdjacentObjectsAtDir: jest.fn(),
    removeFromGrid: jest.fn(),
    getObjectsAtGridPosition: jest.fn()
};

const mockGridObject = {
    getVector2Position: jest.fn(),
    id: 'test-id',
    type: Constants.PLAYER_STR
};

const mockGraphicsHandler = {
    doAction: jest.fn()
};

describe('MoveCommand', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGridObject.getVector2Position.mockReturnValue({ x: 0, y: 0 });
        mockGrid.getAdjacentObjectsAtDir.mockReturnValue([]);  // Ensure it returns an array by default
    });

    test('should create a new MoveCommand with the correct properties', () => {
        const moveCommand = new MoveCommand(mockGrid, mockGridObject, 'UP', mockGraphicsHandler);
        expect(moveCommand.moveSpeed).toBeGreaterThan(0);
        expect(moveCommand.objectHideSpeed).toBeGreaterThan(0);
    });

    test('should execute move successfully and call graphicsHandler with move action', () => {
        mockGrid.moveGridObjectToDir.mockReturnValue(true);

        const moveCommand = new MoveCommand(mockGrid, mockGridObject, 'UP', mockGraphicsHandler);
        moveCommand.execute();

        expect(mockGrid.moveGridObjectToDir).toHaveBeenCalledWith(mockGridObject, 'UP');
        expect(mockGraphicsHandler.doAction).toHaveBeenCalledWith(
            'test-id',
            Constants.MOVE_STR,
            { direction: GetDirectionAsString('UP'), time: 0.35 }
        );
    });

    test('should fail move and call graphicsHandler with failmove action', () => {
        mockGrid.moveGridObjectToDir.mockReturnValue(false);

        const moveCommand = new MoveCommand(mockGrid, mockGridObject, 'UP', mockGraphicsHandler);
        moveCommand.execute();

        expect(mockGrid.moveGridObjectToDir).toHaveBeenCalledWith(mockGridObject, 'UP');
        expect(mockGraphicsHandler.doAction).toHaveBeenCalledWith(
            'test-id',
            'failmove',
            { direction: GetDirectionAsString('UP'), time: 0.35 }
        );
    });

    test('should hide and remove collectible when entering a cell with collectible', () => {
        mockGrid.moveGridObjectToDir.mockReturnValue(true);
        const mockCollectible = { type: Constants.COLLECTIBLE, id: 'collectible-id' };
        mockGrid.getAdjacentObjectsAtDir.mockReturnValue([mockCollectible]);

        const moveCommand = new MoveCommand(mockGrid, mockGridObject, 'UP', mockGraphicsHandler);
        moveCommand.execute();

        expect(mockGrid.moveGridObjectToDir).toHaveBeenCalledWith(mockGridObject, 'UP');
        expect(mockGraphicsHandler.doAction).toHaveBeenCalledWith(
            'test-id',
            Constants.MOVE_STR,
            { direction: GetDirectionAsString('UP'), time: 0.35 }
        );
        expect(mockGraphicsHandler.doAction).toHaveBeenCalledWith(
            'collectible-id',
            'hide',
            { time: 0.6 }
        );
        expect(mockGrid.removeFromGrid).toHaveBeenCalledWith(mockCollectible);
    });
});

