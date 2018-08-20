//import { CommunicationManager } from "./../CommunicationManager";
//import { GlobalAppData } from "./../GlobalAppData";
import { Launcher } from "./Launcher";
import { Swarm } from "./swarm/Swarm";
import { Vector2D } from "./swarm/Vector2D";
import { Alignment } from "./gui/TextFormats";



export interface LaunchPadProperties{
    ownerID:number;
    numRows:number;
    numColumns:number;
    numGapX:number;
    numGapY:number;
}


/** 
 * Launchpad contains launchers with ammo and cooldown
 * they do not represent the spawn location for swarms
*/
export class LaunchPad extends PIXI.utils.EventEmitter{
    
    public container:PIXI.Container;
    public properties:LaunchPadProperties;
    
    private unselectedFilter:any;
    private selectedButton:PIXI.Sprite;

    private mapItemTypeToTexture:Array<PIXI.Texture> = new Array<PIXI.Texture>();

    private parentContainer:PIXI.Container;
    private emitToLeft: boolean;
    private panelWidth:number = 300;
    private panelHeight:number = 140;
    private imageOffsetX:number = 0;
    private imageOffsetY:number = 0;

    private txtTitle:PIXI.Text;

    public launchers:Array<Launcher> = new Array<Launcher>();

    public id:number;

    private static padCounter:number = 0;

    constructor(properties:LaunchPadProperties){
        super();
        this.id = LaunchPad.padCounter++;
        this.properties = properties;
        this.unselectedFilter = new PIXI.filters.BlurFilter(1);
    }

    // called each frame
    public update():void{
        this.launchers.forEach(element => {
            element.update();
        });
    }

    public canFire():boolean{
        let canFire:boolean = false;
        this.launchers.map((launcher) => {
            if(launcher.canFire()){
                canFire = true;
            }
        });
        return canFire;
    }

    public fireLauncher(ownerID:number):boolean{
        let launcher:Launcher = this.getLauncherByOwnerID(ownerID);
        return launcher.fire();
    }
    public autoFireLauncher(ownerID:number, ammo:number = 2, delay:number = 1):boolean{
        let launcher:Launcher = this.getLauncherByOwnerID(ownerID);
        return launcher.autoFire(ammo, delay);
    }

    private getLauncherByOwnerID(ownerID:number):Launcher{
        let l:Launcher = this.launchers[0];     // assuming there is always at least 1 launcher available for every LaunchPad

        this.launchers.map((launcher) => {
            if(launcher.ownerID === ownerID){
                l = launcher;
            }
        });
        return l;
    }


    public getLauncherPositionByID(launcherID: number): Vector2D {
        return this.getPositionOfLauncher( this.getLauncherByOwnerID(launcherID) );
    }

    private getPositionOfLauncher(l:Launcher):Vector2D{
        return new Vector2D(this.container.x + l.disp.x - l.disp.width * .5, 
            this.container.y + l.disp.y - l.disp.height * .5
          );
    }

    public containerWidth():number{
        return this.container.width > 0 ? this.container.width : 130;
    }

    public hasSelectedItem():boolean{
        return this.selectedButton != null;
    }

    public getSelectedItemType():number{
        let itemType:number = this.mapItemTypeToTexture.indexOf(this.selectedButton.texture);
        return itemType >= 0 ? itemType : 0;        // if no selected button texture, use default itemType 0
    }

    
    public init(pContainer:PIXI.Container, emitToLeft:boolean):void{
        this.parentContainer = pContainer;
        this.container = new PIXI.Container();
        this.parentContainer.addChild(this.container);
        this.emitToLeft = emitToLeft;

        this.createLaunchers();
        this.updateOnStageResize();
    }

    public updateOnStageResize():void{
        //console.log("updating action panel position after stage resize: " + GlobalAppData.APP_RENDERER.width + " / " + GlobalAppData.APP_RENDERER.height);
        //this.container.x = GlobalAppData.APP_RENDERER.width / 2 - (this.container.width / 2);
        //this.container.y = GlobalAppData.APP_RENDERER.height - this.container.height;
    }

    // PRIVATE
    private createLaunchers():void{ 
        let l:Launcher;
        let counter:number = 0;

        for(let c:number = 0; c<this.properties.numColumns; c++){
            for(let r:number = 0; r<this.properties.numRows; r++){
                l = new Launcher(counter++, this.properties.ownerID);
                l.on("launch", (ownerID)=>{
                    this.emit("create_swarm", ownerID);}
                );
                
                l.disp.x = c * (l.disp.width + c * this.properties.numGapX);
                l.disp.y = r * (l.disp.height + r * this.properties.numGapY);
                this.container.addChild(l.disp);

                l.setReady();

                this.launchers.push(l);
            }
        }
    }
}