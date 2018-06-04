import { Highlight } from "../highlight";

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

    setAnimate() {
        const scalePercent = this.options.scalePercent + 1;
        const scaleMax = this.options.minScale * scalePercent;
        console.log(scaleMax);
        const scalePerStep = this.calculateEnlargeStep();
        if (scaleMax <= this.scale && this.increase) {
            this.increase = false;
        }
        if (this.options.minScale > this.scale && !this.increase) {
            this.increase = true;
        }
        this.scale += this.increase ? scalePerStep : -scalePerStep;
        this.primitive[this.options.field] = this.scale;
    }

    calculateEnlargeStep() {
        debugger;

        const durationInSeconds = this.options.duration;
        const numberOfSteps = (durationInSeconds / 2) / this.options.timeoutInterval;
        const currentScale = this.options.minScale;
        const scalePercent = 1 + this.options.scalePercent;
        const scaleDelta = (scalePercent * currentScale) - currentScale;
        const scalePerStep = scaleDelta / numberOfSteps;
        return scalePerStep;
    }

    stopCallback() {
        this.pickedLabel[this.options.primitiveType][this.options.field] = 1;
    }

}
