import { Enlarge } from "./highlight/animations/enlarge";
import {Cesium} from '../index';
import { BillboardLocations } from "./testCaseConfig";
import { ChangeColor } from "./highlight/animations/changeColor";

export class Tester {

    constructor(cesium, view, entities, options) {
        this.view = view;
        this.cesium = cesium;
        this.options = options;
        this.entities = this._addEntityToEntitiesArr() || entities;
        this._initHighlight()
    }

    get imageUrl(){
        const imageUrl = 'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-person-128.png';
        return imageUrl;
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
                enlarge : new Enlarge(entity),
                changeColor: new ChangeColor(entity)
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
                pickedObject.id.highlight.changeColor.startAnimation(this.options).then(stop =>{ setTimeout(() => stop(), 5000)} );

            }
        }
        this.handler = new this.cesium.ScreenSpaceEventHandler(this.view.scene.canvas);
        this.handler.setInputAction(this.clickListener.bind(this), this.cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    _addEntityToEntitiesArr(){
        let entitiesMock = [];
        BillboardLocations.forEach(billboard => {
            let entityToPush = {
                name: 'billboard',
                position: this.cesium.Cartesian3.fromDegrees(billboard.x, billboard.y),
                billboard : {
                    image :  new Cesium.PinBuilder().fromUrl(this.imageUrl, this.cesium.Color.ROYALBLUE, 48),
                    verticalOrigin : this.cesium.VerticalOrigin.BOTTOM
                }
            };

            entitiesMock.push(entityToPush);
        })
        return entitiesMock;
    }
}


