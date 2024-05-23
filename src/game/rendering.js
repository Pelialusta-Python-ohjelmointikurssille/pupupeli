import { Vector2 } from "./vector.js";
import { Direction } from "./direction.js"
import { GridVectorToScreenVector } from "./coord_helper.js";
import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";
import { InitGame, MovePupu } from "./initgame.js"

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
        }
    ]
};

class Renderer {
    constructor () {
        this.pixiApp = null;
        this.characterObject = null;
        this.builtinAssets = null;
        this.turnTimer = 0;
        this.turnTimeSeconds = 0.5;
        this.commands = [];
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
        this.builtinAssets = await PIXI.Assets.loadBundle(["builtin_characters", "builtin_backgrounds"]);
    }

    async init () {
        this.pixiApp = await this.initPixi();
        await this.loadBuiltinBundles();
        this.createBackground();
        this.createGrid();
        this.createCharacter();
    }

    createBackground () {
        let bg = new PIXI.Sprite(this.builtinAssets.builtin_backgrounds.background_grass);
        this.pixiApp.stage.addChild(bg);
        bg.width = this.pixiApp.screen.width;
        bg.height = this.pixiApp.screen.height;
    }

    createGrid () {
        let grid = new GraphicsGrid(new Vector2(this.pixiApp.screen.width, this.pixiApp.screen.height), new Vector2(8, 8), new Vector2(0, 0), 0x003300, 2);
        this.pixiApp.stage.addChild(grid.lineContainer);
    }

    createCharacter () {
        let bunnyTextures = [
            this.builtinAssets.builtin_characters.bunny_up,
            this.builtinAssets.builtin_characters.bunny_right,
            this.builtinAssets.builtin_characters.bunny_down,
            this.builtinAssets.builtin_characters.bunny_left
        ];
        this.characterObject = new Character(new Vector2(0, 0), bunnyTextures, new Vector2(64, 64));
        this.pixiApp.stage.addChild(this.characterObject.shadowGraphics);
        this.pixiApp.stage.addChild(this.characterObject.renderSprite);
    }

    processTurn () {
        if (this.commands == null) {
            return;
        }
        if (this.commands.length <= 0) {
            return;
        }

        switch (this.commands.shift()) {
            case "oikea":
                onMovePupu(1, 0)
                break;
            case "vasen":
                onMovePupu(-1, 0)
                break;
            case "ylös":
                onMovePupu(0, -1)
                break;
            case "alas":
                onMovePupu(0, 1)
                break;
        }
        
        
    }

    addProcessLoop () {
        this.pixiApp.ticker.add((time) =>
        {  
            if (this.turnTimer < this.turnTimeSeconds) {
                this.turnTimer += time.deltaTime / 60;
            }
            if (this.turnTimer >= this.turnTimeSeconds) {
                this.processTurn();
                this.turnTimer = 0;
            }
            this.characterObject.process((time.deltaTime / 60));
        });
    }
}

class Character {
    constructor (gridPosition, textures, size) {
        this.gridPosition = gridPosition;
        this.screenPosition = this.getScreenPosition(this.gridPosition);
        this.direction = Direction.Right;
        this.textures = textures;
        this.renderSprite = new PIXI.Sprite(this.textures[0]);
        this.renderSprite.anchor.set(0.5);
        this.renderSprite.width = size.x;
        this.renderSprite.height = size.y;
        this.renderSprite.x = this.screenPosition.x;
        this.renderSprite.y = this.screenPosition.y;
        this.moveDirection = new Vector2(0, 0);
        this.oldPosition = new Vector2(this.screenPosition.x, this.screenPosition.y);
        this.isMoving = false;
        this.moveSpeed = 4;
        this.moveProgress = 0;
        this.scaledMoveDirection = this.moveDirection;
        this.shadowGraphics = new PIXI.Graphics();
        this.shadowGraphics.ellipse(0, 0, 20, 10);
        this.shadowGraphics.fill(0x000000, 0.35);
        this.shadowGraphics.x = this.screenPosition.x;
        this.shadowGraphics.y = this.screenPosition.y+28;
        this.unmodifiedScreenPos = new Vector2(this.screenPosition.x, this.screenPosition.y);
    }

    getScreenPosition (position) {
        return GridVectorToScreenVector(position, new Vector2(640, 640), new Vector2(8, 8));
    }

    getCoordinateScale () {
        return 80;
    }

