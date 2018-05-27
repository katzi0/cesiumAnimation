export const AnimateType = {
    shrinkGrow: 'shrink/grow',
    wobble: 'wobble',
    flicker: 'flicker'
};

export const Types = {
    label: {key: 'label', field: 'scale', scaleLevel: 0.08, maxScale: 10, minScale: 1},
    polyline: {key: 'polyline', field: 'width', scaleLevel: 0.1, maxScale: 20, minScale: 5}
}

export const defaultOptions = {
    type: Types.label.key,
    duration: 0,//if 0, stop manually with callback
    animationType: AnimateType.wobble
};

