//shader:
var gl;

//vec3
var uBackground;
var uForeground;

//vec2
var uResolution;
var uBaseVector;
var uNormalVector;

//float
var uMaxLineDistance;
var uMaxLineWidth;
var uWaveScale;
var uAmplitude;
var uAnimParam;
var uBaseShift;
var uThicknessA;
var uThicknessB;
var uTaperFrac;
var uRevealParameter;
var uAlpha;

//int
var uFlipWaves;
var uNumLines;
var uAdditionalCornerCurves;
var uPhaseShift;
var uMirrorX;
var uMirrorY;
var uDuplicate;

var playIntro = false;
var playOutro = false;
var revealParameter = 0;

var sampling = false;
var animTimerInput;

var colors = [];
var variables = [];
var states = [];

const fps = 30.0;

function setSamplingState(state) {
    sampling = state;
    // var elem = document.getElementById("overlay");
    // elem.style.visibility = sampling ? "visible" : "collapse";
}

function updateVariables() {

}

function addSlider(varname, defaultValue, minValue, maxValue, deltaValue) {

    var index = variables.length;
    variables[index] = defaultValue;

    var controlDiv = document.createElement("div"); 
    controlDiv.style.background = "white";
    controlDiv.style.width = "300px";
    controlDiv.style.height = "30px";
    controlDiv.style.margin = "0 auto";

    var label = document.createElement("div"); 
    label.style.width = "120px";
    label.style.height = "30px";
    label.style.display = "inline-block";
    label.style.textAlign = "left";
    label.innerHTML = varname + ":";
    label.style.fontFamily = "monospace";
    controlDiv.appendChild(label);

    var buttonLeft = document.createElement("button"); 
    buttonLeft.style.width = "30px";
    buttonLeft.style.height = "30px";
    buttonLeft.style.display = "inline-block";
    buttonLeft.innerHTML = "❮";
    controlDiv.appendChild(buttonLeft);

    var input = document.createElement("input"); 
    input.type = "text";
    input.value = defaultValue;
    input.style.width = "50px";
    input.style.height = "20px";
    input.style.display = "inline-block";
    input.style.margin = "0 5px 0 5px";
    input.style.fontFamily = "monospace";
    controlDiv.appendChild(input);

    var buttonRight = document.createElement("button"); 
    buttonRight.style.width = "30px";
    buttonRight.style.height = "30px";
    buttonRight.style.display = "inline-block";
    buttonRight.innerHTML = "❯";
    controlDiv.appendChild(buttonRight);

    var changeCurrentVariable = function(val) {
        if(isNaN(val))
            val = defaultValue;
        val = Math.max(minValue, Math.min(maxValue, val));
        input.value = val;
        variables[index] = val;
        updateVariables();
    };

    //hook click events:
    buttonLeft.onclick = function(event) { changeCurrentVariable(Number(input.value) - deltaValue); };
    buttonRight.onclick = function(event) { changeCurrentVariable(Number(input.value) + deltaValue); };
    input.onchange = function(event) { changeCurrentVariable(Number(input.value)); };

    document.getElementById("controllerPanel").appendChild(controlDiv);

    return input;
}

function addButton(varname, callback) {

    var controlDiv = document.createElement("div"); 
    controlDiv.style.background = "white";
    controlDiv.style.width = "300px";
    controlDiv.style.height = "30px";
    controlDiv.style.margin = "0 auto";

    // var label = document.createElement("div"); 
    // label.style.width = "120px";
    // label.style.height = "30px";
    // label.style.display = "inline-block";
    // label.style.textAlign = "left";
    // label.innerHTML = varname + ":";
    // label.style.fontFamily = "monospace";
    // controlDiv.appendChild(label);

    var btn = document.createElement("button"); 
    btn.style.width = "200px";
    btn.style.height = "30px";
    btn.style.display = "inline-block";
    btn.style.fontFamily = "monospace";
    btn.innerHTML = varname;
    controlDiv.appendChild(btn);

    //hook click events:
    btn.onclick = function(event) { callback(); };
    
    document.getElementById("controllerPanel").appendChild(controlDiv);
}

function addColorPicker(varname, defaultcolor) {

    var idx = colors.length;
    colors[idx] = defaultcolor;

    var controlDiv = document.createElement("div"); 
    controlDiv.style.background = "white";
    controlDiv.style.width = "300px";
    controlDiv.style.height = "30px";
    controlDiv.style.margin = "0 auto";

    var label = document.createElement("div"); 
    label.style.width = "120px";
    label.style.height = "30px";
    label.style.display = "inline-block";
    label.style.textAlign = "left";
    label.innerHTML = varname + ":";
    label.style.fontFamily = "monospace";
    controlDiv.appendChild(label);

    var picker = document.createElement("input"); 
    picker.type = "color";
    picker.style.width = "30px";
    picker.style.height = "20px";
    picker.style.display = "inline-block";
    picker.value = defaultcolor;
    controlDiv.appendChild(picker);

    document.getElementById("controllerPanel").appendChild(controlDiv);

    picker.oninput = function(event) { 
        colors[idx] = picker.value;
    };
}

