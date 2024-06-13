import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";
import { ASSETS } from "./manifests/asset_manifest.js";
import { drawTrail } from "./mousetrailTest.js";

export class PixiRenderer {
    constructor() {
        this.pixiApp = null;
        this.renderLoopFunctions = [];
        this.builtinAssets = null;
        this.cameraWorldContainer = null;
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
        this.cameraWorldContainer = new PIXI.Container();
        this.cameraWorldContainer.sortDirty = true;
        this.pixiApp.stage.addChild(this.cameraWorldContainer);
        drawTrail(this.pixiApp);
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

    addToStage(sprite) {
        this.cameraWorldContainer.addChild(sprite);
    }

    removeFromStage(sprite) {
        this.cameraWorldContainer.removeChild(sprite);
    }
}

