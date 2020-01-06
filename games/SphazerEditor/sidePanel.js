var polygon = null;
var node = null;

function focusOnPolygon(p) {
    polygon = p;
    
    var panel = document.getElementById('rightPanel');
    
    if(p == null) {
        panel.style.opacity = 0.2;
        updateFormDependencies();
    }
    else {
        panel.style.opacity = 1.0;
        setFormProperties();
    }
    
    focusOnNode(null);
}

function focusOnNode(n) {
    
    node = n;
    
    var panel = document.getElementById('nodePanel');
    
    if(n == null) {
        panel.style.opacity = 0.2;
    }
    else {
        panel.style.opacity = 1.0;
    }
    
    setFormProperties();
}

function useTangentsChanged() {
    
    var useTangs = document.getElementById('cbUseTangents').checked;
    if(useTangs) {
        //check both 'use CW' and 'use CCW' checkboxes
        document.getElementById('cbTangent1').checked = true;
        document.getElementById('cbTangent2').checked = true;
    }
    else {
        document.getElementById('cbTangent1').checked = false;
        document.getElementById('cbTangent2').checked = false;
    }

    updateFormDependencies();

    setPolygonProperties();
}

function deletePolygonClicked() {
    if(polygon != null)
        polygon.triggerDelete();
    focusOnPolygon(null);
}

function copyPolygonClicked() {
    if(polygon != null)
        polygon.triggerCopy();
}

function changeValue(lblId, dValue, minVal, maxVal) {
    var lblElement = document.getElementById(lblId); 
    var value = Number(lblElement.textContent);
    lblElement.textContent = Math.min(maxVal, Math.max(minVal, value + dValue));
    
    formChanged();
}


function formChanged() {
    setPolygonProperties();
    updateFormDependencies();
}

function setFormProperties() {
    
    if(polygon == null)
        return;

    //document.getElementById('cbIsObstacle').checked = polygon.isObstacle;
    document.getElementById("optsType").selectedIndex = polygon.polygonType;
    
    document.getElementById('cbTransX').checked = polygon.transformation.doTransX;
    document.getElementById('optsTransX').value = polygon.transformation.transXMode;
    document.getElementById('lblDurationTransX').textContent = polygon.transformation.transXDuration;
    document.getElementById('lblOffsetTransX').textContent = polygon.transformation.transXOffset;
    
    document.getElementById('cbTransY').checked = polygon.transformation.doTransY;
    document.getElementById('optsTransY').value = polygon.transformation.transYMode;
    document.getElementById('lblDurationTransY').textContent = polygon.transformation.transYDuration;
    document.getElementById('lblOffsetTransY').textContent = polygon.transformation.transYOffset;
    
    document.getElementById('cbRotate').checked = polygon.transformation.doRotate;
    document.getElementById('optsRotDir').value = polygon.transformation.rotDirection;
    document.getElementById('optsRot').value = polygon.transformation.rotMode;
    document.getElementById('lblDurationRot').textContent = polygon.transformation.rotDuration;
    document.getElementById('lblOffsetRot').textContent = polygon.transformation.rotOffset;
    
    if(node != null) {
        document.getElementById('cbUseTangents').checked = node.hasCwTangent || node.hasCcwTangent;;
        document.getElementById('cbLockTangents').checked = node.lockTangents;
        document.getElementById('cbTangent1').checked = node.hasCwTangent;
        document.getElementById('cbTangent2').checked = node.hasCcwTangent;
    }
    
    updateFormDependencies();
}

function setPolygonProperties() {
    
    if(polygon == null)
        return;
    
    //polygon.isObstacle = document.getElementById('cbIsObstacle').checked;
    polygon.polygonType = document.getElementById("optsType").selectedIndex;
    
    polygon.transformation.doTransX = document.getElementById('cbTransX').checked;
    polygon.transformation.transXMode = document.getElementById('optsTransX').value;
    polygon.transformation.transXDuration = Number(document.getElementById('lblDurationTransX').textContent);
    polygon.transformation.transXOffset = Number(document.getElementById('lblOffsetTransX').textContent);
    
    polygon.transformation.doTransY = document.getElementById('cbTransY').checked;
    polygon.transformation.transYMode = document.getElementById('optsTransY').value;
    polygon.transformation.transYDuration = Number(document.getElementById('lblDurationTransY').textContent);
    polygon.transformation.transYOffset = Number(document.getElementById('lblOffsetTransY').textContent);
    
    polygon.transformation.doRotate = document.getElementById('cbRotate').checked;
    polygon.transformation.rotDirection = document.getElementById('optsRotDir').value;
    polygon.transformation.rotMode = document.getElementById('optsRot').value;
    polygon.transformation.rotDuration = Number(document.getElementById('lblDurationRot').textContent);
    polygon.transformation.rotOffset = Number(document.getElementById('lblOffsetRot').textContent);
    
    if(node != null) {
        node.lockTangents = document.getElementById('cbLockTangents').checked;
        node.hasCwTangent = document.getElementById('cbTangent1').checked;
        node.hasCcwTangent = document.getElementById('cbTangent2').checked;
    }
}

function updateFormDependencies() {
    
    if(document.getElementById('optsRotDir').value == 'osc') {
        document.getElementById('optsRot').hidden = false;
        document.getElementById('tblRotOffset').hidden = false;
    }
    else {
        document.getElementById('optsRot').hidden = true;
        document.getElementById('tblRotOffset').hidden = true;
    }

    var disableTangCheckboxes = !document.getElementById('cbUseTangents').checked;
    document.getElementById('cbLockTangents').disabled = disableTangCheckboxes;
    document.getElementById('cbTangent1').disabled = disableTangCheckboxes;
    document.getElementById('cbTangent2').disabled = disableTangCheckboxes;
    
}