function addCheckbox(varname) {

    var idx = states.length;
    states[idx] = false;

    var controlDiv = document.createElement("div"); 
    controlDiv.style.background = "white";
    controlDiv.style.width = "300px";
    controlDiv.style.height = "30px";
    controlDiv.style.margin = "0 auto";

    var label = document.createElement("div"); 
    label.style.width = "120px";
    label.style.height = "30px";
    label.style.display = "inline-block";
    label.style.textAlign = "left";
    label.innerHTML = varname + ":";
    label.style.fontFamily = "monospace";
    controlDiv.appendChild(label);

    var cbox = document.createElement("input"); 
    cbox.type = "checkbox";
    cbox.style.width = "15px";
    cbox.style.height = "15px";
    cbox.style.display = "inline-block";
    cbox.checked = false;
    controlDiv.appendChild(cbox);

    document.getElementById("controllerPanel").appendChild(controlDiv);

    cbox.onchange = function(event) { 
        states[idx] = cbox.checked;
    };
}

function addBackgroundSelector() {

    var idx = states.length;
    states[idx] = false;

    var controlDiv = document.createElement("div"); 
    controlDiv.style.background = "white";
    controlDiv.style.width = "300px";
    controlDiv.style.height = "30px";
    controlDiv.style.margin = "0 auto";

    var label = document.createElement("div"); 
    label.style.width = "100px";
    label.style.height = "30px";
    label.style.display = "inline-block";
    label.style.textAlign = "left";
    label.innerHTML = "BG File:";
    label.style.fontFamily = "monospace";
    controlDiv.appendChild(label);

    var fileBox = document.createElement("input"); 
    fileBox.type = "file";
    fileBox.accept="image/png, image/jpeg";
    fileBox.style.width = "200px";
    fileBox.style.height = "20px";
    fileBox.style.display = "inline-block";
    controlDiv.appendChild(fileBox);

    document.getElementById("controllerPanel").appendChild(controlDiv);

    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            console.log("ja");
            var img = document.getElementById('bgImage');
            img.src = URL.createObjectURL(this.files[0]);
            console.log("want", img.src);
        }
    });

    fileBox.onchange = function(event) { 
        if (this.files && this.files[0]) {
            var img = document.getElementById('bgImage');
            img.src = URL.createObjectURL(this.files[0]);
        }
    };
}

function addDivider() {
    var controlDiv = document.createElement("div"); 
    controlDiv.style.background = "lightgray";
    controlDiv.style.width = "300px";
    controlDiv.style.height = "2px";
    controlDiv.style.margin = "5px auto 5px auto";
    document.getElementById("controllerPanel").appendChild(controlDiv);
}

function createControls() {
    addSlider("Width", 800, 1, 1920, 1);
    addSlider("Height", 600, 1, 1080, 1);
    addSlider("Cover Hori.", 0.8, 0, 1, 0.025);
    addSlider("Cover Vert.", 0.8, 0, 1, 0.025);
    addSlider("#Lines", 30, 1, 100, 1);
    addSlider("Frequency", 1, 0.025, Infinity, 0.025);
    addSlider("Amplitude", 50, 0, Infinity, 1);
    addSlider("Wave Duration", 10, -Infinity, Infinity, 0.1);
    addSlider("Base Shift", -0.8, -Infinity, Infinity, 0.01);
    addSlider("Thickness A", 2.0, 0, Infinity, 1);
    addSlider("Thickness B", 0.5, 0, Infinity, 1);
    addSlider("Taper Frac", 0.3, 0, 1, 0.025);
    addSlider("Intro Duration", 3, 0.1, Infinity, 0.1);
    addSlider("Outro Duration", 3, 0.1, Infinity, 0.1);
    animTimerInput = addSlider("Anim Param", 0, 0, 1, 0.1);
    addSlider("BG Alpha", 1, 0, 1, 0.1);

    addDivider();

    //bools:
    addCheckbox("Mirror X");
    addCheckbox("Mirror Y");
    addCheckbox("Flip Waves");
    addCheckbox("Duplicate");
    addCheckbox("Phase Shift");
    addCheckbox("Paused");

    addDivider();

    addColorPicker("Background", "#fff2db");
    addColorPicker("Foreground", "#F3B440");

    addDivider();

    addButton("Play Intro", function() { playIntro = true; revealParameter = -1; });
    addButton("Play Outro", function() { playOutro = true; revealParameter = 0; });
    addButton("Download Frame", downloadFrame);
    addButton("Download Sequence", downloadSequence);

    addDivider();

    addBackgroundSelector();
}

