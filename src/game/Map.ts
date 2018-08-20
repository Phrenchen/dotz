/**
 * reads map layout from CommunicationManager. if offline, the manager will provide static data
 */

import { LaunchPad, LaunchPadProperties } from "./LaunchPad";
import { SwarmFactory } from "./swarm/SwarmFactory";
import { Swarm } from "./swarm/Swarm";
import { Vector2D } from "./swarm/Vector2D";
import { MapProperties } from "./MapProperties";
import { MathHelper } from "../helper/MathHelper";
import { AssetConsts } from "./AssetConsts";
import { VisualHelper, Colors } from "../helper/VisualHelper";
import { GlobalAppData } from "./GlobalAppData";
import { GameConsts } from "./GameConsts";
import { SwarmBehaviour } from "./swarm/SwarmBehaviour";
//import { DebugHelper } from "../helper/DebugHelper";
import { SwarmConsts } from "./swarm/SwarmConsts";
import { lchmod } from "fs";
import { ScreenAnchor, Alignment } from "./gui/TextFormats";
import { GameEvents } from "./GameEvents";
import { EventEmitter } from "events";
import { Rectangle } from "pixi.js";
import { GameData } from "./model/GameData";
import { PlayerVO } from "./model/PlayerVO";
import { InputControl } from "./InputControl";
import ColorConsts from "../ColorConsts";
import { isUndefined } from "util";
import { SwarmBehaviourTree } from "../swe/SwarmBehaviourTree";
import { UnitType } from "./model/SwarmConfigTypes";

export class Map extends EventEmitter {
    public disp: PIXI.Container;
    private background: PIXI.Graphics;
    private swarmFactory: SwarmFactory;
    private properties: MapProperties;

    private launchPads: Array<LaunchPad> = new Array<LaunchPad>();

    private swarms: Array<Swarm> = new Array<Swarm>();
    private foodSwarmIDs: Array<number> = new Array<number>();
    private pointerPosition: Vector2D = new Vector2D();
    private connectorGraphics: PIXI.Graphics = new PIXI.Graphics();

    private inputControl:InputControl;

    private isGameOver:boolean = false;     // only needed because removing listeners fails? TODO: dispose InputControl
    private debugGraphics: PIXI.Graphics = new PIXI.Graphics();

    constructor(container: PIXI.Container, swarmFactory: SwarmFactory, properties: MapProperties) {
        super();

        this.disp = container;
        this.swarmFactory = swarmFactory;
        this.properties = properties;

        // add initially present swarms to SwarmData via SwarmFactory

        // map adds swarm data to model. there must be a better place and way to do this?
        // idea: add swarms to central storage place...good idea?
        let numSwarms: number = this.properties.swarms.length;

        for (let i: number = 0; i < numSwarms; i++) {
            //console.log(this.properties.swarms[i]);
            this.foodSwarmIDs.push(this.swarmFactory.swarmData.addSwarmDef(this.properties.swarms[i]));
        }
        this.init();
    }

    public dispose():void{
        // dispose swarms
        this.swarms.map((swarm) => {
            swarm.dispose();
        });

        this.isGameOver = true;

        this.inputControl.removeAllListeners(GameEvents.TOUCH_START);
        this.inputControl.removeAllListeners(GameEvents.TOUCH_END);
        this.swarms.length = 0;     // forget about old swarms
    }

    public getRemainingFood():number{
        return  this.swarmFactory.countUnitsAlive(this.swarms, GameConsts.ID_FOOD);
    }
    
    public getRemainingEnemies():number{
        return this.swarmFactory.countUnitsAlive(this.swarms, GameConsts.ID_ENEMY_SOLDIER);
    }

    // called from UI via Game...
    public spawnSwarm(ownerID:number):boolean{
        let launchpad:LaunchPad = this.getLauncherPadByID(ownerID);
        //launchpad.autoFireLauncher(ownerID, )
        return launchpad.fireLauncher(ownerID);
    }

    // assets available
    private init(): void {
        this.createBackground();

        this.disp.addChild(this.connectorGraphics);

        // create launchpad for each player
        let pad: LaunchPad;
        let position: Vector2D;
        let playerPosition: number = 0;   // range 1-4
        let viewport: Rectangle = new Rectangle();
        viewport.width = GlobalAppData.APP_RENDERER.screen.width;
        viewport.height = GlobalAppData.APP_RENDERER.screen.height;

        this.createFoodLaunchPad();
        this.createGuardSwarms();
        this.createFoodSwarms();
        
        this.initInputListener();
        
        this.disp.addChild(this.debugGraphics);
        
        // CONVENIENCE FEATURE:
        // automatically spawn a playerSwarm at pad 0 at launcher 0
        //this.properties.players.map((player) => {
            //this.onCreateSwarm(player.id, 0);
            //});
    }
        
