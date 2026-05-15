'use strict';

(() => {

    const LLA = [34.617373460151356, 134.7977016109173, 181.98268817287962];

    const url =
      "https://www.geo-fs.com/backend/aircraft/repository/Protium%20H1_448101_4016/772-3.glb";

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

                minimumPixelSize: 0

            })
        );

        console.log("[77200] spawned");

        return model;
    }

    const wait = setInterval(() => {

        if (window.geofs?.api?.viewer && window.Cesium) {

            clearInterval(wait);
            spawn737();

        }

    }, 300);

})();