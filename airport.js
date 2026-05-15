'use strict';

(() => {

    // =========================
    // ① COLLISIONゾーン用座標
    // =========================

    const CENTER_A_LAT = 34.610152;
    const CENTER_A_LON = 134.801031;
    const CENTER_A_ALT = 179.0290;

    // =========================
    // ② GLB表示用座標（別）
    // =========================

    const CENTER_B_LAT = 34.615500;
    const CENTER_B_LON = 134.805200;
    const CENTER_B_ALT = 80;

    // =========================
    // 2km四方（A用）
    // =========================

    const HALF = 1000;

    const corners = [
        [-HALF, -HALF, 0],
        [ HALF, -HALF, 0],
        [ HALF,  HALF, 0],
        [-HALF,  HALF, 0]
    ];

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

    const collisionTriangles = [
        tri(corners[0], corners[1], corners[2]),
        tri(corners[0], corners[2], corners[3])
    ];

    // =========================
    // GeoFS collision object（A）
    // =========================

    const obj = {

        name: "ZONE A (Collision)",
        type: 100,

        url: "https://raw.githubusercontent.com/supermanone-boop/models/main/a10c.glb",

        location: [
            CENTER_A_LAT,
            CENTER_A_LON,
            CENTER_A_ALT
        ],

        htr: [0,0,0],
        rotateModelOnly: false,
        scale: 1,

        metricOffset: [0,0,0],

        collisionRadius: 2000,
        collisionTriangles,

        options: {}
    };

    geofs.objects.objectList.push(obj);
    geofs.objects.loadModels();

    console.log("[ZONE A] collision spawned");

    // =========================
    // Cesium GLB（B）
    // =========================

    const url =
      "https://raw.githubusercontent.com/supermanone-boop/geofs-extra-collidable-object/main/airport.glb";

    function spawnModel() {

        const viewer = geofs.api.viewer;

        const pos = Cesium.Cartesian3.fromDegrees(
            CENTER_B_LON,
            CENTER_B_LAT,
            CENTER_B_ALT
        );

        viewer.scene.primitives.add(
            Cesium.Model.fromGltf({
                url: url,
                modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(pos),
                scale: 50
            })
        );

        console.log("[ZONE B] GLB spawned");
    }

    const wait = setInterval(() => {
        if (window.geofs && geofs.api && window.Cesium) {
            clearInterval(wait);
            spawnModel();
        }
    }, 500);

})();