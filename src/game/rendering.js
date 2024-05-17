import * as PIXI from "pixi.js"
import { GridSpaceToScreenSpace } from "./coord_helper.js"

//refactor pls

export const app = new PIXI.Application();
await app.init({
  width: 640,
  height: 640,
  backgroundColor: 0x1099bb,
  view: document.querySelector("#scene"),
  antialias: true
})
app.ticker.maxFPS = 60;

const bunny_texture = await PIXI.Assets.load("static/game_assets/pupu_edesta_lapinakyva.png");
const background_texture = await PIXI.Assets.load("static/game_assets/Tausta1.png");

const bunny_sprite = new PIXI.Sprite(bunny_texture);
const background_sprite = new PIXI.Sprite(background_texture);
background_sprite.width = app.screen.width;
background_sprite.height = app.screen.height;

bunny_sprite.width = 64;
bunny_sprite.height = 64;
bunny_sprite.anchor.set(0.5);

app.stage.addChild(background_sprite);
app.stage.addChild(bunny_sprite);

var gridX = 0;
var gridY = 0;
let coords = GridSpaceToScreenSpace(gridX, gridY, 640, 640, 8, 8, 0, 0);
var targetX = coords[0];
var targetY = coords[1];
var xdir = 0;
var ydir = 0;
var bunnySpeedMod = 0.1;

bunny_sprite.x = targetX;
bunny_sprite.y = targetY;

var atTarget = true;

function GetDistance(ax, ay, bx, by) {
  return Math.sqrt((bx-ax)**2 + (by-ay)**2);
}

export function setBunnyPos(x, y) {
  gridX += x;
  gridY += y;
  let coords = GridSpaceToScreenSpace(gridX, gridY, 640, 640, 8, 8, 0, 0);
  targetX = coords[0];
  targetY = coords[1];
  xdir = ((coords[0]-bunny_sprite.x));
  ydir = ((coords[1]-bunny_sprite.y));
  atTarget = false;
}

app.ticker.add((time) =>
{  
  if (atTarget == false){
    if (
        GetDistance(bunny_sprite.x, bunny_sprite.y, targetX, targetY) <= 
        GetDistance(bunny_sprite.x+(xdir*time.deltaTime * bunnySpeedMod), bunny_sprite.y+(ydir*time.deltaTime * bunnySpeedMod), targetX, targetY)
      ){
      bunny_sprite.position.x = targetX;
      bunny_sprite.position.y = targetY;
      atTarget = true;
    } else {
      bunny_sprite.position.x += xdir * time.deltaTime * bunnySpeedMod;
      bunny_sprite.position.y += ydir * time.deltaTime * bunnySpeedMod;
    }
  }
});