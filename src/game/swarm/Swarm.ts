import { Vector2D } from "./Vector2D";
import { Unit } from "./Unit";
import { MathHelper } from "../../helper/MathHelper";
import { VisualHelper } from "../../helper/VisualHelper";
import { AssetConsts } from "../AssetConsts";
import { SwarmConsts } from "./SwarmConsts";
import { DebugHelper } from "../../helper/DebugHelper";
import { PlayerUnit } from "./PlayerUnit";
import { GlobalAppData } from "../GlobalAppData";
import { DetailInfos } from "../gui/DetailInfos";
import { GameEvents } from "../GameEvents";

import * as GSAP from "gsap";
import { Point } from "pixi.js";
import { SwarmProperties, UnitType } from "../model/SwarmConfigTypes";
import { SwarmFactory } from "./SwarmFactory";

/**
 * consists of units, following the same strategy (flee, seek,...)
 * 
 * notifies listeners when a change of strategy is due:
 *      - all units carry FOOD
 *      - enemy nearby
 *      - no units left -> swarm dies
 */
export class Swarm extends PIXI.utils.EventEmitter{
    public properties: SwarmProperties;
    public units:Array<Unit> = new Array<Unit>();
    public currentTargetSwarm:Swarm | null;
    
    private container:PIXI.Container;
    private factory:SwarmFactory;
    public visitedSwarms:Array<number> = new Array<number>();
    
    private detailOffset:Vector2D = new Vector2D(50,0);
    private arrivalDistance:number = 1;
    private detailInfos: DetailInfos;
    private invisibleOrigin:PIXI.Sprite;
    private connectorGraphics:PIXI.Graphics = new PIXI.Graphics();

    public hasArrived:boolean = true;

    constructor(properties:SwarmProperties, container:PIXI.Container, factory:SwarmFactory){
        super();

        this.properties = properties;
        this.container = container;
        this.factory = factory;
        
        this.container.addChild(this.connectorGraphics);
        let textures = PIXI.loader.resources[AssetConsts.SPRITESHEET_LAUNCHER].textures as any;
        this.invisibleOrigin = new PIXI.Sprite( textures[AssetConsts.getLauncherNameByID(this.properties.ownerID)] );
        this.container.addChild(this.invisibleOrigin);
        
        this.properties.currentTargetSwarmLocation = this.properties.origin;

        this.createUnits();
        this.createDetailInfos();
        this.hideDetails();

        this.updateUnitsAliveCount();

        // TODO: use this? show swarm origin permanently?
        this.invisibleOrigin.visible = false;
    }

    public dispose():void{
        // dispose units
        this.units.map((unit) => {
            unit.dispose();
        });
    }

    public currentUnitsAliveCount():number{
        return this.properties.currentUnitsAliveCount;
    }

    private updateUnitsAliveCount():void{
        let aliveCounter:number = 0;

        this.units.forEach(element => {
            if(element.isAlive()){
                aliveCounter++;
            }
        });

        // dispatch unit count update for UI if amount changes
        let oldAmount:number = this.properties.currentUnitsAliveCount;

        if(oldAmount != aliveCounter){
            this.properties.currentUnitsAliveCount = aliveCounter;

            
        }

    }

    private createDetailInfos():void{
        this.detailInfos = new DetailInfos(this.properties);
        this.container.addChild(this.detailInfos.disp);
    }

    public setTargetSwarm(s:Swarm):void{
        this.currentTargetSwarm = s;
        this.properties.currentTargetSwarmLocation = s.properties.origin;
    }

    public hasUntargetedUnits():boolean{
        let result:boolean = false;

        this.units.forEach(element => {
            if(!element.hasBeenTargeted){
                result = true;
            }    
        });

        return result;
    }

    public resetVisitedSwarms():void{
        this.visitedSwarms.length = 0;      // forget about visited swarms
    }

    public isPlayerControlled():boolean{
        return this.properties.ownerID > 0;
    }

