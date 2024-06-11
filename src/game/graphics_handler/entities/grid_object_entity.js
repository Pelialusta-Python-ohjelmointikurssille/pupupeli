import { Vector2 } from "../../vector.js";
import { GraphicsEntity } from "./graphics_entity.js";
import { Constants } from "../../commonstrings.js";

export class GridObjectEntity extends GraphicsEntity {
    constructor(entityId, entityHandler, container, sprite, data, skins) {
        super(entityId, entityHandler, container, sprite, data, skins);
        this.gridReference = entityHandler.getMainGridObject();
        this.gridCellPosition = new Vector2(0, 0);
        this.sizeWithinCellMultiplier = 0.9;
        this.fakeZPosition = 0;
        this.currentAnimation = null;
        this.type = "grid_object";
        if (data != null) {
            if (data.position != null) {
                this.gridCellPosition = data.position;
            }
        }
        this.startPosition = new Vector2(this.gridCellPosition.x, this.gridCellPosition.y);
        this.screenPosition = this.gridReference.gridToScreenCoordinates(this.gridCellPosition);
        this.dirTexMap = new Map();
    }

    onCreate() {
        super.onCreate();
        this.sprite.anchor.set(0.5);
        this.sprite.height = this.sizeWithinCellMultiplier * this.gridReference.gridScale;
        this.sprite.width = this.sizeWithinCellMultiplier * this.gridReference.gridScale;
        this.screenPosition = this.gridReference.gridToScreenCoordinates(this.gridCellPosition);
        this.container.x = this.screenPosition.x;
        this.container.y = this.screenPosition.y;
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
        this.sprite.height = this.sizeWithinCellMultiplier * this.gridReference.gridScale;
        this.sprite.width = this.sizeWithinCellMultiplier * this.gridReference.gridScale;
        this.screenPosition = this.gridReference.gridToScreenCoordinates(this.gridCellPosition);
        this.container.x = this.screenPosition.x;
        this.container.y = this.screenPosition.y;
    }

    reset() {
        super.reset();
        this.gridCellPosition = new Vector2(this.startPosition.x, this.startPosition.y);
        this.screenPosition = this.gridReference.gridToScreenCoordinates(this.gridCellPosition);
        this.container.x = this.screenPosition.x;
        this.container.y = this.screenPosition.y;
    }
}