import { Vector2 } from "../../../game/vector.js";
import { GraphicsEntity } from "./graphics_entity.js";
import { MoveTween } from "../move_tween.js";


export class GridObjectEntity extends GraphicsEntity {
    constructor(entityId, entityHandler, container, sprite, data) {
        super(entityId, entityHandler, container, sprite, data);
        this.gridReference = entityHandler.getGridObject();
        this.animProgress = new MoveTween(0.8, this.onFinishAnimation, this);
        this.gridCellPosition = new Vector2(0, 0);
        this.sizeWithinCellMultiplier = 0.9;
        if (data !== null) {
            if (data.position !== null) {
                this.gridCellPosition = data.position;
            }
        }
        this.screenPosition = this.gridReference.gridToScreenCoordinates(this.gridCellPosition);
    }

    onCreate() {
        super.onCreate();
        // Maybe have these not hardcoded?
        this.sprite.anchor.set(0.5);
        this.sprite.height = this.sizeWithinCellMultiplier * this.gridReference.gridScale;
        this.sprite.width = this.sizeWithinCellMultiplier * this.gridReference.gridScale;
    }

    onUpdate(deltaTime) {
        super.onUpdate(deltaTime);
        this.animProgress.increment(deltaTime);
        this.screenPosition = this.gridReference.gridToScreenCoordinates(this.gridCellPosition);
        this.container.position.x = this.screenPosition.x;
        this.container.position.y = this.screenPosition.y;
    }

    onFinishAnimation() {
    }

    doAction(actionId, actionData) {
    }
}