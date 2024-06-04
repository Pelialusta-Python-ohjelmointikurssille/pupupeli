
export class GraphicsEntity {
    // data is used by subclasses
    // eslint-disable-next-line no-unused-vars
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

    // deltaTime is used to sychronize the graphics with the game loop
    // eslint-disable-next-line no-unused-vars
    onUpdate(deltaTime) {
    }
}