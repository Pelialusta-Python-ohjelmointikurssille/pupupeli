import { GraphicsEntity } from "./graphics_entity.js";
import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";


export class TrailEntity extends GraphicsEntity {
    constructor(entityId, entityHandler, container, sprite, data,) {
        super(entityId, entityHandler, container, sprite, data);

        this.lineGraphic = new PIXI.Graphics();

        this.container.addChild(this.lineGraphic);

    }
}