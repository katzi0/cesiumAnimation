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
        return this.pickedLabel[this.primtiveShapeKey];
    }

    set primtiveShapeKey(primtiveShapeKey) {
        this._primtiveShapeKey = primtiveShapeKey;
    }

    get primtiveShapeKey() {
        return this._primtiveShapeKey;
    }

    setPrimitiveProp() {
        this.setAnimate();
    }

    // setAnimate() {
    //     const scalePercent = this.options.scalePercent + 1;
    //     const scaleMax = this.options.minScale * scalePercent;
    //     const scalePerStep = this.calculateEnlargeStep();
    //     if (scaleMax <= this.scale && this.increase) {
    //         this.increase = false;
    //     }
    //     if (this.options.minScale > this.scale && !this.increase) {
    //         this.increase = true;
    //     }
    //     this.scale += this.increase ? scalePerStep : -scalePerStep;
    //     this.primitive[this.options.field] = this.scale;
    // }

    // setAnimate() {
    //     const scalePercent = this.options.scalePercent + 1;
    //     const scaleMax = this.options.minScale * scalePercent;
    //     const scalePerStep = this.calculateEnlargeStep();
    //
    //     this.primitive[this.options.field] = new Cesium.CallbackProperty( ()=> {
    //
    //         if(!this.increase)
    //             this.scaleSum = scalePerStep;
    //
    //         if (scaleMax <= this.scale && this.increase) {
    //             this.increase = false;
    //             this.scaleSum = this.scaleSum ? this.scaleSum - scalePerStep : scalePerStep;
    //         }
    //         if (this.options.minScale > this.scale && !this.increase) {
    //             this.increase = true;
    //             this.scaleSum = this.scaleSum ? this.scaleSum + scalePerStep : scalePerStep;
    //         }
    //
    //         let res = Cesium.EasingFunction.BACK_OUT(this.scaleSum);
    //         console.log(res);
    //         this.scale = res; //this.increase ? res : -res;
    //         // this.scale = Cesium.EasingFunction.CUBIC_IN(this.scale);
    //         return this.scale;
    //     }, false)
    // }

    setAnimate(isAnimationTimeOver = false) {
        const scalePercent = this.options.scalePercent + 1;
        const scaleMax = this.options.minScale * scalePercent;
        const scalePerStep = this.calculateEnlargeStep();

        this.primitive[this.options.field] = new Cesium.CallbackProperty( ()=> {
            console.log('here');
            if (scaleMax <= this.scale && this.increase) {
                this.increase = false;
            }
            if (this.options.minScale > this.scale && !this.increase) {
                this.increase = true;
            }
            if(isAnimationTimeOver) {
                this.scale = 1;
                console.log('here');
                return 1;
            }
            else{
                this.scale += this.increase ? scalePerStep : -scalePerStep;
                return this.scale;
            }
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
                this.increase=!this.increase;
            }
            if (this.options.minScale >= this.scale && !this.increase) {
                clearInterval(interval);
            }

            this.scale += this.increase ? scalePerStep : -scalePerStep;
            this.primitive[this.options.field]  = this.scale;
        },this.options.timeoutInterval);
    }

}
