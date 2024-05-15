const pupuSprite = "images/pupu_edesta_lapinakyva.png";
const canvasName = "gridCanvas";
const bgName = "url(images/Tausta1.png)";
const pupuSize = 75;

var context;
var canvas;
var pupuImage;

initCanvas();

function initCanvas() {
    //move to own class someday
    canvas = document.getElementById(canvasName);
    canvas.style.background = bgName;
    context = canvas.getContext("2d");
    addPupuImage(context);
}

function addPupuImage(context) {
    pupuImage = new Image();
    pupuImage.src = pupuSprite;
    pupuImage.onload = function () {
        context.drawImage(pupuImage, 0, 0, pupuSize, pupuSize);
        console.log("onload pupu");
    }
}

export function reDrawPupu(x, y) {
    canvas.width = canvas.width; //refreshes the canvas
            let newX = x * pupuSize;
            let newY = y * pupuSize;
            context.drawImage(pupuImage, newX, newY, pupuSize, pupuSize);
}