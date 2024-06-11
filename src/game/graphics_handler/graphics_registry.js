export class GraphicsRegistry {
    constructor(graphicsHandler, assets) {
        this.assets = assets;
        this.registeredEntities = new Map();
        this.registeredAnimations = new Map();
        this.registeredEntitySkins = new Map();
        this.registeredSkinInstances = new Map();
        this.registeredThemes = new Map();
        this.graphicsHandler = graphicsHandler;
    }

    registerEntity(entityType, factoryFunction) {
        this.registeredEntities.set(entityType, factoryFunction);
    }

    deRegisterEntity(entityType) {
        this.registeredEntities.delete(entityType);
    }

    registerAnimation(animationType, factoryFunction, compatibleEntities) {
        this.registeredAnimations.set(animationType, factoryFunction);
    }

    deRegisterAnimation(animationType) {
        this.registeredAnimations.delete(animationType);
    }

    registerEntitySkin(skinName, theme, factoryFunction) {
        this.registeredEntitySkins.set(skinName, factoryFunction);
        this.registeredThemes.set(skinName, theme);
    }

    deRegisterEntitySkin(skinName) {
        this.registeredEntitySkins.delete(skinName);
        this.registeredThemes.delete(skinName);
    }

    createEntity(entityUUID, entityType, entityData, skinList) {
        if (this.registeredEntities.has(entityType) === false) return;
        let skins = new Map();
        skinList.forEach(skinName => {
            let skin = this.createEntitySkin(skinName);
            if (skin != null) {
                skins.set(skinName, skin);
            }
        });
        let entity = this.registeredEntities.get(entityType).call(this, entityUUID, entityData, this.graphicsHandler.graphicsEntityHandler, skins);
        entity.type = entityType;
        return entity;
    }

    createAnimation(animationType, animationData, entity) {
        
    }

    createEntitySkin(skinName) {
        if (this.registeredEntitySkins.has(skinName) === false) return;
        if (this.registeredSkinInstances.has(skinName) === false) {
            let entitySkin = this.registeredEntitySkins.get(skinName).call(this, skinName, this.registeredThemes.get(skinName), this.assets);
            this.registeredSkinInstances.set(skinName, entitySkin);
            return entitySkin;
        }
        return this.registeredSkinInstances.get(skinName);
    }
}