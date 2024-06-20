import { GraphicsRegistry } from '../graphics_registry'; 

class MockGraphicsHandler {
    constructor() {
        this.graphicsEntityHandler = {};
    }
}

const mockFactoryFunction = jest.fn((...args) => args);
const mockAssets = {};

describe('GraphicsRegistry', () => {
    let graphicsRegistry;
    let mockGraphicsHandler;

    beforeEach(() => {
        mockGraphicsHandler = new MockGraphicsHandler();
        graphicsRegistry = new GraphicsRegistry(mockGraphicsHandler, mockAssets);
    });

    describe('registerEntity', () => {
        it('should register an entity', () => {
            graphicsRegistry.registerEntity('testEntity', mockFactoryFunction);
            expect(graphicsRegistry.registeredEntities.get('testEntity')).toBe(mockFactoryFunction);
        });
    });

    describe('registerEntityList', () => {
        it('should register a list of entities', () => {
            const entityList = [
                { typeName: 'entity1', factoryFunction: mockFactoryFunction },
                { typeName: 'entity2', factoryFunction: mockFactoryFunction }
            ];
            graphicsRegistry.registerEntityList(entityList);
            expect(graphicsRegistry.registeredEntities.has('entity1')).toBe(true);
            expect(graphicsRegistry.registeredEntities.has('entity2')).toBe(true);
        });
    });

    describe('deRegisterEntity', () => {
        it('should deregister an entity', () => {
            graphicsRegistry.registerEntity('testEntity', mockFactoryFunction);
            graphicsRegistry.deRegisterEntity('testEntity');
            expect(graphicsRegistry.registeredEntities.has('testEntity')).toBe(false);
        });
    });

    describe('registerAnimationList', () => {
        it('should register a list of animations', () => {
            const animationList = [
                { typeName: 'anim1', factoryFunction: mockFactoryFunction, compatibleEntities: ['entity1'] },
                { typeName: 'anim2', factoryFunction: mockFactoryFunction, compatibleEntities: ['entity2'] }
            ];
            graphicsRegistry.registerAnimationList(animationList);
            expect(graphicsRegistry.registeredAnimations.has('anim1')).toBe(true);
            expect(graphicsRegistry.registeredAnimations.has('anim2')).toBe(true);
        });
    });

    describe('registerAnimation', () => {
        it('should register an animation', () => {
            graphicsRegistry.registerAnimation('testAnimation', mockFactoryFunction, ['entity1']);
            expect(graphicsRegistry.registeredAnimations.get('testAnimation')).toBe(mockFactoryFunction);
            expect(graphicsRegistry.animationCompatability.get('testAnimation')).toEqual(['entity1']);
        });
    });

    describe('deRegisterAnimation', () => {
        it('should deregister an animation', () => {
            graphicsRegistry.registerAnimation('testAnimation', mockFactoryFunction, ['entity1']);
            graphicsRegistry.deRegisterAnimation('testAnimation');
            expect(graphicsRegistry.registeredAnimations.has('testAnimation')).toBe(false);
        });
    });

    describe('registerEntitySkin', () => {
        it('should register an entity skin', () => {
            graphicsRegistry.registerEntitySkin('testSkin', 'testTheme', mockFactoryFunction);
            expect(graphicsRegistry.registeredEntitySkins.get('testSkin')).toBe(mockFactoryFunction);
            expect(graphicsRegistry.registeredThemes.get('testSkin')).toBe('testTheme');
        });
    });

    describe('registerEntitySkinList', () => {
        it('should register a list of entity skins', () => {
            const skinList = [
                { typeName: 'skin1', theme: 'theme1', factoryFunction: mockFactoryFunction },
                { typeName: 'skin2', theme: 'theme2', factoryFunction: mockFactoryFunction }
            ];
            graphicsRegistry.registerEntitySkinList(skinList);
            expect(graphicsRegistry.registeredEntitySkins.has('skin1')).toBe(true);
            expect(graphicsRegistry.registeredEntitySkins.has('skin2')).toBe(true);
        });
    });

    describe('deRegisterEntitySkin', () => {
        it('should deregister an entity skin', () => {
            graphicsRegistry.registerEntitySkin('testSkin', 'testTheme', mockFactoryFunction);
            graphicsRegistry.deRegisterEntitySkin('testSkin');
            expect(graphicsRegistry.registeredEntitySkins.has('testSkin')).toBe(false);
            expect(graphicsRegistry.registeredThemes.has('testSkin')).toBe(false);
        });
    });

    describe('createEntity', () => {
        it('should return undefined for unregistered entity type', () => {
            const entity = graphicsRegistry.createEntity('uuid1', 'unregisteredEntity', {}, null);
            expect(entity).toBeUndefined();
        });
    });

    describe('createAnimation', () => {
        it('should create an animation', () => {
            graphicsRegistry.registerAnimation('testAnimation', mockFactoryFunction, ['testEntity']);
            const animation = graphicsRegistry.createAnimation('testAnimation', { some: 'data' }, 'testEntity');
            expect(animation).toEqual(['testAnimation', 'testEntity', { some: 'data' }]);
        });

        it('should return undefined for unregistered animation type', () => {
            const animation = graphicsRegistry.createAnimation('unregisteredAnimation', {}, 'testEntity');
            expect(animation).toBeUndefined();
        });
    });

    describe('createAnimation with no compatibility specified', () => {
        it('should create an animation when no compatibility specified', () => {
            graphicsRegistry.registerAnimation('testAnimation', mockFactoryFunction, []);
            const animation = graphicsRegistry.createAnimation('testAnimation', { some: 'data' }, 'testEntity');
            expect(animation).toEqual(['testAnimation', 'testEntity', { some: 'data' }]);
        });
    });

    describe('createEntitySkin with pooled instance', () => {
        it('should reuse already created skin instances', () => {
            graphicsRegistry.registerEntitySkin('testSkin', 'testTheme', mockFactoryFunction);
            const skin1 = graphicsRegistry.createEntitySkin('testSkin');
            const skin2 = graphicsRegistry.createEntitySkin('testSkin');
            expect(skin1).toBe(skin2);
        });
    });

    describe('createEntitySkin', () => {
        it('should create an entity skin', () => {
            graphicsRegistry.registerEntitySkin('testSkin', 'testTheme', mockFactoryFunction);
            const skin = graphicsRegistry.createEntitySkin('testSkin');
            expect(skin).toEqual(['testSkin', 'testTheme', mockAssets]);
        });

        it('should return undefined for unregistered skin name', () => {
            const skin = graphicsRegistry.createEntitySkin('unregisteredSkin');
            expect(skin).toBeUndefined();
        });

        it('should pool already created skins', () => {
            graphicsRegistry.registerEntitySkin('testSkin', 'testTheme', mockFactoryFunction);
            const skin1 = graphicsRegistry.createEntitySkin('testSkin');
            const skin2 = graphicsRegistry.createEntitySkin('testSkin');
            expect(skin1).toBe(skin2);
        });
    });

    describe('createEntity', () => {
        let graphicsRegistry;
        let mockGraphicsHandler;
        const mockFactoryFunction = jest.fn((uuid, data, handler, skins) => ({
            uuid, data, handler, skins
        }));
    
        beforeEach(() => {
            mockGraphicsHandler = new MockGraphicsHandler();
            graphicsRegistry = new GraphicsRegistry(mockGraphicsHandler, mockAssets);
        });
    
        it('should return undefined for unregistered entity type', () => {
            const entity = graphicsRegistry.createEntity('uuid1', 'unregisteredEntity', {}, null);
            expect(entity).toBeUndefined();
        });
    
        it('should call the correct factory function with the correct parameters', () => {
            graphicsRegistry.registerEntity('testEntity', mockFactoryFunction);
            const entityUUID = 'uuid1';
            const entityData = { some: 'data' };
            graphicsRegistry.createEntity(entityUUID, 'testEntity', entityData, null);
            expect(mockFactoryFunction).toHaveBeenCalledWith(entityUUID, entityData, mockGraphicsHandler.graphicsEntityHandler, new Map());
        });
    });
    
});
