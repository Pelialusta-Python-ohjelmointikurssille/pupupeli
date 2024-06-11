import { GraphicsEntity } from "./graphics_entity.js";

export class BackgroundEntity extends GraphicsEntity {
    constructor(entityId, entityHandler, container, sprite, data, skins) {
        super(entityId, entityHandler, container, sprite, data);
        this.entityId = entityId;
        this.entityHandler = entityHandler;
        this.container = container;
        this.sprite = sprite;
        this.isReady = true;
        this.type = "background";
        if (this.sprite !== null) {
            this.container.addChild(this.sprite);
            this.sprite.width = data.bgWidth;
            this.sprite.height = data.bgHeight;
            this.container.zIndex = -1;
        }
    }
}