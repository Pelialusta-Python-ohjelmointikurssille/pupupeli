import { GraphicsEntity } from "./graphics_entity.js";
import { Vector2 } from "../../../game/vector.js";
import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";

export class PlayerEntity extends GraphicsEntity {
    constructor(entityId, entityHandler, container, sprite, size) {
        super(entityId, entityHandler, container, sprite, size);
    }

    onCreate() {
        super.onCreate();
        this.sprite.anchor.set(0.5);
        this.sprite.height = 64;
        this.sprite.width = 64;
        this.sprite.x += 40;
        this.sprite.y += 40;
    }
}


