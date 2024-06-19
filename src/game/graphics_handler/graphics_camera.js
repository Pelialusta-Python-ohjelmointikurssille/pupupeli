import { Vector2 } from "../vector.js";

/**
 * Entity used for changing viewport position and resolution scaling.
 * Acts as a virtual camera in the game world.
 */
export class GraphicsCamera {
    /**
     * 
     * @param {PIXI.Container} container Reference to PixiRenderer's cameraWorldContainer
     * @param {PIXI.Rectangle} pixiScreen Reference to PixiJS screen variable. Used to get game resolution
     * @param {Vector2} startPosition Start position of camera as a Vector2
     */
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
        this.minZoom = 0.08;
        this.maxZoom = 1;
        this.focusPaddingPercent = 0.1;
        this.container.position.x = this.screenCenter.x;
        this.container.position.y = this.screenCenter.y;
        this.totalRenderScale = this.getTotalRenderScale();
        this.updatePosition();
    }

    /**
     * Update the camera's position and associated variables
     */
    updatePosition() {
        this.totalRenderScale = this.getTotalRenderScale();
        //this.container.position.x = -this.position.x;
        //this.container.position.y = -this.position.y;
        this.container.pivot.x = this.position.x;
        this.container.pivot.y = this.position.y;
        this.container.rotation = this.rotation;
        this.container.scale = this.totalRenderScale;
    }

    /**
     * 
     * @returns {number} Total render scale taking into account resolution and camera zoom.
     */
    getTotalRenderScale() {
        return this.renderScale.x * this.zoomScale;
    }
    
    /**
     * Called every frame.
     * @param {number} deltaTime Time delta in seconds 
     */
    // deltaTime is used to sychronize the camera with the game loop
    // eslint-disable-next-line no-unused-vars
    onUpdate(deltaTime) {
        this.updatePosition();
    }


    /**
     * Move camera to a Vector2 point.
     * @param {Vector2} point 
     */
    moveToPoint(point) {
        this.position.x = point.x;
        this.position.y = point.y;
    }

    /**
     * Set camera to focus on an area, so that it fits inside camera view.
     * @param {Vector2} middle Middle position of the area.
     * @param {Vector2} size Width and height of the area.
     */
    focusOnAreaMiddle(middle, size) {
        let topLeft = new Vector2(middle.x - (size.x / 2), middle.y - (size.y / 2));
        let bottomRight = new Vector2(middle.x + (size.x / 2), middle.y + (size.y / 2));
        this.focusOnArea(topLeft, bottomRight);
    }

    /**
     * Set camera to focus on an area, so that it fits inside camera view.
     * @param {Vector2} topLeft Top left point of the area bounds.
     * @param {Vector2} bottomRight Bottom right point of the area bounds.
     */
    focusOnArea(topLeft, bottomRight) {
        let zoom = 1;
        let width = (bottomRight.x - topLeft.x);
        let height = (bottomRight.y - topLeft.y);
        let middle = new Vector2(topLeft.x + width / 2, topLeft.y + height / 2);
        this.moveToPoint(middle);

        if (width > height) zoom = 1024 / width;
        else zoom = 1024 / height;
        this.setZoom(zoom * (1 - (this.focusPaddingPercent * zoom)));
    }

    /**
     * Set camera zoom. Will be clamped if too big or small. Smaller value means more zoomed out. Bigger means more zoomed in.
     * @param {number} value 
     */
    setZoom(value) {
        if (value > this.maxZoom) this.zoomScale = this.maxZoom;
        else if (value < this.minZoom) this.zoomScale = this.minZoom;
        else this.zoomScale = value;
    }
}