function downloadFrame() {
    if(sampling)
        return;
    setSamplingState(true);
    var canvas = document.getElementById("canvas");
    canvas.toBlob(function(blob) { 
        saveAs(blob, "frame.png"); 
        setSamplingState(false); 
    });
}

function downloadSequence() {

    if(sampling)
        return;

    setSamplingState(true);

    var frames = [];

    var zip = new JSZip();
    var intro_frames = zip.folder("intro_frames");
    var anim_frames = zip.folder("anim_frames");
    var outro_frames = zip.folder("outro_frames");

    var t1 = variables[12], t2 = variables[7], t3 = variables[13];

    var num_intro_frames = Math.ceil(fps * t1);
    var num_anim_frames = Math.ceil(fps * t2);
    var num_outro_frames = Math.ceil(fps * t3);
    var num_total_frames = (num_intro_frames + num_anim_frames + num_outro_frames);

    var wave_anim_per_frame = 1.0 / num_anim_frames;

    // console.log(num_intro_frames, num_anim_frames, num_outro_frames, wave_anim_per_frame);

    var og_val = variables[14];


    var printFrame = function(i) {

        var frameIdx = 0;
        var map = intro_frames;
        if(i < num_intro_frames) {
            frameIdx = i;
            var t = frameIdx / num_intro_frames;
            revealParameter = -1 + t;
            variables[14] = -(num_intro_frames - frameIdx - 1) * wave_anim_per_frame;
            map = intro_frames;
        }
        else if(i < num_intro_frames + num_anim_frames) {
            frameIdx = i - num_intro_frames;
            var t = frameIdx / num_anim_frames;
            revealParameter = 0;
            variables[14] = t;
            map = anim_frames;
        }
        else if(i < num_total_frames) {
            frameIdx = i - num_intro_frames - num_anim_frames;
            var t = frameIdx / num_outro_frames;
            revealParameter = t;
            variables[14] = frameIdx * wave_anim_per_frame;
            map = outro_frames;
        }
        else {
            //done! and quit
            variables[14] = og_val;
            zip.generateAsync({type:"blob"})
            .then(function(content) {
                saveAs(content, "animation.zip");
                setSamplingState(false);
            });
            return;
        }

        // animTimer = i / n;
        redraw();
    
        var canvas = document.getElementById("canvas");
        canvas.toBlob(function(blob) {
            map.file("frame" + frameIdx + ".png", blob, {base64: true});
            printFrame(i + 1);
        });
    }

    printFrame(0);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255.0,
      g: parseInt(result[2], 16) / 255.0,
      b: parseInt(result[3], 16) / 255.0
    } : null;
}

