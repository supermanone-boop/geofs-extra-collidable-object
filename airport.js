'use strict';

(() => {

    const LAT = 34.617103901204814;
    const LON = 134.7943127399184;
    const ALT = 183.40703763074646;

    const url =
      "https://www.geo-fs.com/backend/aircraft/repository/747-8F%20by%20JAaMDG%20and%20Boa93_364320_5409/74D2.glb";

    function spawn747() {

        const viewer = geofs.api.viewer;

        const pos = Cesium.Cartesian3.fromDegrees(
            LON,
            LAT,
            ALT
        );

        const model = viewer.scene.primitives.add(
            Cesium.Model.fromGltf({

                url: url,

                modelMatrix:
                    Cesium.Transforms.eastNorthUpToFixedFrame(pos),

                scale: 1,

                minimumPixelSize: 128

            })
        );

        console.log("[747-8F] spawned");

        return model;
    }

    const wait = setInterval(() => {

        if (window.geofs?.api?.viewer && window.Cesium) {

            clearInterval(wait);
            spawn747();

        }

    }, 300);

})();