    public showDetails():void{
        this.detailInfos.disp.x = this.properties.origin.x + this.detailOffset.x;
        this.detailInfos.disp.y = this.properties.origin.y + this.detailOffset.y;
        this.detailInfos.disp.visible = true;
    }

    public hideDetails():void{
        this.detailInfos.disp.visible = false;
        this.connectorGraphics.clear();
    }

    
    private createUnits():void{
        let unit:Unit;
        let positions:Array<Vector2D> = this.getPositions(this.properties.positioningMode);
        let containerOffset:Vector2D = new Vector2D(this.container.x, this.container.y);
        
        for(let i:number = 0; i < this.properties.maxUnitCount; i++){
            unit = this.factory.createUnit(this.properties);
            unit.position = positions[i];
            unit.maxSpeed = this.properties.maxSpeed;
            this.container.addChild(unit.disp);
            this.units.push(unit);
            
            //unit.disp.scale = 0;
            GSAP.TweenLite.fromTo(unit.disp, .4, {alpha:"0" }, {alpha:"1", ease:GSAP.Sine.easeOut});
        }
    }
    
    private getPositions(mode:string):Array<Vector2D>{
        let positions:Array<Vector2D> = new Array<Vector2D>();
        let offsetX:number;
        let offsetY:number;

        switch(this.properties.positioningMode){
            case "random":                              //TODO: enums
                for(let i:number = 0; i < this.properties.maxUnitCount; i++){
                    offsetX = MathHelper.getRandomInt(0, 2 * this.properties.spawnRadius) - this.properties.spawnRadius;
                    offsetY = MathHelper.getRandomInt(0, 2 * this.properties.spawnRadius) - this.properties.spawnRadius;
                    
                    let position:Vector2D = new Vector2D( this.properties.origin.x + offsetX,  this.properties.origin.y + offsetY);
                    positions.push(position);
                }
                break;
            case "circle":
            default:
                positions = VisualHelper.calculatePositionsOnCircle(this.properties.maxUnitCount, this.properties.spawnRadius);
                
                for(let i:number = 0; i < this.properties.maxUnitCount; i++){
                    offsetX = positions[i].x;
                    offsetY = positions[i].y;

                    let position:Vector2D = new Vector2D( this.properties.origin.x + offsetX,  this.properties.origin.y + offsetY);
                    positions[i] = position;
                }
                break;
        }
        
        return positions;
    }

    public getNextUntargetedUnit():Unit{
        for(let i:number = 0; i<this.units.length; i++){
            if(!this.units[i].hasBeenTargeted){
                return this.units[i];
            }
        }
        return null;
    }

    public update(pointerPosition:Vector2D):void{
        let distanceToTargetUnit:number;
        
        // calculate average center of swarm
        let sumX:number = 0;
        let sumY:number = 0;
        this.units.map((unit) => {
            sumX += unit.position.x;
            sumY += unit.position.y;
        });
        
        let centerX:number = sumX / this.units.length;
        let centerY:number = sumY / this.units.length;
        
        this.properties.origin.x = centerX;
        this.properties.origin.y = centerY;

        if(this.properties.behaviorTree){
            this.properties.behaviorTree.update();
        }

        if(this.properties.unitType != UnitType.ENEMY && this.properties.unitType != UnitType.PLAYER){     // temporary case until all behaviortrees have been implemented
            this.units.forEach(element => {
                if(this.currentTargetSwarm != null){
                    if(element.targetUnit == null){
                        // randomly select next untargeted unit
                        element.setTargetUnit(this.currentTargetSwarm.getNextUntargetedUnit());
                        
                        if(element.targetUnit){
                            let distance:number = element.position.dist(element.targetUnit.position);

                            //console.log("tried to find a free target unit in currentTargetSwarm but couldn´t find any -> flocking");
                            element.seek(element.targetUnit.position);
                        }
                        else{
                            //element.flock(this.units);
                        }
                    }
                }
                else{
                    if(this.isPlayerControlled()){
                        //console.log("flocking player controlled swarm: " + this.properties.id);
                        //element.flock(this.units);
                        //element.arrive(pointerPosition);
                        //element.wander();
                        element.velocity.x = 0;
                        element.velocity.y = 0;
                    }
                    else if(this.properties.unitType == UnitType.ENEMY){
                        element.flock(this.units);
                    }
                }
                element.update();
    
            });

        }
        
        if(this.checkArrivals()){
            //console.log("all swarm units have arrived. seek next target or flock?");
        }
        
        this.invisibleOrigin.x = this.properties.origin.x;
        this.invisibleOrigin.y = this.properties.origin.y;
        this.invisibleOrigin.x -= this.invisibleOrigin.width * .5; 
        this.invisibleOrigin.y -= this.invisibleOrigin.height * .5;
        
        if(this.showConnector()){
            this.showConnectors(pointerPosition);
        }
        
        this.updateUnitsAliveCount();

        this.detailInfos.update();

        this.checkExtinction();
    }

