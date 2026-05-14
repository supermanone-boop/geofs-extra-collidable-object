'use strict';

(() => {



    const CENTER_LAT = 35.689207296197;
    const CENTER_LON = 139.69175111;
    const CENTER_ALT = 278.4;



    const R = 50;
    const SEG = 12;



    const ring = [];

    for(let i=0;i<SEG;i++){

        const a = (i / SEG) * Math.PI * 2;

        ring.push([

            Math.cos(a) * R,
            Math.sin(a) * R,
            0

        ]);
    }



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

    const collisionTriangles = [];

    for(let i=1;i<SEG-1;i++){

        collisionTriangles.push(
            tri(ring[0], ring[i], ring[i+1])
        );
    }



    const obj = {

        name: "50M Collision Zone",

        type: 100,

        url: "https://raw.githubusercontent.com/supermanone-boop/models/main/a10c.glb",

        location: [
            CENTER_LAT,
            CENTER_LON,
            CENTER_ALT
        ],

        htr: [0,0,0],

        rotateModelOnly: false,

        scale: 1,

        metricOffset: [0,0,0],

        collisionRadius: 120,

        collisionTriangles,

        options: {}

    };



    geofs.objects.objectList.push(obj);

    geofs.objects.loadModels();

    console.log("[50M COLLISION ZONE] spawned");



    const url =
      "https://raw.githubusercontent.com/supermanone-boop/models/main/heliport.glb";


    const LON = 139.69175111;
    const LAT = 35.689207296197;
    const HEIGHT = 282.8;

    function spawnModel() {
      const viewer = geofs.api.viewer;

      const pos = Cesium.Cartesian3.fromDegrees(
        LON,
        LAT,
        HEIGHT
      );

      const model = viewer.scene.primitives.add(
        Cesium.Model.fromGltf({
          url: url,
          modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(pos),
          scale: 0.011
        })
      );

      console.log("なんとできました");
      return model;
    }


    const wait = setInterval(() => {
      if (window.geofs && geofs.api && window.Cesium) {
        clearInterval(wait);
        spawnModel();
      }
    }, 500);

})();