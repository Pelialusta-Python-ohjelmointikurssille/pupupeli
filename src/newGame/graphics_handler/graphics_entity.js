import { Vector2 } from "../../game/vector.js";

export class GraphicsEntity {
    constructor(entityId, entityHandler, startPosition, size, rotation) {
        this.entityId = entityId;
        this.entityHandler = entityHandler;
        this.position = startPosition;
        this.width = size.x;
        this.height = size.y;
        this.rotation = rotation;
    }

    onCreate() {

    }

    onDestroy() {

    }

    onUpdate() {
        
    }

    doAnimation() {

    }
}