function redraw() {

    var x = variables[2] * variables[0];
    var y = variables[3] * variables[1];

    var center = [x / 2, y / 2];
    var baseVector = [center[0], center[1]];
    var dist = Math.sqrt(center[0] * center[0] + center[1] * center[1]);
    baseVector = [center[0] / dist, center[1] / dist];
    var dist2 = Math.sqrt(x * x + y * y);
    var normal = [y / dist2, x / dist2];

    var maxLineDistance = dist;
    var addCornerSamples = Math.ceil(variables[6] / (maxLineDistance / variables[4]));

    var bgColor = hexToRgb(colors[0]);
    var fgColor = hexToRgb(colors[1]);

    gl.uniform3f(uBackground, bgColor.r, bgColor.g, bgColor.b);
    gl.uniform3f(uForeground, fgColor.r, fgColor.g, fgColor.b);

    gl.uniform2f(uResolution, variables[0], variables[1]);
    gl.uniform2f(uBaseVector, baseVector[0], baseVector[1]);
    gl.uniform2f(uNormalVector, normal[0], normal[1]);

    gl.uniform1f(uMaxLineDistance, maxLineDistance);
    gl.uniform1f(uMaxLineWidth, 2 * maxLineDistance);
    gl.uniform1f(uWaveScale, variables[5]);
    gl.uniform1f(uAmplitude, variables[6]);
    gl.uniform1f(uAnimParam, variables[14]);
    gl.uniform1f(uBaseShift, variables[8]);
    gl.uniform1f(uThicknessA, variables[9]);
    gl.uniform1f(uThicknessB, variables[10]);
    gl.uniform1f(uTaperFrac, variables[11]);
    gl.uniform1f(uRevealParameter, revealParameter);
    gl.uniform1f(uAlpha, variables[15]);

    gl.uniform1i(uFlipWaves, states[2]);
    gl.uniform1i(uNumLines, variables[4]);
    gl.uniform1i(uAdditionalCornerCurves, addCornerSamples);
    gl.uniform1i(uPhaseShift, states[4]);
    gl.uniform1i(uMirrorX, states[0]);
    gl.uniform1i(uMirrorY, states[1]);
    gl.uniform1i(uDuplicate, states[3]);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function setupShader(fragSrc, vertSrc) {
    // Get A WebGL context
    var canvas = document.getElementById("canvas");
    gl = canvas.getContext("experimental-webgl");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendFunc(gl.SRC_COLOR, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendEquation(gl.GL_FUNC_ADD);

    // GL_DST_COLOR, GL_ONE_MINUS_SRC_ALPHA

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertSrc);
    gl.compileShader(vertexShader);

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragSrc);
    gl.compileShader(fragmentShader);

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if ( !gl.getProgramParameter( program, gl.LINK_STATUS) ) {
        var info = gl.getProgramInfoLog(program);
        console.log("oh noe!" , info);
        throw 'Could not compile WebGL program. \n\n' + info;
    }

    // // // setup a GLSL program
    gl.useProgram(program);

    // // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");

    // Create a buffer and put a single clipspace rectangle in
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            -1.0, -1.0,
            1.0, -1.0,
            -1.0,  1.0,
            1.0, 1.0]),
        gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    uBackground = gl.getUniformLocation(program, 'uBackground');
    uForeground = gl.getUniformLocation(program, 'uForeground');

    uResolution = gl.getUniformLocation(program, 'uResolution');
    uBaseVector = gl.getUniformLocation(program, 'uBaseVector');
    uNormalVector = gl.getUniformLocation(program, 'uNormalVector');

    uMaxLineDistance = gl.getUniformLocation(program, 'uMaxLineDistance');
    uMaxLineWidth = gl.getUniformLocation(program, 'uMaxLineWidth');
    uWaveScale = gl.getUniformLocation(program, 'uWaveScale');
    uAmplitude = gl.getUniformLocation(program, 'uAmplitude');
    uAnimParam = gl.getUniformLocation(program, 'uAnimParam');
    uBaseShift = gl.getUniformLocation(program, 'uBaseShift');
    uThicknessA = gl.getUniformLocation(program, 'uThicknessA');
    uThicknessB = gl.getUniformLocation(program, 'uThicknessB');
    uTaperFrac = gl.getUniformLocation(program, 'uTaperFrac');
    uRevealParameter = gl.getUniformLocation(program, 'uRevealParameter');
    uAlpha = gl.getUniformLocation(program, 'uAlpha');

    uFlipWaves = gl.getUniformLocation(program, 'uFlipWaves');
    uNumLines = gl.getUniformLocation(program, 'uNumLines');
    uAdditionalCornerCurves = gl.getUniformLocation(program, 'uAdditionalCornerCurves');
    uPhaseShift = gl.getUniformLocation(program, 'uPhaseShift');
    uMirrorX = gl.getUniformLocation(program, 'uMirrorX');
    uMirrorY = gl.getUniformLocation(program, 'uMirrorY');
    uDuplicate = gl.getUniformLocation(program, 'uDuplicate');
}

function update() {

    if(sampling)
        return;

    var dt = 1.0 / fps;
    if(variables[7] != 0.0 && !states[5]) {
        variables[14] = (variables[14] + dt / variables[7]) % 1.0;
        if(variables[14] < 0)
            variables[14] += 1.0;

        animTimerInput.value = variables[14];
    }

    var scale = Math.min(1.0, Math.min(800.0 / variables[0]), Math.max(600.0 / variables[1]));

    var canvas = document.getElementById("canvas");
    canvas.width = variables[0];
    canvas.height = variables[1];
    canvas.style.width = (scale * variables[0]) + "px";
    canvas.style.height = (scale * variables[1]) + "px";
    gl.viewport(0, 0, variables[0], variables[1]);

    var bgImage = document.getElementById("bgImage");
    bgImage.style.width = (scale * variables[0]) + "px";
    bgImage.style.height = (scale * variables[1]) + "px";

    if (playIntro)
    {
        revealParameter += dt / variables[12];
        if (revealParameter > 0)
        {
            revealParameter = 0;
            playIntro = false;
        }
    }
    else if (playOutro)
    {
        revealParameter += dt / variables[13];
        if (revealParameter > 1)
        {
            revealParameter = -1;
            playOutro = false;
            playIntro = true;
        }
    }
    else
        revealParameter = 0;

    redraw();
}

window.onload = function(event) {

    var fragSrc, vertSrc;

    let setupControls = function() {
        setupShader(fragSrc, vertSrc);
        createControls();
        setInterval(update, 1000.0 / 60.0);
    };

    let loadFragmentShader = function() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                fragSrc = this.responseText;
                setupControls();
            }
        };
        xhttp.open("GET", "waveShader.frag", true);
        xhttp.send();
    };

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            vertSrc = this.responseText;
            loadFragmentShader();
        }
    };
    xhttp.open("GET", "waveShader.vert", true);
    xhttp.send();
}
