///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="Game.ts"/>
///<reference path="InputOverlay.ts"/>

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

function fitApp(appCanvas:HTMLCanvasElement, touchCanvas:HTMLCanvasElement) {

    var body = document.getElementById('body');
    body.style.width = window.innerWidth + "px";
    body.style.height = window.innerHeight + "px";
    document.body.scrollTop = document.documentElement.scrollTop = 0;

    var contentDiv = document.getElementById("content");
    var p_width = window.innerWidth;//contentDiv.clientWidth;
    var p_height =  window.innerHeight;//contentDiv.clientHeight;
    var app_width = appCanvas.clientWidth;
    var app_height = appCanvas.clientHeight;
    
    var appRatio = app_width / app_height;
    var parentRatio = p_width / p_height;

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

    // appCanvas.style.transform = "scale(" + (.5 * p_width / c_width) + ", " + (.5 * p_height / c_height) + ")"
    appCanvas.style.webkitTransform = appCanvas.style.transform = "matrix(" + scale + ", 0, 0, " + scale + ", " + transX + ", " + transY +")";
    appCanvas.style.webkitTransformOrigin = appCanvas.style.transformOrigin = "0 0";

    var inputScaleX = p_width / touchCanvas.clientWidth;
    var inputScaleY = p_height / touchCanvas.clientHeight;
    touchCanvas.style.webkitTransform = touchCanvas.style.transform = "matrix(" + inputScaleX + ", 0, 0, " + inputScaleY + ", 0, 0)";
    touchCanvas.style.webkitTransformOrigin = touchCanvas.style.transformOrigin = "0 0";
}

function generateTouchElement_Touch(touch:Touch):OceanEaters.inputElement {
    var res:OceanEaters.inputElement = new OceanEaters.inputElement();
    res.id = touch.identifier;//.pointerId;
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
    var inputOverlay = new OceanEaters.InputOverlay(100, 100, app);
    inputOverlay.view.style.position = "absolute";
    inputOverlay.view.style.opacity = "0";


    var contentDiv = document.getElementById("content");
    contentDiv.appendChild(app.view);
    contentDiv.appendChild(inputOverlay.view);


    // app.view.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)";

    PIXI.loader.add('oceanShader', 'assets/oceanShader.frag')
            .add('skyShader', 'assets/skyShader.frag')
            .add('ripples', 'assets/ripples.png');
    PIXI.loader.load((loader, resources) => {
        app.setup();
        // inputOverlay.setup();
    });

    fitApp(app.view, inputOverlay.view);
    window.onresize = () => {
        fitApp(app.view, inputOverlay.view);
    }

    /*

    window.onpointerdown = (event) => { app.inputDown(generateTouchElement_Pointer(event)) };
    window.onpointermove = (event) => { app.inputMove(generateTouchElement_Pointer(event)) };
    window.onpointerup = (event) => { app.inputUp(generateTouchElement_Pointer(event)) };
    window.onpointercancel = (event) => { app.inputUp(generateTouchElement_Pointer(event)) };

    window.ontouchstart = (event) => { 
        for(var i:number=0; i<event.changedTouches.length; ++i) {
            app.inputDown(generateTouchElement_Touch(event.changedTouches[i]));
        }
    };
    window.ontouchmove = (event) => { 
        for(var i:number=0; i<event.changedTouches.length; ++i) {
            app.inputMove(generateTouchElement_Touch(event.changedTouches[i]));
        }
    };
    window.ontouchend = (event) => { 
        for(var i:number=0; i<event.changedTouches.length; ++i) {
            app.inputUp(generateTouchElement_Touch(event.changedTouches[i]));
        }
    };
    window.ontouchcancel = (event) => { 
        for(var i:number=0; i<event.changedTouches.length; ++i) {
            app.inputUp(generateTouchElement_Touch(event.changedTouches[i]));
        }
    };

    */


    /*

    window.onmousedown = (event) => { app.inputDown(generateTouchElementFromMouse(event)) };

    if(!!window.PointerEvent) {
        if (this.supportsPointerEvents)
        {
            window.document.addEventListener('pointermove', this.onPointerMove, true);
            this.interactionDOMElement.addEventListener('pointerdown', this.onPointerDown, true);
            // pointerout is fired in addition to pointerup (for touch events) and pointercancel
            // we already handle those, so for the purposes of what we do in onPointerOut, we only
            // care about the pointerleave event
            this.interactionDOMElement.addEventListener('pointerleave', this.onPointerOut, true);
            this.interactionDOMElement.addEventListener('pointerover', this.onPointerOver, true);
            window.addEventListener('pointercancel', this.onPointerCancel, true);
            window.addEventListener('pointerup', this.onPointerUp, true);
        }
        else
        {
            window.document.addEventListener('mousemove', this.onPointerMove, true);
            this.interactionDOMElement.addEventListener('mousedown', this.onPointerDown, true);
            this.interactionDOMElement.addEventListener('mouseout', this.onPointerOut, true);
            this.interactionDOMElement.addEventListener('mouseover', this.onPointerOver, true);
            window.addEventListener('mouseup', this.onPointerUp, true);
        }
    }

    if(this.supportsTouchEvents) {

    }

    // if (this.supportsTouchEvents)
    // {
    //     this.interactionDOMElement.addEventListener('touchstart', this.onPointerDown, true);
    //     this.interactionDOMElement.addEventListener('touchcancel', this.onPointerCancel, true);
    //     this.interactionDOMElement.addEventListener('touchend', this.onPointerUp, true);
    //     this.interactionDOMElement.addEventListener('touchmove', this.onPointerMove, true);
    // }



    window.onpointerdown = (event) => { app.inputDown(generateTouchElement(event)) };
    window.onpointermove = (event) => { app.inputMove(generateTouchElement(event)) };
    window.onpointerup = (event) => { app.inputUp(generateTouchElement(event)) };
    window.onpointercancel = (event) => { app.inputUp(generateTouchElement(event)) };
    // window.onpointerout = (event) => { app.inputUp(generateTouchElement(event)) };
    // window.onpointerleave = (event) => { app.inputUp(generateTouchElement(event)) };
    */

    /*
                this.stage.on("pointerdown", this.pointerDown, this);
            this.stage.on("pointermove", this.pointerMove, this);
            this.stage.on("pointerupoutside", this.pointerUp, this);
            this.stage.on("pointercancel", this.pointerUp, this);
            this.stage.on("pointerup", this.pointerUp, this);
            this.stage.on("pointerout", this.pointerUp, this);
    */
}
