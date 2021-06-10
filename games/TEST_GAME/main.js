define("main", ["require", "exports", "pixi.js"], function (require, exports, PIXI) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    window.onload = function () {
        var app = new PIXI.Application();
        app.view.style.position = "absolute";
        // var contentDiv = document.getElementById("content");
        // contentDiv.appendChild(app.view);
        var geom = new PIXI.Geometry();
        var mesh = new PIXI.Mesh(geom, null);
        app.stage.addChild(mesh);
    };
});
