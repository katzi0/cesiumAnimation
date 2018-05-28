import { Tester } from "./js/highlight/test-case/testCase";

require('cesium/Widgets/widgets.css');
require('./css/main.css');

export const Cesium = require('cesium/Cesium');

const viewer = new Cesium.Viewer('cesiumContainer');

const test = new Tester(Cesium, viewer, []);
