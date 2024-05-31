import { Vector2 } from "../../../game/vector.js";
import { GraphicsEntity } from "./graphics_entity.js";
import { MoveTween } from "../move_tween.js";


export class GridObjectEntity extends GraphicsEntity {
    constructor(entityId, entityHandler, container, sprite, data) {
        super(entityId, entityHandler, container, sprite, data);
        this.gridCellPosition = new Vector2(0, 0);
        this.gridReference = entityHandler.getGridObject();
        this.animProgress = new MoveTween(0.8, this.onFinishAnimation, this);
    }

    onCreate() {
        super.onCreate();
        // Maybe have these not hardcoded?
        this.sprite.anchor.set(0.5);
        this.sprite.height = 64;
        this.sprite.width = 64;
        this.sprite.x += 40;
        this.sprite.y += 40;
    }

    onUpdate(deltaTime) {
        super.onUpdate(deltaTime);
    }

    onFinishAnimation() {
    }

    onUpdate(deltaTime) {
        super.onUpdate(deltaTime);
        this.animProgress.increment(deltaTime);
    }

    doAction(actionId, actionData) {
    }
}