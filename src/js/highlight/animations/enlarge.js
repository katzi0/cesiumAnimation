import { Highlight } from "../highlight";
import { Cesium } from "../../../index";

export class Enlarge extends Highlight {

    super(pickedLabel, options) {
        this.pickedLabel = pickedLabel;
        this.options = options;
    }

    get scale() {
        return this._scale || this.options.minScale;
    }

    set scale(scale) {
        this._scale = scale;
    }

    get increase() {
        return this._increase;
    }

    set increase(increase) {
        this._increase = increase;
    }

    get primitive() {
        return this.pickedLabel[this.options.primitiveType];
    }

    setPrimitiveProp() {
        this.setAnimate();
    }

    setAnimate() {
        const scalePercent = this.options.scalePercent + 1;
        const scaleMax = this.options.minScale * scalePercent;
        const scalePerStep = this.calculateEnlargeStep();

        this.primitive[this.options.field] = new Cesium.CallbackProperty(() => {
            if (scaleMax <= this.scale && this.increase) {
                this.increase = false;
            }
            if (this.options.minScale > this.scale && !this.increase) {
                this.increase = true;
            }
            this.scale += this.increase ? scalePerStep : -scalePerStep;
            return this.scale;
        }, false)
    }

    calculateEnlargeStep() {
        const durationInSeconds = this.options.speed;
        const numberOfSteps = (durationInSeconds / 2) / this.options.timeoutInterval;
        const currentScale = this.options.minScale;
        const scalePercent = 1 + this.options.scalePercent;
        const scaleDelta = (scalePercent * currentScale) - currentScale;
        const scalePerStep = scaleDelta / numberOfSteps;
        return scalePerStep;
    }

    stopCallback() {
        const scalePercent = this.options.scalePercent + 1;
        const scaleMax = this.options.minScale * scalePercent;
        const scalePerStep = this.calculateEnlargeStep();
        const interval = setInterval(() => {
            if (scaleMax <= this.scale && this.increase) {
                this.increase = !this.increase;
            }
            if (this.options.minScale >= this.scale && !this.increase) {
                clearInterval(interval);
            }

            this.scale += this.increase ? scalePerStep : -scalePerStep;
            this.primitive[this.options.field] = this.scale;
        }, this.options.timeoutInterval);
    }

}
