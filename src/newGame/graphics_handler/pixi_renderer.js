import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";
import {Vector2} from "../../game/vector.js";

export class PixiRenderer {
    constructor() {
        this.pixiApp = null;
        this.renderLoopFunctions = [];
        // multiplication factor based on 640x640,
        // so if res is 1280x1280, the value is Vector2(2, 2) and so on
        this.renderScale = null;
        this.builtinAssets = null;
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
        this.pixiApp.ticker.add((time) =>
        {  
            this.renderLoop(time);
        });
        this.renderScale = new Vector2(renderOptions.screenWidth / 640, renderOptions.screenHeight / 640);
    }

    async loadAssetBuiltinBundles() {
        await PIXI.Assets.init({ manifest: builtinAssetManifest });
        this.builtinAssets = await PIXI.Assets.loadBundle(["characters", "backgrounds", "fonts"]);
    }

    // used to potentially load assets from other sources than builtin assets
    // that are loaded at init
    // does nothing right now
    async loadAssetBundle() {

    }

    renderLoop(time) {
        if (this.renderLoopFunctions == null || this.renderLoopFunctions.length <= 0) return;
        this.renderLoopFunctions.forEach(func => {
            func(time.deltaMS/1000);
        });
    }

    addFunctionToRenderLoop(func) {
        this.renderLoopFunctions.push(func);
    }

    addSprite(sprite) {
        this.pixiApp.stage.addChild(sprite);
    }

    destroySprite(sprite) {
        this.pixiApp.stage.removeChild(sprite);
    }
}


/**
 * Asset manifest containing asset bundles
 * of sprites for characters and backgrounds.
 * Used for all game assets.
 */
const builtinAssetManifest = {
    bundles : [
        {
            name: "characters",
            assets: [
                {
                    alias: "bunny_down",
                    src: "src/static/game_assets/bunny_front.png"
                },
                {
                    alias: "bunny_right",
                    src: "src/static/game_assets/bunny_right.png"
                },
                {
                    alias: "bunny_left",
                    src: "src/static/game_assets/bunny_left.png"
                },
                {
                    alias: "bunny_up",
                    src: "src/static/game_assets/bunny_back.png"
                }
            ]
        },
        {
            name: "backgrounds",
            assets: [
                {
                    alias: "background_grass",
                    src: "src/static/game_assets/background_grass.png"
                }
            ]
        },
        {
            name: "fonts",
            assets : [
                {
                    /*
                    Apache License
                    Version 2.0, January 2004
                    http://www.apache.org/licenses/
                    Mainly just placeholder font for testing font loading.
                    */ 
                    alias: "builtin_roboto_light",
                    src: "src/static/game_assets/Roboto-Light.ttf",
                    data: { family: 'Roboto Light' }

                }
            ]
        }
    ]
}
