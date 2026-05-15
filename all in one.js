(() => {

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

const HANGAR = {
    lat: 34.61852487242056,
    lon: 134.7954409373162,
    alt: 138.06635526066395
};

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

function spawnHangar() {

    const viewer = geofs.api.viewer;

    const base = Cesium.Cartesian3.fromDegrees(
        HANGAR.lon,
        HANGAR.lat + 0.00105,
        HANGAR.alt - 0.8
    );

    const enu = Cesium.Transforms.eastNorthUpToFixedFrame(base);

    const offset = new Cesium.Cartesian3(-40, 0, 0);

    const shifted = Cesium.Matrix4.multiplyByPoint(
        enu,
        offset,
        new Cesium.Cartesian3()
    );

    const heading = Cesium.Math.toRadians(90);

    const hpr = new Cesium.HeadingPitchRoll(
        heading,
        0,
        0
    );

    const modelMatrix =
        Cesium.Transforms.headingPitchRollToFixedFrame(
            shifted,
            hpr
        );

    viewer.scene.primitives.add(
        Cesium.Model.fromGltf({
            url: "https://raw.githubusercontent.com/supermanone-boop/models/main/hangar.glb",
            modelMatrix: modelMatrix,
            scale: 26
        })
    );

    console.log("[HANGAR] spawned");
}

const wait = setInterval(() => {

    if (window.geofs?.api?.viewer && window.Cesium) {

        clearInterval(wait);

        spawnZoneA();
        spawnZoneB();
        spawnZoneC();
        spawnHangar();

    }

}, 300);

})();