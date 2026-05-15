(() => {

    const viewer = geofs.api.viewer;

    // =========================
    // 共通：lerp
    // =========================
    function lerp(a, b, t) {
        return [
            a[0] + (b[0] - a[0]) * t,
            a[1] + (b[1] - a[1]) * t,
            a[2] + (b[2] - a[2]) * t
        ];
    }

    // =========================
    // 距離（m）
    // =========================
    function dist(a, b) {

        const R = 6371000;

        const dLat = (b[0] - a[0]) * Math.PI / 180;
        const dLon = (b[1] - a[1]) * Math.PI / 180;

        const lat1 = a[0] * Math.PI / 180;

        const x = dLon * Math.cos(lat1);
        const y = dLat;

        return Math.sqrt(x*x + y*y) * R;
    }

    // =========================
    // 共通関数（2m間隔）
    // =========================
    function makeLine(A, B, colorHex) {

        const d = dist(A, B);

        const step = 2.0; // ←🔥完全に2m固定
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

                    pixelSize: 0, // UI完全排除

                    color: Cesium.Color.fromCssColorString(colorHex).withAlpha(1.0),

                    outlineColor: Cesium.Color.WHITE.withAlpha(0.2),
                    outlineWidth: 0
                },

                distanceDisplayCondition:
                    new Cesium.DistanceDisplayCondition(0.0, 3000.0)
            });
        }
    }

    // =========================
    // ① GREEN LINE → 黄色に変更
    // =========================
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

    // =========================
    // ② YELLOW LINE（元）→ 同じ黄色
    // =========================
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