///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="GameContainer.ts"/>

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

const APP_WIDTH = 450;//800;
const APP_HEIGHT = 800;//600;

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
  window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel /*= document.onmousewheel*/ = null; 
    window.onwheel = null; 
    window.ontouchmove = null;  
    document.onkeydown = null;  
}

function fitApp(app:CircuitFreaks.GameContainer) {

    const margin = 10;//30;

    var body = document.getElementById('body');
    body.style.width = window.innerWidth + "px";
    body.style.height = window.innerHeight + "px";
    document.body.scrollTop = document.documentElement.scrollTop = 0;

    var contentDiv = document.getElementById("content");
    var p_width = window.innerWidth;
    var p_height =  window.innerHeight;
    var p_ratio = p_width / p_height;

    var containerWidth = APP_WIDTH + 2 * margin;
    var containerHeight = APP_HEIGHT + 2 * margin;
    var containerInnerRatio = containerWidth / containerHeight;

    if(containerInnerRatio < p_ratio)
        containerWidth = containerHeight * p_ratio;
    else
        containerHeight = containerWidth / p_ratio;

    var scale = p_width / containerWidth;
    app.view.style.webkitTransform = app.view.style.transform = "matrix(" + scale + ", 0, 0, " + scale + ", 0, 0)";
    app.view.style.webkitTransformOrigin = app.view.style.transformOrigin = "0 0";
    app.resize(containerWidth, containerHeight, APP_WIDTH, APP_HEIGHT);
}

window.onload = () => {

    disableScroll();

    var app = new CircuitFreaks.GameContainer(APP_WIDTH, APP_HEIGHT);
    app.view.style.position = "absolute";

    var contentDiv = document.getElementById("content");
    contentDiv.appendChild(app.view);

    // PIXI.loader.add('oceanShader', 'assets/oceanShader.frag')
    //         .add('skyShader', 'assets/skyShader.frag')
    //         .add('ripples', 'assets/ripples.png');
    PIXI.loader.load((loader, resources) => {
        app.setup();
    });

    fitApp(app);
    window.onresize = () => {
        fitApp(app);
    }

    window.onkeydown = (e) => {
        app.keyDown(e.keyCode);
    }

    // window.onmousedown = (e) => {
    //     fitApp(app);
    // }
}
