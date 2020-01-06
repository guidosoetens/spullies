var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TOOL_OPT_WIDTH = 50.0;
var DRAGGABLE_CMP_RADIUS = 25.0;
var POLYGON_NODE_RADIUS = 10.0;
var LEVEL_VERTICAL_MARGIN = 100.0;
var LEVEL_HORIZONTAL_MARGIN = LEVEL_VERTICAL_MARGIN;
var LEVEL_WIDTH = 800.0;
var LEVEL_HEIGHT = 600.0;
var TOOLBAR_HEIGHT = 80.0;
var STAGE_WIDTH = LEVEL_WIDTH + 2 * LEVEL_HORIZONTAL_MARGIN;
var STAGE_HEIGHT = LEVEL_HEIGHT + 2 * LEVEL_VERTICAL_MARGIN + TOOLBAR_HEIGHT;
var TUNNEL_COLORS = [0x0, 0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
var SPECIAL_POLYGONS_IDX = 0x10000;
var SPECIAL_POLYGON_CIRCLE = SPECIAL_POLYGONS_IDX;
var SPECIAL_POLYGON_STAR = SPECIAL_POLYGONS_IDX + 1;
var SPECIAL_POLYGON_HEART = SPECIAL_POLYGONS_IDX + 2;
var debugTekstje = "";
///<reference path="../../libs/phaser/phaser.d.ts"/>
///<reference path="Definitions.ts"/>
var EditorModule;
(function (EditorModule) {
    var ToolbarOption = /** @class */ (function (_super) {
        __extends(ToolbarOption, _super);
        function ToolbarOption(game, goalLoc, dropCallback, str) {
            var _this = _super.call(this, game) || this;
            _this.goalLoc = goalLoc;
            _this.dropCallback = dropCallback;
            _this.position.x = goalLoc.x;
            _this.position.y = goalLoc.y;
            var gr = _this.game.make.graphics(0, 0);
            _this.addChild(gr);
            gr.lineStyle(0);
            gr.beginFill(0x555555, .3);
            gr.drawRoundedRect(-.5 * TOOL_OPT_WIDTH + 5, -.5 * TOOL_OPT_WIDTH + 5, TOOL_OPT_WIDTH, TOOL_OPT_WIDTH, 10);
            gr.endFill();
            gr.lineStyle(2, 0x333333);
            gr.beginFill(0x555555);
            gr.drawRoundedRect(-.5 * TOOL_OPT_WIDTH, -.5 * TOOL_OPT_WIDTH, TOOL_OPT_WIDTH, TOOL_OPT_WIDTH, 10);
            gr.endFill();
            var style = { font: "24px Arial", fill: "#ffffff", align: "center" };
            var tbText = _this.game.make.text(0, 0, str, style);
            tbText.position.x -= .5 * tbText.width;
            tbText.position.y -= .45 * tbText.height;
            _this.addChild(tbText);
            //this.game.input.onDown.add(this.onDown, this);
            _this.game.input.addMoveCallback(_this.onMove, _this);
            _this.game.input.onUp.add(_this.onUp, _this);
            _this.hasInput = false;
            return _this;
        }
        ToolbarOption.prototype.isMouseOver = function () {
            return Math.abs(this.position.x - this.game.input.mousePointer.x) < .5 * TOOL_OPT_WIDTH &&
                Math.abs(this.position.y - this.game.input.mousePointer.y) < .5 * TOOL_OPT_WIDTH;
        };
        ToolbarOption.prototype.tryCaptureMouse = function () {
            if (this.isMouseOver()) {
                this.hasInput = true;
                return true;
            }
            return false;
        };
        /*
        onDown() {
            if(this.isMouseOver())
                this.hasInput = true;
        }*/
        ToolbarOption.prototype.onMove = function () {
            if (this.hasInput) {
                var mousePos = this.game.input.mousePointer.position;
                this.position.x = mousePos.x;
                this.position.y = mousePos.y;
            }
        };
        ToolbarOption.prototype.onUp = function () {
            if (this.hasInput) {
                this.hasInput = false;
                if (this.position.x > 0 && this.position.y > 0 && this.position.x < LEVEL_WIDTH && this.position.y < LEVEL_HEIGHT)
                    this.dropCallback(this);
                this.position.x = this.goalLoc.x;
                this.position.y = this.goalLoc.y;
            }
        };
        return ToolbarOption;
    }(Phaser.Group));
    EditorModule.ToolbarOption = ToolbarOption;
})(EditorModule || (EditorModule = {}));
///<reference path="../../libs/phaser/phaser.d.ts"/>
///<reference path="Definitions.ts"/>
var EditorModule;
(function (EditorModule) {
    var DraggableComponent = /** @class */ (function (_super) {
        __extends(DraggableComponent, _super);
        function DraggableComponent(game, parent, color, str) {
            var _this = _super.call(this, game, parent) || this;
            _this.graphics = _this.game.make.graphics(0, 0);
            _this.addChild(_this.graphics);
            _this.graphics.lineStyle(2, 0xffffff);
            _this.graphics.beginFill(color);
            _this.graphics.drawCircle(0, 0, 2 * DRAGGABLE_CMP_RADIUS);
            _this.graphics.endFill();
            var style = { font: "24px Arial", fill: "#ffffff", align: "center" };
            _this.tbText = _this.game.make.text(0, 0, str, style);
            _this.tbText.position.x -= .5 * _this.tbText.width;
            _this.tbText.position.y -= .45 * _this.tbText.height;
            _this.addChild(_this.tbText);
            _this.game.input.addMoveCallback(_this.onMove, _this);
            _this.game.input.onUp.add(_this.onUp, _this);
            _this.hasInput = false;
            return _this;
        }
        DraggableComponent.prototype.setText = function (str) {
            this.tbText.setText(str);
            this.tbText.position.x = -.5 * this.tbText.width;
            /*
            this.graphics.clear();
            this.graphics.lineStyle(2, 0xffffff);
            this.graphics.beginFill(color);
            this.graphics.drawCircle(0,0, 2 * DRAGGABLE_CMP_RADIUS);
            this.graphics.endFill();
            */
        };
        DraggableComponent.prototype.isMouseOver = function () {
            var mousePos = EditorModule.Level.getMousePosition();
            return this.position.distance(mousePos) < DRAGGABLE_CMP_RADIUS;
        };
        DraggableComponent.prototype.tryCaptureMouse = function () {
            if (this.isMouseOver()) {
                this.alpha = 0.5;
                this.hasInput = true;
                return true;
            }
            return false;
        };
        DraggableComponent.prototype.onMove = function () {
            if (this.hasInput) {
                var mousePos = EditorModule.Level.getMousePosition();
                this.position.x = Math.max(DRAGGABLE_CMP_RADIUS, Math.min(LEVEL_WIDTH - DRAGGABLE_CMP_RADIUS, mousePos.x));
                this.position.y = Math.max(DRAGGABLE_CMP_RADIUS, Math.min(LEVEL_HEIGHT - DRAGGABLE_CMP_RADIUS, mousePos.y));
            }
        };
        DraggableComponent.prototype.onUp = function () {
            if (this.hasInput) {
                this.alpha = 1.0;
                this.hasInput = false;
            }
        };
        return DraggableComponent;
    }(Phaser.Group));
    EditorModule.DraggableComponent = DraggableComponent;
})(EditorModule || (EditorModule = {}));
///<reference path="../../libs/phaser/phaser.d.ts"/>
///<reference path="Definitions.ts"/>
var EditorModule;
(function (EditorModule) {
    var PolygonVertex = /** @class */ (function (_super) {
        __extends(PolygonVertex, _super);
        function PolygonVertex(game, shapeChangedCallback) {
            var _this = _super.call(this, game) || this;
            _this.shapeChangedCallback = shapeChangedCallback;
            _this.graphics = _this.game.make.graphics();
            _this.addChild(_this.graphics);
            _this._lockTangents = true;
            _this._hasCwTangent = false;
            _this.cwAngle = 0;
            _this.cwOffset = 0;
            _this._hasCcwTangent = false;
            _this.ccwAngle = 0;
            _this.ccwOffset = 0;
            _this.hasInputFocus = false;
            _this.repaint();
            return _this;
        }
        Object.defineProperty(PolygonVertex.prototype, "lockTangents", {
            get: function () {
                return this._lockTangents;
            },
            set: function (val) {
                this._lockTangents = val;
                if (val) {
                    this.ccwAngle = this.cwAngle + Math.PI;
                }
                this.onPropertiesChanged();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PolygonVertex.prototype, "hasCwTangent", {
            get: function () {
                return this._hasCwTangent;
            },
            set: function (val) {
                this._hasCwTangent = val;
                this.onPropertiesChanged();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PolygonVertex.prototype, "hasCcwTangent", {
            get: function () {
                return this._hasCcwTangent;
            },
            set: function (val) {
                this._hasCcwTangent = val;
                this.onPropertiesChanged();
            },
            enumerable: true,
            configurable: true
        });
        PolygonVertex.prototype.serialize = function () {
            return {
                "x": this.position.x,
                "y": this.position.y,
                "lockTangents": this._lockTangents,
                "hasCwTangent": this._hasCwTangent,
                "cwAngle": this.cwAngle,
                "cwOffset": this.cwOffset,
                "hasCcwTangent": this._hasCcwTangent,
                "ccwAngle": this.ccwAngle,
                "ccwOffset": this.ccwOffset
            };
        };
        PolygonVertex.serializePolygonVertex = function (x, y) {
            return PolygonVertex.serializePolygonVertexWithControls(x, y, 0, 0, 0, 0);
        };
        PolygonVertex.serializePolygonVertexWithControls = function (x, y, cwAngle, cwOffset, ccwAngle, ccwOffset) {
            var lockTangs = false;
            if (cwOffset < .01 || ccwOffset < .01) //one of the control points are disabled?
                lockTangs = true;
            else {
                var deltaAngle = ccwAngle - cwAngle;
                var toCW = new Phaser.Point(Math.cos(cwAngle), Math.sin(cwAngle));
                var toCcW = new Phaser.Point(Math.cos(ccwAngle), Math.sin(ccwAngle));
                if (toCcW.dot(toCW) < -.99)
                    lockTangs = true;
            }
            return {
                "x": x,
                "y": y,
                "lockTangents": lockTangs,
                "hasCwTangent": cwOffset > 0.1,
                "cwAngle": cwAngle,
                "cwOffset": cwOffset,
                "hasCcwTangent": ccwOffset > 0.1,
                "ccwAngle": ccwAngle,
                "ccwOffset": ccwOffset > 0.1 ? ccwOffset : Math.PI
            };
        };
        PolygonVertex.prototype.deserialize = function (data) {
            this.position.x = data.x;
            this.position.y = data.y;
            this._lockTangents = data.lockTangents;
            this._hasCwTangent = data.hasCwTangent;
            this.cwAngle = data.cwAngle;
            this.cwOffset = data.cwOffset;
            this._hasCcwTangent = data.hasCcwTangent;
            this.ccwAngle = data.ccwAngle;
            this.ccwOffset = data.ccwOffset;
            this.repaint();
            //return new Phaser.Point(data.x, data.y);
        };
        PolygonVertex.prototype.onPropertiesChanged = function () {
            this.repaint();
            this.shapeChangedCallback();
        };
        PolygonVertex.prototype.drawTangent = function (angle, offset, color) {
            var sumOffset = 2 * POLYGON_NODE_RADIUS + offset;
            var x = sumOffset * Math.cos(angle);
            var y = sumOffset * Math.sin(angle);
            this.graphics.lineStyle(2, color);
            this.graphics.moveTo(0, 0);
            this.graphics.lineTo(x, y);
            this.graphics.beginFill(color, 1);
            this.graphics.drawCircle(x, y, 2 * POLYGON_NODE_RADIUS);
            this.graphics.endFill();
        };
        PolygonVertex.prototype.repaint = function () {
            this.graphics.clear();
            var clr = this.hasInputFocus ? 0xffffff : 0xaaaaaa;
            if (this.hasInputFocus) {
                if (this._hasCwTangent)
                    this.drawTangent(this.cwAngle, this.cwOffset, 0x00ff00);
                if (this._hasCcwTangent)
                    this.drawTangent(this.ccwAngle, this.ccwOffset, 0x0000ff);
            }
            this.graphics.lineStyle(0);
            this.graphics.beginFill(clr, 1);
            this.graphics.drawCircle(0, 0, 2 * POLYGON_NODE_RADIUS);
            this.graphics.endFill();
        };
        PolygonVertex.prototype.getControlPoint1 = function () {
            return new Phaser.Point();
        };
        PolygonVertex.prototype.setHandlesFocus = function (focus) {
            this.hasInputFocus = focus;
            this.repaint();
        };
        PolygonVertex.prototype.captureMouse = function () {
            this.handleIdx = 0;
        };
        PolygonVertex.prototype.tryCaptureMouse = function (pt, testForSubhandles) {
            if (this.position.distance(pt) < POLYGON_NODE_RADIUS) {
                this.handleIdx = 0;
                return true;
            }
            if (testForSubhandles) {
                var localPt = new Phaser.Point(pt.x - this.position.x, pt.y - this.position.y);
                if (this.hasCwTangent) {
                    var offset = this.cwOffset + 2 * POLYGON_NODE_RADIUS;
                    var angle = this.cwAngle;
                    var pt = new Phaser.Point(offset * Math.cos(angle), offset * Math.sin(angle));
                    if (pt.distance(localPt) < POLYGON_NODE_RADIUS) {
                        this.handleIdx = 1;
                        return true;
                    }
                }
                if (this.hasCcwTangent) {
                    var offset = this.ccwOffset + 2 * POLYGON_NODE_RADIUS;
                    var angle = this.ccwAngle;
                    var pt = new Phaser.Point(offset * Math.cos(angle), offset * Math.sin(angle));
                    if (pt.distance(localPt) < POLYGON_NODE_RADIUS) {
                        this.handleIdx = 2;
                        return true;
                    }
                }
            }
            return false;
        };
        PolygonVertex.prototype.performMouseMove = function (pt) {
            if (this.handleIdx == 0) {
                //update location:
                this.position.x = pt.x;
                this.position.y = pt.y;
            }
            else {
                var localPt = new Phaser.Point(pt.x - this.position.x, pt.y - this.position.y);
                var angle = Math.atan2(localPt.y, localPt.x);
                var distance = localPt.getMagnitude();
                var offset = Math.max(0, distance - 2 * POLYGON_NODE_RADIUS);
                if (this.handleIdx == 1) {
                    this.cwAngle = angle;
                    this.cwOffset = offset;
                    if (this.lockTangents)
                        this.ccwAngle = angle + Math.PI;
                }
                else {
                    this.ccwAngle = angle;
                    this.ccwOffset = offset;
                    if (this.lockTangents)
                        this.cwAngle = angle + Math.PI;
                }
                this.repaint();
            }
        };
        return PolygonVertex;
    }(Phaser.Group));
    EditorModule.PolygonVertex = PolygonVertex;
})(EditorModule || (EditorModule = {}));
///<reference path="../../libs/phaser/phaser.d.ts"/>
///<reference path="Definitions.ts"/>
var EditorModule;
(function (EditorModule) {
    var CONTROL_RADIUS = 100;
    var SIDE_HANDLE_RADIUS = 10;
    var TransformationTool = /** @class */ (function (_super) {
        __extends(TransformationTool, _super);
        function TransformationTool(game, transformationCallback, transformationFinishedCallback) {
            var _this = _super.call(this, game) || this;
            _this.transformationCallback = transformationCallback;
            _this.transformationFinishedCallback = transformationFinishedCallback;
            _this.graphics = _this.game.make.graphics();
            _this.addChild(_this.graphics);
            _this.hasInputFocus = false;
            _this.inputPivot = new Phaser.Point(0, 0);
            _this.repaint();
            _this.game.input.addMoveCallback(_this.onMove, _this);
            _this.game.input.onUp.add(_this.onUp, _this);
            return _this;
        }
        TransformationTool.prototype.repaint = function () {
            this.graphics.clear();
            this.graphics.lineStyle(2, 0xffffff, 0.5);
            this.graphics.beginFill(0xffffff, 0.1);
            this.graphics.drawCircle(0, 0, 2 * CONTROL_RADIUS);
            this.graphics.lineStyle(1, 0xffffff, 0.2);
            this.graphics.moveTo(0, -CONTROL_RADIUS);
            this.graphics.lineTo(0, CONTROL_RADIUS);
            this.graphics.moveTo(-CONTROL_RADIUS, 0);
            this.graphics.lineTo(CONTROL_RADIUS, 0);
            this.graphics.endFill();
            var sqrt_half = Math.sqrt(.5);
            this.graphics.lineStyle(0);
            this.graphics.beginFill(0xffffff);
            this.graphics.drawRect(CONTROL_RADIUS - SIDE_HANDLE_RADIUS, -SIDE_HANDLE_RADIUS, 2 * SIDE_HANDLE_RADIUS, 2 * SIDE_HANDLE_RADIUS);
            this.graphics.drawRect(-SIDE_HANDLE_RADIUS, -CONTROL_RADIUS - SIDE_HANDLE_RADIUS, 2 * SIDE_HANDLE_RADIUS, 2 * SIDE_HANDLE_RADIUS);
            this.graphics.drawRect(sqrt_half * CONTROL_RADIUS - SIDE_HANDLE_RADIUS, -sqrt_half * CONTROL_RADIUS - SIDE_HANDLE_RADIUS, 2 * SIDE_HANDLE_RADIUS, 2 * SIDE_HANDLE_RADIUS);
            this.graphics.drawCircle(-sqrt_half * CONTROL_RADIUS, sqrt_half * CONTROL_RADIUS, 2 * SIDE_HANDLE_RADIUS);
            this.graphics.endFill();
        };
        TransformationTool.prototype.reset = function () {
            this.position.x = CONTROL_RADIUS + 10;
            this.position.y = LEVEL_HEIGHT - CONTROL_RADIUS - 10;
            /*
            this.position.x = CONTROL_RADIUS + 10;
            this.position.y = this.game.height - 2 * CONTROL_RADIUS + 10;
            */
        };
        TransformationTool.prototype.tryCaptureMouse = function () {
            if (!this.visible)
                return false;
            var pt = EditorModule.Level.getMousePosition();
            var toPt = new Phaser.Point(pt.x - this.position.x, pt.y - this.position.y);
            var sqrt_half = Math.sqrt(.5);
            var locs = [[1, 0], [sqrt_half, -sqrt_half], [0, -1], [-sqrt_half, sqrt_half]];
            for (var i = 0; i < 4; ++i) {
                var x = locs[i][0] * CONTROL_RADIUS;
                var y = locs[i][1] * CONTROL_RADIUS;
                var to = new Phaser.Point(x - toPt.x, y - toPt.y);
                if (Math.max(Math.abs(to.x), Math.abs(to.y)) < SIDE_HANDLE_RADIUS) {
                    this.inputPivot.x = to.x;
                    this.inputPivot.y = to.y;
                    this.hasInputFocus = true;
                    this.handleIdx = i;
                    return true;
                }
            }
            if (this.position.distance(pt) < CONTROL_RADIUS) {
                this.hasInputFocus = true;
                this.handleIdx = -1;
                this.inputPivot.x = pt.x - this.position.x;
                this.inputPivot.y = pt.y - this.position.y;
                return true;
            }
            return false;
        };
        TransformationTool.prototype.onMove = function () {
            var pt = EditorModule.Level.getMousePosition();
            if (this.hasInputFocus) {
                if (this.handleIdx < 0) {
                    //translate:
                    this.position.x = pt.x - this.inputPivot.x;
                    this.position.y = pt.y - this.inputPivot.y;
                }
                else {
                    var rot = 0;
                    var scaleX = 1;
                    var scaleY = 1;
                    var to = new Phaser.Point(pt.x - this.position.x + this.inputPivot.x, pt.y - this.position.y + this.inputPivot.y);
                    if (this.handleIdx == 0)
                        scaleX = to.x / CONTROL_RADIUS;
                    else if (this.handleIdx == 1)
                        scaleX = scaleY = to.getMagnitude() / CONTROL_RADIUS;
                    else if (this.handleIdx == 2)
                        scaleY = -to.y / CONTROL_RADIUS;
                    else
                        rot = Math.atan2(to.y, to.x) - .75 * Math.PI;
                    var pivot = new Phaser.Point(this.position.x, this.position.y);
                    this.transformationCallback(pivot, rot, scaleX, scaleY);
                }
            }
        };
        TransformationTool.prototype.onUp = function () {
            this.hasInputFocus = false;
            this.transformationFinishedCallback();
        };
        return TransformationTool;
    }(Phaser.Group));
    EditorModule.TransformationTool = TransformationTool;
})(EditorModule || (EditorModule = {}));
///<reference path="../../libs/phaser/phaser.d.ts"/>
///<reference path="PolygonVertex.ts"/>
///<reference path="Definitions.ts"/>
///<reference path="TransformationTool.ts"/>
var EditorModule;
(function (EditorModule) {
    var Polygon = /** @class */ (function (_super) {
        __extends(Polygon, _super);
        function Polygon(game) {
            var _this = _super.call(this, game) || this;
            _this.visualContainer = _this.game.make.group();
            _this.addChild(_this.visualContainer);
            _this.graphics = _this.game.make.graphics(0, 0);
            _this.visualContainer.addChild(_this.graphics);
            _this.pivotBullet = _this.game.make.graphics();
            _this.pivotBullet.lineStyle(2, 0xffffff);
            _this.pivotBullet.beginFill(0xff6600);
            _this.pivotBullet.drawCircle(0, 0, 20);
            _this.pivotBullet.endFill();
            _this.visualContainer.addChild(_this.pivotBullet);
            _this.pivotBullet.visible = false;
            _this.handlesLayer = _this.game.make.group();
            _this.visualContainer.addChild(_this.handlesLayer);
            var radius = 100.0;
            for (var i = 0; i < 5; ++i) {
                var angle = (i / 5.0 + .75) * 2 * Math.PI;
                var pt = new Phaser.Point(radius * Math.cos(angle), radius * Math.sin(angle));
                var vertex = new EditorModule.PolygonVertex(_this.game, function () { _this.vertexPropertiesChanged(); });
                vertex.position = pt;
                _this.handlesLayer.addChild(vertex);
            }
            //this.game.input.onDown.add(this.onDown, this);
            _this.game.input.addMoveCallback(_this.onMove, _this);
            _this.game.input.onUp.add(_this.onUp, _this);
            _this.hasInput = false;
            _this.inputIndex = -1;
            _this.inputPivot = new Phaser.Point(0, 0);
            _this.polygonType = 0;
            _this.movingPivot = false;
            _this._transformation = {
                //translate x:
                "doTransX": false,
                "transXMode": 'cos',
                "transXDuration": 3,
                "transXOffset": 20,
                //translate y:
                "doTransY": false,
                "transYMode": 'cos',
                "transYDuration": 3,
                "transYOffset": 20,
                //rotation:
                "doRotate": false,
                "rotDirection": 'cw',
                "rotMode": 'cos',
                "rotDuration": 3,
                "rotOffset": 0,
            };
            _this.repaint();
            return _this;
        }
        Object.defineProperty(Polygon.prototype, "polygonType", {
            get: function () {
                return this._polygonType;
            },
            set: function (val) {
                this._polygonType = val;
                this.repaint();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Polygon.prototype, "transformation", {
            get: function () {
                return this._transformation;
            },
            enumerable: true,
            configurable: true
        });
        Polygon.prototype.vertexPropertiesChanged = function () {
            this.repaint();
        };
        Polygon.prototype.setSidePanels = function () {
            EditorModule.SidePanelInterface.setPolygonFocus(this);
            if (this.hasInput && !this.movingPivot && this.inputIndex >= 0) {
                EditorModule.SidePanelInterface.setNodeFocus(this.handlesLayer.getChildAt(this.inputIndex));
            }
        };
        Polygon.prototype.serializePoint = function (pt) {
            return { "x": pt.x, "y": pt.y };
        };
        Polygon.prototype.deserializePoint = function (data) {
            return new Phaser.Point(data.x, data.y);
        };
        Polygon.prototype.calculateTransfomation = function (time, duration, offset, mode) {
            var t = time / duration * 2 * Math.PI;
            var value = offset;
            if (mode == 'cos') {
                value *= Math.cos(t);
            }
            else if (mode == 'sin') {
                value *= Math.sin(t);
            }
            else if (mode == 'negcos') {
                value *= 1.0 - Math.cos(t);
            }
            else {
                value *= 1.0 - Math.sin(t);
            }
            return value;
        };
        Polygon.prototype.setAnimationTime = function (time) {
            //calculate transfomation:
            var transX = 0;
            var transY = 0;
            var angle = 0;
            if ((this.polygonType == 0) && time > 0) {
                if (this.transformation.doTransX)
                    transX = this.calculateTransfomation(time, this.transformation.transXDuration, this.transformation.transXOffset, this.transformation.transXMode);
                if (this.transformation.doTransY)
                    transY = this.calculateTransfomation(time, this.transformation.transYDuration, this.transformation.transYOffset, this.transformation.transYMode);
                if (this.transformation.doRotate) {
                    if (this.transformation.rotDirection == 'osc') {
                        angle = this.calculateTransfomation(time, this.transformation.rotDuration, this.transformation.rotOffset, this.transformation.rotMode);
                    }
                    else {
                        angle = time / this.transformation.rotDuration * 360;
                        if (this.transformation.rotDirection == 'ccw')
                            angle = -angle;
                    }
                }
            }
            //apply transformation:
            this.visualContainer.position.x = transX;
            this.visualContainer.position.y = transY;
            this.visualContainer.angle = angle;
        };
        Polygon.prototype.serialize = function () {
            var ptsData = [];
            var n = this.handlesLayer.children.length;
            for (var i = 0; i < n; ++i) {
                var point = this.handlesLayer.getChildAt(i);
                ptsData[ptsData.length] = point.serialize();
            }
            var copyTrans = {};
            for (var key in this._transformation)
                copyTrans[key] = this._transformation[key];
            return {
                "center": this.serializePoint(this.position),
                "polygonType": this.polygonType,
                "points": ptsData,
                "transformation": copyTrans //this._transformation
            };
        };
        Polygon.prototype.deserializeVertices = function (data) {
            var _this = this;
            this.handlesLayer.removeChildren();
            for (var i = 0; i < data.length; ++i) {
                var vertex = new EditorModule.PolygonVertex(this.game, function () { _this.vertexPropertiesChanged(); });
                vertex.deserialize(data[i]);
                this.handlesLayer.addChild(vertex);
            }
            this.repaint();
        };
        Polygon.prototype.deserialize = function (data) {
            this.handlesLayer.removeChildren();
            this.position = data.center;
            this.deserializeVertices(data.points);
            /*
            for(var i:number=0; i<data.points.length; ++i) {
                var vertex = new PolygonVertex(this.game, () => { this.vertexPropertiesChanged(); });
                vertex.deserialize(data.points[i]);
                this.handlesLayer.addChild(vertex);
            }
            */
            //next statement also repaints polygon:
            this.polygonType = data.polygonType;
            this._transformation = data.transformation;
        };
        Polygon.prototype.prepareForTransform = function () {
            var pts = {};
            var n = this.handlesLayer.children.length;
            for (var i = 0; i < n; ++i) {
                var p = this.handlesLayer.getChildAt(i);
                var data = {
                    "x": p.position.x,
                    "y": p.position.y,
                    "cwx": p.position.x + p.cwOffset * Math.cos(p.cwAngle),
                    "cwy": p.position.y + p.cwOffset * Math.sin(p.cwAngle),
                    "ccwx": p.position.x + p.ccwOffset * Math.cos(p.ccwAngle),
                    "ccwy": p.position.y + p.ccwOffset * Math.sin(p.ccwAngle),
                };
                pts[i] = data;
            }
            debugTekstje = "ORIGIN: [" + this.pivotBullet.position.x + ", " + this.pivotBullet.position.y + "]";
            var copy = {
                "pivotX": this.pivotBullet.position.x,
                "pivotY": this.pivotBullet.position.y,
                "pts": pts
            };
            this.preTransformCopy = copy;
        };
        Polygon.prototype.transform = function (matrix) {
            var pivotLoc = matrix.apply(new Phaser.Point(this.preTransformCopy.pivotX, this.preTransformCopy.pivotY));
            this.pivotBullet.position.x = pivotLoc.x;
            this.pivotBullet.position.y = pivotLoc.y;
            //transform vertex points...
            var n = this.handlesLayer.children.length;
            for (var i = 0; i < n; ++i) {
                var p = this.handlesLayer.getChildAt(i);
                var data = this.preTransformCopy.pts[i];
                var prePos = new Phaser.Point(data.x, data.y);
                var cwPt = new Phaser.Point(data.cwx, data.cwy);
                var ccwPt = new Phaser.Point(data.ccwx, data.ccwy);
                var newPos = matrix.apply(prePos);
                if (p.hasCwTangent) {
                    var newCw = matrix.apply(cwPt);
                    newCw.x -= newPos.x;
                    newCw.y -= newPos.y;
                    p.cwOffset = newCw.getMagnitude();
                    p.cwAngle = Math.atan2(newCw.y, newCw.x);
                }
                if (p.hasCcwTangent) {
                    var newCcw = matrix.apply(ccwPt);
                    newCcw.x -= newPos.x;
                    newCcw.y -= newPos.y;
                    p.ccwOffset = newCcw.getMagnitude();
                    p.ccwAngle = Math.atan2(newCcw.y, newCcw.x);
                }
                p.position = newPos;
                p.repaint();
            }
            this.repaint();
        };
        Polygon.prototype.finalizeTransform = function () {
            var dx = this.pivotBullet.position.x;
            var dy = this.pivotBullet.position.y;
            this.pivotBullet.position.x = 0;
            this.pivotBullet.position.y = 0;
            this.position.x += dx;
            this.position.y += dy;
            for (var i = 0; i < this.handlesLayer.children.length; ++i) {
                var c = this.handlesLayer.getChildAt(i);
                c.position.x -= dx;
                c.position.y -= dy;
            }
            this.repaint();
        };
        Polygon.prototype.setFocus = function (isShown, showControls) {
            this.alpha = isShown ? 1.0 : 0.4;
            this.pivotBullet.visible = showControls;
            this.handlesLayer.visible = showControls;
        };
        Polygon.prototype.hitTestLineSegment = function (p, q, pt) {
            var to = new Phaser.Point(q.x - p.x, q.y - p.y);
            var distance = to.getMagnitude();
            to = to.divide(distance, distance);
            var perp = new Phaser.Point(-to.y, to.x);
            var toInput = new Phaser.Point(pt.x - p.x, pt.y - p.y);
            var dot = to.dot(toInput);
            if (dot > 0 && dot < distance) {
                var dotPerp = perp.dot(toInput);
                if (Math.abs(dotPerp) < POLYGON_NODE_RADIUS) {
                    return true;
                }
            }
            return false;
        };
        Polygon.prototype.hitTestEdge = function (idx, pt) {
            var p1 = this.handlesLayer.getChildAt(idx);
            var p2 = this.handlesLayer.getChildAt((idx + 1) % this.handlesLayer.children.length);
            if (p1.hasCwTangent || p2.hasCcwTangent) {
                //do bezier test:
                var c1x = p1.position.x;
                var c1y = p1.position.y;
                var c2x = p2.position.x;
                var c2y = p2.position.y;
                if (p1.hasCwTangent) {
                    c1x = p1.position.x + p1.cwOffset * Math.cos(p1.cwAngle);
                    c1y = p1.position.y + p1.cwOffset * Math.sin(p1.cwAngle);
                }
                if (p2.hasCcwTangent) {
                    c2x = p2.position.x + p2.ccwOffset * Math.cos(p2.ccwAngle);
                    c2y = p2.position.y + p2.ccwOffset * Math.sin(p2.ccwAngle);
                }
                var minX = Math.min(c1x, c2x, p1.position.x, p2.position.x);
                var maxX = Math.max(c1x, c2x, p1.position.x, p2.position.x);
                var minY = Math.min(c1y, c2y, p1.position.y, p2.position.y);
                var maxY = Math.max(c1y, c2y, p1.position.y, p2.position.y);
                if ((pt.x > (minX - POLYGON_NODE_RADIUS)) && (pt.x < (maxX + POLYGON_NODE_RADIUS)) && (pt.y > (minY - POLYGON_NODE_RADIUS)) && (pt.y < (maxY + POLYGON_NODE_RADIUS))) {
                    var iterations = 10;
                    var prevPt = p1.position;
                    for (var i = 0; i < iterations; ++i) {
                        var t = (i + 1) / (iterations);
                        var h0 = Math.pow(1 - t, 3.0);
                        var h1 = 3 * t * Math.pow(1 - t, 2.0);
                        var h2 = 3 * t * t * (1 - t);
                        var h3 = Math.pow(t, 3.0);
                        var samplePt = new Phaser.Point(h0 * p1.position.x + h1 * c1x + h2 * c2x + h3 * p2.position.x, h0 * p1.position.y + h1 * c1y + h2 * c2y + h3 * p2.position.y);
                        if (this.hitTestLineSegment(prevPt, samplePt, pt))
                            return true;
                        prevPt = samplePt;
                    }
                }
            }
            else {
                return this.hitTestLineSegment(p1.position, p2.position, pt);
            }
            return false;
        };
        Polygon.prototype.polygonHitTestPoint = function (pt) {
            return EditorModule.Level.instance.hitTestPoint(this.graphics, new Phaser.Point(pt.x + this.position.x, pt.y + this.position.y));
            /*
            var pts = new Array<Phaser.Point>();
            
            for(var i:number=0; i<this.handlesLayer.children.length; ++i) {
                var vertex = <PolygonVertex>this.handlesLayer.getChildAt(i);
                pts[i] = new Phaser.Point(vertex.position.x, vertex.position.y);
            }
            
            var polygon = new Phaser.Polygon(pts);
            return polygon.contains(pt.x, pt.y);
            */
        };
        Polygon.prototype.transformedHitTestPoint = function () {
            var mousePt = EditorModule.Level.getMousePosition();
            var localMousePt = new Phaser.Point(mousePt.x - (this.position.x + this.visualContainer.position.x), mousePt.y - (this.position.y + this.visualContainer.position.y));
            var pt = localMousePt.rotate(0, 0, -this.visualContainer.angle, true);
            return this.polygonHitTestPoint(pt);
        };
        Polygon.prototype.isMouseOver = function () {
            /*
            var points = this.getPointsArray();
            
            var rect:Phaser.Rectangle = new Phaser.Rectangle(points[0].x, points[0].y, 1, 1);
            for(var i:number=0; i<points.length; ++i) {
                rect = rect.union(new Phaser.Rectangle(points[i].x, points[i].y, 1, 1));
            }
            
            var margin = 10.0;
            rect.x -= margin;
            rect.y -= margin;
            rect.width += 2 * margin;
            rect.height += 2 * margin;
            
            var pt = this.game.input.mousePointer.position;
            var localMousePt = new Phaser.Point(pt.x - this.position.x, pt.y - this.position.y);
            return rect.contains(localMousePt.x, localMousePt.y) || localMousePt.getMagnitude() < 20.0;
            */
            return true;
        };
        Polygon.prototype.renderPoints = function () {
            var n = this.handlesLayer.children.length;
            // var last = this.handlesLayer.getChildAt(n-1).position;
            // this.graphics.moveTo(last.x, last.y);
            var first = this.handlesLayer.getChildAt(0).position;
            this.graphics.moveTo(first.x, first.y);
            for (var i = 1; i < n; ++i) {
                var prev = i == 0 ? (n - 1) : (i - 1);
                var p1 = this.handlesLayer.getChildAt(prev);
                var p2 = this.handlesLayer.getChildAt(i);
                if (p1.hasCwTangent || p2.hasCcwTangent) {
                    var c1x = p1.position.x;
                    var c1y = p1.position.y;
                    var c2x = p2.position.x;
                    var c2y = p2.position.y;
                    if (p1.hasCwTangent) {
                        c1x = p1.position.x + p1.cwOffset * Math.cos(p1.cwAngle);
                        c1y = p1.position.y + p1.cwOffset * Math.sin(p1.cwAngle);
                    }
                    if (p2.hasCcwTangent) {
                        c2x = p2.position.x + p2.ccwOffset * Math.cos(p2.ccwAngle);
                        c2y = p2.position.y + p2.ccwOffset * Math.sin(p2.ccwAngle);
                    }
                    this.graphics.bezierCurveTo(c1x, c1y, c2x, c2y, p2.position.x, p2.position.y);
                }
                else {
                    //straight line...
                    this.graphics.lineTo(p2.position.x, p2.position.y);
                }
            }
        };
        Polygon.prototype.repaint = function () {
            var fillColor = 0xff0000; // = this.isObstacle ? 0xff0000 : 0x44ff44;
            if (this.polygonType == 0)
                fillColor = 0xff0000;
            else if (this.polygonType == 1)
                fillColor = 0x44ff44;
            else
                fillColor = 0xffaa55;
            // this.graphics.lin
            this.graphics.clear();
            this.graphics.lineStyle(0, 0xffffff);
            this.graphics.beginFill(fillColor, .3);
            this.renderPoints();
            this.graphics.endFill();
            this.graphics.lineStyle(3, 0xffffff);
            this.renderPoints();
        };
        Polygon.prototype.triggerDelete = function () {
            EditorModule.Level.instance.deletePolygon(this);
        };
        Polygon.prototype.triggerCopy = function () {
            EditorModule.Level.instance.copyPolygon(this);
        };
        Polygon.prototype.tryCaptureMouse = function (allowHandleFocus) {
            var _this = this;
            var prevFocusNode = null;
            for (var i = 0; i < this.handlesLayer.children.length; ++i) {
                var node = this.handlesLayer.getChildAt(i);
                if (node.hasInputFocus)
                    prevFocusNode = node;
            }
            if (this.hasInput && !this.movingPivot && this.inputIndex >= 0) {
                prevFocusNode = this.handlesLayer.getChildAt(this.inputIndex);
            }
            this.focusCurrentNode();
            if (this.isMouseOver()) {
                EditorModule.SidePanelInterface.setNodeFocus(null);
                var n = this.handlesLayer.children.length;
                var mousePt = EditorModule.Level.getMousePosition();
                var localMousePt = new Phaser.Point(mousePt.x - this.position.x, mousePt.y - this.position.y);
                if (localMousePt.getMagnitude() < 20.0 && allowHandleFocus) {
                    this.inputPivot.x = localMousePt.x;
                    this.inputPivot.y = localMousePt.y;
                    this.movingPivot = true;
                    this.hasInput = true;
                    return true;
                }
                else
                    this.movingPivot = false;
                if (this.game.input.mousePointer.rightButton.isDown && allowHandleFocus) {
                    for (var i = 0; i < n; ++i) {
                        var vertex = this.handlesLayer.children[i];
                        if (vertex.position.distance(localMousePt) < POLYGON_NODE_RADIUS) {
                            if (n > 2) {
                                this.handlesLayer.removeChildAt(i);
                                this.repaint();
                            }
                            return true;
                        }
                    }
                    return false;
                }
                if (allowHandleFocus) {
                    //test if handle was hit:
                    for (var i = 0; i < n; ++i) {
                        var vertex = this.handlesLayer.children[i];
                        if (vertex.tryCaptureMouse(localMousePt, prevFocusNode == vertex)) {
                            this.hasInput = true;
                            this.inputIndex = i;
                            this.focusCurrentNode();
                            return true;
                        }
                    }
                    //test if edge was hit:
                    for (var i = 0; i < n; ++i) {
                        if (this.hitTestEdge(i, localMousePt)) {
                            //cut polygon:
                            var vertex = new EditorModule.PolygonVertex(this.game, function () { _this.vertexPropertiesChanged(); });
                            vertex.position = new Phaser.Point(localMousePt.x, localMousePt.y);
                            vertex.captureMouse();
                            this.handlesLayer.addChildAt(vertex, i + 1); //.children  .splice(i + 1, 0, vertex);
                            this.hasInput = true;
                            this.inputIndex = i + 1;
                            this.focusCurrentNode();
                            this.repaint();
                            return true;
                        }
                    }
                }
                this.hasInput = this.polygonHitTestPoint(localMousePt);
                this.inputPivot.x = localMousePt.x;
                this.inputPivot.y = localMousePt.y;
                return this.hasInput;
            }
            return false;
        };
        Polygon.prototype.focusCurrentNode = function () {
            for (var i = 0; i < this.handlesLayer.children.length; ++i) {
                var vertex = this.handlesLayer.getChildAt(i);
                vertex.setHandlesFocus(false);
            }
            if (this.hasInput && !this.movingPivot) {
                var vertex = this.handlesLayer.getChildAt(this.inputIndex);
                EditorModule.SidePanelInterface.setNodeFocus(vertex);
                vertex.setHandlesFocus(true);
            }
            else {
                EditorModule.SidePanelInterface.setNodeFocus(null);
            }
        };
        Polygon.prototype.onMove = function () {
            if (this.hasInput) {
                var mousePt = EditorModule.Level.getMousePosition();
                var localMousePt = new Phaser.Point(mousePt.x - this.position.x, mousePt.y - this.position.y);
                if (this.movingPivot) {
                    this.pivotBullet.x = localMousePt.x - this.inputPivot.x;
                    this.pivotBullet.y = localMousePt.y - this.inputPivot.y;
                }
                else {
                    //update...
                    if (this.inputIndex >= 0) {
                        //update point location:
                        var c = this.handlesLayer.getChildAt(this.inputIndex);
                        c.performMouseMove(localMousePt);
                        this.repaint();
                    }
                    else {
                        //moving polygon:
                        this.position.x += localMousePt.x - this.inputPivot.x;
                        this.position.y += localMousePt.y - this.inputPivot.y;
                    }
                }
            }
        };
        Polygon.prototype.onUp = function () {
            if (this.hasInput && this.movingPivot) {
                this.finalizeTransform();
            }
            this.movingPivot = false;
            this.hasInput = false;
            this.inputIndex = -1;
        };
        return Polygon;
    }(Phaser.Group));
    EditorModule.Polygon = Polygon;
})(EditorModule || (EditorModule = {}));
///<reference path="../../libs/phaser/phaser.d.ts"/>
///<reference path="DraggableComponent.ts"/>
///<reference path="Definitions.ts"/>
var EditorModule;
(function (EditorModule) {
    var RotateableComponent = /** @class */ (function (_super) {
        __extends(RotateableComponent, _super);
        function RotateableComponent(game, parent, str, colorChangedCallback) {
            var _this = _super.call(this, game, parent, 0xaaaaaa, str) || this;
            _this.colorChangedCallback = colorChangedCallback;
            _this.colorIndex = 0;
            _this.rotateMode = false;
            var gr = _this.game.make.graphics(0, DRAGGABLE_CMP_RADIUS);
            _this.addChild(gr);
            gr.beginFill(0xffffff);
            gr.drawCircle(0, 0, 20);
            gr.endFill();
            _this.lineGraphics = _this.game.make.graphics(0, DRAGGABLE_CMP_RADIUS);
            _this.addChild(_this.lineGraphics);
            _this.lineGraphics.lineStyle(2, 0xffffff);
            _this.lineGraphics.moveTo(0, 0);
            _this.lineGraphics.lineTo(0, 300);
            _this.lineGraphics.visible = false;
            _this.colorHandle = _this.game.make.graphics(0, -DRAGGABLE_CMP_RADIUS);
            _this.addChild(_this.colorHandle);
            _this.setColorIndex(_this.colorIndex);
            return _this;
        }
        RotateableComponent.prototype.serialize = function () {
            return { "angleDeg": this.angle, "x": this.position.x, "y": this.position.y, "colorIndex": this.colorIndex, "color": TUNNEL_COLORS[this.colorIndex] };
        };
        RotateableComponent.prototype.deserialize = function (data) {
            this.position.x = data.x;
            this.position.y = data.y;
            this.angle = data.angleDeg;
            this.colorIndex = data.colorIndex;
            this.setColorIndex(this.colorIndex);
        };
        RotateableComponent.prototype.isMouseOver = function () {
            var mousePos = EditorModule.Level.getMousePosition();
            return this.position.distance(mousePos) < DRAGGABLE_CMP_RADIUS + 10;
        };
        RotateableComponent.prototype.getColorIndex = function () {
            return this.colorIndex;
        };
        RotateableComponent.prototype.setColorIndex = function (colorIndex) {
            this.colorIndex = colorIndex;
            this.colorHandle.clear();
            this.colorHandle.lineStyle(2, 0xffffff);
            this.colorHandle.beginFill(TUNNEL_COLORS[this.colorIndex]);
            this.colorHandle.drawCircle(0, 0, 20);
            this.colorHandle.endFill();
        };
        RotateableComponent.prototype.changeColor = function () {
            this.colorIndex = (this.colorIndex + 1) % TUNNEL_COLORS.length;
            this.setColorIndex(this.colorIndex);
            this.colorChangedCallback(this, this.colorIndex);
        };
        RotateableComponent.prototype.tryCaptureMouse = function () {
            if (_super.prototype.tryCaptureMouse.call(this)) {
                this.lineGraphics.visible = true;
                var radAng = (this.angle + 90) * Math.PI / 180.0;
                var globalHandleLoc = new Phaser.Point(DRAGGABLE_CMP_RADIUS * Math.cos(radAng), DRAGGABLE_CMP_RADIUS * Math.sin(radAng));
                var mousePos = EditorModule.Level.getMousePosition();
                var toMousePos = new Phaser.Point(mousePos.x - this.position.x, mousePos.y - this.position.y);
                this.rotateMode = globalHandleLoc.distance(toMousePos) < 10;
                if (!this.rotateMode) {
                    //try change color:
                    var colorChangeLoc = new Phaser.Point(-DRAGGABLE_CMP_RADIUS * Math.cos(radAng), -DRAGGABLE_CMP_RADIUS * Math.sin(radAng));
                    if (colorChangeLoc.distance(toMousePos) < 10) {
                        //change color:
                        this.changeColor();
                        this.onUp();
                    }
                }
                return true;
            }
            return false;
        };
        RotateableComponent.prototype.onUp = function () {
            this.lineGraphics.visible = false;
            _super.prototype.onUp.call(this);
        };
        RotateableComponent.prototype.onMove = function () {
            if (this.hasInput && this.rotateMode) {
                var mousePos = EditorModule.Level.getMousePosition();
                this.angle = 180 * Math.atan2(mousePos.y - this.position.y, mousePos.x - this.position.x) / Math.PI - 90;
            }
            else
                _super.prototype.onMove.call(this);
        };
        return RotateableComponent;
    }(EditorModule.DraggableComponent));
    EditorModule.RotateableComponent = RotateableComponent;
})(EditorModule || (EditorModule = {}));
///<reference path="../../libs/phaser/phaser.d.ts"/>
///<reference path="Definitions.ts"/>
///<reference path="Polygon.ts"/>
/*
///<reference path="../sidePanel.d.ts"/>
//.js"/>
*/
var EditorModule;
(function (EditorModule) {
    var SidePanelInterface = /** @class */ (function () {
        function SidePanelInterface() {
            //...
        }
        SidePanelInterface.setPolygonFocus = function (p) {
            focusOnPolygon(p);
        };
        SidePanelInterface.setNodeFocus = function (v) {
            focusOnNode(v);
        };
        return SidePanelInterface;
    }());
    EditorModule.SidePanelInterface = SidePanelInterface;
})(EditorModule || (EditorModule = {}));
///<reference path="../../libs/phaser/phaser.d.ts"/>
///<reference path="Definitions.ts"/>
///<reference path="DraggableComponent.ts"/>
///<reference path="Polygon.ts"/>
///<reference path="RotateableComponent.ts"/>
///<reference path="SidePanelInterface.ts"/>
var EditorModule;
(function (EditorModule) {
    var Level = /** @class */ (function (_super) {
        __extends(Level, _super);
        function Level(game) {
            var _this = _super.call(this, game) || this;
            /*
            this.dataTexture = game.make.bitmapData(this.game.width, this.game.height);
            this.dataTexture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
            this.game.add.image(-this.game.width, 0, this.dataTexture);//.alpha = .2;
            */
            _this.fooColor = -1;
            Level.instance = _this;
            _this.focusedPolygon = null;
            var bgGr = _this.game.make.graphics(0, 0);
            bgGr.beginFill(0x0, .4);
            bgGr.drawRoundedRect(-LEVEL_HORIZONTAL_MARGIN, -LEVEL_VERTICAL_MARGIN, LEVEL_WIDTH + 2 * LEVEL_HORIZONTAL_MARGIN, LEVEL_HEIGHT + 2 * LEVEL_VERTICAL_MARGIN, 10);
            bgGr.endFill();
            bgGr.lineStyle(0, 0x0);
            bgGr.beginFill(0x008800);
            bgGr.drawRoundedRect(0, 0, LEVEL_WIDTH, LEVEL_HEIGHT, 10);
            bgGr.endFill();
            _this.addChild(bgGr);
            /*
            var gr = this.game.make.graphics(0,0);
            gr.lineStyle(0, 0x0);
            gr.beginFill(0x004400);
            gr.drawRect(0, 0, LEVEL_WIDTH, LEVEL_HEIGHT);
            gr.endFill();
            this.addChild(gr);
            */
            _this.polygons = _this.game.make.group();
            _this.addChild(_this.polygons);
            _this.tunnels = _this.game.make.group();
            _this.addChild(_this.tunnels);
            _this.ballElement = new EditorModule.DraggableComponent(_this.game, _this, 0xff8800, "●");
            _this.goalElement = new EditorModule.DraggableComponent(_this.game, _this, 0x0088ff, "⚑");
            _this.transformationTool = new EditorModule.TransformationTool(_this.game, function (p, r, sx, sy) { _this.transformationChanged(p, r, sx, sy); }, function () { _this.transformationFinished(); });
            _this.addChild(_this.transformationTool);
            _this.clearLevel();
            /*
            var mask:Phaser.Graphics = this.game.make.graphics(0,0);
            mask.beginFill(0x0);
            mask.drawRoundedRect(LEVEL_MARGIN, LEVEL_MARGIN, LEVEL_WIDTH, LEVEL_HEIGHT, 10);
            mask.endFill();
            this.mask = mask;
            */
            _this.dataTexture = _this.game.add.bitmapData(_this.game.width, _this.game.height);
            //this.dataTexture.fill(255,255,255,.8);
            var container = _this.dataTexture.addToWorld(); //-this.game.width);
            container.scale.x = .2;
            container.scale.y = .2;
            container.visible = false;
            return _this;
            //this.dataTexture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
            //var img = this.game.add.image(0, 0, this.dataTexture);//.alpha = .2;
            //img.alpha = .5;
        }
        Level.getMousePosition = function () {
            var mousePt = Level.instance.game.input.mousePointer.position;
            var result = new Phaser.Point(mousePt.x - LEVEL_HORIZONTAL_MARGIN, mousePt.y - LEVEL_VERTICAL_MARGIN);
            return result;
        };
        Level.prototype.hitTestPoint = function (obj, pt) {
            //this.dataTexture.drawGroup(gr);
            this.dataTexture.clear();
            this.dataTexture.fill(255, 255, 255, .1);
            this.dataTexture.drawFull(obj);
            this.dataTexture.update();
            this.dataTexture.setPixel(0, 0, 0, 0, 0, true);
            var x = Math.round(pt.x + LEVEL_HORIZONTAL_MARGIN);
            var y = Math.round(pt.y + LEVEL_VERTICAL_MARGIN);
            var color = this.dataTexture.getPixelRGB(x, y);
            //alert(color.r);
            //debugTekstje = "pt:" + x + ", " + y + ": [" + color.a + "]";
            /*
            var tex = gr.generateTexture();
            //var sprite:Phaser.Sprite = this.game.make.sprite(0, 0, tex);
            this.dataTexture.draw(new PIXI.Sprite(tex));*/
            return color.a > 100;
        };
        Level.prototype.deletePolygon = function (p) {
            this.polygons.remove(p);
            this.focusPolygon(null);
        };
        Level.prototype.copyPolygon = function (p) {
            var data = p.serialize();
            var copy = new EditorModule.Polygon(this.game);
            copy.deserialize(data);
            copy.position.x += 10;
            copy.position.y -= 10;
            this.polygons.addChild(copy);
            this.focusPolygon(copy);
        };
        Level.prototype.serializePoint = function (pt) {
            return { "x": pt.x, "y": pt.y };
        };
        Level.prototype.deserializePoint = function (data) {
            return new Phaser.Point(data.x, data.y);
        };
        Level.prototype.serialize = function () {
            var polygonsData = [];
            for (var i = 0; i < this.polygons.children.length; ++i) {
                var p = this.polygons.getChildAt(i);
                polygonsData[polygonsData.length] = p.serialize();
            }
            var tunnelsData = [];
            for (var i = 0; i < this.tunnels.children.length; ++i) {
                var rot = this.tunnels.getChildAt(i);
                tunnelsData[tunnelsData.length] = rot.serialize();
            }
            return {
                "levelWidth": LEVEL_WIDTH,
                "levelHeight": LEVEL_HEIGHT,
                "ballPosition": this.serializePoint(this.ballElement.position),
                "goalPosition": this.serializePoint(this.goalElement.position),
                "polygons": polygonsData,
                "tunnels": tunnelsData
            };
        };
        Level.prototype.deserialize = function (data) {
            this.clearLevel();
            this.ballElement.position = this.deserializePoint(data.ballPosition);
            this.goalElement.position = this.deserializePoint(data.goalPosition);
            var tunnelsData = data.tunnels;
            for (var i = 0; i < tunnelsData.length - 1; i += 2) {
                this.addTunnel(new Phaser.Point(0, 0));
                for (var j = 0; j < 2; ++j) {
                    var rObj = this.tunnels.children[this.tunnels.children.length - 2 + j];
                    rObj.deserialize(tunnelsData[i + j]);
                }
            }
            var polygonsData = data.polygons;
            for (var i = 0; i < polygonsData.length; ++i) {
                var p = new EditorModule.Polygon(this.game);
                p.deserialize(polygonsData[i]);
                this.polygons.addChild(p);
            }
        };
        Level.prototype.render = function () {
            this.num = ((this.num + 1) % 10);
            this.game.debug.text("TESt" + this.num, 0, 100);
        };
        Level.prototype.setAnimationTime = function (time) {
            for (var _i = 0, _a = this.polygons.children; _i < _a.length; _i++) {
                var c = _a[_i];
                var polygon = c;
                polygon.setAnimationTime(time);
            }
        };
        Level.prototype.tunnelColorChanged = function (tunnel, colorIdx) {
            for (var i = 0; i < this.tunnels.length; ++i) {
                if (this.tunnels.children[i] == tunnel) {
                    var j = (i % 2 == 0) ? (i + 1) : (i - 1);
                    var rotElem = this.tunnels.children[j];
                    rotElem.setColorIndex(colorIdx);
                    break;
                }
            }
        };
        Level.prototype.transformationFinished = function () {
            if (this.focusedPolygon != null) {
                this.focusedPolygon.finalizeTransform();
            }
        };
        Level.prototype.transformationChanged = function (pivot, angle, scaleX, scaleY) {
            if (this.focusedPolygon != null) {
                //redefine pivot:
                pivot.x = pivot.x - this.focusedPolygon.position.x;
                pivot.y = pivot.y - this.focusedPolygon.position.y;
                var matrix = new Phaser.Matrix();
                matrix = matrix.identity()
                    .translate(-pivot.x, -pivot.y)
                    .scale(scaleX, scaleY)
                    .rotate(angle)
                    .translate(pivot.x, pivot.y);
                this.focusedPolygon.transform(matrix);
            }
        };
        Level.prototype.resetTunnelLayouts = function () {
            //var clrs:Array<number> = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0x00ffff];
            for (var i = 0; i < this.tunnels.length; ++i) {
                var idx = Math.floor(i / 2);
                //var clr:number = clrs[idx % clrs.length];
                var rotElem = this.tunnels.children[i];
                rotElem.setText("" + (idx + 1));
            }
        };
        Level.prototype.clearLevel = function () {
            this.polygons.removeChildren();
            this.tunnels.removeChildren();
            this.ballElement.position = new Phaser.Point(.3 * LEVEL_WIDTH, .5 * LEVEL_HEIGHT);
            this.goalElement.position = new Phaser.Point(.7 * LEVEL_WIDTH, .5 * LEVEL_HEIGHT);
            this.focusPolygon(null);
        };
        Level.prototype.addPolygon = function (pt, argument) {
            var p = new EditorModule.Polygon(this.game);
            this.polygons.addChild(p);
            p.position.x = pt.x - LEVEL_HORIZONTAL_MARGIN;
            p.position.y = pt.y - LEVEL_VERTICAL_MARGIN;
            var vertices = [];
            var radius = 100;
            switch (argument) {
                case SPECIAL_POLYGON_STAR:
                    var starSamples = 10;
                    for (var i = 0; i < starSamples; ++i) {
                        var angle = (i / starSamples - .25) * 2 * Math.PI;
                        var locRad = ((i % 2 == 0) ? 1 : .5) * radius;
                        vertices[i] = EditorModule.PolygonVertex.serializePolygonVertex(locRad * Math.cos(angle), locRad * Math.sin(angle));
                    }
                    break;
                case SPECIAL_POLYGON_CIRCLE:
                    var tangOffset = 0.55 * radius;
                    for (var i = 0; i < 4; ++i) {
                        var angle = (i / 4.0) * 2 * Math.PI;
                        var nx = Math.cos(angle);
                        var ny = Math.sin(angle);
                        vertices[i] = EditorModule.PolygonVertex.serializePolygonVertexWithControls(radius * nx, radius * ny, angle + .5 * Math.PI, tangOffset, angle - .5 * Math.PI, tangOffset);
                    }
                    break;
                case SPECIAL_POLYGON_HEART:
                    var slantedLength = .7 * Math.sqrt(2 * radius * radius);
                    vertices[0] = EditorModule.PolygonVertex.serializePolygonVertex(0, radius);
                    vertices[1] = EditorModule.PolygonVertex.serializePolygonVertexWithControls(-radius, 0, -.75 * Math.PI, slantedLength, 0, 0);
                    vertices[2] = EditorModule.PolygonVertex.serializePolygonVertexWithControls(0, -radius, -.25 * Math.PI, slantedLength, -.75 * Math.PI, slantedLength);
                    vertices[3] = EditorModule.PolygonVertex.serializePolygonVertexWithControls(radius, 0, 0, 0, -.25 * Math.PI, slantedLength);
                    break;
                default:
                    var samples = Math.max(3, Math.min(10, argument));
                    for (var i = 0; i < samples; ++i) {
                        var angle = (i / samples + 2 / samples - .25) * 2 * Math.PI;
                        vertices[i] = EditorModule.PolygonVertex.serializePolygonVertex(100 * Math.cos(angle), 100 * Math.sin(angle));
                    }
                    break;
            }
            p.deserializeVertices(vertices);
            this.focusPolygon(p);
        };
        Level.prototype.addTunnel = function (pt) {
            var _this = this;
            var rc = new EditorModule.RotateableComponent(this.game, this.tunnels, "", function (tunnel, idx) { _this.tunnelColorChanged(tunnel, idx); });
            rc.position.x = pt.x - LEVEL_HORIZONTAL_MARGIN;
            rc.position.y = pt.y - LEVEL_VERTICAL_MARGIN;
            rc = new EditorModule.RotateableComponent(this.game, this.tunnels, "", function (tunnel, idx) { _this.tunnelColorChanged(tunnel, idx); });
            rc.position.x = Math.min(pt.x + 3 * DRAGGABLE_CMP_RADIUS, LEVEL_WIDTH - DRAGGABLE_CMP_RADIUS) - LEVEL_HORIZONTAL_MARGIN;
            rc.position.y = pt.y - LEVEL_VERTICAL_MARGIN;
            this.resetTunnelLayouts();
        };
        Level.prototype.focusPolygon = function (p) {
            var keepFocus = p == this.focusedPolygon;
            this.focusedPolygon = p;
            //by default unfocus all polygons:
            for (var _i = 0, _a = this.polygons.children; _i < _a.length; _i++) {
                var item = _a[_i];
                var polygon = item;
                polygon.setFocus(p == null, false);
            }
            this.transformationTool.visible = p != null;
            if (!keepFocus)
                this.transformationTool.reset();
            if (p != null) {
                p.setSidePanels();
                this.polygons.bringToTop(p);
                p.setFocus(true, true);
            }
            else
                EditorModule.SidePanelInterface.setPolygonFocus(null);
        };
        Level.prototype.trySelectPolygon = function () {
            for (var _i = 0, _a = this.polygons.children.slice().reverse(); _i < _a.length; _i++) {
                var item = _a[_i];
                var polygon = item;
                if (polygon.transformedHitTestPoint()) {
                    this.focusPolygon(polygon);
                    return;
                }
            }
        };
        Level.prototype.tryCaptureMouse = function () {
            //try capture ball / goal (lazy evaluation)
            if (this.ballElement.tryCaptureMouse() || this.goalElement.tryCaptureMouse()) {
                this.focusPolygon(null);
                return true;
            }
            if (this.transformationTool.tryCaptureMouse()) {
                //do not adjust current polygon focus:
                if (this.focusedPolygon != null)
                    this.focusedPolygon.prepareForTransform();
                return true;
            }
            for (var _i = 0, _a = this.tunnels.children.slice().reverse(); _i < _a.length; _i++) {
                var item = _a[_i];
                var tunnelElem = item;
                if (tunnelElem.tryCaptureMouse()) {
                    if (this.game.input.mousePointer.rightButton.isDown) {
                        //delete tunnel:
                        var idx = this.tunnels.children.indexOf(tunnelElem);
                        if (idx % 2 == 1)
                            idx--;
                        this.tunnels.removeChildAt(idx);
                        this.tunnels.removeChildAt(idx);
                        this.resetTunnelLayouts();
                        this.focusPolygon(null);
                        return false;
                    }
                    else {
                        this.focusPolygon(null);
                        return true;
                    }
                }
            }
            //try capture polygon:
            for (var _b = 0, _c = this.polygons.children.slice().reverse(); _b < _c.length; _b++) {
                var item = _c[_b];
                var polygon = item;
                if (polygon.tryCaptureMouse(this.focusedPolygon == polygon)) {
                    this.focusPolygon(polygon);
                    return true;
                }
            }
            this.focusPolygon(null);
            return false;
        };
        return Level;
    }(Phaser.Group));
    EditorModule.Level = Level;
})(EditorModule || (EditorModule = {}));
///<reference path="../../libs/phaser/phaser.d.ts"/>
///<reference path="ToolbarOption.ts"/>
///<reference path="Definitions.ts"/>
///<reference path="Level.ts"/>
var EditorModule;
(function (EditorModule) {
    var MainState = /** @class */ (function (_super) {
        __extends(MainState, _super);
        function MainState() {
            var _this = _super.call(this) || this;
            _this._isAnimating = false;
            return _this;
        }
        Object.defineProperty(MainState.prototype, "isAnimating", {
            get: function () {
                return this._isAnimating;
            },
            set: function (val) {
                this._isAnimating = val;
                this.onAnimationStateChanged();
            },
            enumerable: true,
            configurable: true
        });
        MainState.prototype.serializePoint = function (pt) {
            return { "x": pt.x, "y": pt.y };
        };
        MainState.prototype.deserializePoint = function (data) {
            return new Phaser.Point(data.x, data.y);
        };
        MainState.prototype.serializeLevel = function () {
            return this.level.serialize();
        };
        MainState.prototype.loadLevel = function (data) {
            this.level.deserialize(data);
        };
        MainState.prototype.clearLevel = function () {
            this.level.clearLevel();
        };
        MainState.prototype.onAnimationStateChanged = function () {
            this.noTouchShowParameter = 0.0;
            if (this.isAnimating) {
                this.animationTime = 0.0;
            }
            this.level.setAnimationTime(0.0);
        };
        MainState.prototype.preload = function () {
        };
        MainState.prototype.create = function () {
            var _this = this;
            var bgGraphics = this.game.add.graphics(0, 0);
            bgGraphics.beginFill(0xffffff);
            bgGraphics.drawRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
            //create level:
            this.level = new EditorModule.Level(this.game);
            this.level.position = new Phaser.Point(LEVEL_HORIZONTAL_MARGIN, LEVEL_VERTICAL_MARGIN);
            //this.stage.addChild(this.level);
            var grToolsBounds = new Phaser.Rectangle(2, 5, STAGE_WIDTH - 4, (STAGE_HEIGHT - LEVEL_HEIGHT - 2 * LEVEL_VERTICAL_MARGIN) - 7);
            var grTools = this.game.add.graphics(0, LEVEL_HEIGHT + 2 * LEVEL_VERTICAL_MARGIN);
            grTools.lineStyle(2, 0x888888);
            grTools.beginFill(0xaaaaaa, .5);
            grTools.drawRoundedRect(grToolsBounds.x, grToolsBounds.y, grToolsBounds.width, grToolsBounds.height, 10);
            grTools.endFill();
            var callbacks = [
                function (opt) { _this.level.addPolygon(opt.position, 3); },
                function (opt) { _this.level.addPolygon(opt.position, 4); },
                function (opt) { _this.level.addPolygon(opt.position, 5); },
                function (opt) { _this.level.addPolygon(opt.position, 6); },
                function (opt) { _this.level.addPolygon(opt.position, SPECIAL_POLYGON_CIRCLE); },
                function (opt) { _this.level.addPolygon(opt.position, SPECIAL_POLYGON_HEART); },
                function (opt) { _this.level.addPolygon(opt.position, SPECIAL_POLYGON_STAR); },
                function (opt) { _this.level.addTunnel(opt.position); }
            ];
            var symbols = ["▲", "◼", "⬟", "⬢", "🌑", "♥", "★", "🍙"];
            //create tool options:
            this.toolbarOptions = this.game.add.group();
            for (var i = 0; i < 8; ++i) {
                var opt = new EditorModule.ToolbarOption(this.game, new Phaser.Point(20 + (i * 1.25 + .5) * TOOL_OPT_WIDTH, LEVEL_HEIGHT + 2 * LEVEL_VERTICAL_MARGIN + grToolsBounds.centerY), callbacks[i], symbols[i]);
                this.toolbarOptions.addChild(opt);
            }
            this.game.input.onDown.add(this.onInputDown, this);
            this.noTouchVisual = this.game.add.group();
            this.noTouchVisual.position.x = STAGE_WIDTH / 2;
            this.noTouchVisual.position.y = 60;
            this.noTouchShowParameter = 0.0;
            var gr = this.game.make.graphics(0, 0);
            this.noTouchVisual.addChild(gr);
            gr.beginFill(0x0, .5);
            gr.lineStyle(2, 0xffffff, .5);
            gr.drawRoundedRect(-180, -20, 360, 40, 5);
            gr.endFill();
            var style = { font: "18px Arial", fill: "#ffffff", align: "center" };
            var tb = this.game.make.text(0, 0, 'cannot manipulate field during animation', style);
            tb.position.x -= .5 * tb.width;
            tb.position.y -= .45 * tb.height;
            this.noTouchVisual.addChild(tb);
            EditorModule.SidePanelInterface.setPolygonFocus(null);
            EditorModule.SidePanelInterface.setNodeFocus(null);
        };
        MainState.prototype.onInputDown = function () {
            if (this.isAnimating) {
                this.noTouchShowParameter = 1.0;
                this.level.trySelectPolygon();
                return;
            }
            //try capture toolbar option:
            for (var _i = 0, _a = this.toolbarOptions.children; _i < _a.length; _i++) {
                var item = _a[_i];
                var opt = item;
                if (opt.tryCaptureMouse())
                    return;
            }
            if (this.level.tryCaptureMouse())
                return;
        };
        MainState.prototype.update = function () {
            this.noTouchShowParameter *= .965;
            this.noTouchVisual.alpha = Math.min(1.0, 8 * this.noTouchShowParameter);
            this.noTouchVisual.scale.x = 1.0 + Math.pow(this.noTouchShowParameter, 3.0) * .1 * Math.cos(this.noTouchShowParameter * 20);
            this.noTouchVisual.scale.y = 2.0 - this.noTouchVisual.scale.x;
            if (this.isAnimating) {
                this.animationTime += this.game.time.physicsElapsed;
                this.level.setAnimationTime(this.animationTime);
                if (this.animationTime > 100.0)
                    this.animationTime = 0.0;
            }
        };
        MainState.prototype.render = function () {
            this.game.debug.text(debugTekstje, 20, 20, "#ffffff");
        };
        return MainState;
    }(Phaser.State));
    EditorModule.MainState = MainState;
})(EditorModule || (EditorModule = {}));
///<reference path="../../libs/phaser/phaser.d.ts"/>
///<reference path="MainState.ts"/>
///<reference path="Definitions.ts"/>
///<reference path="SidePanelInterface.ts"/>
var EditorModule;
(function (EditorModule) {
    var SimpleGame = /** @class */ (function () {
        function SimpleGame() {
            this.game = new Phaser.Game(STAGE_WIDTH, STAGE_HEIGHT, Phaser.AUTO, 'content');
            this.mainState = new EditorModule.MainState();
            this.game.state.add("MainState", this.mainState, true);
        }
        Object.defineProperty(SimpleGame.prototype, "isAnimating", {
            get: function () {
                return this.mainState.isAnimating;
            },
            set: function (val) {
                this.mainState.isAnimating = val;
            },
            enumerable: true,
            configurable: true
        });
        SimpleGame.prototype.deserializeLevel = function (data) {
            this.mainState.loadLevel(data);
        };
        SimpleGame.prototype.serializeCurrentLevel = function () {
            return this.mainState.serializeLevel();
        };
        SimpleGame.prototype.clearLevel = function () {
            this.mainState.clearLevel();
        };
        return SimpleGame;
    }());
    EditorModule.SimpleGame = SimpleGame;
})(EditorModule || (EditorModule = {}));
var phaserGame;
window.onload = function () {
    phaserGame = new EditorModule.SimpleGame();
};
