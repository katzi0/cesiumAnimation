import { ChangeColor } from "./animations/changeColor";
import { Enlarge } from "./animations/enlarge";
import { AnimateType } from "./config";

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
            if (animation === AnimateType.shrinkGrow){
                this.enlarge = new Enlarge(this);
                this.enlarge.startAnimation();
            }

            if(animation === AnimateType.flicker)
            {
                this.changeColor = new ChangeColor(this);
                this.changeColor.startAnimation();
            }
        })
        //this.startAnimation();
       // runAnimation();
        return new Promise(() => (this.enlarge.stopCallback()));
    }


// {
//     filterArray: entity.filterArr,
//     enlarge : new Enlarge(entity),
//     changeColor: new ChangeColor(entity)
// }
}
