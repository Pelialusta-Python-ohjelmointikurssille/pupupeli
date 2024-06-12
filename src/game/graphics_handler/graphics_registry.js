export class GraphicsRegistry {
    constructor(graphicsHandler, assets) {
        this.assets = assets;
        this.registeredEntities = new Map();
        this.registeredAnimations = new Map();
        this.registeredEntitySkins = new Map();
        this.registeredSkinInstances = new Map();
        this.registeredThemes = new Map();
        this.animationCompatability = new Map();
        this.graphicsHandler = graphicsHandler;
    }

    registerEntityList(entityList) {
        entityList.forEach(entObject => {
            this.registerEntity(entObject.typeName, entObject.factoryFunction);
        });
    }

    registerAnimationList(animationList) {
        animationList.forEach(animObj => {
            this.registerAnimation(animObj.typeName, animObj.factoryFunction, animObj.compatibleEntities);
        });
    }

    registerEntitySkinList(entitySkinList) {
        entitySkinList.forEach(skinObj => {
            this.registerEntitySkin(skinObj.typeName, skinObj.theme, skinObj.factoryFunction)
        });
    }

    registerEntity(entityType, factoryFunction) {
        this.registeredEntities.set(entityType, factoryFunction);
    }

    deRegisterEntity(entityType) {
        this.registeredEntities.delete(entityType);
    }

    registerAnimation(animationType, factoryFunction, compatibleEntities) {
        this.registeredAnimations.set(animationType, factoryFunction);
        if (this.animationCompatability.has(animationType)) {
            this.animationCompatability.set(animationType, this.animationCompatability.get(animationType).concat(compatibleEntities));
        } else {
            this.animationCompatability.set(animationType, compatibleEntities);
        }
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
        if (skinList != null) {
            skinList.forEach(skinName => {
                let skin = this.createEntitySkin(skinName);
                if (skin != null) {
                    skins.set(skinName, skin);
                }
            });
        }
        let entity = this.registeredEntities.get(entityType).call(this, entityUUID, entityData, this.graphicsHandler.graphicsEntityHandler, skins);
        entity.type = entityType;
        return entity;
    }

    createAnimation(animationType, animationData, entity) {
        if (this.registeredAnimations.has(animationType) === false) return;
        if (this.animationCompatability.get(animationType).includes(entity) === false && this.animationCompatability.get(animationType) > 0) return;
        let animation = this.registeredAnimations.get(animationType).call(this, animationType, entity, animationData);
        return animation;
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