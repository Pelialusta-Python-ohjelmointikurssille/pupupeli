import { GraphicsEntity } from "./graphics_entity.js";

export class BackgroundEntity extends GraphicsEntity {
    constructor(entityUUID, entityHandler, container, sprite, entityData, skins) {
        super(entityUUID, entityHandler, container, sprite, entityData, skins);
    }
}