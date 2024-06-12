import { GraphicsEntity } from "./graphics_entity.js";

export class BackgroundEntity extends GraphicsEntity {
    constructor(entityId, entityHandler, container, sprite, data, skins) {
        super(entityId, entityHandler, container, sprite, data, skins);
        if (this.sprite !== null) {
            this.sprite.width = data.bgWidth;
            this.sprite.height = data.bgHeight;
            this.sprite.anchor.set(0.5)
            this.sprite.x += this.sprite.width / 2;
            this.sprite.y += this.sprite.height / 2;
        }
    }
}