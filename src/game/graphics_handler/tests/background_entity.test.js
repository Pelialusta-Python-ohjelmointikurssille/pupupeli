import { BackgroundEntity } from '../entities/background_entity';
import { GraphicsEntity } from '../entities/graphics_entity';

jest.mock('../entities/graphics_entity');

describe('BackgroundEntity', () => {
    let mockUUID;
    let mockEntityHandler;
    let mockContainer;
    let mockSprite;
    let mockEntityData;
    let mockSkins;

    beforeEach(() => {
        mockUUID = 'test-uuid';
        mockEntityHandler = {};
        mockContainer = {};
        mockSprite = {
            position: { x: 0, y: 0 },
            anchor: { set: jest.fn() },
        };
        mockEntityData = {
            size: { x: 800, y: 600 },
        };
        mockSkins = {};

        GraphicsEntity.mockImplementation(() => {
            return {
                sprite: mockSprite,
            };
        });
    });

    it('should initialize correctly and set sprite properties', () => {

        const backgroundEntity = new BackgroundEntity(
            mockUUID,
            mockEntityHandler,
            mockContainer,
            mockSprite,
            mockEntityData,
            mockSkins
        );

        expect(GraphicsEntity).toHaveBeenCalledWith(
            mockUUID,
            mockEntityHandler,
            mockContainer,
            mockSprite,
            mockEntityData,
            mockSkins
        );

        expect(mockSprite.position.x).toBe(mockEntityData.size.x / 4);
        expect(mockSprite.position.y).toBe(mockEntityData.size.y / 4);

        expect(mockSprite.anchor.set).toHaveBeenCalledWith(0.5);
    });

});