    private showConnector():boolean{
        return this.isPlayerControlled();
    }
    
    public checkUnitArrival(unit:Unit):boolean{
        //console.log("checking unit arrival");
        if(unit.targetUnit){
            return unit.position.dist(unit.targetUnit.position) < this.arrivalDistance;
        }
        else if(unit.targetPosition){
            return unit.position.dist(unit.targetPosition) < this.arrivalDistance;
        }
        return true;        // no target
    }

    private checkArrivals():boolean{
        let arrivalCounter:number = 0;
         
        this.units.forEach((unit) => {
            if(this.checkUnitArrival(unit)){
                arrivalCounter++;
                
                if(this.properties.unitType == UnitType.ENEMY){
                    //console.log("unit has arrived");
                }
                
                if(unit.targetUnit && unit.targetUnit.isAlive()){
                    this.applyDamage(unit.targetUnit);
                }

                if(unit.targetUnit && !unit.targetUnit.isAlive()){     // check isAlive after applying damage
                    //console.log("unit killed");
                    unit.targetUnit.hide();
                    unit.targetUnit = null;

                    if(unit.targetUnit){
                        if(unit.targetUnit.isPlayerUnit){
                            this.properties.enemyKillCount++;       // data in store    dont change here
                            this.emit(GameEvents.PLAYER_UNIT_DEAD, this.properties.ownerID);
                        }
                        else{
                            this.properties.foodCollectCount++;     // data in store    dont change here
                            this.emit(GameEvents.FOOD_COLLECTED, this.properties.ownerID);
                        }
                    }
                }
            }
        });

        this.hasArrived = arrivalCounter == this.units.length;       // have all units arrived?

            /*
            if(unit.targetUnit != null){
                //console.log("---");
                if(unit.position.dist(unit.targetUnit.position) > this.arrivalDistance){
                    //console.log("not arrived yet");
                    hasArrived = false;
                }
                else{
                    if(unit.targetUnit.isAlive()){
                        this.applyDamage(unit.targetUnit);
    
                        // TODO: move data update to a better place!
                        if(!unit.targetUnit.isAlive()){
                            //console.log("player unit killed");

                            unit.targetUnit.hide();
                            
                            if(unit.targetUnit.isPlayerUnit){
                                this.properties.enemyKillCount++;       // data in store    dont change here
                                this.emit(GameEvents.PLAYER_UNIT_DEAD, this.properties.ownerID);
                            }
                            else{
                                this.properties.foodCollectCount++;     // data in store    dont change here
                                this.emit(GameEvents.FOOD_COLLECTED, this.properties.ownerID);
                            }
                        }
                    }
                    unit.targetUnit = null;                  // targetUnit is damaged once and "forgotten". follow-up orders here please
                }
            }
            else{
                //console.log("no targetUnit");
                unit.flock(this.units);
                hasArrived = true;
            }
            */

        if(this.hasArrived){
            // check if every unit in the targetSwarm has been reached by an own unit
            //if(this.currentTargetSwarm){
                //console.log("------> need next target -> every unit has reached it´s target");
                if(this.currentTargetSwarm){
                    this.visitedSwarms.push(this.currentTargetSwarm.properties.id);      // remember last targetID
                    this.currentTargetSwarm = null;                                      // clear target
                }
                this.units.map((unit) => {
                    unit.targetUnit = null;
                    unit.targetPosition = null;
                });

                this.emit(SwarmConsts.ARRIVED_AT_TARGET, this.properties.id);
            //}
        }
        return this.hasArrived;
    }

