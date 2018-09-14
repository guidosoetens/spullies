///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="Game.ts"/>

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

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
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    window.ontouchmove = null;  
    document.onkeydown = null;  
}

function fitApp(appCanvas:HTMLCanvasElement) {
    var contentDiv = document.getElementById("content");
    var p_width = contentDiv.clientWidth;
    var p_height = contentDiv.clientHeight;
    var c_width = appCanvas.clientWidth;
    var c_height = appCanvas.clientHeight;
    // appCanvas.style.transform = "scale(" + (.5 * p_width / c_width) + ", " + (.5 * p_height / c_height) + ")"
    appCanvas.style.transform = "matrix(" + (.8 * p_width / c_width) + ", 0, 0, " + (.8 * p_height / c_height) + ", 100, 100)";
    appCanvas.style.transformOrigin = "0 0";
}

window.onload = () => {

    disableScroll();

    var app = new OceanEaters.Game(800, 600);

    var contentDiv = document.getElementById("content");
    contentDiv.appendChild(app.view);

    app.view.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)";

    PIXI.loader.add('oceanShader', 'assets/oceanShader.frag')
            .add('skyShader', 'assets/skyShader.frag')
            .add('ripples', 'assets/ripples.png');
    PIXI.loader.load((loader, resources) => {
        app.setup();
    });

    fitApp(app.view);
    window.onresize = () => {
        fitApp(app.view);
    }
}
