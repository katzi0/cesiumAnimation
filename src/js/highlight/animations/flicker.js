import { defaultOptions, Types } from "../config";
import { Highlight } from "../highlight";
import { Cesium } from '../../../index';

export class Flicker extends Highlight {

    get options() {
        return this._options
    }

    set options(options) {
        this._options = Object.assign({}, defaultOptions, options);
    }

    get color() {
        return this._color;
    }

    set color(color) {
        this._color = color;
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

    get duration() {
        return this.primitiveConfig.duration;
    }

    setPrimitiveProp(primtiveShapeKey) {
        this.color = Types[primtiveShapeKey].color;
        this.primitiveConfig = Types[primtiveShapeKey];
        this.setAnimate();
        // this.setOpacity();
    }
        setAnimate()
        {
            let isBlue = true;
            const interval = window.setInterval(() => {
                isBlue ? this.primitive.color = Cesium.Color.DARKRED : this.primitive.color = Cesium.Color.Blue;
                isBlue = !isBlue;
            }, this.primitiveConfig.timeoutInterval * 4);
            if (!this.primitiveConfig.interval) {
                window.setTimeout(() => {
                    this.primitive.color = Cesium.Color.Blue;
                    window.clearInterval(interval)
                }, this.duration);
            }
        }

        setOpacity()
        {
            this.primitive.color =  new Cesium.Color(1.0, 1.0, 1.0, 0.1);
            window.setTimeout(() => {
                this.primitive.color = Cesium.Color.Blue;
            }, this.duration);
        }
    }