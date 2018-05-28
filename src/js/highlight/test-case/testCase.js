import { Enlarge } from "../animations/enlarge";
import { Cesium } from '../../../index';
import { BillboardMocks } from "./testCaseConfig";
import { ChangeColor } from "../animations/changeColor";
import { AnimateType } from "../config";
import { Highlight } from "../highlight";

export class Tester {

    constructor(cesium, view, entities, options) {
        this.view = view;
        this.cesium = cesium;
        this.options = options;
        this.entities = this._addEntityToEntitiesArr() || entities;
        this._initHighlight();
        this._addDropDownEventListener();
        this._addAnimationSelectEventListener();
        this._stopAnimationEventlisteners();
    }

    get imageUrl(){
        const imageUrl = 'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-person-128.png';
        return imageUrl;
    }

    _initHighlight() {
        this.entities.forEach(entity => {this.view.entities.add(entity)});
        this._addHighlightPropToEntity(this.view);
    }

    _addHighlightPropToEntity (viewer) {
        // constraint until the project will be integrated in cesium
        viewer.entities.values.forEach(entity => {
            entity.addProperty('highlight');
            entity.highlight = {
                filterArray: entity.filterArr,
                options: new Highlight().options,
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

    _addEntityToEntitiesArr() {
        let entitiesMock = [];
        BillboardMocks.forEach(billboard => {
            let entityToPush = {
                filterArr: billboard.filtersArr,
                name: 'billboard',
                position: this.cesium.Cartesian3.fromDegrees(billboard.position.x, billboard.position.y),
                billboard : {
                    image :  new Cesium.PinBuilder().fromUrl(this.imageUrl, this.cesium.Color.ROYALBLUE, 48),
                    verticalOrigin : this.cesium.VerticalOrigin.BOTTOM
                }
            };
            entitiesMock.push(entityToPush);
        })
        return entitiesMock;
    }

    _addDropDownEventListener(){
        let ddOccupation = document.getElementById('ddOccupation');
        let ddSex = document.getElementById('ddSex');
        let ddAge = document.getElementById('ddAge');
        let selected;
        ddOccupation.addEventListener('change',() => {
            selected = parseInt(ddOccupation.options[ddOccupation.selectedIndex].value);
            this.view.entities.values.forEach(entity => {
                entity.filterArr.forEach(catagory => {
                    if(catagory.occupationFilter != undefined && catagory.occupationFilter ===  selected){
                        switch (entity.highlight.options.animationType) {
                            case AnimateType.shrinkGrow:
                                entity.highlight.enlarge.startAnimation(this.options).then(stop =>{ setTimeout(() => stop(), 5000)} );
                                break;
                            case AnimateType.flicker:
                                entity.highlight.changeColor.startAnimation(this.options).then(stop =>{ setTimeout(() => stop(), 5000)} );
                                break;
                            default:
                                entity.highlight.enlarge.startAnimation(this.options).then(stop =>{ setTimeout(() => stop(), 5000)} );
                        }
                    }
                })
            })
        })
    }

    _addAnimationSelectEventListener(){
        const btnShrinkGrow=  document.getElementById('btnShrinkGrow');
        const btnFlicker=  document.getElementById('btnFlicker');

        btnShrinkGrow.addEventListener('click', () => {
            btnShrinkGrow.style.backgroundColor = "#99ADC6";
            btnFlicker.style.backgroundColor = "";
           this.view.entities.values.forEach(entity => {
               entity.highlight.options.animationType = AnimateType.shrinkGrow;
           })
       })
        btnFlicker.addEventListener('click', () => {
            btnFlicker.style.backgroundColor = "#99ADC6";
            btnShrinkGrow.style.backgroundColor = "";
            this.view.entities.values.forEach(entity => {
                entity.highlight.options.animationType = AnimateType.flicker;
            })
        })
    }


    _stopAnimationEventlisteners() {
        document.getElementById('stopAnimation').addEventListener('click', () => {
            this.entities.highlight.enlarge.stopCallback();
        })
    }
}


