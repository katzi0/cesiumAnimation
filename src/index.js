import { Tester } from "./js/highlight/test-case/testCase";

require('cesium/Widgets/widgets.css');
require('./css/main.css');

export const Cesium = require('cesium/Cesium');

export const Viewer = new Cesium.Viewer('cesiumContainer');

const test = new Tester(Cesium, Viewer, []);