    private createFoodLaunchPad():void{
        let pad:LaunchPad = this.createLaunchPad(GameConsts.ID_FOOD);
        let center:Vector2D = MathHelper.centerOfStage(GlobalAppData.APP_RENDERER.screen);
        pad.container.x = center.x;
        pad.container.y = center.y;
        
        //TODO: add these to the MapProperties
        //let didFire:boolean = pad.autoFireLauncher(GameConsts.ID_FOOD, this.properties.foodRefills, this.properties.foorRefillDelay);
        let didFire:boolean = pad.autoFireLauncher(GameConsts.ID_FOOD, 5, 500);
        //console.log("did it fire? " + didFire);
    }

    private createLaunchPad(ownerID: number): LaunchPad {
        let pad: LaunchPad = new LaunchPad(this.getLaunchPadPropertiesByOwnerID(ownerID));
        let lps: Array<LaunchPad> = this.launchPads;

        pad.on("create_swarm", (ownerID: number) => {
            this.onCreateSwarm(ownerID);                            // CLICKS ON LAUNCHPAD
        }
        );
        pad.init(this.disp, true);
        this.launchPads.push(pad);
        this.disp.addChild(pad.container);
        pad.updateOnStageResize();

        return pad;
    }

    private getPlayerOrigin(playerPosition: number, pad: LaunchPad, viewport: Rectangle, borderPadding: Vector2D = new Vector2D(50, 50)): Vector2D {
        let origin: Vector2D = new Vector2D();
        // positions of player depend on player count.
        // 1 player : bottom right
        // 2 players: bottom right, bottom left
        // 3 players: bottom right, bottom left, top left
        // 4 players: corners

        const bottomRight:Vector2D = new Vector2D(viewport.width - borderPadding.x - pad.container.width, viewport.height - borderPadding.y - pad.container.height);
        const bottomLeft:Vector2D = new Vector2D(borderPadding.x, viewport.height - borderPadding.y - pad.container.height);
        const topLeft:Vector2D = new Vector2D(borderPadding.x, borderPadding.y);
        const topRight:Vector2D = new Vector2D(viewport.width - borderPadding.x - pad.container.width, borderPadding.y);
        
        switch (playerPosition) {
            case 1:
                origin.x = bottomRight.x;
                origin.y = bottomRight.y;
                break;
            case 2:
                origin.x = bottomLeft.x;
                origin.y = bottomLeft.y;
                break;
            case 3:
                origin.x = topLeft.x;
                origin.y = topLeft.y;
                break;
            case 4:
                origin.x = topRight.x;
                origin.y = topRight.y;
                break;
        }
        return origin;
    }

    private getLaunchPadPropertiesByOwnerID(id: number): LaunchPadProperties {
        let lpp: LaunchPadProperties;

        switch (id) {
            case GameConsts.ID_FOOD:
                lpp = {
                    ownerID: GameConsts.ID_FOOD,
                    numRows: 1,
                    numColumns: 1,
                    numGapX: 0,
                    numGapY: 0
                }
                break;

            /*
            // unused
            case GameConsts.ID_PLAYER_4:
                lpp = {
                    ownerID: GameConsts.ID_PLAYER_4,
                    numRows: 1,
                    numColumns: 1,
                    numGapX: 0,
                    numGapY: 0
                }
                break;
            case GameConsts.ID_PLAYER_3:
                lpp = {
                    ownerID: GameConsts.ID_PLAYER_3,
                    numRows: 1,
                    numColumns: 1,
                    numGapX: 0,
                    numGapY: 0
                }
                break;
            case GameConsts.ID_PLAYER_2:
                lpp = {
                    ownerID: GameConsts.ID_PLAYER_2,
                    numRows: 1,
                    numColumns: 1,
                    numGapX: 0,
                    numGapY: 0
                }
                break;
            case GameConsts.ID_PLAYER_1:
            */
            default:
                lpp = {
                    ownerID: GameConsts.ID_PLAYER_1,
                    numRows: 1,
                    numColumns: 1,
                    numGapX: 0,
                    numGapY: 0
                }
                break;
        }
        return lpp;
    }

    private createBackground(): void {
        this.background = VisualHelper.createRectangleGraphic(GlobalAppData.viewport.width - this.disp.x,
            GlobalAppData.viewport.height - this.disp.y,
            Colors.red,
            .0,
            0);
        this.disp.addChild(this.background);
    }

