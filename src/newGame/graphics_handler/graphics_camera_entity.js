import { Vector2 } from "../../game/vector.js";

export class GraphicsCameraEntity {
    constructor(container, pixiScreen, startPosition) {
        this.container = container;
        this.pixiScreen = pixiScreen;
        this.position = startPosition;
        this.renderScale = new Vector2(pixiScreen.width / 640, pixiScreen.height / 640);
        this.screenCenter = new Vector2(pixiScreen.width / 2, pixiScreen.height / 2)
        this.zoomScale = 1;
        this.rotation = 0;
        this.totalRenderScale = this.getTotalRenderScale();
        //this.container.pivot.x = this.screenCenter.x;
        //this.container.pivot.y = this.screenCenter.y;
        this.updateContainerValues();
    }

    updateContainerValues() {
        this.container.position.x = this.position.x;
        this.container.position.y = this.position.y;
        this.container.rotation = this.rotation;
        this.container.scale = this.totalRenderScale;
    }

    getTotalRenderScale() {
        return this.renderScale.x * this.zoomScale;
    }

    onCreate() {

    }

    onDestroy() {

    }

    onUpdate(deltaTime) {
        this.updateContainerValues();
    }
}