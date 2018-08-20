import { VisualHelper, Colors } from "../../helper/VisualHelper";
import { GlobalAppData } from "../GlobalAppData";
import { TextFormats, TextFormatType } from "./../gui/TextFormats";

/**
 * handles hud elements
 */

export class Hud{
    public disp:PIXI.Container;

    // top bar
    private topBar: PIXI.Container;
    private background: PIXI.Graphics;
    private topBarText:PIXI.Text;
    


    constructor(container:PIXI.Container){
        this.disp = container;
        
        this.init();
    }
    
    
    public update():void{
        
    }
    
    private init():void{
        // permanently visible top bar
        this.topBar = new PIXI.Container();
        this.disp.addChild(this.topBar);
        
        //this.initTopbar();
        
    }
    
    private initTopbar(): void {
        let padding:number = 10;
        
        this.topBarText = new PIXI.Text(this.getBasicInfoText(), TextFormats.getFormat(TextFormatType.default));
        this.topBarText.x = GlobalAppData.APP_RENDERER.screen.width * .5 - this.topBarText.width * .5;
        this.topBarText.y = padding;
        this.topBarText.resolution = 2;
        this.background = VisualHelper.createRectangleGraphic(GlobalAppData.APP_RENDERER.screen.width,
            this.topBarText.y + this.topBarText.height + padding,
            Colors.darkGrey, 1, 0
        );
        

        this.topBar.addChild(this.background);
        this.topBar.addChild(this.topBarText);
    }

    private getBasicInfoText():string{
        return "swarms!\neach player spawns a swarm which seeks food or tries to kill the enemy swarm";
    }
    
}