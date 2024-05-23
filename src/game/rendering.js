import { Vector2 } from "./vector.js";
import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";
import { Character } from "./objects/character.js"
import { GraphicsGrid } from "./objects/gridvisualizer.js"

export class Renderer {
    constructor () {
        this.pixiApp = null;
        this.player = null;
        this.builtinAssets = null;
        this.turnTimer = 0;
        this.turnTimeSeconds = 0.5;
        this.commands = [];
        this.runnableFunc = [];
        this.isGridEnabled = true;
        this.grid = null;
    }

    async init () {
        this.pixiApp = await this.initPixi();
        await this.loadBuiltinBundles();
        this.createBackground();
        this.createGrid(8, 8);
        this.createCharacter();
        this.addProcessLoop();
    }

    async initPixi (screenWidth=640, screenHeight=640) {
        let pixiApp = new PIXI.Application();
        await pixiApp.init({
            width: screenWidth,
            height: screenHeight,
            backgroundColor: 0x1099bb,
            antialias: true
        })
        pixiApp.ticker.maxFPS = 60;
        return pixiApp;
    }

    async loadBuiltinBundles () {
        await PIXI.Assets.init({ manifest: builtinAssetManifest});
        this.builtinAssets = await PIXI.Assets.loadBundle(["builtin_characters", "builtin_backgrounds", "builtin_fonts"]);
    }

    createBackground () {
        let bg = new PIXI.Sprite(this.builtinAssets.builtin_backgrounds.background_grass);
        this.pixiApp.stage.addChild(bg);
        bg.width = this.pixiApp.screen.width;
        bg.height = this.pixiApp.screen.height;
    }

    createGrid (gWidht, gHeight) {
        this.grid = new GraphicsGrid(
            new Vector2(this.pixiApp.screen.width, this.pixiApp.screen.height),
            new Vector2(gWidht, gHeight),
            new Vector2(0, 0),
            0x000000,
            2,
            "Roboto Light"
        );
        this.pixiApp.stage.addChild(this.grid.lineContainer);
        if (this.isGridEnabled) this.grid.createLines();
    }

    createCharacter () {
        let bunnyTextures = [
            this.builtinAssets.builtin_characters.bunny_up,
            this.builtinAssets.builtin_characters.bunny_right,
            this.builtinAssets.builtin_characters.bunny_down,
            this.builtinAssets.builtin_characters.bunny_left
        ];
        this.player = new Character(new Vector2(0, 0), bunnyTextures, new Vector2(64, 64));
        this.pixiApp.stage.addChild(this.player.shadowGraphics);
        this.pixiApp.stage.addChild(this.player.renderSprite);
    }

    addFunctionToLoop(func) {
        this.runnableFunc.push(func);
    }

    toggleGrid() {
        if (this.isGridEnabled == false) {
            this.grid.createLines();
            this.isGridEnabled = true;
        }
        else {
            this.grid.removeLines();
            this.isGridEnabled = false;
        }
    }

    addProcessLoop () {
        this.pixiApp.ticker.add((time) =>
        {  
            this.runnableFunc.forEach(element => {
                element(time.deltaTime/60);
            });
            this.player.process((time.deltaTime / 60));
        });
    }
}

const builtinAssetManifest = {
    bundles : [
        {
            name: "builtin_characters",
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
            name: "builtin_backgrounds",
            assets: [
                {
                    alias: "background_grass",
                    src: "src/static/game_assets/background_grass.png"
                }
            ]
        },
        {
            name: "builtin_fonts",
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
