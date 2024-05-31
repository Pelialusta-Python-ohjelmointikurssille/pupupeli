export class AnimationProgress {
    constructor(time, startfunc, finishfunc, context, name) {
        this.value = 0;
        this.time = time;
        this.inProgress = false;
        this.finishfunc = finishfunc;
        this.context = context;
        this.startfunc = startfunc;
        this.name = name;
    }

    start() {
        this.inProgress = true;
        this.startfunc.call(this.context, this.name);
    }

    increment(delta) {
        if (this.value <= 1 && this.inProgress === true) {
            this.value += delta / this.time;
        } else if (this.value > 1) {
            this.stop();
            this.finishfunc.call(this.context, this.name);
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