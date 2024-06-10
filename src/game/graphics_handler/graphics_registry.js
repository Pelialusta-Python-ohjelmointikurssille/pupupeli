export class GraphicsRegistry {
    constructor(graphicsHandler) {
        this.assets = null;
        this.registeredEntities = new Map();
        this.registeredAnimations = new Map();
        this.registeredEntitySkins = new Map();
        this.graphicsHandler = graphicsHandler;
    }

    registerEntity(entityType, factoryFunction) {
        this.registeredEntities.set(entityType, factoryFunction);
    }

    deRegisterEntity(entityType) {
        if (this.registeredEntities.has(entityType)) {
            this.registeredEntities.delete(entityType);
        }
    }

    registerAnimation(animationType, factoryFunction, compatibleEntities) {
        this.registeredAnimations.set(animationType, factoryFunction);
    }

    deRegisterAnimation(animationType) {
        if (this.registeredAnimations.has(animationType)) {
            this.registeredAnimations.delete(animationType);
        }
    }

    registerEntitySkin(skinName, factoryFunction) {
        this.registeredEntitySkins.set(skinName, factoryFunction);
    }

    deRegisterEntitySkin(skinName) {
        if (this.registeredEntitySkins.has(skinName)) {
            this.registeredEntitySkins.delete(skinName);
        }
    }

    createEntity(entityUUID, entityType, entityData) {
        if (this.registeredEntities.has(entityType) === false) return;
        let entity = this.registeredEntities.get(entityType).call(this, entityUUID, entityData, this.graphicsHandler.graphicsEntityHandler);
        entity.type = entityType;
        return entity;
    }

    createAnimation(animationType, animationData, entity) {
        
    }

    createEntitySkin(skinName) {

    }
}