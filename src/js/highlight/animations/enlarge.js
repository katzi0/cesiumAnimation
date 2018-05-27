import { defaultOptions, Types, AnimateType } from './config';
import { Cesium } from '../../index';

export class Enlarge {

    constructor(options, enitity) {
        this.pickedLabel = {};
        this.entity = enitity || {};
        this.options = options;
        // this.setDefinedPrimitivesInEntity();
        this.initEnlarge(options);
    }

    get options() {
        return this._options
    }

    set options(options) {
        this._options = Object.assign({}, defaultOptions, options);
    }

    initEnlarge(options) {
        return new Promise((resolve, reject) => {

            for (let primtiveShapeKey in this.pickedLabel) {
                this.setPrimitiveProp(primtiveShapeKey)
            }
            resolve(this.stopCallback.bind(this));
        })
    }

    setPrimitiveProp(primtiveShapeKey){
            const primitive = this.pickedLabel[primtiveShapeKey];
            const maxScale = Types[primtiveShapeKey].maxScale;
            const minScale = Types[primtiveShapeKey].minScale;
            let animationAction = {increase: true};
            let scale = Types[primtiveShapeKey].minScale;
            let prevScale;

            let obj = {
                //entity,
                primitive,
               // pickedLabel,
                primtiveShapeKey,
              //  duration,
                maxScale,
                minScale,
                animationAction,
                scale,
                prevScale
            }

            // if (this.options.duration) {
            //     this.setAnimationMidpoint(animationAction, this.options.duration);
            // }

            if (this.options.duration) {
                this.endAnimation(this.entity, primitive, this.options.duration, primtiveShapeKey);
            }
            this.setAnimate(obj);
        }

    stopCallback() {
        for (let key in this.pickedLabel) {
            let primitive = this.pickedLabel[key];
            primitive[Types[key].field] = 1;
        }
    }

    setDefinedPrimitivesInEntity() {
        debugger;
        if (Cesium.defined(this.entity.polyline))
            this.pickedLabel.polyline = this.entity.polyline;
        if (Cesium.defined(this.entity.label))
            this.pickedLabel.label = this.entity.label;
    };

    setAnimationMidpoint(action, duration) {
        setTimeout(() => {
            action.increase = !action.increase
        }, duration * 500);
    }

    setAnimate(obj) {
        obj.primitive[Types[obj.primtiveShapeKey].field] = new Cesium.CallbackProperty(function () {
            //if (!obj.duration) {
                if (obj.prevScale && obj.prevScale < obj.scale) {
                    obj.animationAction.increase = obj.maxScale > obj.scale ? true : false;
                }
                else {
                    obj.animationAction.increase = obj.minScale < obj.scale ? false : true;
                }
           // }
            obj.prevScale = obj.scale;
            return obj.scale += obj.animationAction.increase ? Math.sin(obj.scale * Types[obj.primtiveShapeKey].scaleLevel) : -Math.sin(obj.scale * Types[obj.primtiveShapeKey].scaleLevel);
        }, false);
    }

    endAnimation(entity, primitive, duration = 0, type) {
        setTimeout(() => {
            primitive[Types[type].field] = 1;
        }, duration * 1000);
    };
}
