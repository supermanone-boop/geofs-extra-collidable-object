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

                // 🔥これが重要（距離で自然縮小）
                scaleByDistance: new Cesium.NearFarScalar(
                    50, 1.0,      // 近距離
                    2000, 0.1     // 遠距離で小さく
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