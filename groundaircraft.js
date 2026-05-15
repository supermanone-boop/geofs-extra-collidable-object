const AIRCRAFT = [

    {
        name: "A380",
        lla: [34.617293779346646, 134.80097227352553, 181.9825137569666],
        url: "https://www.geo-fs.com/models/aircraft/premium/a380/a380.gltf",
        scale: 1,
        minimumPixelSize: 0,
        heading: 0
    },

    {
        name: "772",
        lla: [34.617373460151356, 134.7977016109173, 181.98268817287962],
        url: "https://www.geo-fs.com/backend/aircraft/repository/Protium%20H1_448101_4016/772-3.glb",
        scale: 1,
        minimumPixelSize: 0,
        heading: 0
    },

    {
        name: "747-8F",
        lla: [34.617103901204814, 134.7943127399184, 183.40703763074646],
        url: "https://www.geo-fs.com/backend/aircraft/repository/747-8F%20by%20JAaMDG%20and%20Boa93_364320_5409/74D2.glb",
        scale: 1,
        minimumPixelSize: 0,
        heading: 0
    },

    {
        name: "777-300",
        lla: [34.617513185716795, 134.79988631071322, 183.58430198900194],
        url: "https://www.geo-fs.com/models/aircraft/premium/777_300/777_300.gltf",
        scale: 1,
        minimumPixelSize: 0,
        heading: 0
    },

    {
        name: "F22",
        lla: [34.618951250181496, 134.79598969563978, 181.13101855234822],
        url: "https://www.geo-fs.com/backend/aircraft/repository/F22%20Test_285706_2857/F22V91.glb",
        scale: 1,
        minimumPixelSize: 0,
        heading: 90
    }

];

function spawnAircraft(obj){

    const viewer = geofs.api.viewer;

    const pos = Cesium.Cartesian3.fromDegrees(
        obj.lla[1],
        obj.lla[0],
        obj.lla[2]
    );

    const heading = Cesium.Math.toRadians(
        obj.heading || 0
    );

    const hpr = new Cesium.HeadingPitchRoll(
        heading,
        0,
        0
    );

    const modelMatrix =
        Cesium.Transforms.headingPitchRollToFixedFrame(
            pos,
            hpr
        );

    const model = viewer.scene.primitives.add(
        Cesium.Model.fromGltf({
            url: obj.url,
            modelMatrix: modelMatrix,
            scale: obj.scale,
            minimumPixelSize: obj.minimumPixelSize
        })
    );

    console.log(`[AIR] ${obj.name} spawned`);

    return model;
}

const wait = setInterval(() => {

    if (window.geofs?.api?.viewer && window.Cesium) {

        clearInterval(wait);

        AIRCRAFT.forEach(a => {
            spawnAircraft(a);
        });

    }

}, 300);