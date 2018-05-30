import { Flicker } from "./animations/flicker";
import { Enlarge } from "./animations/enlarge";
import { AnimateType } from "./config";
import { ChangeOpacity } from "./animations/changeOpacity";
import { Jump } from "./animations/jump";

export class HighlightSelector {
    //optionsOFALL....


    constructor(animationArr, options) {
        this.options = options;
        // this.setup(animationArr, options)
    }

    set selectedEntity(entity) {
        this._selectedEntity = entity;
    }
    get selectedEntity(){
        return this._selectedEntity;
    }

    setup(animationArr, options, entity) {
        this.selectedEntity = entity;
        this.animations = [];
        if (animationArr) {
            animationArr.forEach(animation => {
                switch (animation) {
                    case AnimateType.shrinkGrow:
                        this.animations.push(new Enlarge(this.selectedEntity));
                        break;
                    case AnimateType.flicker:
                        this.animations.push(new Flicker(this.selectedEntity));
                        break;
                    case AnimateType.changeOpacity:
                        this.animations.push(new ChangeOpacity(this.selectedEntity));
                        break;
                    case AnimateType.jump:
                        this.animations.push(new Jump(this.selectedEntity));
                        break;
                    default:
                        this.animations.push(new Enlarge(this.selectedEntity));
                }
            })
        }
    }

    start() {
        this.animations.forEach(animation => animation.startAnimation())

    }

    stop() {
        this.animations.forEach(animation => animation.stopCallback())
    }

// {
//     filterArray: entity.filterArr,
//     enlarge : new Enlarge(entity),
//     changeColor: new ChangeColor(entity)
// }
}
