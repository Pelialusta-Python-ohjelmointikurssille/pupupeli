import { Vector2 } from "./vector.js";
import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";
import { Character } from "./objects/character.js"
import { GraphicsGrid } from "./objects/gridvisualizer.js"

/**
 * Class used for game visuals and PixiJS app management.
 */
export class Renderer {
    constructor () {
        this.pixiApp = null;
        this.player = null;
        this.builtinAssets = null;
        this.turnTimer = 0;
        this.turnTimeSeconds = 0.5;
        this.commands = [];
        this.runnableFunc = [];
        this.isGridEnabled = false;
        this.grid = null;

        this.onEndFunc = null;
    }
    /**
     * Initializes PixiJS.
     * Loads assets from manifest.
     * Creates game objects.
     * Starts game loop.
     */
    async init () {
        this.pixiApp = await this.initPixi();
        await this.loadBuiltinBundles();
        this.createBackground();
        this.createGrid(8, 8);
        this.createCharacter();
        this.addProcessLoop();
    }

    /**
     * Initializes PixiJS application
     * @param {*} screenWidth Width of game windows in pixels.
     * @param {*} screenHeight Height of game window in pixels.
     * @returns PixiJS app.
     */
    async initPixi (screenWidth=640, screenHeight=640) {
        let pixiApp = new PIXI.Application();
        await pixiApp.init({
            width: screenWidth,
            height: screenHeight,
            backgroundColor: 0x1099bb,
            antialias: true,
        })
        pixiApp.ticker.maxFPS = 60;
        return pixiApp;
    }

    /**
     * Loads asset bundles from manifest.
     * Contains character and background textures.
     */
    async loadBuiltinBundles () {
        await PIXI.Assets.init({ manifest: builtinAssetManifest});
        this.builtinAssets = await PIXI.Assets.loadBundle(["builtin_characters", "builtin_backgrounds", "builtin_fonts"]);
    }

    /**
     * Creates background sprite object.
     */
    createBackground () {
        let bg = new PIXI.Sprite(this.builtinAssets.builtin_backgrounds.background_grass);
        this.pixiApp.stage.addChild(bg);
        bg.width = this.pixiApp.screen.width;
        bg.height = this.pixiApp.screen.height;
    }

    /**
     * Creates grid object with lines and cell numbers.
     * @param {*} columns Number of cell columns in the grid.
     * @param {*} rows Number of cell rows in the grid.
     */
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

    /**
     * Creates the character object.
     * Also adds a shadow graphics object.
     */
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
        this.player.setOnEndFunc(this.onEndFunc);
    }

    /**
     * Used to add functions to the main game loop.
     * These given functions will be run every frame.
     * @param {*} func The function that should run every frame.
     */
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

    /**
     * Creates the PixiJS ticker loop.
     */
    addProcessLoop () {
        this.pixiApp.ticker.add((time) =>
        {  
            this.runnableFunc.forEach(element => {
                element(time.deltaTime/60);
            });
            this.player.process((time.deltaTime / 60));
        });
    }

    reset() {
        this.player.reset();
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
