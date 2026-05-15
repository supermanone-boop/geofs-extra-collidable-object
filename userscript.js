// ==UserScript==
// @name         GeoFS extra-collidable-object
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  extra-collidable-object
// @author       supermanone-boop
// @match        https://www.geo-fs.com/*
// @grant        none
// ==/UserScript==

'use strict';

(() => {

    // =========================================================
    // 🧭 基本座標（コリジョンゾーンA）
    // =========================================================
    const ZONE_A = {
        lat: 34.610152,
        lon: 134.801031,
        alt: 179.0290
    };

    // =========================================================
    // 🏗️ 建物ゾーン（B）
    // =========================================================
    const ZONE_B = {
        lat: 34.615500,
        lon: 134.805200,
        alt: 80
    };

    // =========================================================
    // 🚁 ヘリポートゾーン（C）
    // =========================================================
    const ZONE_C = {
        lat: 35.689207296197,
        lon: 139.69175111,
        alt: 278.4
    };

    // =========================================================
    // ✈️ AI機体
    // =========================================================
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

    // =========================================================
    // 🔺 triangle util
    // =========================================================
    function tri(p0, p1, p2) {

        const u = [
            p1[0] - p0[0],
            p1[1] - p0[1],
            p1[2] - p0[2]
        ];

        const v = [
            p2[0] - p0[0],
            p2[1] - p0[1],
            p2[2] - p0[2]
        ];

        const n = [
            u[1] * v[2] - u[2] * v[1],
            u[2] * v[0] - u[0] * v[2],
            u[0] * v[1] - u[1] * v[0]
        ];

        return Object.assign([p0, p1, p2], { u, v, n });
    }

    // =========================================================
    // 🧱 ZONE A
    // =========================================================
    function spawnZoneA() {

        const HALF = 1000;

        const corners = [
            [-HALF, -HALF, 0],
            [ HALF, -HALF, 0],
            [ HALF,  HALF, 0],
            [-HALF,  HALF, 0]
        ];

        const collisionTriangles = [
            tri(corners[0], corners[1], corners[2]),
            tri(corners[0], corners[2], corners[3])
        ];

        geofs.objects.objectList.push({
            name: "ZONE A",
            type: 100,
            url: "https://raw.githubusercontent.com/supermanone-boop/models/main/a10c.glb",
            location: [ZONE_A.lat, ZONE_A.lon, ZONE_A.alt],
            htr: [0, 0, 0],
            rotateModelOnly: false,
            scale: 1,
            metricOffset: [0, 0, 0],
            collisionRadius: 2000,
            collisionTriangles,
            options: {}
        });

        geofs.objects.loadModels();
        console.log("[ZONE A] spawned");
    }

    // =========================================================
    // 🌀 ZONE B
    // =========================================================
    function spawnZoneB() {

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

        console.log("[ZONE B] spawned");
    }

    // =========================================================
    // 🚁 ZONE C
    // =========================================================
    function spawnZoneC() {

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

        console.log("[ZONE C] spawned");
    }

    // =========================================================
    // ✈️ aircraft spawn
    // =========================================================
    function spawnAircraft(obj) {

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

    // =========================================================
    // 🚀 init wait
    // =========================================================
    const wait = setInterval(() => {

        if (window.geofs?.api?.viewer && window.Cesium) {

            clearInterval(wait);

            spawnZoneA();
            spawnZoneB();
            spawnZoneC();

            AIRCRAFT.forEach(a => {
                spawnedAircraft.push(spawnAircraft(a));
            });

        }

    }, 300);

})();