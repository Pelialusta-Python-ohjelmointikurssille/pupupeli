import { Vector2 } from "../../../game/vector.js";
import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";

export class GraphicsEntity {
    constructor(entityId, entityHandler, container, sprite, data) {
        this.entityId = entityId;
        this.entityHandler = entityHandler;
        this.container = container;
        this.sprite = sprite;
        this.isReady = true;
        if (this.sprite !== null) {
            this.container.addChild(this.sprite);
        }
    }

    onCreate() {
    }

    onDestroy() {
    }

    onUpdate(deltaTime) {
    }

    doAction(actionId, actionData) {
    }
}