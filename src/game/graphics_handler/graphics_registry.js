/**
 * Class used to register animations, entities and skins.
 */
export class GraphicsRegistry {
    /**
     * 
     * @param {GraphicsHandler} graphicsHandler 
     * @param {*} assets 
     */
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

    /**
     * 
     * @param {Array} entityList List of entities to be registered.
     */
    registerEntityList(entityList) {
        entityList.forEach(entObject => {
            this.registerEntity(entObject.typeName, entObject.factoryFunction);
        });
    }

    /**
     * 
     * @param {Array} animationList List of animations to be registered.
     */
    registerAnimationList(animationList) {
        animationList.forEach(animObj => {
            this.registerAnimation(animObj.typeName, animObj.factoryFunction, animObj.compatibleEntities);
        });
    }

    /**
     * 
     * @param {Array} entitySkinList List of skins to be registered. 
     */
    registerEntitySkinList(entitySkinList) {
        entitySkinList.forEach(skinObj => {
            this.registerEntitySkin(skinObj.typeName, skinObj.theme, skinObj.factoryFunction)
        });
    }

    /**
     * 
     * @param {string} entityType 
     * @param {Function} factoryFunction 
     */
    registerEntity(entityType, factoryFunction) {
        this.registeredEntities.set(entityType, factoryFunction);
    }

    /**
     * 
     * @param {string} entityType 
     */
    deRegisterEntity(entityType) {
        this.registeredEntities.delete(entityType);
    }

    /**
     * 
     * @param {string} animationType 
     * @param {Function} factoryFunction 
     * @param {Array} compatibleEntities 
     */
    registerAnimation(animationType, factoryFunction, compatibleEntities) {
        this.registeredAnimations.set(animationType, factoryFunction);
        if (this.animationCompatability.has(animationType)) {
            this.animationCompatability.set(animationType, this.animationCompatability.get(animationType).concat(compatibleEntities));
        } else {
            this.animationCompatability.set(animationType, compatibleEntities);
        }
    }

    /**
     * 
     * @param {string} animationType 
     */
    deRegisterAnimation(animationType) {
        this.registeredAnimations.delete(animationType);
    }

    /**
     * 
     * @param {string} skinName 
     * @param {string} theme 
     * @param {Function} factoryFunction 
     */
    registerEntitySkin(skinName, theme, factoryFunction) {
        this.registeredEntitySkins.set(skinName, factoryFunction);
        this.registeredThemes.set(skinName, theme);
    }

    /**
     * 
     * @param {string} skinName 
     */
    deRegisterEntitySkin(skinName) {
        this.registeredEntitySkins.delete(skinName);
        this.registeredThemes.delete(skinName);
    }

    /**
     * 
     * @param {string} entityUUID 
     * @param {string} entityType 
     * @param {object} entityData 
     * @param {Array} skinList 
     * @returns {GraphicsEntity} Entity of given type.
     */
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

    /**
     * 
     * @param {string} animationType 
     * @param {object} animationData 
     * @param {GraphicsEntity} entity 
     * @returns Animation
     */
    createAnimation(animationType, animationData, entity) {
        if (this.registeredAnimations.has(animationType) === false) return;
        if (this.animationCompatability.get(animationType).includes(entity) === false && this.animationCompatability.get(animationType) > 0) return;
        let animation = this.registeredAnimations.get(animationType).call(this, animationType, entity, animationData);
        return animation;
    }

    /**
     * 
     * @param {string} skinName 
     * @returns {EntitySkin}
     */
    createEntitySkin(skinName) {
        // This also pools already created skins, since they don't need to be unique per entity
        // and are only used to store references to data.
        if (this.registeredEntitySkins.has(skinName) === false) return;
        if (this.registeredSkinInstances.has(skinName) === false) {
            let entitySkin = this.registeredEntitySkins.get(skinName).call(this, skinName, this.registeredThemes.get(skinName), this.assets);
            this.registeredSkinInstances.set(skinName, entitySkin);
            return entitySkin;
        }
        return this.registeredSkinInstances.get(skinName);
    }
}