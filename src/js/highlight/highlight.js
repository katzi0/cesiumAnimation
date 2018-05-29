import { defaultOptions, Types } from "./config";
import { Cesium } from "../../index";


export class Highlight {

    constructor(enitity, options) {
        this.pickedLabel = {};
        this.entity = enitity || {};
        this.options = options;
        this.setDefinedPrimitivesInEntity();
    }

    get options() {
        return this._options
    }

    set options(options) {
        this._options = Object.assign({}, defaultOptions, options);
    }

    startAnimation(options) {
        return new Promise((resolve, reject) => {
            for (let primtiveShapeKey in this.pickedLabel) {
                this.primtiveShapeKey = primtiveShapeKey;
                this.setPrimitiveProp(primtiveShapeKey)
            }
            resolve(this.stopCallback.bind(this));
        })
    }

    setPrimitiveProp(primtiveShapeKey) {
        console.log("need to override")
    }

    endAnimation() {
        console.log("need to override")
    }

    stopCallback() {
        for (let key in this.pickedLabel) {
            let primitive = this.pickedLabel[key];
            primitive[Types[key].field] = 1;
        }
    }

    setDefinedPrimitivesInEntity() {
        if (Cesium.defined(this.entity.polyline))
            this.pickedLabel.polyline = this.entity.polyline;
        if (Cesium.defined(this.entity.label))
            this.pickedLabel.label = this.entity.label;
        if (Cesium.defined(this.entity.billboard))
            this.pickedLabel.billboard = this.entity.billboard;
    };

    addAnimationType(type) {
        let animationTypeArr = [];
        this.options.animationType.forEach(x => animationTypeArr.push(x));
        animationTypeArr.push(type);
        this.options.animationType = animationTypeArr;
    };

    removeAnimationType(selectedType){
        this.options.animationType = this.options.animationType.filter(type =>  type !== selectedType);
    };
}
