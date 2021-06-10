import * as PIXI from 'pixi.js';

window.onload = () => {
    var app = new PIXI.Application();
    app.view.style.position = "absolute";
    // var contentDiv = document.getElementById("content");
    // contentDiv.appendChild(app.view);

    let geom = new PIXI.Geometry();
    let mesh = new PIXI.Mesh(geom, null);
    app.stage.addChild(mesh);
}
