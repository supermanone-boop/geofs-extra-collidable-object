'use strict';

(() => {

    const LLA = [34.617373460151356, 134.7977016109173, 181.98268817287962];

    const url =
      "https://www.geo-fs.com/models/aircraft/premium/737_700/737.gltf";

    function spawn737() {

        const viewer = geofs.api.viewer;

        const pos = Cesium.Cartesian3.fromDegrees(
            LLA[1], // lon
            LLA[0], // lat
            LLA[2]  // alt
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

        console.log("[737-700] spawned");

        return model;
    }

    const wait = setInterval(() => {

        if (window.geofs?.api?.viewer && window.Cesium) {

            clearInterval(wait);
            spawn737();

        }

    }, 300);

})();