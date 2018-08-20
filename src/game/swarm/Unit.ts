import { AssetConsts } from "./../AssetConsts";
import { SteeredVehicle } from "./SteeredVehicle";
import { Vector2D } from "./Vector2D";



export class Unit extends SteeredVehicle{
    
    public isPlayerUnit:boolean;
    public hitpoints:number = 100;
    public disp:PIXI.Container = new PIXI.Container();
    protected sprite:PIXI.Sprite;
    protected unitColor:number;
    public targetUnit:Unit | null;
    public targetPosition:Vector2D | null;
    public hasBeenTargeted:boolean = false;

    constructor(skin:string, isPlayerUnit:boolean, unitColor:number){
        super();
        this.isPlayerUnit = isPlayerUnit;
        this.unitColor = unitColor;

        this.disp.pivot.x = .5;
        this.disp.pivot.y = .5;
        let textures = PIXI.loader.resources[AssetConsts.SPRITESHEET_LAUNCHER].textures as any;
        this.sprite = new PIXI.Sprite( textures[skin] );

        // color transform with unitColor
        this.changeColor(this.unitColor);

        this.sprite.pivot.x = .5;
        this.sprite.pivot.y = .5;
       
        this.sprite.scale.x = .3;
        this.sprite.scale.y = .3;

        this.disp.addChild(this.sprite);
    }

    private changeColor(color:number):void{
        this.sprite.tint = color;
    }

    public dispose():void{
        this.velocity.x = this.velocity.y = 0;
    }

    public update():void{
        super.update();
        this.disp.x = this.position.x;
        this.disp.y = this.position.y;
        
        if(this.targetUnit != null){
            if(!this.targetUnit.isAlive()){
                this.targetUnit.hasBeenTargeted = false;
                this.targetUnit = null;
            }
            if(this.isPlayerUnit){
                this.disp.scale.x = 1.2;
                this.disp.scale.y = 1.2;
                
            }
            if(this.targetUnit){
                this.seek(this.targetUnit.position);
            }
        }
        else if(this.targetPosition != null){
            this.seek(this.targetPosition);
        }
        else{
            if(this.isPlayerUnit){
                this.disp.scale.x = .5;
                this.disp.scale.y = .5;
            }
        }
    }

    public setTargetUnit(unit):void{
        this.targetUnit = unit;
        if(unit){
            unit.hasBeenTargeted = true;
        }
    }

    public applyDamage(amount:number):boolean{
        this.hitpoints = Math.max(0, this.hitpoints - amount);
        return this.isAlive();
    }

    public reset():void{
        this.sprite.scale.x = .3;
        this.sprite.scale.y = .3;
        this.disp.visible = true;
    }

    public hide():void{
        this.disp.visible = false;
    }

    public isAlive():boolean{
        return this.hitpoints > 0;
    }
}