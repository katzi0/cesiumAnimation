import { Highlight } from "../highlight";
import { Cesium, Viewer } from "../../../index";
import { Types } from "../config";

export class Jump extends Highlight {
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

    set windowCoordinates(windowCoordinates) {
        this._windowCoordinates = windowCoordinates;
    }

    get windowCoordinates() {
        return this._windowCoordinates;
    }

    // setAnimate() {
    //     let increase = true;
    //     const scalePerStep = this.calculateEnlargeStep();
    //     const durationInSeconds = this.primitiveConfig.duration;
    //
    //     const startValue = 0;
    //     const endValue = 1;
    //     const numOfSteps = this.primitiveConfig.duration / this.primitiveConfig.timeoutInterval;
    //     const valueIncrement = (endValue - startValue) / numOfSteps;
    //     const sinValueIncrement = Math.PI / numOfSteps;
    //
    //
    //     let currentValue = startValue;
    //     let currentSinValue = 0;
    //
    //     const interval = window.setInterval(() => {
    //         currentSinValue += sinValueIncrement;
    //         currentValue += valueIncrement * (Math.sin(currentSinValue) ** 2) * 2;
    //         if (currentSinValue < Math.PI) {
    //             this.scale = currentValue;
    //         }
    //         else {
    //             this.scale = endValue;
    //         }
    //
    //     }, this.primitiveConfig.timeoutInterval);
    //     if (!this.primitiveConfig.interval) {
    //         window.setTimeout(() => window.clearInterval(interval), durationInSeconds);
    //     }
    // }

    setAnimate() {

        //_value isnt good approach to get data...
        this.windowCoordinates = Cesium.SceneTransforms.wgs84ToWindowCoordinates(Viewer.scene, this.entity.position._value);
        const originPosition = this.entity.position._value;
        //windowCoordinates .y -= 50;
        // let ct3 = this.cesium.Cartesian3.fromDegrees(ct2.x, ct2.y);
        //    let cartesainFromWindowCoordinates = Viewer.camera.pickEllipsoid(windowCoordinates);
        //  this.entity.position = cartesainFromWindowCoordinates ? cartesainFromWindowCoordinates : this.entity.position._value;

        let increase = true;
        const scalePerStep = this.calculateEnlargeStep();
        const durationInSeconds = this.primitiveConfig.duration;
        const maxWindowCoordinateHeight = this.windowCoordinates.y - this.primitiveConfig.jumpMaxHeight;
        const interval = window.setInterval(() => {
            const roundedScale = this.getRoundedScale();
            if ((this.windowCoordinates.y <= maxWindowCoordinateHeight)) {
                increase = !increase;
            }
            let y = this.windowCoordinates.y;
            y += increase ? scalePerStep : -scalePerStep;
            this.windowCoordinates = {x: this.windowCoordinates.x, y};
            let cartesainFromWindowCoordinates = Viewer.camera.pickEllipsoid(this.windowCoordinates);
            this.entity.position = cartesainFromWindowCoordinates ? cartesainFromWindowCoordinates : this.entity.position._value;
        }, this.primitiveConfig.timeoutInterval);
        if (!this.primitiveConfig.interval) {
            window.setTimeout(() => {window.clearInterval(interval);
                if (originPosition !== this.entity.position._value) {
                    this.entity.position = originPosition;
                }
            }, durationInSeconds);
        }
    }


    calculateEnlargeStep() {
        const durationInSeconds = this.primitiveConfig.duration;
        const numberOfSteps = (durationInSeconds / 2) / this.primitiveConfig.timeoutInterval;
        const currentScale = this.windowCoordinates.y;
        // const destinatedScale = this.primitiveConfig.jumpMaxHeight;
        // const scaleDelta = destinatedScale - currentScale;
        const scalePerStep = -this.primitiveConfig.jumpMaxHeight / numberOfSteps;
        return scalePerStep;
    }

    getRoundedScale() {
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