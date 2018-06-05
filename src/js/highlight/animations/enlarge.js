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

    set scaleSum(scaleSum) {
        this._scaleSum = scaleSum;
    }

    get scaleSum() {
        return this._scaleSum;
    }


    setAnimate() {
        const scalePercent = this.options.scalePercent + 1;
        const scaleMax = this.options.minScale * scalePercent;
        let scalePerStep = this.calculateEnlargeStep();

        this.primitive[this.options.field] = new Cesium.CallbackProperty(() => {
            this.scaleSum = this.scaleSum ? this.scaleSum + scalePerStep : 1;
            if (this.scaleSum >= 1) {
                this.increase = false;
                scalePerStep = -scalePerStep;
                this.scaleSum += scalePerStep;
            }
            if (this.scaleSum <= 0){
                this.increase = true;
                scalePerStep = scalePerStep * -1;
                this.scaleSum += scalePerStep;
            }

            this.scale = this.increase ? Cesium.EasingFunction.BACK_OUT(this.scaleSum) : Cesium.EasingFunction.BACK_IN(this.scaleSum);
            this.scale += this.options.minScale;
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
