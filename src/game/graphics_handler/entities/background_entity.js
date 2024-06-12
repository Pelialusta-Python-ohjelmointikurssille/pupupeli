import { GraphicsEntity } from "./graphics_entity.js";

export class BackgroundEntity extends GraphicsEntity {
    constructor(entityId, entityHandler, container, sprite, data, skins) {
        super(entityId, entityHandler, container, sprite, data, skins);
        if (this.sprite !== null) {
            this.sprite.width = data.bgWidth;
            this.sprite.height = data.bgHeight;
        }
    }
}