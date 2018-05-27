import { Enlarge } from "./highlight/animations/enlarge";
import {Cesium} from '../index';

export class Tester {

    constructor(cesium, view, entities, options) {
        this.view = view;
        this.cesium = cesium;
        this.options = options;
        this.entities = [
            // {
            //     position: this.cesium.Cartesian3.fromDegrees(-75.1641667, 39.9522222),
            //     label: {
            //         id: 'label',
            //         text: 'test',
            //         scale: 1
            //     },
            //     polyline: {
            //         positions: this.cesium.Cartesian3.fromDegreesArray([-75, 35, -125, 35]),
            //         width: 5,
            //         material: this.cesium.Color.RED
            //     }
            // },
            // {
            //     name: 'blue line on the surface',
            //     position: this.cesium.Cartesian3.fromDegrees(-75.1641667, 39.9522222),
            //     polyline: {
            //         positions: this.cesium.Cartesian3.fromDegreesArray([-65, 35, -105, 35]),
            //         width: 5,
            //         material: this.cesium.Color.BLUE
            //     }
            // },
            {
                name: 'billboard',
                position: this.cesium.Cartesian3.fromDegrees(-75.1641667, 20.9522222),
                billboard : {
                    image :  new Cesium.PinBuilder().fromColor(this.cesium.Color.ROYALBLUE, 48).toDataURL(),
                    verticalOrigin : this.cesium.VerticalOrigin.BOTTOM
                }
            }

        ] || entities;
        this._initHighlight()
    }


    _initHighlight() {
        this.entities.forEach(entity => this.view.entities.add(entity));
        this._addHighlightPropToEntity(this.view);
    }

    _addHighlightPropToEntity (viewer) {
        // constraint until the project will be integrated in cesium
        viewer.entities.values.forEach(entity => {
            entity.addProperty('highlight');
            entity.highlight = {
                enlarge : new Enlarge(entity)
            }
        })
    }

    runTest() {
        this._addClickListener();
    }

    _addClickListener() {
        this.clickListener = function (click) {
            const pickedObject = this.view.scene.pick(click.position);
            if (this.cesium.defined(pickedObject) && (pickedObject.id)) {
                pickedObject.id.highlight.enlarge.startAnimation(this.options).then(stop =>{ setTimeout(() => stop(), 5000)} );
            }
        }
        this.handler = new this.cesium.ScreenSpaceEventHandler(this.view.scene.canvas);
        this.handler.setInputAction(this.clickListener.bind(this), this.cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
}


