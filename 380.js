'use strict';

(() => {

    const LLA = [
        34.617293779346646,
        134.80097227352553,
        181.9825137569666
    ];

    const url =
      "https://www.geo-fs.com/models/aircraft/premium/a380/a380.gltf";

    function spawnJAL() {

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

                scale: 1

                // ❌ minimumPixelSize は入れない（重要）

            })
        );

        console.log("[JAL 737-800] spawned");

        return model;
    }

    const wait = setInterval(() => {

        if (window.geofs?.api?.viewer && window.Cesium) {

            clearInterval(wait);
            spawnJAL();

        }

    }, 300);

})();