function clearClicked() 
{
    phaserGame.clearLevel();
    setAnimationState(false);
}

function setAnimationState(doAnim) {
    phaserGame.isAnimating = doAnim;
    var btnAnimate = document.getElementById('btnAnimate');
    
    if(doAnim) 
        btnAnimate.textContent = "STOP ANIMATION";
    else
        btnAnimate.textContent = "PLAY ANIMATION";
}

function btnAnimateClicked() {
    setAnimationState(!phaserGame.isAnimating);
}

function loadClicked() 
{
    var element = document.createElement('input');
    element.setAttribute('type', 'file');
    element.style.display = 'none';
    document.body.appendChild(element);
    
    var loadFile = (e) => {
        var reader = new FileReader();
        reader.onload = function(event) {
            var obj = JSON.parse(event.target.result);
            phaserGame.deserializeLevel(obj);
        }
        reader.readAsText(e.target.files[0]);
    };
    
    element.addEventListener('change', loadFile, false);

    element.click();

    document.body.removeChild(element);
    
    setAnimationState(false);
};


function saveClicked() 
{
    //download('level.json', phaserGame.serializeCurrentLevel());
    
    var filename = 'level.json';
    var obj = phaserGame.serializeCurrentLevel();
    var text = JSON.stringify(obj, undefined, 4);
    
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
};