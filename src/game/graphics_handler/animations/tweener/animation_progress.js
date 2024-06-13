/**
 * Class used to track an animation's progress and to interpolate values.
 */
export class AnimationProgress {
    /**
     * 
     * @param {number} time Duration of the animation in seconds.
     * @param {Function} startfunc Function that should be called when animation starts.
     * @param {Function} finishfunc Function that should be called when animation ends.
     * @param {object} context Object that calls the previous functions.
     * @param {string} name Name of the animation. Will be sent to onStartAnimation and onFinishAnimation.
     */
    constructor(time, startfunc, finishfunc, context, name) {
        this.value = 0;
        this.time = time;
        this.inProgress = false;
        this.finishfunc = finishfunc;
        this.context = context;
        this.startfunc = startfunc;
        this.name = name;
    }

    /**
     * Starts the animation progress counter. Also calls startFunc defined in class constructor.
     */
    start() {
        this.inProgress = true;
        this.startfunc.call(this.context, this.name);
    }

    /**
     * Used to update values of the counter. Should be done every frame.
     * @param {number} delta Time between frames in seconds.
     */
    increment(delta) {
        if (this.value < 100 && this.inProgress === true) {
            this.value += delta / this.time * 100;
        } else if (this.value >= 100) {
            this.value = 100;
            this.stop();
            this.finishfunc.call(this.context, this.name);
        }
    }

    /**
     * Skips the timer to the end.
     */
    skipToEnd() {
        this.value = 100;
        this.stop();
        this.finishfunc.call(this.context, this.name);
    }

    /**
     * Stops the timer without calling finish animation.
     */
    stop() {
        this.value = 0;
        this.inProgress = false;
    }

    /**
     * Sets the counter's value to a specified one.
     * @param {number} time The time the counter should be set to.
     */
    setTime(time) {
        if (this.inProgress === true || time > 100 || time < 0) return;
        this.time = time;
    }
}