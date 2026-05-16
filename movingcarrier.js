'use strict';

(() => {

    // =====================================================
    // ルート
    // =====================================================

    const POINTS = [

        [34.62309057094318, 134.78998250617317],

        [34.611669, 135.344630],

        [34.633300, 135.411515]

    ];

    // =====================================================
    // 設定
    // =====================================================

    const SPEED_KMH = 120;
    const SPEED_MS = SPEED_KMH / 3.6;

    const DECK_HEIGHT = 22;

    // 400m四方
    const HALF = 200;

    // =====================================================
    // viewer
    // =====================================================

    const viewer = geofs.api.viewer;

    // =====================================================
    // helper
    // =====================================================

    function dist(a, b) {

        const R = 6371000;

        const lat1 = a[0] * Math.PI / 180;
        const lat2 = b[0] * Math.PI / 180;

        const dLat = (b[0] - a[0]) * Math.PI / 180;
        const dLon = (b[1] - a[1]) * Math.PI / 180;

        const x =
            dLon * Math.cos((lat1 + lat2) / 2);

        const y = dLat;

        return Math.sqrt(x*x + y*y) * R;
    }

    function lerp(a, b, t) {

        return [

            a[0] + (b[0] - a[0]) * t,

            a[1] + (b[1] - a[1]) * t

        ];
    }

    // =====================================================
    // triangle helper
    // =====================================================

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

            u[1]*v[2]-u[2]*v[1],
            u[2]*v[0]-u[0]*v[2],
            u[0]*v[1]-u[1]*v[0]

        ];

        return Object.assign(

            [p0,p1,p2],

            {u,v,n}

        );
    }

    // =====================================================
    // deck collision
    // =====================================================

    const p0 = [-HALF,-HALF,DECK_HEIGHT];
    const p1 = [ HALF,-HALF,DECK_HEIGHT];
    const p2 = [ HALF, HALF,DECK_HEIGHT];
    const p3 = [-HALF, HALF,DECK_HEIGHT];

    const collisionTriangles = [

        tri(p0,p1,p2),
        tri(p0,p2,p3)

    ];

    // =====================================================
    // collision object
    // =====================================================

    const obj = {

        name: "MOVING CARRIER",

        type: 100,

        url:
        "https://www.geo-fs.com/models/objects/carrier/carrier.gltf",

        location: [

            POINTS[0][0],
            POINTS[0][1],
            0

        ],

        llaLocation: [

            POINTS[0][0],
            POINTS[0][1],
            0

        ],

        htr:[0,0,0],

        rotateModelOnly:false,

        scale:1,

        metricOffset:[0,0,0],

        collisionRadius:700,

        collisionTriangles,

        options:{}

    };

    geofs.objects.objectList.push(obj);

    geofs.objects.loadModels();

    console.log("[COLLISION] spawned");

    // =====================================================
    // Cesium carrier model
    // =====================================================

    const model = viewer.scene.primitives.add(

        Cesium.Model.fromGltf({

            url:
            "https://www.geo-fs.com/models/objects/carrier/carrier.gltf",

            modelMatrix:
                Cesium.Transforms.eastNorthUpToFixedFrame(

                    Cesium.Cartesian3.fromDegrees(

                        POINTS[0][1],
                        POINTS[0][0],
                        0

                    )

                ),

            scale: 1

        })

    );

    console.log("[MODEL] spawned");

    // =====================================================
    // movement state
    // =====================================================

    let current = 0;

    let t = 0;

    let last = performance.now();

    let prevP = POINTS[0];

    // =====================================================
    // update
    // =====================================================

    function update(now) {

        const A = POINTS[current];

        const B =
            POINTS[(current + 1) % POINTS.length];

        const segmentDist = dist(A, B);

        const dt = (now - last) / 1000;

        last = now;

        t += (SPEED_MS * dt) / segmentDist;

        if (t >= 1) {

            t = 0;

            current =
                (current + 1) % POINTS.length;
        }

        // =================================================
        // 現在位置
        // =================================================

        const p = lerp(A, B, t);

        // =================================================
        // 向き
        // =================================================

        const heading = Math.atan2(

            B[1] - A[1],
            B[0] - A[0]

        );

        // =================================================
        // Cesium model move
        // =================================================

        const pos = Cesium.Cartesian3.fromDegrees(

            p[1],
            p[0],
            0

        );

        const hpr =

            new Cesium.HeadingPitchRoll(

                -heading,
                0,
                0

            );

        model.modelMatrix =

            Cesium.Transforms.headingPitchRollToFixedFrame(

                pos,
                hpr

            );

        // =================================================
        // collision move
        // =================================================

        obj.location = [

            p[0],
            p[1],
            0

        ];

        obj.llaLocation = obj.location;

        // =================================================
        // aircraft push
        // =================================================

        const aircraft = geofs.aircraft.instance;

        if (aircraft?.llaLocation) {

            const d = dist(

                [

                    aircraft.llaLocation[0],
                    aircraft.llaLocation[1]

                ],

                p

            );

            const altDiff = Math.abs(

                aircraft.llaLocation[2] - DECK_HEIGHT

            );

            // carrier deck上判定
            if (

                d < 250 &&
                altDiff < 15

            ) {

                aircraft.llaLocation[0] +=

                    (p[0] - prevP[0]);

                aircraft.llaLocation[1] +=

                    (p[1] - prevP[1]);

            }

        }

        // =================================================
        // prev更新
        // =================================================

        prevP = [...p];

        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);

    console.log("[MOVING CARRIER + PUSH] started");

})();