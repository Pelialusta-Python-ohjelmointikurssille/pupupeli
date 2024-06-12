import { Vector2 } from "../../../vector.js";
import { GraphicsEntity } from "../graphics_entity.js";

export class PawnEntity extends GraphicsEntity {
    constructor(entityUUID, entityHandler, container, sprite, entityData, skins) {
        super(entityUUID, entityHandler, container, sprite, entityData, skins);
        this.gridReference = entityHandler.getMainGridObject();
        this.gridPosition = new Vector2(0, 0);
        this.gridStartPosition = new Vector2(0, 0);
        this.sizeWithinCellMultiplier = 0.9;
        this.sprite.anchor.set(0.5);
    }

    applyEntityData(){
        super.applyEntityData();
        if (this.entityData.gridPosition != null) {
            this.gridPosition = this.entityData.gridPosition;
        }
    }

    onCreate() {
        super.onCreate();
        this.gridStartPosition = new Vector2(this.gridPosition.x, this.gridPosition.y);
        this.updatePosition();
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