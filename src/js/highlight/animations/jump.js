import { Highlight } from "../highlight";
import { Cesium, Viewer } from "../../../index";
import { Types } from "../config";

export class Jump extends Highlight {
    super(pickedLabel, options) {
        this.pickedLabel = pickedLabel;
        this.options = options;
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

    set intervalId(intervalId) {
        this._intervalId = intervalId;
    }

    get intervalId() {
        return this._intervalId;
    }

    set originPosition(originPosition) {
        this._originPosition = originPosition;
    }

    get originPosition() {
        return this._originPosition;
    }

    set isMouseClickDetected(isMouseClickDetected) {
        this._isMouseClickDetected = isMouseClickDetected;
    }

    get isMouseClickDetected() {
        return this._isMouseClickDetected;
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
        this.isMouseClickDetected = false;
        this.windowCoordinates = Cesium.SceneTransforms.wgs84ToWindowCoordinates(Viewer.scene, this.entity.position._value);
        this.originPosition = this.entity.position._value;
        let increase = true;
        let isDetected = false;
        const scalePerStep = this.calculateEnlargeStep();
        const durationInSeconds = this.primitiveConfig.duration;
        const maxWindowCoordinateHeight = this.windowCoordinates.y - this.primitiveConfig.jumpMaxHeight;
        const interval = window.setInterval(() => {
            this.intervalId = interval;
            if (!isDetected) {
                isDetected = !isDetected;
                this.detectMouseClickHandler();
            }

            if (this.isMouseClickDetected) {
                window.clearInterval(this.intervalId);
                this.entity.position = this.originPosition;
            }

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
            window.setTimeout(() => {
                document.getElementById('cesiumContainer').removeEventListener('onmousemove', () => {
                });
                window.clearInterval(interval);
                if (this.originPosition !== this.entity.position._value) {
                    this.entity.position = this.originPosition;
                }
            }, durationInSeconds);
        }
    }

    calculateEnlargeStep() {
        const durationInSeconds = this.primitiveConfig.duration;
        const numberOfSteps = (durationInSeconds / 2) / this.primitiveConfig.timeoutInterval;
        const scalePerStep = -this.primitiveConfig.jumpMaxHeight / numberOfSteps;
        return scalePerStep;
    }

    detectMouseClickHandler() {
        const jumpScope = this;
        const mouseHandler = document.getElementById('cesiumContainer');
        mouseHandler.onmousemove = this.stopAnimationAfterMouseEvent.bind(jumpScope);
    }

    stopAnimationAfterMouseEvent() {
        document.getElementById('cesiumContainer').removeEventListener('onmousemove',this.stopAnimationAfterMouseEvent);
        this.isMouseClickDetected = true;
       // console.log('yay')
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