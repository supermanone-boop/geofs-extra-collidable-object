"use strict";

const url =
  "https://raw.githubusercontent.com/supermanone-boop/models/main/heliport.glb";


const LON = 139.69175111;
const LAT = 35.689207296197;
const HEIGHT = 282.8;

function spawnModel() {
  const viewer = geofs.api.viewer;

  const pos = Cesium.Cartesian3.fromDegrees(
    LON,
    LAT,
    HEIGHT
  );

  const model = viewer.scene.primitives.add(
    Cesium.Model.fromGltf({
      url: url,
      modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(pos),
      scale: 0.015
    })
  );

  console.log("なんとできました");
  return model;
}


const wait = setInterval(() => {
  if (window.geofs && geofs.api && window.Cesium) {
    clearInterval(wait);
    spawnModel();
  }
}, 500);