    private initInputListener(): void {
        this.inputControl = new InputControl();
        this.inputControl.init(this.disp);

        this.inputControl.addListener(GameEvents.TOUCH_START, (position:Vector2D) =>{
            //this.showDetailsForNearestSwarm(position);
        });

        this.inputControl.addListener(GameEvents.TOUCH_END, (position:Vector2D) =>{
            //this.hideDetails();

            if(!this.isGameOver && this.properties.hasActivePlayer()){      // active player
                let swarm:Swarm = this.createSwarm(     // spawns new swarm
                    this.properties.getActivePlayerID(),
                    new Vector2D(position.x, position.y),
                    this.disp,
                    this.getColorByOwnerID(this.properties.getActivePlayerID())
                );
                this.addInitialTarget(swarm);           // add target
            }

        });

        this.disp.on("pointermove", (e) => { 
            this.updateMousePosition(e) 
        });
    }

    private updateMousePosition(e): void {
        this.pointerPosition.x = e.data.originalEvent.clientX;
        this.pointerPosition.y = e.data.originalEvent.clientY;
    }

    // SHOW / HIDE DETAILS
    
    // SHOW DETAILS FOR NEAREST SWARM
    private showDetailsForNearestSwarm(position:Vector2D):void{
        //console.log("-------- showDetailsForNearestSwarm ---------");
        //console.log("show details nearest swarm amongst: " + this.swarms.length);
        let swarm:Swarm = SwarmBehaviour.getNearestSwarmByPosition(position, this.swarms);
        if(swarm != null){
            swarm.showDetails();
        }
    }
    

    private hideDetails(): void {
        this.swarms.forEach(element => element.hideDetails());
    }

    // creates swarms of FOODs
    private createFoodSwarms(): void {
        let s: Swarm;
        let numSwarms: number = this.properties.swarms.length;

        for (let i: number = 0; i < numSwarms; i++) {
            s = this.swarmFactory.create(this.properties.swarms[i], this.disp);                                     // CREATE SWARM onMapStart
            console.log(s.properties);
            s.on(SwarmConsts.ON_EXTINCTION, (swarmID: number) => { this.onSwarmExtinction(swarmID); });
            //s.properties.behaviorTree = new SwarmBehaviourTree(s, this.swarms);       // does food need a behaviortree?
            //s.showDetails();                    // show food swarm details
            this.swarms.push(s);
        }
    }

    private createGuardSwarms():void{
        let guardSwarm:Swarm = this.swarmFactory.create({
                id: GameConsts.ID_ENEMY_SOLDIER,
                ownerID: GameConsts.ID_ENEMY_SOLDIER,
                unitColor: ColorConsts.UNIT_ENEMY,
                maxUnitCount: 50,

                targetSwarmID: -1,
                behaviorTree: null,

                currentUnitsAliveCount: 0,
                isAlive: true,
                unitLifeSpan: 10,
                maxSpeed: 1.4,
                wanderSpeed: .1,
                spawnRadius: 100,
                origin: new Vector2D(100, 100),
                currentTargetSwarmLocation: new Vector2D(),
                skin: AssetConsts.ASSET_UNIT_WORKER,
                positioningMode: "circle",
                unitType: UnitType.ENEMY,
                connectorColor: ColorConsts.UNIT_ENEMY,
                foodCollectCount: 0,
                enemyKillCount: 0
            }, this.disp
        );
        guardSwarm.properties.behaviorTree = new SwarmBehaviourTree(guardSwarm, this.swarms);
        this.swarms.push(guardSwarm);
    }

    // called from firing LaunchPad
    private onCreateSwarm(ownerID: number): void {
        let launcherPad: LaunchPad = this.getLauncherPadByID(ownerID);
        let position: Vector2D = launcherPad.getLauncherPositionByID(ownerID) as Vector2D;
        let unitColor:number = this.getColorByOwnerID(launcherPad.properties.ownerID);
        
        let swarm: Swarm = this.createSwarm(ownerID, position, this.disp, unitColor);
        
        //swarm.showDetails();                // show details for player swarms
        this.swarms.push(swarm);
        this.addInitialTarget(swarm);
    }

    private getColorByOwnerID(id:number):number{
        let color:number = undefined;
        if(id < 0){
            // npc unit
            switch(id){
                case GameConsts.ID_FOOD:
                    color = ColorConsts.UNIT_FOOD;
                    break;
                case GameConsts.ID_ENEMY_SOLDIER:
                    color = ColorConsts.UNIT_ENEMY;
                    break;
                default: break;
            }
        }
        else{
            // player unit
            this.properties.players.map((player) => {
                if(player.id === id){
                    color = player.playerColor;
                }
            });
        }
        return !isUndefined(color) ? color : 0xFF0000;
    }


    
    private createSwarm(ownerID:number, position:Vector2D, disp:PIXI.Container, unitColor:number):Swarm{
        let swarm:Swarm = this.swarmFactory.createByOwnerID(ownerID, position, disp, unitColor);   // CREATE player SWARM
        swarm.properties.behaviorTree = new SwarmBehaviourTree(swarm, this.swarms);
        swarm.on(SwarmConsts.ON_EXTINCTION, (swarmID: number) => {
            this.onSwarmExtinction(swarmID);
        });
        
        swarm.on(GameEvents.PLAYER_UNIT_DEAD, (ownerID: number) => {
            if (GameData.isPlayerSwarm(ownerID)) {
                this.emit(GameEvents.PLAYER_UNIT_DEAD, ownerID);
            }
        });
        
        swarm.on(GameEvents.FOOD_COLLECTED, (ownerID: number) => {
            this.emit(GameEvents.FOOD_COLLECTED, ownerID);
        });
        this.swarms.push(swarm);

        return swarm;
    }

