import { GraphicsEntity } from "./graphics_entity.js";
import { Vector2 } from "../../../game/vector.js";
import { GridVectorToScreenVector } from "../coord_helper.js";
import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";

export class BackgroundEntity extends GraphicsEntity {
    constructor(entityId, entityHandler, container, sprite, data) {
        super(entityId, entityHandler, container, sprite, data);
        this.entityId = entityId;
        this.entityHandler = entityHandler;
        this.container = container;
        this.sprite = sprite;
        this.isReady = true;
        this.type = "base";
        if (this.sprite !== null) {
            this.container.addChild(this.sprite);
            this.sprite.width = data.bgWidth;
            this.sprite.height = data.bgHeight;
            this.container.zIndex = -1;
        }
    }
}