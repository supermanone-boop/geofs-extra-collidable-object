'use strict';

(() => {

    // =========================
    // 機体リスト
    // =========================
    const OBJECTS = [

        {
            name: "A380",
            lla: [34.617293779346646, 134.80097227352553, 181.9825137569666],
            url: "https://www.geo-fs.com/models/aircraft/premium/a380/a380.gltf",
            scale: 1,
            minimumPixelSize: 0
        },

        {
            name: "772",
            lla: [34.617373460151356, 134.7977016109173, 181.98268817287962],
            url: "https://www.geo-fs.com/backend/aircraft/repository/Protium%20H1_448101_4016/772-3.glb",
            scale: 1,
            minimumPixelSize: 0
        },

        {
            name: "747-8F",
            lla: [34.617103901204814, 134.7943127399184, 183.40703763074646],
            url: "https://www.geo-fs.com/backend/aircraft/repository/747-8F%20by%20JAaMDG%20and%20Boa93_364320_5409/74D2.glb",
            scale: 1,
            minimumPixelSize: 0
        }

    ];

    // =========================
    // spawn関数
    // =========================
    function spawn(obj) {

        const viewer = geofs.api.viewer;

        const pos = Cesium.Cartesian3.fromDegrees(
            obj.lla[1],
            obj.lla[0],
            obj.lla[2]
        );

        const model = viewer.scene.primitives.add(
            Cesium.Model.fromGltf({

                url: obj.url,

                modelMatrix:
                    Cesium.Transforms.eastNorthUpToFixedFrame(pos),

                scale: obj.scale,

                minimumPixelSize: obj.minimumPixelSize

            })
        );

        console.log(`[${obj.name}] spawned`);

        return model;
    }

    // =========================
    // 起動待ち
    // =========================
    const wait = setInterval(() => {

        if (window.geofs?.api?.viewer && window.Cesium) {

            clearInterval(wait);

            OBJECTS.forEach(spawn);

        }

    }, 300);

})();