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

function fitApp(app:OceanEaters.Game) {

    const gameWidth = 800;
    const gameHeight = 600;
    const margin = 30;

    var body = document.getElementById('body');
    body.style.width = window.innerWidth + "px";
    body.style.height = window.innerHeight + "px";
    document.body.scrollTop = document.documentElement.scrollTop = 0;

    var contentDiv = document.getElementById("content");
    var p_width = window.innerWidth;
    var p_height =  window.innerHeight;
    var app_width = app.view.clientWidth;
    var app_height = app.view.clientHeight;
    
    var appRatio = app_width / app_height;
    var parentRatio = p_width / p_height;

    console.log();

    var scale = 1.0;

    if(parentRatio > appRatio) {
        scale = p_height / app_height;
    }
    else {
        scale = p_width / app_width;
    }
    scale *= .95;

    var transX = .5 * (p_width - scale * app_width);
    var transY = .5 * (p_height - scale * app_height);

    app.view.style.webkitTransform = app.view.style.transform = "matrix(" + scale + ", 0, 0, " + scale + ", " + transX + ", " + transY +")";
    app.view.style.webkitTransformOrigin = app.view.style.transformOrigin = "0 0";
}

function generateTouchElement_Touch(touch:Touch):OceanEaters.inputElement {
    var res:OceanEaters.inputElement = new OceanEaters.inputElement();
    res.id = touch.identifier;
    res.x = touch.clientX;
    res.y = touch.clientY;
    return res;
}

function generateTouchElement_Pointer(event:PointerEvent):OceanEaters.inputElement {
    var res:OceanEaters.inputElement = new OceanEaters.inputElement();
    res.id = event.pointerId;
    res.x = event.x;
    res.y = event.y;
    return res;
}

window.onload = () => {

    disableScroll();

    var app = new OceanEaters.Game(800, 600);
    app.view.style.position = "absolute";

    var contentDiv = document.getElementById("content");
    contentDiv.appendChild(app.view);

    PIXI.loader.add('oceanShader', 'assets/oceanShader.frag')
            .add('skyShader', 'assets/skyShader.frag')
            .add('ripples', 'assets/ripples.png');
    PIXI.loader.load((loader, resources) => {
        app.setup();
    });

    fitApp(app);
    window.onresize = () => {
        fitApp(app);
    }
}
