import { Vector2 } from "../../../vector.js";
import { GraphicsEntity } from "../graphics_entity.js";

export class PawnEntity extends GraphicsEntity {
    constructor(entityId, entityHandler, container, sprite, data, skins) {
        super(entityId, entityHandler, container, sprite, data, skins);
        this.gridReference = entityHandler.getMainGridObject();
        this.gridPosition = new Vector2(0, 0);
        this.gridStartPosition = new Vector2(0, 0);
        this.sizeWithinCellMultiplier = 0.9;
        if (data != null) {
            if (data.gridPosition != null) {
                this.gridPosition = data.gridPosition;
                this.gridStartPosition = new Vector2(this.gridPosition.x, this.gridPosition.y);
            }
        }
        
        this.sprite.anchor.set(0.5);
        this.updatePosition();
    }

    onCreate() {
        super.onCreate();
    }

    onUpdate(deltaTime) {
        super.onUpdate(deltaTime);
    }

    onStartAnimation(name) {
        super.onStartAnimation(name);
    }

    onFinishAnimation(name) {
        super.onFinishAnimation(name);
    }

    doAnimation(animation) {
        super.doAnimation(animation);
    }

    finishAnimationsInstantly() {
        super.finishAnimationsInstantly();
        this.updatePosition();
    }

    reset() {
        super.reset();
        this.gridPosition = new Vector2(this.gridStartPosition.x, this.gridStartPosition.y);
        this.updatePosition();
    }

    updatePosition() {
        this.sprite.height = this.sizeWithinCellMultiplier * this.gridReference.gridScale;
        this.sprite.width = this.sizeWithinCellMultiplier * this.gridReference.gridScale;
        this.screenPosition = this.gridReference.gridToScreenCoordinates(this.gridPosition);
        this.container.x = this.screenPosition.x;
        this.container.y = this.screenPosition.y;
    }
}