import { GraphicsEntity } from "./graphics_entity.js";

/**
 * May be obsolete.Mainly used to create backgrounds.
 * However does not contain unique functionality compared to GraphicsEntity.
 */
export class BackgroundEntity extends GraphicsEntity {
    constructor(entityUUID, entityHandler, container, sprite, entityData, skins) {
        super(entityUUID, entityHandler, container, sprite, entityData, skins);
        this.container.pivot.x = entityData.size.x / 2;
        this.container.pivot.y = entityData.size.y / 2;
    }
}