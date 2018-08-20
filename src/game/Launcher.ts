import { EventEmitter } from "stream";
import { AssetConsts } from "./AssetConsts";
import { Texture } from "pixi.js";
import { GameConsts } from "./GameConsts";

enum LauncherStatusEnum{
    READY = 0,
    EMPTY,
    LOADING
};

export class LauncherStatus{
    public static onClick(launcher:Launcher):boolean{
        let didFire:boolean = false;

        switch(launcher.state){
            case LauncherStatusEnum.EMPTY:
                console.log("launcher is empty");
                break;
            case LauncherStatusEnum.LOADING:
                console.log("launcher is loading");
                break;
            case LauncherStatusEnum.READY:
                //console.log("launcher is ready to fire: owner: " + launcher.ownerID);       // only npc use launchers right now.
                
                if(launcher.ammo > 0){
                    launcher.fire();
                    didFire = true;
                }
                else{
                    // final state: empty, until resupplied
                    launcher.setEmpty();
                }
                break;
            default: 
                console.log("no valid state found. what to do? ignore?");
                break;
        }
        return didFire;
    }
}

export class Launcher extends PIXI.utils.EventEmitter{
    public id: number;
    public ownerID:number;

    public disp:PIXI.Container;
    public state:LauncherStatusEnum = LauncherStatusEnum.EMPTY;
    
    public ammo:number = 1;
    public isAutoFiring:boolean = false;
    public reloadTimeStart:number;                  // Date.now()
    public maxReloadDuration:number = 1000;        // milliseconds

    private background:PIXI.Sprite;
    

    constructor(id:number, ownerID:number){
        super();
        this.id = id;
        this.ownerID = ownerID;
        this.disp = new PIXI.Container();

        let textures = PIXI.loader.resources[AssetConsts.SPRITESHEET_LAUNCHER].textures as any;
        
        //TODO: dirty way of selecting a texture via ownerID :/
        let textureName:string = AssetConsts.getLauncherNameByID(this.ownerID);
        this.background = new PIXI.Sprite( textures[ textureName] );
        this.background.name = "launcher_" + this.id;
        //this.background.x -= this.background.width * .5;
        this.background.y -= this.background.height * .5;
  
        //this.disp.addChild(this.background);

        //this.background.visible = false;
        
        this.initButton(this.background);
        this.setReady();
    }

    public canFire():boolean{
        return this.state === LauncherStatusEnum.READY;
    }

    /**
     * 
     * @param delay 
     * @param ammo 
     * @returns did it actually fire?
     */
    public autoFire(ammo:number, delay:number):boolean{
        //console.log("auto fire");
        this.ammo = ammo;
        this.maxReloadDuration = delay;
        this.isAutoFiring = true;
        return LauncherStatus.onClick(this);
    }

    // called every frame
    public update():void{
        // if loading, check remaining duration
        switch(this.state){
            case LauncherStatusEnum.LOADING:
                let currentTime:number = Date.now();
                let currentLoadingDuration:number = currentTime - this.reloadTimeStart;
                let percentLoaded:number = currentLoadingDuration / this.maxReloadDuration;

                if(currentLoadingDuration >= this.maxReloadDuration){
                    //console.log("changing state from loading to ready: ");
                    this.setReady();
                }
                break;
            case LauncherStatusEnum.READY:
                if(this.isAutoFiring)
                {
                    //console.log("fire again! you have enough ammo!");
                    LauncherStatus.onClick(this);
                }
            case LauncherStatusEnum.EMPTY:
                break;
            default:
                break;
        }
        
    }

    private initButton(sprite:PIXI.Sprite):void{
        sprite.interactive = true;
        sprite.buttonMode = false;
       
        sprite.on("pointerup", (e) =>{ this.onClick(e); });
    }

     private onClick(e):void{
        // check own state. launch-ready, on-cooldown, empty
        LauncherStatus.onClick(this);
    }
    
    public fire():boolean{
        if(this.canFire()){
            this.state = LauncherStatusEnum.LOADING;
            this.background.visible = true;
            this.ammo -= 1;
            this.reloadTimeStart = Date.now();
            this.emit("launch", this.ownerID);
            return true;
        }
        return false;
    }

    public setEmpty():void{
        //console.log("xxx empty launcher at: " + this.id);
        this.state = LauncherStatusEnum.EMPTY;
        this.background.visible = true;
        this.isAutoFiring = false;
    }

    public setReady():void{
        //console.log("xxx ready");
        this.state = LauncherStatusEnum.READY;
        this.background.visible = true;
    }
}