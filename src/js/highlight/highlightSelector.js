import { Enlarge } from "./animations/enlarge";
import { AnimateType, defaultOptions } from "./config";
import { Cesium } from "../../index";
import { IndicationEnlarge } from "./animations/indicationEnlarge";

export class HighlightSelector {
    //optionsOFALL....


    constructor(animationArr, options) {
        this.options = Object.assign({},defaultOptions, options);
        this.pickedPrimitve = {};
    }

    get inervalId() {
        return this._intervalId;
    }
    set inervalId(intervalId) {
        this._intervalId = intervalId;
    }

    get scale() {
        return this._scale;
    }

    set scale(scale) {
        this._scale = scale;
    }

    get options() {
        return this._options;
    }

    set options(options) {
        this._options = options;
    }

    set selectedEntity(entity) {
        this._selectedEntity = entity;
    }

    get selectedEntity() {
        return this._selectedEntity;
    }

    set animations(animations) {
        this._animations = animations;
    }

    get animations(){
        return this._animations;
    }

    setup(animationArr, options, entity) {
        this.options = Object.assign({},defaultOptions, options);
        this.selectedEntity = entity;
        let helperArr = [];
        if (animationArr) {
            animationArr.forEach(animation => {
                switch (animation) {
                    case AnimateType.shrinkGrow:
                        helperArr.push(new Enlarge(this.selectedEntity, this.options));
                        break;
                    case AnimateType.IndicationEnlarge:
                        helperArr.push(new IndicationEnlarge(this.selectedEntity, this.options));
                        break;
                    default:
                        helperArr.push(new Enlarge(this.selectedEntity, this.options));
                }
            })
            this.animations = helperArr;
            this.setDefinedPrimitivesInEntity(this.selectedEntity);
            for (let primtiveShapeKey in this.pickedPrimitve) {
                this.setPrimitiveProp(primtiveShapeKey)
            }
        }
    }

    // start() {
    //     if(this.inervalId)
    //         this.stop();
    //     this.inervalId = window.setInterval(() => {
    //         this.animations.forEach(animation => animation.startAnimation())
    //     }, this.options.timeoutInterval);
    //     if (!this.options.interval || this.options.indicationOnly) {
    //         window.setTimeout(() => this.stop(), this.options.duration);
    //     }
    // }


    start() {
        this.animations.forEach(animation => animation.startAnimation());
        if(!this.options.interval || this.options.indicationOnly){
            window.setTimeout(() => {
                this.stop()
            }, this.options.duration);
        }
    }

    stop() {
        if(this.animations){
            this.animations.forEach(animation => animation.stopCallback());
        }

    }

    setDefinedPrimitivesInEntity(selectedEntity) {
        if (Cesium.defined(selectedEntity.billboard))
            this.pickedPrimitve.billboard = selectedEntity.billboard;
    };

    setPrimitiveProp() {
        this.scale = this.options.minScale;
    }
}
