import { Cesium } from '../../index';

export const AnimateType = {
    shrinkGrow: 'shrink/grow',
    wobble: 'wobble',
    flicker: 'flicker',
    changeOpacity: 'changeOpacity',
    jump: 'jump',
    IndicationEnlarge: 'IndicationEnlarge'
};

export const Types = {
    billboard: {
        key: 'billboard',
        field: 'scale',
        maxScale: 1.5,
        minScale: 1,
        currentScale: 1,
        interval: true,
        timeoutInterval: 16,
        duration: 1000,
        color: 'LIGHTSTEELBLUE',
        opacityEndResult: 0.3,
        jumpMaxHeight: 50,
        indicationOnly: true

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
    // duration: 4,//if 0, stop manually with callback
    animationType: [AnimateType.shrinkGrow],
    primitiveType: 'billboard',
    field: 'scale',
    maxScale: 1.5,
    scalePercent:0.5,
    minScale: 1,
    interval: true,
    timeoutInterval: 16,
    speed: 1000,
    duration: 2000,
    indicationOnly: false,
    easingFunction: 'ELASTIC_OUT'
};





