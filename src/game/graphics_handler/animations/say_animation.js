import { AnimationProgress } from "../animation_progress.js";
import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";


export class SayAnimation {
    constructor(gridObject, name, data) {
        //data is { time: this.time, text: sayString }
        console.log("SAY ANIMATION: " + data.text);
        this.gridObject = gridObject;
        this.data = data;
        this.progress = new AnimationProgress(data.time, this.onStart, this.onFinish, this, name);
        this.inProgress = false;
        this.name = name;
        this.text = data.text;
        this.speechBubble = new PIXI.Graphics();
        this.speechBubbleColor = 0xFFFFFF;
        this.speechText = new PIXI.Text({ text: `${this.text}`, style: { fontFamily: "Roboto Light", fontSize: 32, fill: 0x000000 } });
        this.previousZindex = this.gridObject.container.zIndex;
        this.gridObject.container.addChild(this.speechBubble);
        this.gridObject.container.addChild(this.speechText);
    }

    start() {
        this.progress.start();
        this.inProgress = true;

        //Placeholder values, should not be hardcoded
        this.speechBubble.pivot.x = 0;
        this.speechBubble.pivot.y = 32;
        this.speechText.anchor.set(0.5);
        this.speechText.x = 0;
        this.speechText.y = 135;
        this.speechBubble
            .ellipse(0, 180, 200, 64)
            .fill({ color: this.speechBubbleColor });

        // Temporary fix to make speech bubble on top of everything
        // This also makes the animated object be on top also though
        this.gridObject.container.zIndex = 9;
    }

    skipToEnd() {
        this.progress.skipToEnd();
    }

    increment(deltaTime) {
        if (this.inProgress === false) return;
        this.progress.increment(deltaTime);
    }

    stop() {
        this.progress.stop();
        this.inProgress = false;
        this.speechBubble.clear();
        this.gridObject.container.removeChild(this.speechBubble);
        this.gridObject.container.removeChild(this.speechText);
        this.gridObject.container.zIndex = this.previousZindex;
    }

    onStart() {
        this.gridObject.onStartAnimation(this.name);
    }

    onFinish() {
        this.inProgress = false;
        this.speechBubble.clear();
        this.gridObject.container.removeChild(this.speechBubble);
        this.gridObject.container.removeChild(this.speechText);
        this.gridObject.onFinishAnimation(this.name);
        this.gridObject.container.zIndex = this.previousZindex;
    }

}