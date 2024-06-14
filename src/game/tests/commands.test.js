import { MoveCommand } from '../commands';
import { Constants } from '../commonstrings';
import { AnimationNames } from '../graphics_handler/manifests/animation_manifest';
import { Direction } from '../direction';

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
        const moveCommand = new MoveCommand(mockGrid, mockGridObject, Direction.Up, mockGraphicsHandler);
        expect(moveCommand.moveSpeed).toBeGreaterThan(0);
        expect(moveCommand.objectHideSpeed).toBeGreaterThan(0);
    });

    test('should execute move successfully and call graphicsHandler with move action', () => {
        mockGrid.moveGridObjectToDir.mockReturnValue(true);

        const moveCommand = new MoveCommand(mockGrid, mockGridObject, Direction.Up, mockGraphicsHandler);
        moveCommand.execute();

        expect(mockGrid.moveGridObjectToDir).toHaveBeenCalledWith(mockGridObject, Direction.Up);
        expect(mockGraphicsHandler.doAction).toHaveBeenCalledWith(
            mockGridObject.id,
            AnimationNames.PAWN_MOVE,
            { direction: Direction.Up, time: moveCommand.moveSpeed }
        );
    });

    test('should fail move and call graphicsHandler with failmove action', () => {
        mockGrid.moveGridObjectToDir.mockReturnValue(false);

        const moveCommand = new MoveCommand(mockGrid, mockGridObject, Direction.Up, mockGraphicsHandler);
        moveCommand.execute();

        expect(mockGrid.moveGridObjectToDir).toHaveBeenCalledWith(mockGridObject, Direction.Up);
        expect(mockGraphicsHandler.doAction).toHaveBeenCalledWith(
            mockGridObject.id,
            AnimationNames.PAWN_FAIL_MOVE,
            { direction: Direction.Up, time: moveCommand.moveSpeed }
        );
    });

    test('should hide and remove collectible when entering a cell with collectible', () => {
        let collectibleID = 'collectible-id';
        mockGrid.moveGridObjectToDir.mockReturnValue(true);
        const mockCollectible = { type: Constants.COLLECTIBLE, id: collectibleID };
        mockGrid.getAdjacentObjectsAtDir.mockReturnValue([mockCollectible]);

        const moveCommand = new MoveCommand(mockGrid, mockGridObject, Direction.Up, mockGraphicsHandler);
        moveCommand.execute();

        expect(mockGrid.moveGridObjectToDir).toHaveBeenCalledWith(mockGridObject, Direction.Up);
        expect(mockGraphicsHandler.doAction).toHaveBeenCalledWith(
            'test-id',
            AnimationNames.PAWN_MOVE,
            { direction: Direction.Up, time: moveCommand.moveSpeed }
        );
        expect(mockGraphicsHandler.doAction).toHaveBeenCalledWith(
            collectibleID,
            AnimationNames.PAWN_HIDE,
            { time: moveCommand.objectHideSpeed }
        );
        expect(mockGrid.removeFromGrid).toHaveBeenCalledWith(mockCollectible);
    });
});

