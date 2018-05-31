export const AnimateType = {
    shrinkGrow: 'shrink/grow',
    wobble: 'wobble',
    flicker: 'flicker',
    changeOpacity: 'changeOpacity',
    jump: 'jump'
};

export const Types = {
    billboard: {
        key: 'billboard',
        field: 'scale',
        maxScale: 1.5,
        minScale: 1,
        currentScale: 1,
        interval: false,
        timeoutInterval: 50,
        duration: 2000,
        color: 'LIGHTSTEELBLUE',
        opacityEndResult: 0.3,
        jumpMaxHeight: 50,

    },
    label: {
        key: 'label',
        field: 'scale',
        maxScale: 1.5,
        minScale: 1,
        interval: false,
        timeoutInterval: 50,
        duration: 2000
    },
    polyline: {
        key: 'polyline',
        field: 'width',
        maxScale: 1.5,
        minScale: 1,
        interval: false,
        timeoutInterval: 50,
        duration: 2000
    }
}

export const defaultOptions = {
    duration: 4,//if 0, stop manually with callback
    animationType: [AnimateType.shrinkGrow, AnimateType.flicker, AnimateType.jump],
    color: Types.billboard.color
};





