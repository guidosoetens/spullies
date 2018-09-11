///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="Game.ts"/>


window.onload = () => {

    var app = new OceanEaters.Game(800, 600);

    var contentDiv = document.getElementById("content");
    contentDiv.appendChild(app.view);

    PIXI.loader.add('oceanShader', 'assets/oceanShader.frag')
            .add('ripples', 'assets/ripples.png');
    PIXI.loader.load((loader, resources) => {
        app.setup();
    });
}
