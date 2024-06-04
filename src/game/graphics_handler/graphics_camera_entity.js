import { Vector2 } from "../vector.js";

export class GraphicsCameraEntity {
    constructor(container, pixiScreen, startPosition) {
        this.container = container;
        this.pixiScreen = pixiScreen;
        this.position = startPosition;
        // 1024 is an arbitrary value, just used to get consistant scales
        // accross resolutions. Default resolution is 1024x1024
        this.renderScale = new Vector2(pixiScreen.width / 1024, pixiScreen.height / 1024);
        this.screenCenter = new Vector2(pixiScreen.width / 2, pixiScreen.height / 2)
        this.zoomScale = 1;
        this.rotation = 0;
        this.container.pivot.x = this.screenCenter.x;
        this.container.pivot.y = this.screenCenter.y;
        this.totalRenderScale = this.getTotalRenderScale();
        this.updatePosition();
    }

    updatePosition() {
        this.totalRenderScale = this.getTotalRenderScale();
        // TODO: Solve this mess and how to properly make correct resolution scaling
        this.container.position.x = (this.position.x + this.screenCenter.x) * (this.getTotalRenderScale());
        this.container.position.y = (this.position.y + this.screenCenter.y) * (this.getTotalRenderScale());
        this.container.rotation = this.rotation;
        this.container.scale = this.totalRenderScale;
        this.container.rotation = this.rotation;
    }

    getTotalRenderScale() {
        return this.renderScale.x * this.zoomScale;
    }

    onCreate() {

    }

    onDestroy() {

    }

    // deltaTime is used to sychronize the camera with the game loop
    // eslint-disable-next-line no-unused-vars
    onUpdate(deltaTime) {
        this.updatePosition();
    }
}