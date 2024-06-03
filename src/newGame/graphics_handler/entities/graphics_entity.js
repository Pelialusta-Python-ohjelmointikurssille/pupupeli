
export class GraphicsEntity {
    constructor(entityId, entityHandler, container, sprite, data) {
        this.entityId = entityId;
        this.entityHandler = entityHandler;
        this.container = container;
        this.sprite = sprite;
        this.isReady = true;
        this.type = "base";
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