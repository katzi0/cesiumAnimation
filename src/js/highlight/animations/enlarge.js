import { defaultOptions, Types, AnimateType } from '../config';
import { Cesium } from '../../../index';
import { Highlight } from "../highlight";
export class Enlarge extends Highlight {

    super(pickedLabel, options) {
        this.pickedLabel = pickedLabel;
        this.options = options;
    }

    get scale() {
        return this._scale;
    }

    set scale(scale) {
        this._scale = scale;
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

    setPrimitiveProp(primtiveShapeKey) {
        this.scale = Types[primtiveShapeKey].minScale;
        this.primitiveConfig = Types[primtiveShapeKey];
        this.setAnimate();
    }

    setAnimate() {
        let increase = true;
        const scalePerStep = this.calculateEnlargeStep();
        const durationInSeconds = this.primitiveConfig.duration;
        const interval = window.setInterval(() => {
            const roundedScale = this.getRoundedScale();
            if ((this.primitiveConfig.maxScale <= roundedScale && increase) || (this.primitiveConfig.minScale >= roundedScale && !increase)) {
                increase = !increase;
            }
            this.scale += increase ? scalePerStep : -scalePerStep;
            this.primitive[this.primitiveConfig.field] = this.scale;
        }, this.primitiveConfig.timeoutInterval);
        if (!this.primitiveConfig.interval) {
            window.setTimeout(() => window.clearInterval(interval), durationInSeconds);
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

    getRoundedScale(){
        const roundedCondition = Number(this.scale);
        return parseFloat(roundedCondition.toFixed(3));
    }

    endAnimation(entity, primitive, duration = 0, type, obj) {
        setTimeout(() => {
            primitive[Types[type].field] = new Cesium.CallbackProperty(function () {
                while (obj.scale > 1) {
                    if (obj.prevScale < obj.scale && obj.scale < obj.maxScale) {
                        obj.prevScale = obj.scale;
                        return obj.scale += obj.scale * Types[obj.primtiveShapeKey].scaleLevel
                    }
                    else {
                        obj.prevScale = obj.scale;
                        return obj.scale -= obj.scale * Types[obj.primtiveShapeKey].scaleLevel
                    }
                }
            }, false);
        }, duration * 1000);
    };
}
