import { Enlarge } from "../animations/enlarge";
import { Cesium } from '../../../index';
import { BillboardMocks } from "./testCaseConfig";
import { ChangeColor } from "../animations/changeColor";
import { AnimateType, defaultOptions } from "../config";
import { HighlightSelector } from "../highlightSelector";

export class Tester {

    constructor(cesium, view, entities, options) {
        this.view = view;
        this.cesium = cesium;
        this.options = options;
        this.entities = this._addEntityToEntitiesArr() || entities;
        this._animationTypes = defaultOptions.animationType;
        this._initHighlight();
        this._addDropDownEventListener();
        this._addAnimationSelectEventListener();
        this._stopAnimationEventlisteners();
        this._addClickListener();
    }

    get imageUrl(){
        const imageUrl = 'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-person-128.png';
        return imageUrl;
    }

    get animationTypes(){
        return this._animationTypes;
    }
    set animationTypes(animationTypes) {
        this._animationTypes = animationTypes;
    }


    _initHighlight() {
        this.entities.forEach(entity => {this.view.entities.add(entity)});
        this._addHighlightPropToEntity(this.view);
    }

    _addHighlightPropToEntity (viewer) {
        // constraint until the project will be integrated in cesium
        viewer.entities.values.forEach(entity => {
            entity.addProperty('highlight');
            entity.highlight = new HighlightSelector();
        })
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
                        entity.highlight(this.animationTypes, []).then(stop => {
                            setTimeout(() => stop(), 5000)
                        });

                        // entity.highlight.enlarge.options.animationType.forEach(type => {
                        //     if(type ===  AnimateType.shrinkGrow)
                        //         entity.highlight.enlarge.startAnimation(this.options)
                        // entity.highlight.changeColor.options.animationType.forEach(type => {
                        //     if (type === AnimateType.flicker)
                        //         entity.highlight.changeColor.startAnimation(this.options)
                        //     else
                        //         entity.highlight.changeColor.startAnimation(this.options, true)
                        //         });
                        // })
                    }
                })
            })
        })
    }

    _modifyAnimationTypesArr(selectedType, add = true){
        let arr = [];
        if(add)
        {
            let index = this.animationTypes.findIndex(type => type === selectedType);
            this.animationTypes.forEach(type => arr.push(type));
            if(index < 0)
                arr.push(selectedType);
        }
        else
            arr = this.animationTypes.filter(type => type !== selectedType);
        return arr;
    }

    _addAnimationSelectEventListener(){
        const btnShrinkGrow=  document.getElementById('btnShrinkGrow');
        const btnFlicker=  document.getElementById('btnFlicker');
        let isSelectedShrinkGrow = true;
        let isSelectedFlicker =  true;
        btnShrinkGrow.style.backgroundColor = "#99ADC6";
        btnFlicker.style.backgroundColor = "#99ADC6";

        btnShrinkGrow.addEventListener('click', () => {
            if(!isSelectedShrinkGrow){
                isSelectedShrinkGrow = true;
                btnShrinkGrow.style.backgroundColor = "#99ADC6";
                this.view.entities.values.forEach(entity => {
                    // this.animationTypes.forEach(type => arr.push(type));
                    // arr.push(AnimateType.shrinkGrow);
                    this.animationTypes = this._modifyAnimationTypesArr(AnimateType.shrinkGrow, true);
                    //
                    // entity.highlight.enlarge.addAnimationType(AnimateType.shrinkGrow);
                })
            }
            else {
                isSelectedShrinkGrow = false;
                btnShrinkGrow.style.backgroundColor = "";
                this.view.entities.values.map(entity => {

                    this.animationTypes = this._modifyAnimationTypesArr(AnimateType.shrinkGrow, false);
                    // entity.highlight.enlarge.removeAnimationType(AnimateType.shrinkGrow);
                })
            }
       })
        btnFlicker.addEventListener('click', () => {
            if(!isSelectedFlicker){
                isSelectedFlicker = true;
                btnFlicker.style.backgroundColor = "#99ADC6";
                this.view.entities.values.forEach(entity => {
                    this.animationTypes = this._modifyAnimationTypesArr(AnimateType.flicker, true);
                    // entity.highlight.changeColor.addAnimationType(AnimateType.flicker);
                })
            }
            else {
                isSelectedFlicker = false;
                btnFlicker.style.backgroundColor = "";
                this.view.entities.values.map(entity => {
                    this.animationTypes = this._modifyAnimationTypesArr(AnimateType.flicker, false);
                    // entity.highlight.changeColor.removeAnimationType(AnimateType.flicker);
                })
            }
        })
    }



    _stopAnimationEventlisteners() {
        document.getElementById('stopAnimation').addEventListener('click', () => {
            this.entities.highlight.enlarge.stopCallback();
        })
    }
}


