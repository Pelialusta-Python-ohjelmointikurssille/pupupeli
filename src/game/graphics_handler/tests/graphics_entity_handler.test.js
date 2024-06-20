import { GraphicsEntitySystem } from '../graphics_entity_handler';

jest.mock('../graphics_camera');
jest.mock('../../vector.js');

describe('GraphicsEntitySystem', () => {
    let rendererMock, graphicsHandlerMock, graphicsRegistryMock, entitySystem;

    beforeEach(() => {
        rendererMock = {
            builtinAssets: {},
            addToStage: jest.fn(),
            removeFromStage: jest.fn(),
            cameraWorldContainer: {},
            pixiApp: { screen: {} }
        };
        graphicsHandlerMock = { onEntitiesReady: jest.fn() };
        graphicsRegistryMock = {
            createEntity: jest.fn(),
            createAnimation: jest.fn()
        };
        entitySystem = new GraphicsEntitySystem(rendererMock, graphicsHandlerMock, graphicsRegistryMock);
    });

    test('should create graphics entity', () => {
        const entityId = 'test-entity';
        const type = 'grid';
        const data = {};
        const skins = [];
        const entityMock = {
            container: {},
            onCreate: jest.fn()
        };
        graphicsRegistryMock.createEntity.mockReturnValue(entityMock);

        entitySystem.createGraphicsEntity(entityId, type, data, skins);

        expect(graphicsRegistryMock.createEntity).toHaveBeenCalledWith(entityId, type, data, skins);
        expect(rendererMock.addToStage).toHaveBeenCalledWith(entityMock.container);
        expect(entityMock.onCreate).toHaveBeenCalled();
        expect(entitySystem.entityDict.get(entityId)).toBe(entityMock);
        expect(entitySystem.mainGridEntityUUID).toBe(entityId);
    });

    test('should destroy graphics entity', () => {
        const entityId = 'test-entity';
        const entityMock = { container: {} };
        entitySystem.entityDict.set(entityId, entityMock);

        entitySystem.destroyGraphicsEntity(entityId);

        expect(rendererMock.removeFromStage).toHaveBeenCalledWith(entityMock.container);
        expect(entitySystem.entityDict.has(entityId)).toBe(false);
    });

    test('should play animation on entity', () => {
        const entityId = 'test-entity';
        const animationId = 'test-animation';
        const animationData = {};
        const entityMock = {
            doAnimation: jest.fn()
        };
        const animationMock = {};
        entitySystem.entityDict.set(entityId, entityMock);
        graphicsRegistryMock.createAnimation.mockReturnValue(animationMock);

        entitySystem.doAction(entityId, animationId, animationData);

        expect(graphicsRegistryMock.createAnimation).toHaveBeenCalledWith(animationId, animationData, entityMock);
        expect(entityMock.doAnimation).toHaveBeenCalledWith(animationMock);
    });

    test('should reset all grid objects', () => {
        const entityMock = { reset: jest.fn() };
        entitySystem.entityDict.set('test-entity', entityMock);

        entitySystem.resetGridObjects();

        expect(entityMock.reset).toHaveBeenCalled();
    });

    test('should skip and finish all animations', () => {
        const entityMock = { finishAnimationsInstantly: jest.fn() };
        entitySystem.entityDict.set('test-entity', entityMock);

        entitySystem.skipAnimationsAndFinish();

        expect(entityMock.finishAnimationsInstantly).toHaveBeenCalled();
    });

    test('should destroy all textboxes', () => {
        const entityMock1 = { type: 'textbox' };
        const entityMock2 = { type: 'other' };
        entitySystem.entityDict.set('textbox-entity', entityMock1);
        entitySystem.entityDict.set('other-entity', entityMock2);

        entitySystem.destroyTextBoxes();

        expect(entitySystem.entityDict.has('textbox-entity')).toBe(false);
        expect(entitySystem.entityDict.has('other-entity')).toBe(true);
    });

    test('should set entity themes', () => {
        const entityMock = { setTheme: jest.fn() };
        entitySystem.entityDict.set('test-entity', entityMock);
        const theme = 'dark';

        entitySystem.setEntityThemes(theme);

        expect(entityMock.setTheme).toHaveBeenCalledWith(theme);
    });

    test('should get main grid object', () => {
        const entityId = 'main-grid-entity';
        const entityMock = { container: {} };
        entitySystem.entityDict.set(entityId, entityMock);
        entitySystem.mainGridEntityUUID = entityId;
    
        const mainGridObject = entitySystem.getMainGridObject();
    
        expect(mainGridObject).toBe(entityMock);
    });

    test('should not call onEntitiesReady if entities are not ready', () => {
        const entityMock1 = { onUpdate: jest.fn(), isReady: false };
        const entityMock2 = { onUpdate: jest.fn(), isReady: true };
        entitySystem.entityDict.set('entity1', entityMock1);
        entitySystem.entityDict.set('entity2', entityMock2);
        entitySystem.camera = { onUpdate: jest.fn() };
    
        entitySystem.updateAllEntities(0.16);
    
        expect(entitySystem.camera.onUpdate).toHaveBeenCalledWith(0.16);
        expect(entityMock1.onUpdate).toHaveBeenCalledWith(0.16);
        expect(entityMock2.onUpdate).toHaveBeenCalledWith(0.16);
        expect(graphicsHandlerMock.onEntitiesReady).not.toHaveBeenCalled();
    });
});