    moveToDirection (direction) {
        if (this.isMoving) {
            return;
        }
        this.direction = direction;
        this.renderSprite.texture = this.textures[direction];
        this.isMoving = true;
        this.oldPosition = new Vector2(this.screenPosition.x, this.screenPosition.y);
        if (direction == 0) {
            this.gridPosition.y -= 1
            this.moveDirection = new Vector2(0, -1);
        }
        else if (direction == 1) {
            this.gridPosition.x += 1
            this.moveDirection = new Vector2(1, 0);
        }
        else if (direction == 2) {
            this.gridPosition.y += 1
            this.moveDirection = new Vector2(0, 1);
        }
        else if (direction == 3) {
            this.gridPosition.x -= 1
            this.moveDirection = new Vector2(-1, 0);
        }
    }

    getJumpHeigh(progress) {
        return -(Math.sin(Math.PI * progress)**0.75) * this.getCoordinateScale() * 0.3;
    }

    process (deltaTime) {
        if (this.isMoving) {
            if (this.moveProgress < 1 - (deltaTime * this.moveSpeed)) {
                this.moveProgress += (deltaTime * this.moveSpeed);
                this.scaledMoveDirection = this.moveDirection.MultipliedBy(this.getCoordinateScale());
                this.unmodifiedScreenPos.x = this.oldPosition.x + (this.scaledMoveDirection.x * this.moveProgress);
                this.unmodifiedScreenPos.y = this.oldPosition.y + (this.scaledMoveDirection.y * this.moveProgress);
                this.screenPosition.x = this.unmodifiedScreenPos.x;
                this.screenPosition.y = this.unmodifiedScreenPos.y + this.getJumpHeigh(this.moveProgress);
            }
            else {
                this.moveProgress = 0;
                this.isMoving = false;
                this.screenPosition = this.getScreenPosition(this.gridPosition);
                this.unmodifiedScreenPos = this.getScreenPosition(this.gridPosition);
            }
            this.renderSprite.x = this.screenPosition.x;
            this.renderSprite.y = this.screenPosition.y;
            this.shadowGraphics.x = this.screenPosition.x;
            this.shadowGraphics.y = this.unmodifiedScreenPos.y+28;
        }
    }
}

class GraphicsGrid {
    constructor (sizeOnScreen, gridSize, position, lineColor, lineWidth) {
        this.sizeOnScreen = sizeOnScreen;
        this.gridSize = gridSize;
        this.position = position;
        this.lineContainer = new PIXI.Container();
        this.lineColor = lineColor;
        this.lineWidth = lineWidth;
        this.createLines();
    }

    createLines () {
        let linexcount = this.gridSize.x + 1;
        let lineycount = this.gridSize.y + 1;
        let linexgap = this.sizeOnScreen.x / this.gridSize.x;
        let lineygap = this.sizeOnScreen.y / this.gridSize.y;
        for (let i=0; i<linexcount; i++) {
            let lineGraphics = new PIXI.Graphics()
            .rect(i*linexgap-(this.lineWidth/2), this.position.y, this.lineWidth, this.sizeOnScreen.y + this.position.y)
            .fill(this.lineColor);
            this.lineContainer.addChild(lineGraphics);
        }
        for (let i=0; i<lineycount; i++) {
            let lineGraphics = new PIXI.Graphics()
            .rect(this.position.x, i*lineygap-(this.lineWidth/2), this.sizeOnScreen.x + this.position.x, this.lineWidth)
            .fill(this.lineColor);
            this.lineContainer.addChild(lineGraphics);
        }
    }
}
var pupu;
const renderer = new Renderer();
await renderer.init();
renderer.addProcessLoop();
pupu = InitGame();
function onMovePupu(x, y) {
    console.log("MOVE");
    if (MovePupu(pupu, x, y)) {
        setBunnyPos(x, y);
    }
}
export const app = renderer.pixiApp;

export function setBunnyPos (x, y) { 
    if (y == -1) {
        renderer.characterObject.moveToDirection (Direction.Up);
    }
    if (y == 1) {
        renderer.characterObject.moveToDirection (Direction.Down);
    }
    if (x == 1) {
        renderer.characterObject.moveToDirection (Direction.Right);
    }
    if (x == -1) {
        renderer.characterObject.moveToDirection (Direction.Left);
    }
}

export function processList(list) {
    if (list == null || renderer == null) {
        return;
    }
    console.log(list)
    renderer.commands = list;
}