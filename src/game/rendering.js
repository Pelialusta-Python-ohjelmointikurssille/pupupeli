import * as PIXI from "pixi.js"

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

var bx = 0;
var by = 0;

export function setBunnyPos(x, y) {
  bx += x;
  by += y;
  console.log("SET POS");
}


app.ticker.add((time) =>
{bunny_sprite.position.x = bx * 80 + 32;
  bunny_sprite.position.y = by * 80 + 32;
});

