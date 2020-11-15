///<reference path="../../../../pixi/pixi.js.d.ts"/>
///<reference path="SquareButton.ts"/>
///<reference path="../Point.ts"/>
///<reference path="ScrollPanel.ts"/>

module Magneon
{
    export function checkIfMobile() : boolean {
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor);
        return check;
      };

    export class Menu extends PIXI.Container {

        size:PIXI.Point;
        isBusy:boolean = false;

        buttons:SquareButton[] = [];
        regButtonContainer:PIXI.Container;
        scrollPanel:ScrollPanel;

        text:PIXI.Text;

        onOpenLevel:Function = undefined;
        onOpenEditor:Function = undefined;

        constructor(w:number, h:number) {
            super();

            this.size = new PIXI.Point(w, h);

            let bg = new PIXI.Graphics();
            bg.beginFill(0x0, .8);
            bg.drawRect(0,0,w,h);
            bg.endFill();
            this.addChild(bg);

            let panel = new PIXI.Graphics();
            panel.lineStyle(4, 0x00ffff);
            panel.beginFill(0x0, .3);
            panel.drawRoundedRect(-200,-300,400,600,10);
            this.addChild(panel);
            panel.x = w / 2;
            panel.y = h / 2;

            this.text = new PIXI.Text('');
            this.text.x = w / 2;
            this.text.y = h / 2 - 200;
            this.text.style.align = 'center';
            this.text.style.fill = 0xffffff;
            this.text.style.fontSize = 12;
            this.addChild(this.text);

            this.regButtonContainer = new PIXI.Container();
            this.addChild(this.regButtonContainer);

            var btn = new SquareButton('NEW', 0xffaa00);
            btn.callback = () => { this.makeNewLevel(); };
            this.regButtonContainer.addChild(btn);
            this.buttons.push(btn);
            btn.x = APP_WIDTH / 2 - 100;
            btn.y = APP_HEIGHT / 2 - 240;

            btn = new SquareButton('EDIT', 0x00ffaa);
            btn.callback = () => { 
                if(window.innerWidth < window.innerHeight)
                    alert('Please make sure this window is in landscape mode (i.e.: it has a horizontal layout).');
                else if(checkIfMobile())
                    alert('The editor-option is only available in a Desktop browser.');
                else {
                    this.onOpenEditor(); 
                    this.visible = false;
                }
            };
            this.regButtonContainer.addChild(btn);
            this.buttons.push(btn);
            btn.x = APP_WIDTH / 2;
            btn.y = APP_HEIGHT / 2 - 240;

            this.scrollPanel = new ScrollPanel(360, 460);
            this.scrollPanel.x = w / 2 - 180;
            this.scrollPanel.y = h / 2 - 180;
            this.addChild(this.scrollPanel);

            this.visible = false;
        }

        private loadLevel(index:number, openEditor:boolean = false) {
            this.isBusy = true;
            let onLevelLoaded = (result) => {
                this.isBusy = false;
                this.visible = false;
                if(this.onOpenLevel)
                    this.onOpenLevel(result);
                if(openEditor && this.onOpenEditor)
                    this.onOpenEditor();
            }
            LevelLoader.loadLevel(index, onLevelLoaded);
        }

        makeNewLevel() {
            let cb = (idx) => { this.loadLevel(idx, true); };
            LevelLoader.makeNewLevel(cb);
        }

        update(dt:number) {
            this.scrollPanel.update(dt);
        }

        open() {
            this.isBusy = true;
            this.visible = true;

            this.buttons = [];
            this.scrollPanel.clear();

            for(let c of this.regButtonContainer.children)
                this.buttons.push(c as SquareButton);

            let onLevelListLoaded = (result) => {

                result.sort(function(a, b) { return a - b; });

                this.text.text = '';
                for(let r of result) {
                    let btn = new SquareButton('' + r, 0x00ff00);
                    btn.data = r;
                    btn.callback = () => { this.loadLevel(btn.data); };
                    this.scrollPanel.push(btn);
                    this.buttons.push(btn);
                }
                this.isBusy = false;
            };

            LevelLoader.listLevels(onLevelListLoaded);
        }

        touchDown(p:Point) {

            if(this.isBusy)
                return;

            this.scrollPanel.touchDown(p);

            for(let b of this.buttons) {
                if(b.hitTestPoint(p.toPixi())) {
                    b.callback();
                }
            }

            let pp = p.clone();
            pp.subtract(new Point(APP_WIDTH/2, APP_HEIGHT / 2));
            if(Math.abs(pp.x) > 200 || Math.abs(pp.y) > 300) {
                this.visible = false;
            }
        }

        touchMove(p:Point) {
            this.scrollPanel.touchMove(p);
        }

        touchUp(p:Point) {
            this.scrollPanel.touchUp(p);
        }
    }
}