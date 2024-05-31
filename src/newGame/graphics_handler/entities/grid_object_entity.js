import { Vector2 } from "../../../game/vector.js";
import { GraphicsEntity } from "./graphics_entity.js";


export class GridObjectEntity extends GraphicsEntity {
    constructor(entityId, entityHandler, container, sprite, data) {
        super(entityId, entityHandler, container, sprite, data);
        this.gridCellPosition = new Vector2(0, 0);
    }

    onCreate() {
        super.onCreate();
    }

    onUpdate(deltaTime) {
        super.onUpdate(deltaTime);
    }
}