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

    // set primitive(primitive)
    // {
    //     this._primitive = primitive;
    // }

    setPrimitiveProp(primtiveShapeKey) {
        this.scale = Types[primtiveShapeKey].minScale;
        this.primitiveConfig = Types[primtiveShapeKey];
        // this.primitive = this.pickedLabel[primtiveShapeKey];

        // if (this.options.duration) {
        //     this.endAnimation(this.entity, this.primitive, this.options.duration, primtiveShapeKey);
        // }
        this.setAnimate();
    }

    setAnimationMidpoint(action, duration) {
        setTimeout(() => {
            action.increase = !action.increase
        }, duration * 500);
    }

    // setAnimate() {
    //
    //     let prevScale;
    //     let increase = true;
    //     const interval = window.setInterval(() => {
    //         let animationStep = this.scale * this.primitiveConfig.scaleLevel;
    //         increase = (!prevScale || (prevScale < this.scale && this.scale < this.primitiveConfig.maxScale)) ? true : false;
    //         prevScale = this.scale;
    //         this.scale += increase ?  animationStep : - animationStep;
    //         this.primitive[this.primitiveConfig.field] = this.scale;
    //         // if (!prevScale || (prevScale < this.scale && this.scale < this.primitiveConfig.maxScale)) {
    //         //     prevScale = this.scale;
    //         //     this.scale += this.scale * this.primitiveConfig.scaleLevel;
    //         //     this.primitive[this.primitiveConfig.field] = this.scale;
    //         // }
    //         // else if( this.scale > this.primitiveConfig.minScale) {
    //         //     prevScale = this.scale;
    //         //     this.scale -= this.scale * this.primitiveConfig.scaleLevel;
    //         //     this.primitive[this.primitiveConfig.field] = this.scale;
    //         // }
    //         // else {
    //         //     this.primitive[this.primitiveConfig.field] = this.primitiveConfig.minScale;
    //         // }
    //     }, 50);
    //     window.setTimeout(() => window.clearInterval(interval), this.options.duration*1000);
    //
    // }


    setAnimate() {
        let increaseDelta = 1;
        let increase = true;
        const scalePerStep = this.calculateEnlargeStep();
        const durationInSeconds = this.options.duration * 1000;
        const interval = window.setInterval(() => {
            if ((this.primitiveConfig.maxScale < this.scale + scalePerStep && increase) || (this.primitiveConfig.minScale > this.scale - scalePerStep && !increase)) {
                increase = !increase;
            }
            increaseDelta += scalePerStep;
            this.scale += increase ? scalePerStep : -scalePerStep;
            this.primitive[this.primitiveConfig.field] = this.scale;
            console.log(this.scale);
        }, this.options.timeoutInterval);
        if (!this.primitiveConfig.interval) {
            window.setTimeout(() => window.clearInterval(interval), durationInSeconds);
        }
    }

    calculateEnlargeStep() {
        const durationInSeconds = this.options.duration * 1000; //mili
        const numberOfSteps = (durationInSeconds / 2) / this.options.timeoutInterval;
        const currentScale = this.primitiveConfig.minScale;
        const destinatedScale = this.primitiveConfig.maxScale;
        const scaleDelta = destinatedScale - currentScale;
        const scalePerStep = scaleDelta / numberOfSteps;
        return scalePerStep;
    }

    //     obj.primitive[Types[obj.primtiveShapeKey].field] = new Cesium.CallbackProperty(function () {
    //             if (obj.prevScale && obj.prevScale < obj.scale) {
    //                 obj.animationAction.increase = obj.maxScale > obj.scale ? true : false;
    //             }
    //             else {
    //                 obj.animationAction.increase = obj.minScale < obj.scale ? false : true;
    //             }
    //         obj.prevScale = obj.scale;
    //         return obj.scale += obj.animationAction.increase ? obj.scale * Types[obj.primtiveShapeKey].scaleLevel : -obj.scale * Types[obj.primtiveShapeKey].scaleLevel;
    //     }, false);
    // }

    // endAnimation(entity, primitive, duration = 0, type) {
    //     setTimeout(() => {
    //
    //         primitive[Types[type].field] = 1;
    //     }, duration * 1000);
    // };

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
