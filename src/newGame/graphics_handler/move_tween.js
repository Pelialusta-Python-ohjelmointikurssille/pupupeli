export class MoveTween {
    constructor(time, finishfunc, context) {
        this.value = 0;
        this.time = time;
        this.inProgress = false;
        this.finishfunc = finishfunc;
        this.context = context;
    }

    start() {
        this.inProgress = true;
    }

    increment(delta) {
        if (this.value < 1 && this.inProgress === true) {
            this.value += delta / this.time;
        } else if (this.value > 1) {
            this.stop();
            this.finishfunc.call(this.context);
        }
    }

    stop() {
        this.value = 0;
        this.inProgress = false;
    }

    setTime(time) {
        if (this.inProgress === true) return;
        this.time = time;
    }
}