import { ChangeColor } from "./animations/changeColor";
import { Enlarge } from "./animations/enlarge";
import { AnimateType } from "./config";
import { ChangeOpacity } from "./animations/changeOpacity";

export class HighlightSelector {
    //optionsOFALL....

    constructor(options) {
        this.options = options;
        return this.run;

    }
    // runAnimation() {
    //     this.enlarge ? this.enlarge.startAnimation() : {};
    //     this.changeColor ? this.changeColor.startAnimation() : {};
    // }
    run(animationArr, options) {
        animationArr.forEach(animation => {
            this.stopCallback;

            switch(animation){
                case AnimateType.shrinkGrow:
                    this.enlarge = new Enlarge(this);
                    this.enlarge.startAnimation();
                    this.stopCallback = this.enlarge.stopCallback;
                    break;

                case AnimateType.flicker:
                    this.changeColor = new ChangeColor(this);
                    this.changeColor.startAnimation();
                    this.stopCallback = this.changeColor.stopCallback;

                    break;

                case AnimateType.changeOpacity:
                    this.changeOpacity = new ChangeOpacity(this);
                    this.changeOpacity.startAnimation();
                    this.stopCallback = this.changeOpacity.stopCallback;

                    break;

                default:
                    this.enlarge = new Enlarge(this);
                    this.enlarge.startAnimation();
                    this.stopCallback = this.enlarge.stopCallback;
            }
        })
        //this.startAnimation();
       // runAnimation();
        return new Promise(() => (this.stopCallback));
    }


// {
//     filterArray: entity.filterArr,
//     enlarge : new Enlarge(entity),
//     changeColor: new ChangeColor(entity)
// }
}
