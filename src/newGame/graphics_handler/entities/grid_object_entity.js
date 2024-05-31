import { Vector2 } from "../../../game/vector.js";
import { GraphicsEntity } from "./graphics_entity.js";
import { AnimationProgress } from "../move_tween.js";


export class GridObjectEntity extends GraphicsEntity {
    constructor(entityId, entityHandler, container, sprite, data) {
        super(entityId, entityHandler, container, sprite, data);
        this.gridReference = entityHandler.getGridObject();
        this.gridCellPosition = new Vector2(0, 0);
        this.sizeWithinCellMultiplier = 0.9;
        this.animations = new Map();
        if (data !== null) {
            if (data.position !== null) {
                this.gridCellPosition = data.position;
            }
        }
        this.screenPosition = this.gridReference.gridToScreenCoordinates(this.gridCellPosition);
    }

    onCreate() {
        super.onCreate();
        this.sprite.anchor.set(0.5);
        this.sprite.height = this.sizeWithinCellMultiplier * this.gridReference.gridScale;
        this.sprite.width = this.sizeWithinCellMultiplier * this.gridReference.gridScale;
    }

    onUpdate(deltaTime) {
        super.onUpdate(deltaTime);
        this.animations.forEach((value, key, map) => {
            value.increment(deltaTime);
        })
    }

    onStartAnimation(name) {
        console.log(this.entityId + " started animation: " + name);
    }

    onFinishAnimation(name) {
        console.log(this.entityId + " finished animation: " + name);
    }

    doAction(actionId, actionData) {
    }
}