    private applyDamage(targetUnit:Unit):void{
        targetUnit.applyDamage(Number.MAX_VALUE);

        if(!targetUnit.isAlive()){
            // target unit died
            // emit with playerID
            
        }
    }

    private checkExtinction():void{
        // check every unit if it is alive
        // remove dead units
        if(!this.properties.isAlive){
            return;
        }
        // swarm is still alive, could go extinct though
        this.units.forEach(element => {
            if(!element.isAlive()){
                this.units.splice(this.units.indexOf(element), 1);
                //console.log("removing dead unit. living units in swarm " + this.properties.id + ": " + this.units.length);
            }
        });


        if(this.units.length == 0){
            //console.log("dispatch event of swarm gone extinct -> no units left")
            this.properties.isAlive = false;
            this.invisibleOrigin.visible = false;
            
            if(!this.isPlayerControlled()){
                this.hideDetails();
            }

            this.emit(SwarmConsts.ON_EXTINCTION, this.properties.id);
        }
    }

    public resetUnits():void{
        this.units.forEach(element => {
            element.reset();
            element.hasBeenTargeted = false;
        });
    }

    private showConnectors(pointerPosition:Vector2D):void{
        this.connectorGraphics.clear();
        //this.connectorGraphics.lineStyle(2, 0xFFFFFF, 1);

        // draw green line from mouse position to own center
        //this.connectorGraphics.moveTo(pointerPosition.x, pointerPosition.y);
        //this.connectorGraphics.lineTo(this.properties.origin.x, this.properties.origin.y)

        if(this.currentTargetSwarm != null){
            // draw red line from own origin to current target origin
            //this.connectorGraphics.lineStyle(2, this.properties.connectorColor, .7);
            //this.connectorGraphics.moveTo(this.properties.origin.x, this.properties.origin.y);
            //this.connectorGraphics.lineTo(this.currentTargetSwarm.properties.origin.x, this.currentTargetSwarm.properties.origin.y);

            // draw x directional arrows in intervals
            //this.drawArrows();
        }
    }

    // TODO: draw direction arrows along the path to the target swarm to indicate the intention of each player swarm
    /*
        such as: ---->---->
     */
    /*
    private drawArrows():void{
        if(!this.currentTargetSwarm){
            return;
        }

        let arrowOffset:number = 30;
        let ownPosition:Vector2D = new Vector2D(this.properties.origin.x, this.properties.origin.y);
        let targetPosition:Vector2D = new Vector2D(this.currentTargetSwarm.properties.origin.x, this.currentTargetSwarm.properties.origin.y);
        
        
        let distX:number = ownPosition.x - targetPosition.x;
        let distY:number = ownPosition.y - targetPosition.y;


        let distance:number = ownPosition.dist(targetPosition);
        let numArrows:number = Math.floor(arrowOffset / distance);
        
        // find points on line
        let centerPosX:number = ownPosition.x + (targetPosition.x - ownPosition.x) * .5;
        let centerPosY:number = ownPosition.y + (targetPosition.y - ownPosition.y) * .5;
        

    }
    */

    


    public updateOnStageResize(width:number, height:number):void{
        this.units.forEach(element => {
            element.stageWidth = width;
            element.stageHeight = height;
        });
        
        /*if(!GlobalAppData.APP_RENDERER){
            return;
        }
        console.log(GlobalAppData.APP_RENDERER.screen.width, GlobalAppData.APP_RENDERER.screen.height);
        this.units.forEach(element => {
            element.stageWidth = GlobalAppData.APP_RENDERER.screen.width;
            element.stageHeight = GlobalAppData.APP_RENDERER.screen.height;
        });
        */
    }
}