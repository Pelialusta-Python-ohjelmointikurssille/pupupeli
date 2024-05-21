import { Vector2 } from "./vector.js";
import { Direction } from "./direction.js"
import { GridVectorToScreenVector } from "./coord_helper.js"

/* global PIXI */

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
    }

    async initPixi (screenWidth=640, screenHeight=640) {
        let pixiApp = new PIXI.Application();
        await pixiApp.init({
            width: screenWidth,
            height: screenHeight,
            backgroundColor: 0x1099bb,
            antialias: true
        })
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
        this.pixiApp.stage.addChild(this.characterObject.renderSprite);
    }

    addProcessLoop () {
        this.pixiApp.ticker.add((time) =>
        {  
            this.characterObject.process(time.deltaTime);
        });
    }
}

class Character {
    constructor (gridPosition, textures, size) {
        this.gridPosition = gridPosition;
        this.screenPosition = this.getScreenPosition(this.gridPosition);
        this.direction = Direction.Right;
        this.textures = textures;
        this.renderSprite = new PIXI.Sprite(this.textures[0])
        this.renderSprite.anchor.set(0.5);
        this.renderSprite.width = size.x;
        this.renderSprite.height = size.y;
        this.targetPosition = new Vector2(this.screenPosition.x, this.screenPosition.y);
        this.moveDirection = new Vector2(0, 0);
        this.isMoving = false;
        this.moveSpeed = 5;
    }

    getScreenPosition (position) {
        return GridVectorToScreenVector(position, new Vector2(640, 640), new Vector2(8, 8));
    }

    moveToDirection (direction) {
        this.direction = direction;
        this.renderSprite.texture = this.textures[direction];
        this.isMoving = true;
        if (direction == 0) {
            this.gridPosition.SetValue(this.gridPosition.x, this.gridPosition.y - 1);
            this.moveDirection = new Vector2(0, -1);
        }
        else if (direction == 1) {
            this.gridPosition.SetValue(this.gridPosition.x + 1, this.gridPosition.y);
            this.moveDirection = new Vector2(1, 0);
        }
        else if (direction == 2) {
            this.gridPosition.SetValue(this.gridPosition.x, this.gridPosition.y + 1);
            this.moveDirection = new Vector2(0, 1);
        }
        else if (direction == 3) {
            this.gridPosition.SetValue(this.gridPosition.x - 1, this.gridPosition.y);
            this.moveDirection = new Vector2(-1, 0);
        }
        this.targetPosition = this.getScreenPosition(this.gridPosition);
    }

    process (deltaTime) {
        if (this.isMoving) {
            let predictedPosition = new Vector2(
                this.screenPosition.x + (this.moveDirection.x * (this.moveSpeed) * deltaTime),
                this.screenPosition.y + (this.moveDirection.y * (this.moveSpeed) * deltaTime)
            );
            if (this.screenPosition.DistanceTo(this.targetPosition) > this.screenPosition.DistanceTo(predictedPosition)){
                this.screenPosition.SetValue(
                    this.screenPosition.x + (this.moveDirection.x * (this.moveSpeed) * deltaTime),
                    this.screenPosition.y + (this.moveDirection.y * (this.moveSpeed) * deltaTime)
                );
            }
            else {
                this.isMoving = false;
                this.moveDirection = new Vector2(0, 0);
                this.screenPosition = new Vector2(this.targetPosition.x, this.targetPosition.y);
            }
        }
        this.renderSprite.x = this.screenPosition.x;
        this.renderSprite.y = this.screenPosition.y;
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

const renderer = new Renderer();
await renderer.init();
renderer.addProcessLoop();
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