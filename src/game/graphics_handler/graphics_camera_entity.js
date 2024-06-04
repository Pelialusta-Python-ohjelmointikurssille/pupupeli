import { Vector2 } from "../vector.js";

export class GraphicsCameraEntity {
    constructor(container, pixiScreen, startPosition) {
        this.container = container;
        this.pixiScreen = pixiScreen;
        this.position = startPosition;
        // 640 is an arbitrary value, just used to get consistant scales
        // accross resolutions
        // also before the resolution was 640x640
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
        // Works for resolutions that are multiples of 640x640
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

    onUpdate(deltaTime) {
        this.updatePosition();
    }
}