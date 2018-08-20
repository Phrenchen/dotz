import { AvailableDialogs } from "./AvailableDialogs";
import { DialogProperties } from "./DialogProperties";
import { Colors, VisualHelper } from "../../../helper/VisualHelper";
import { EventEmitter } from "events";
import { DialogEvent } from "./DialogEvent";
import { TextFormats, TextFormatType, ScreenAnchor, Alignment } from "../TextFormats";
import { Rectangle, Point } from "pixi.js";
import { AssetConsts } from "../../AssetConsts";


export class Dialog extends EventEmitter{

    public id:AvailableDialogs;
    protected properties:DialogProperties;
    
    public disp:PIXI.Container = new PIXI.Container();
    protected background:PIXI.Sprite;
    protected padding:number = 5;

    private closeDialogTimeoutID:number = -1;

    protected txtTitle:PIXI.Text;
    protected txtDescription:PIXI.Text;
    protected btnOk:PIXI.Container = new PIXI.Container();
    
    constructor(id:AvailableDialogs){
        super();

        this.id = id;
    }
    
    protected init():void{
       
        // add text etc.
        let elements:Array<PIXI.Container> = new Array<PIXI.Container>();
        
        this.txtTitle = new PIXI.Text(this.properties.txtTitle, TextFormats.getFormat(TextFormatType.title));
        this.disp.addChild(this.txtTitle);
        elements.push(this.txtTitle);
        
        this.txtDescription = new PIXI.Text(this.properties.txtDescription, TextFormats.getFormat(TextFormatType.default));
        this.disp.addChild(this.txtDescription);
        elements.push(this.txtDescription);

        this.btnOk = VisualHelper.createLabeledButton("ok", 50, 50, Colors.lightGrey);
        this.btnOk.on("pointerup", (e) =>{ this.onClick(e); });
        this.disp.addChild(this.btnOk);
        elements.push(this.btnOk);

        //VisualHelper.align(elements, ScreenAnchor.centerLeft, Alignment.horizontal, new Rectangle(0, 0, this.properties.dialogWidth, this.properties.dialogHeight));
        VisualHelper.align(elements, ScreenAnchor.topCenter, Alignment.vertical, 
                            new Rectangle(0, 0, this.background.width, this.background.height), 
                            new Point(0, 100), new Point(0, 80));
    }

    protected onClick(e):void{ 
        // override
    }

    protected drawBackground():void{
        let textures = PIXI.loader.resources[AssetConsts.SPRITESHEET_LAUNCHER].textures as any;
        this.background = new PIXI.Sprite( textures[AssetConsts.ASSET_DIALOG_BACKGROUND] );
        //this.background.width = this.properties.dialogWidth;
        //this.background.height = this.properties.dialogHeight;
        this.disp.addChild(this.background);
    }

    public setProperties(p:DialogProperties):void{
        this.properties = p;
        if(this.properties){
            console.log("setProperties for dialog");
            this.drawBackground();
            this.init();
        }
        else{
            console.log("no properties found for dialog: " + p.txtTitle);
        }
    }

    public show():void{
        console.log("show dialog: " + this.properties);
        this.disp.visible = true;

        // check if dialog should automatically close after a short while
        if(this.properties.autoCloseInSeconds > 0){
            this.closeDialogTimeoutID = window.setTimeout(()=>{ 
                this.emit(DialogEvent.CLOSE_DIALOG, this.id); 
            }, this.properties.autoCloseInSeconds * 1000);

        }
    }

    public hide():void{
        console.log("hide dialog");
        this.disp.visible = false;

        if(this.closeDialogTimeoutID != -1){
            window.clearTimeout(this.closeDialogTimeoutID);
            this.closeDialogTimeoutID = -1;
        }

        this.emit(DialogEvent.CLOSE_DIALOG, this.id); 
    }
}