'use strict';

(() => {

    const A = [34.615018371486485, 134.79226623856255, 179.0664018098515];
    const B = [34.61501910072516, 134.81176269645158, 179.06643436359283];

    const viewer = geofs.api.viewer;

    function lerp(a, b, t) {
        return [
            a[0] + (b[0] - a[0]) * t,
            a[1] + (b[1] - a[1]) * t,
            a[2] + (b[2] - a[2]) * t
        ];
    }

    function light(pos) {

        return viewer.entities.add({

            position: Cesium.Cartesian3.fromDegrees(
                pos[1],
                pos[0],
                pos[2]
            ),

            billboard: {
                image: (() => {

                    const c = document.createElement("canvas");
                    c.width = 64;
                    c.height = 64;

                    const ctx = c.getContext("2d");

                    const g = ctx.createRadialGradient(32,32,2,32,32,32);

                    g.addColorStop(0, "rgba(0,255,140,1)");
                    g.addColorStop(0.4, "rgba(0,255,140,0.5)");
                    g.addColorStop(1, "rgba(0,255,140,0)");

                    ctx.fillStyle = g;
                    ctx.beginPath();
                    ctx.arc(32,32,32,0,Math.PI*2);
                    ctx.fill();

                    return c;
                })(),

                scale: 1.0,

                scaleByDistance: new Cesium.NearFarScalar(
                    50, 1.0,
                    2000, 0.1
                )
            }
        });
    }

    const count = 120;

    for (let i = 0; i <= count; i++) {

        const t = i / count;
        const p = lerp(A, B, t);

        light(p);
    }

    console.log("[GREEN LIGHT REALISTIC] spawned");

})();

(() => {

    const viewer = geofs.api.viewer;

    function lerp(a, b, t) {
        return [
            a[0] + (b[0] - a[0]) * t,
            a[1] + (b[1] - a[1]) * t,
            a[2] + (b[2] - a[2]) * t
        ];
    }

    function dist(a, b) {

        const R = 6371000;

        const dLat = (b[0] - a[0]) * Math.PI / 180;
        const dLon = (b[1] - a[1]) * Math.PI / 180;

        const lat1 = a[0] * Math.PI / 180;

        const x = dLon * Math.cos(lat1);
        const y = dLat;

        return Math.sqrt(x*x + y*y) * R;
    }

    function makeLine(A, B, colorHex) {

        const d = dist(A, B);

        const step = 2.0;
        const count = Math.max(2, Math.floor(d / step));

        console.log("[LIGHT LINE]", colorHex, "distance:", d, "count:", count);

        for (let i = 0; i <= count; i++) {

            const t = i / count;
            const p = lerp(A, B, t);

            viewer.entities.add({

                position: Cesium.Cartesian3.fromDegrees(
                    p[1],
                    p[0],
                    p[2] + 0.25
                ),

                point: {

                    pixelSize: 0,

                    color: Cesium.Color.fromCssColorString(colorHex).withAlpha(1.0),

                    outlineColor: Cesium.Color.WHITE.withAlpha(0.2),
                    outlineWidth: 0
                },

                distanceDisplayCondition:
                    new Cesium.DistanceDisplayCondition(0.0, 3000.0)
            });
        }
    }

    const A1 = [
        34.61486651622849,
        134.79294209368445,
        179.06647222005387
    ];

    const B1 = [
        34.61486897874252,
        134.8114518207117,
        179.0665427556996
    ];

    makeLine(A1, B1, "#ffd400");

    const A2 = [
        34.61517948317739,
        134.8107986721722,
        179.06639947160554
    ];

    const B2 = [
        34.61516810358668,
        134.79280917499364,
        179.06626453427415
    ];

    makeLine(A2, B2, "#ffd400");

    console.log("[ALL LIGHT LINES] done");

})();

(() => {

    // =========================================================
    // 🧭 基本座標（コリジョンゾーンA）
    // =========================================================
    const ZONE_A = {
        lat: 34.610152,
        lon: 134.801031,
        alt: 179.0290
    };

    const ZONE_B = {
        lat: 34.615500,
        lon: 134.805200,
        alt: 80
    };

    const ZONE_C = {
        lat: 35.689207296197,
        lon: 139.69175111,
        alt: 278.4
    };

    const AIRCRAFT = [

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
            minimumPixelSize: 128
        }

    ];

    let spawnedAircraft = [];

    function tri(p0,p1,p2){

        const u = [
            p1[0]-p0[0],
            p1[1]-p0[1],
            p1[2]-p0[2]
        ];

        const v = [
            p2[0]-p0[0],
            p2[1]-p0[1],
            p2[2]-p0[2]
        ];

        const n = [
            u[1]*v[2] - u[2]*v[1],
            u[2]*v[0] - u[0]*v[2],
            u[0]*v[1] - u[1]*v[0]
        ];

        return Object.assign([p0,p1,p2], {u,v,n});
    }

    function spawnZoneA(){

        const HALF = 1000;

        const corners = [
            [-HALF,-HALF,0],
            [ HALF,-HALF,0],
            [ HALF, HALF,0],
            [-HALF, HALF,0]
        ];

        const collisionTriangles = [
            tri(corners[0],corners[1],corners[2]),
            tri(corners[0],corners[2],corners[3])
        ];

        geofs.objects.objectList.push({
            name: "ZONE A",
            type: 100,
            url: "https://raw.githubusercontent.com/supermanone-boop/models/main/a10c.glb",
            location: [ZONE_A.lat, ZONE_A.lon, ZONE_A.alt],
            htr: [0,0,0],
            rotateModelOnly: false,
            scale: 1,
            metricOffset: [0,0,0],
            collisionRadius: 2000,
            collisionTriangles,
            options: {}
        });

        geofs.objects.loadModels();

        console.log("[ZONE A] collision spawned");
    }

    function spawnZoneB(){

        const viewer = geofs.api.viewer;

        const pos = Cesium.Cartesian3.fromDegrees(
            ZONE_B.lon,
            ZONE_B.lat,
            ZONE_B.alt
        );

        viewer.scene.primitives.add(
            Cesium.Model.fromGltf({
                url: "https://raw.githubusercontent.com/supermanone-boop/geofs-extra-collidable-object/main/airport.glb",
                modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(pos),
                scale: 50
            })
        );

        console.log("[ZONE B] airport spawned");
    }

    function spawnZoneC(){

        const viewer = geofs.api.viewer;

        const pos = Cesium.Cartesian3.fromDegrees(
            ZONE_C.lon,
            ZONE_C.lat,
            ZONE_C.alt
        );

        viewer.scene.primitives.add(
            Cesium.Model.fromGltf({
                url: "https://raw.githubusercontent.com/supermanone-boop/models/main/heliport.glb",
                modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(pos),
                scale: 0.011
            })
        );

        console.log("[ZONE C] heliport spawned");
    }

    function spawnAircraft(obj){

        const viewer = geofs.api.viewer;

        const pos = Cesium.Cartesian3.fromDegrees(
            obj.lla[1],
            obj.lla[0],
            obj.lla[2]
        );

        const model = viewer.scene.primitives.add(
            Cesium.Model.fromGltf({
                url: obj.url,
                modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(pos),
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

            spawnZoneA();
            spawnZoneB();
            spawnZoneC();

            AIRCRAFT.forEach(a => {
                const m = spawnAircraft(a);
                spawnedAircraft.push(m);
            });

        }

    }, 300);

})();