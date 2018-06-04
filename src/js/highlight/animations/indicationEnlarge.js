import { Highlight } from "../highlight";
import { Cesium } from '../../../index';

export class IndicationEnlarge extends Highlight {

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

    get stopIncrease() {
        return this._stopIncrease || false;
    }

    set stopIncrease(stopIncrease) {
        this._stopIncrease = stopIncrease;
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
                   console.log('here');
                    return 1;
                }
                return Cesium.EasingFunction[this.options.easingFunction](this.scaleSum);
            },false)
        }
    }



    // setAnimate() {
    //     const scalePerStep = this.calculateEnlargeStep();
    //
    //     this.scaleSum = this.scaleSum ? this.scaleSum + scalePerStep : scalePerStep;
    //     if (this.scaleSum >= 1) {
    //         this.stopIncrease = true;
    //     }
    //     if (!this.stopIncrease) {
    //         this.scale = Cesium.EasingFunction.ELASTIC_OUT(this.scaleSum);//this.easeInElastic(this.scaleSum);
    //         this.primitive[this.options.field] = this.scale;
    //     }
    // }

    calculateEnlargeStep() {
        const durationInSeconds = this.options.speed;
        const numberOfSteps = (durationInSeconds / 2) / this.options.timeoutInterval;
        const currentScale = this.options.minScale;
        const destinatedScale = this.options.maxScale;
        const scalePercent =1 + this.options.scalePercent;
        const scaleDelta = scalePercent*currentScale - currentScale;
        const scalePerStep = scaleDelta / numberOfSteps;
        return scalePerStep;
    }

    easeInElastic(t) {
        return (.04 - .04 / t) * Math.sin(25 * t) + 1
    }

    stopCallback() {
        console.log('stopCallback');
        this.primitive[this.options.field] = 1;
        // this.primitive[this.options.field] = this.options.minScale;
    }

}
