import { PIXI } from "../../external_dependencies.js";
import { ASSETS } from "./manifests/asset_manifest.js";

export class PixiRenderer {
    constructor() {
        this.pixiApp = null;
        this.renderLoopFunctions = [];
        this.builtinAssets = null;
        this.cameraWorldContainer = null;
        this.uiContainer = null;
    }

    async initialize(renderOptions) {
        this.pixiApp = new PIXI.Application();
        await this.pixiApp.init({
            width: renderOptions.screenWidth,
            height: renderOptions.screenHeight,
            backgroundColor: 0x1099bb,
            antialias: renderOptions.antialias,
        })
        this.pixiApp.ticker.maxFPS = renderOptions.maxFPS;
        await this.loadAssetBuiltinBundles();
        this.pixiApp.ticker.add((time) => {
            this.renderLoop(time);
        });
        this.cameraWorldContainer = new PIXI.Container({ interractiveChildren: false });
        this.uiContainer = new PIXI.Container();
        this.cameraWorldContainer.sortDirty = true;
        this.pixiApp.stage.addChild(this.cameraWorldContainer);
        this.uiContainer.sortDirty = true;
        this.pixiApp.stage.addChild(this.uiContainer);
    }

    async loadAssetBuiltinBundles() {
        let t1 = new Date().getTime();

        await PIXI.Assets.init({ manifest: ASSETS });
        this.builtinAssets = await PIXI.Assets.loadBundle(["characters", "backgrounds", "fonts", "collectibles", "obstacles", "ui"]);

        let t2 = new Date().getTime();
        console.log(`Loading assets took ${t2 - t1}ms`);
    }

    renderLoop(time) {
        if (this.renderLoopFunctions == null || this.renderLoopFunctions.length <= 0) return;
        this.renderLoopFunctions.forEach(loopObject => {
            loopObject.f.call(loopObject.o, time.deltaMS / 1000);
        });
    }

    addFunctionToRenderLoop(func, object) {
        this.renderLoopFunctions.push({ f: func, o: object });
    }

    addToStage(container) {
        this.cameraWorldContainer.addChild(container);
    }

    removeFromStage(container) {
        this.cameraWorldContainer.removeChild(container);
    }

    addToUI(container) {
        this.uiContainer.addChild(container);
    }

    removeFromUI(container) {
        this.uiContainer.removeChild(container);
    }
}

