import { Highlight } from "../highlight";
import { Cesium } from '../../../index';

export class IndicationEnlarge extends Highlight {

    super(pickedLabel, options) {
        this.pickedLabel = pickedLabel;
        this.options = options;
    }

    get stopIncrease() {
        return this._stopIncrease || false;
    }

    get primitive() {
        return this.pickedLabel[this.options.primitiveType];
    }

    set scaleSum(scaleSum) {
        this._scaleSum = scaleSum;
    }

    get scaleSum() {
        return this._scaleSum;
    }

    setPrimitiveProp() {
        this.setAnimate();
    }

    setAnimate() {
        const scalePerStep = this.calculateEnlargeStep();
        if (!this.stopIncrease) {
            this.primitive[this.options.field] = new Cesium.CallbackProperty(() => {
                this.scaleSum = this.scaleSum ? this.scaleSum + scalePerStep : scalePerStep;
                if (this.scaleSum >= 1) {
                    return 1;
                }
                return Cesium.EasingFunction[this.options.easingFunction](this.scaleSum);
            },false)
        }
    }

    calculateEnlargeStep() {
        const durationInSeconds = this.options.speed;
        const numberOfSteps = (durationInSeconds / 2) / this.options.timeoutInterval;
        const currentScale = this.options.minScale;
        const scalePercent =1 + this.options.scalePercent;
        const scaleDelta = scalePercent*currentScale - currentScale;
        const scalePerStep = scaleDelta / numberOfSteps;
        return scalePerStep;
    }

    stopCallback() {
        this.primitive[this.options.field] = 1;
    }

}
