import { GraphicsEntity } from "./graphics_entity.js";

/**
 * May be obsolete.Mainly used to create backgrounds.
 * However does not contain unique functionality compared to GraphicsEntity.
 */
export class BackgroundEntity extends GraphicsEntity {
    constructor(entityUUID, entityHandler, container, sprite, entityData, skins) {
        super(entityUUID, entityHandler, container, sprite, entityData, skins);
        this.sprite.position.x = entityData.size.x / 4;
        this.sprite.position.y = entityData.size.y / 4;
        this.sprite.anchor.set(0.5);
        //this.sprite.tileScale.x = 0.5;
        //this.sprite.tileScale.y = 0.5;
    }
}