    private onSwarmExtinction(swarmID: number): void {
        // only add swarmID to extinct swarms if it´s an npc swarm. ignore extinct playerSwarms for now
        let index: number = this.foodSwarmIDs.indexOf(swarmID);
        if (index != -1) {
            this.foodSwarmIDs.splice(index, 1);
        }
        else {
            this.emit(GameEvents.PLAYER_EXTINCT, swarmID);
        }

        /*
        if (this.FOODSwarmIDs.length == 0) {
            //console.log("*** game over *** all FOODs have been harvested");
            //TODO: add game over conditions
            this.emit(GameEvents.GAME_OVER);
        }
        */
    }

    private addInitialTarget(s: Swarm): void {
        if (s.isPlayerControlled()) {
            s.on(SwarmConsts.ARRIVED_AT_TARGET, (swarmID: number) => { 
                this.assignNewTargetToSwarm(swarmID) 
            });
            this.setTargetForSwarm(s);
        }
    }

    private setTargetForSwarm(s: Swarm): void {
        // add nearest target to player controlled swarms
        if (s.isPlayerControlled()) {

            //          console.log("setting target while ignoring: " + s.visitedSwarms);
            //let targetSwarm: Swarm = SwarmBehaviour.getNearestSwarm(s, this.swarms, s.visitedSwarms);
            let targetSwarm: Swarm = SwarmBehaviour.getNearestSwarm(s, this.swarms);

            //            console.log("trying to set target with potential: " + targetSwarm.hasUntargetedUnits());      // can be null!
            //TODO: exclude swarms last target
            if (targetSwarm == null) {
                //console.log("didn´t find any valid target swarm. time to clear visitedSwarms?");
                this.resetSwarms();
                s.resetVisitedSwarms();
                //this.setTargetForSwarm(s);
                return;
            }


            if (targetSwarm.hasUntargetedUnits() && targetSwarm.properties.ownerID != s.properties.ownerID) {
                s.setTargetSwarm(targetSwarm);
                //targetSwarm.showDetails();
            }
            else {
                //console.log("no target swarms... last player swarm has not found a target? game over");
                //this.emit(GameEvents.GAME_OVER);
            }
        }
        else {
            //console.log("should never land here: assigning new target to npc swarm: " + s.properties.id);
        }
    }

    private resetSwarms(): void {
        this.swarms.forEach(pSwarm => {
            //if(!pSwarm.isPlayerControlled){
            pSwarm.resetUnits();
            //}
        });
    }

    private assignNewTargetToSwarm(swarmID: number): void {
        let swarm: Swarm = this.getSwarmByID(swarmID);
        this.setTargetForSwarm(swarm);
    }

    private getSwarmByID(swarmID: number): Swarm {
        for (let i: number = 0; i < this.swarms.length; i++) {
            if (this.swarms[i].properties.id == swarmID) {
                return this.swarms[i];
            }
        }
        return this.swarms[0];
    }



    private getLauncherPadByID(ownerID: number): LaunchPad {
        let lp: LaunchPad;
        for (let i: number = 0; i < this.launchPads.length; i++) {
            lp = this.launchPads[i]; 
            if (lp.properties.ownerID === ownerID) {
                return lp;
            }
        }
        return this.launchPads[0];
    }

    public update(): void {
        this.launchPads.forEach(element => {
            element.update();
        });

        this.swarms.forEach(element => {

            element.update(this.pointerPosition);
        });
    }

    /*
    // draw line to neares swarm
    private drawLineToNearestSwarm(origin:Vector2D, target:Vector2D):void{
        this.connectorGraphics.lineStyle(1, 0xFF0000, 1);
        this.connectorGraphics.moveTo(origin.x, origin.y);
        this.connectorGraphics.lineTo(target.x, target.y);
    }
    */

    public updateOnStageResize(): void {
        this.launchPads.forEach(element => {
            element.updateOnStageResize();
        });

        this.swarms.forEach(element => {
            element.updateOnStageResize(window.innerWidth, window.innerHeight);
        });

        if (this.background) {
            this.background.width = GlobalAppData.viewport.width;
            this.background.height = GlobalAppData.viewport.height;
        }
    }

    public updatePlayers(players:Array<PlayerVO>):void{
        this.properties.players = players;
    }
}