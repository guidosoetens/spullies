///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="GameContainer.ts"/>
///<reference path="game/Defs.ts"/>
///<reference path="editor/Editor.ts"/>

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel /*= document.onmousewheel*/ = preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel /*= document.onmousewheel*/ = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}

function fitApp(app: LividLair.GameContainer) {

    const margin = 10;//30;

    var body = document.getElementById('body');
    body.style.width = window.innerWidth + "px";
    body.style.height = window.innerHeight + "px";
    document.body.scrollTop = document.documentElement.scrollTop = 0;

    var contentDiv = document.getElementById("content");
    var p_width = window.innerWidth;
    var p_height = window.innerHeight;
    var p_ratio = p_width / p_height;

    var containerWidth = LividLair.APP_WIDTH + 2 * margin;
    var containerHeight = LividLair.APP_HEIGHT + 2 * margin;
    var containerInnerRatio = containerWidth / containerHeight;

    if (containerInnerRatio < p_ratio)
        containerWidth = containerHeight * p_ratio;
    else
        containerHeight = containerWidth / p_ratio;

    var scale = p_width / containerWidth;
    let dx = (p_width - LividLair.APP_WIDTH * scale) / 2;
    let dy = (p_height - LividLair.APP_HEIGHT * scale) / 2;
    app.view.style.webkitTransform = app.view.style.transform = "matrix(" + scale + ", 0, 0, " + scale + ", " + dx + ", " + dy + ")";
    app.view.style.webkitTransformOrigin = app.view.style.transformOrigin = "0 0";
}

document.addEventListener('contextmenu', event => { if (LividLair.Editor.instance.visible) { event.preventDefault(); } });

window.onload = () => {

    // disableScroll();

    var app = new LividLair.GameContainer();
    app.view.style.position = "absolute";

    var contentDiv = document.getElementById("content");
    contentDiv.appendChild(app.view);

    let roomsLoaded = (data) => {
        LividLair.LairData.instance.parse(data);
        PIXI.loader.add('bricks', 'assets/bricks.png');
        PIXI.loader.add('cracks', 'assets/cracks.png');
        PIXI.loader.add('mechFont', 'assets/fonts/Ausweis.ttf');
        PIXI.loader.add('vertexShader', 'assets/shader.vert');
        PIXI.loader.add('wallShader', 'assets/wallShader.frag');
        PIXI.loader.load(() => { app.setup(); });
    };
    LividLair.LairLoader.loadLair(roomsLoaded);

    fitApp(app);
    document.onresize = () => {
        fitApp(app);
    }

    window.onresize = () => {
        fitApp(app);
    }

    window.onkeydown = (e) => {
        app.keyDown(e.keyCode);
    }

    window.onkeyup = (e) => {
        app.keyUp(e.keyCode);
    }

    // window.onmousedown = (e) => {
    //     fitApp(app);
    // }
}
