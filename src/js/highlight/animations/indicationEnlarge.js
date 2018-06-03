import { defaultOptions, Types, AnimateType } from '../config';
import { Cesium } from '../../../index';
import { Highlight } from "../highlight";

export class IndicationEnlarge extends Highlight {

    super(pickedLabel, options) {
        this.pickedLabel = pickedLabel;
        this.options = options;
    }

    get scale() {
        return this._scale || this.primitiveConfig.minScale;
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

    get primitiveConfig() {
        return this._primitiveConfig;
    }

    set primitiveConfig(primitiveConfig) {
        this._primitiveConfig = primitiveConfig;
    }

    get primitive() {
        return this.pickedLabel[this.primtiveShapeKey];
    }

    set primtiveShapeKey(primtiveShapeKey) {
        this._primtiveShapeKey = primtiveShapeKey;
    }

    get primtiveShapeKey() {
        return this._primtiveShapeKey;
    }
    set scaleSum(scaleSum) {
        this._scaleSum = scaleSum;
    }
    get scaleSum() {
        return this._scaleSum;
    }

    setPrimitiveProp(primtiveShapeKey) {
        // this.scale = Types[primtiveShapeKey].minScale;
        this.primitiveConfig = Types[primtiveShapeKey];
        this.setAnimate();
    }

    // setAnimate() {
    //     let increase = true;
    //     const scalePerStep = this.calculateEnlargeStep();
    //     const durationInSeconds = this.primitiveConfig.duration;
    //     let scaleStepsSum = 0;
    //     let scaleSuffix;
    //     const interval = window.setInterval(() => {
    //         const roundedScale = this.getRoundedScale();
    //         scaleStepsSum += scalePerStep;
    //         scaleSuffix = this.easeOutElastic(scaleStepsSum);
    //         this.scale += scaleSuffix;
    //         this.primitive[this.primitiveConfig.field] = this.scale;
    //         if (scaleStepsSum >= 1) {
    //             window.setTimeout(() => window.clearInterval(interval));
    //         }
    //     }, this.primitiveConfig.timeoutInterval);
    //
    // }

    // setAnimateSin() {
    //     const startValue = 1;
    //     const endValue = 3;
    //     const numOfSteps = this.primitiveConfig.duration / this.primitiveConfig.timeoutInterval;
    //     const valueIncrement = (endValue - startValue) / numOfSteps;
    //     const sinValueIncrement = Math.PI / numOfSteps;
    //     let currentValue = startValue;
    //     let currentSinValue = 0;
    //     let firstEntarnce = true;
    //
    //     const interval = window.setInterval(() => {
    //         currentSinValue += sinValueIncrement;
    //         if (currentSinValue < Math.PI) {
    //             if(firstEntarnce)
    //             {
    //                 currentValue += valueIncrement * (Math.sin(currentSinValue) ** 2) * 2;
    //                 this.primitive[this.primitiveConfig.field] = currentValue;
    //             }
    //             else{
    //                 if (this.primitive[this.primitiveConfig.field]._value > 1)
    //                 {
    //                     currentValue += (valueIncrement * (Math.sin(currentSinValue) ** 2) * 2);
    //                     this.primitive[this.primitiveConfig.field] +=  -currentValue;
    //                 }
    //                 else {
    //                     firstEntarnce=!firstEntarnce;
    //                 }
    //
    //             }
    //         }
    //         else {
    //             if(firstEntarnce){
    //                 firstEntarnce=!firstEntarnce;
    //                 currentSinValue = 0;
    //                 currentValue = 0;
    //             }
    //         }
    //
    //     }, this.primitiveConfig.timeoutInterval);
    //     // if (!this.primitiveConfig.interval) {
    //     //     window.setTimeout(() => window.clearInterval(interval), durationInSeconds);
    //     // }
    // }
    //setAnimateLinear
    setAnimate() {
            const scalePerStep = this.calculateEnlargeStep();

            this.scaleSum = this.scaleSum ? this.scaleSum + scalePerStep : scalePerStep;
                console.log(this.scaleSum);
                if (this.scaleSum >= 1){
                    this.stopIncrease = true;
                }

                if(!this.stopIncrease){
                    this.scale = this.easeInElastic(this.scaleSum);
                    this.primitive[this.primitiveConfig.field] = this.scale;
                }
    }


    calculateEnlargeStep() {
        const durationInSeconds = this.primitiveConfig.duration;
        const numberOfSteps = (durationInSeconds / 2) / this.primitiveConfig.timeoutInterval;
        const currentScale = this.primitiveConfig.minScale;
        const destinatedScale = this.primitiveConfig.maxScale;
        const scaleDelta = destinatedScale - currentScale;
        const scalePerStep = scaleDelta / numberOfSteps;
        return scalePerStep;
    }


    easeInElastic (t) { return (.04 - .04 / t) * Math.sin(25 * t) + 1 }

    easeOutElastic (t) { return .04 * t / (--t) * Math.sin(25 * t) };

    easeInOutSin (t) {
        return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;
    }

    stopCallback(){
        this.pickedLabel.billboard.scale = 1;
        // this.primitive[this.primitiveConfig.field] = this.primitiveConfig.minScale;
    }

    easeInOutCubic (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 }

}
