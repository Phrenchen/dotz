import { Swarm } from "./Swarm";
import { Vector2D } from "./Vector2D";
import { SwarmData } from "./SwarmData";
import { AssetConsts } from "../AssetConsts";
import { Unit } from "./Unit";
import { Food } from "./Food";
import { PlayerUnit } from "./PlayerUnit";
import { GameConsts } from "../GameConsts";
import ColorConsts from "../../ColorConsts";
import { PlayerVO } from "../model/PlayerVO";
import { GameData } from "../model/GameData";
import { spawn } from "child_process";
import { Rectangle } from "pixi.js";
import { SwarmProperties, UnitType } from "../model/SwarmConfigTypes";



export class SwarmFactory {
    public  swarmData:SwarmData;
    
    private viewport: Rectangle = new Rectangle(0,0,400,400);
    private swarmCounter:number = 0;

    //public propertyData: Array<SwarmProperties> = new Array<SwarmProperties>();
    
    constructor(swarmData:SwarmData = null){
        this.swarmData = swarmData ? swarmData : new SwarmData();
        //this.initDefaultSetup();
        //this.initDebugSetup();
        this.initHighUnitCountSetup();
    }

    public setViewport(viewport:Rectangle):void{
        this.viewport = viewport;
    }

    public countUnitsAlive(swarms:Array<Swarm>, ownerID:number):number{
        let amount:number = 0;

        swarms.map((s) => {
            if(s.properties.ownerID == ownerID){
                amount += s.currentUnitsAliveCount();
            }
        });
        return amount;
    }
    
    // used to create food swarms
    public createByOwnerID(id:number, startPosition:Vector2D, container:PIXI.Container, unitColor:number):Swarm{
        let properties:SwarmProperties = this.swarmData.getPropertiesByOwnerID(id);
        properties.unitColor = unitColor;
        properties.origin = startPosition;

        // scale swarm if it´s food. right place to do this? some strategy come in handy maybe?
        if(!GameData.isPlayerSwarm(id)){
            properties = this.scaleSwarmToFitScreen(properties);
        }

        let swarm:Swarm = new Swarm(properties, container, this);
        return swarm;
    }

    /**
     * 
     * food swarms need to be "scaled" regarding
     *  - spawn area
     *  - unit count
     * 
     * @param properties : default properties. will be modified and returned
     * 
     */
    private scaleSwarmToFitScreen(properties:SwarmProperties):SwarmProperties{
        let spawnArea:Vector2D = new Vector2D(this.viewport.width, this.viewport.height);
        let screenBorderPadding:Vector2D = new Vector2D(spawnArea.x / 4, spawnArea.y / 4);       // a quarter of the screen is padding
        let unitsPerSegment:number = 50;
        let segmentSize:Vector2D = new Vector2D(150,50);

        let spawnRadius:number = this.getSpawnRadius(spawnArea, screenBorderPadding, segmentSize);
        let unitCount:number = this.getUnitCount(spawnRadius, segmentSize, unitsPerSegment);
        
        properties.spawnRadius = spawnRadius;
        properties.maxUnitCount = unitCount;
        return properties;
    }
    
    private getSpawnRadius(spawnArea:Vector2D, screenBorderPadding:Vector2D, segmentSize:Vector2D):number{
        // adjust area size
        spawnArea.x -= screenBorderPadding.x;
        spawnArea.y -= screenBorderPadding.y;
        // smaller side counts
        let smallerMinSegmentSide:number = segmentSize.x < segmentSize.y ? segmentSize.x : segmentSize.y;
        let spawnRange:number = spawnArea.x < spawnArea.y ? spawnArea.x : spawnArea.y;
        // guarantee minimal spawn area
        if(spawnRange < smallerMinSegmentSide){
            spawnRange = smallerMinSegmentSide;
        }
        return spawnRange * .5;     // half range is radius
    }
    
    private getUnitCount(spawnRadius:number, segmentSize:Vector2D, unitsPerSegment:number):number{
        let columnCount:number = Math.floor(spawnRadius / segmentSize.x);
        let rowCount:number = Math.floor(spawnRadius / segmentSize.y);
        let segmentCount:number = Math.max(columnCount * rowCount, 1);
        return segmentCount * unitsPerSegment;
    }

    // used to create player swarms?
    public create(properties:SwarmProperties, container:PIXI.Container):Swarm{
        let swarm:Swarm = new Swarm(properties, container, this);
        // scale
        return swarm;
    }

    /**
     * this method modifies swarm properties:
     *  - positioningMode ("circle" | "random")
     *  - unitColor
     * 
     */
    public createUnit(properties:SwarmProperties):Unit{
        let unit:Unit;
        switch(properties.unitType){
            case UnitType.FOOD:
                properties.unitColor = ColorConsts.UNIT_FOOD;
                unit = new Food(properties.ownerID > 0, properties.unitColor);
                break;
                case UnitType.PLAYER:
                unit = new PlayerUnit( this.getUnitSkinByPlayerID(properties.ownerID), properties.ownerID > 0, properties.unitColor );
                break;
            case UnitType.ENEMY:
                properties.unitColor = ColorConsts.UNIT_ENEMY;
                unit = new PlayerUnit( this.getUnitSkinByPlayerID(properties.ownerID), properties.ownerID > 0, properties.unitColor );
                break;
                //unit = new Enemy();
            default:
                properties.unitColor = ColorConsts.UNIT_FOOD;
                unit = new Food(properties.ownerID > 0, properties.unitColor);
                break;
        }

        return unit;
    }

    private getUnitSkinByPlayerID(ownerID:number):string{
        return AssetConsts.ASSET_UNIT_WORKER;
    }

    private initDefaultSetup():void{
        let playerUnitCount:number = 100;

        // player 1
        this.swarmData.addSwarmDef(
            {
                id: GameConsts.ID_PLAYER_1,
                ownerID: GameConsts.ID_PLAYER_1,
                unitColor: ColorConsts.PLAYER_1,
                maxUnitCount: playerUnitCount,

                targetSwarmID: -1,
                behaviorTree: null,

                currentUnitsAliveCount: 0,
                isAlive: true,
                unitLifeSpan: 10,
                maxSpeed: 1.2,
                wanderSpeed: .1,
                spawnRadius: 40,
                origin: new Vector2D(),
                currentTargetSwarmLocation: new Vector2D(),
                skin: AssetConsts.ASSET_UNIT_WORKER,
                positioningMode: "circle",
                unitType: UnitType.PLAYER,
                connectorColor: ColorConsts.PLAYER_1,
                foodCollectCount: 0,
                enemyKillCount: 0
            }
        );   
        
        // player 2
        this.swarmData.addSwarmDef(
            {
                id: GameConsts.ID_PLAYER_2,
                ownerID: GameConsts.ID_PLAYER_2,
                unitColor: ColorConsts.PLAYER_2,
                maxUnitCount: playerUnitCount,

                targetSwarmID: -1,
                behaviorTree: null,

                currentUnitsAliveCount: 0,
                isAlive: true,
                unitLifeSpan: 10,
                maxSpeed: 1.2,
                wanderSpeed: .1,
                spawnRadius: 40,
                origin: new Vector2D(),
                currentTargetSwarmLocation: new Vector2D(),
                skin: AssetConsts.ASSET_UNIT_WORKER,
                positioningMode: "circle",
                unitType: UnitType.PLAYER,
                connectorColor: ColorConsts.PLAYER_2,
                foodCollectCount: 0,
                enemyKillCount: 0
            }
        );

        // player 3
        this.swarmData.addSwarmDef(
            {
                id: GameConsts.ID_PLAYER_3,
                ownerID: GameConsts.ID_PLAYER_3,
                unitColor: ColorConsts.PLAYER_3,
                maxUnitCount: playerUnitCount,
                targetSwarmID: -1,
                behaviorTree: null,
                currentUnitsAliveCount: 0,
                isAlive: true,
                unitLifeSpan: 10,
                maxSpeed: 1.2,
                wanderSpeed: .1,
                spawnRadius: 40,
                origin: new Vector2D(),
                currentTargetSwarmLocation: new Vector2D(),
                skin: AssetConsts.ASSET_UNIT_WORKER,
                positioningMode: "circle",
                unitType: UnitType.PLAYER,
                connectorColor: ColorConsts.PLAYER_3,
                foodCollectCount: 0,
                enemyKillCount: 0
            }
        );

        // player 4
        this.swarmData.addSwarmDef(
            {
                id: GameConsts.ID_PLAYER_4,
                ownerID: GameConsts.ID_PLAYER_4,
                unitColor: ColorConsts.PLAYER_4,
                maxUnitCount: playerUnitCount,
                targetSwarmID: -1,
                behaviorTree: null,
                currentUnitsAliveCount: 0,
                isAlive: true,
                unitLifeSpan: 10,
                maxSpeed: 1.2,
                wanderSpeed: .1,
                spawnRadius: 40,
                origin: new Vector2D(),
                currentTargetSwarmLocation: new Vector2D(),
                skin: AssetConsts.ASSET_UNIT_WORKER,
                positioningMode: "circle",
                unitType: UnitType.PLAYER,
                connectorColor: ColorConsts.PLAYER_4,
                foodCollectCount:0,
                enemyKillCount:0
            }
        );
    }

    //-----------------------------------------------------------------------------------------------------
    private initDebugSetup():void{
        //console.log("init swarmfactory");

        let playerUnitCount:number = 1;

        // player 1
        this.swarmData.addSwarmDef(
            {
                id: GameConsts.ID_PLAYER_1,
                ownerID: GameConsts.ID_PLAYER_1,
                unitColor: ColorConsts.PLAYER_1,
                maxUnitCount: playerUnitCount,
                targetSwarmID: -1,
                behaviorTree: null,
                currentUnitsAliveCount: 0,
                isAlive: true,
                unitLifeSpan: 10,
                maxSpeed: 1.2,
                wanderSpeed: .1,
                spawnRadius: 40,
                origin: new Vector2D(),
                currentTargetSwarmLocation: new Vector2D(),
                skin: AssetConsts.ASSET_UNIT_WORKER,
                positioningMode: "circle",
                unitType: UnitType.PLAYER,
                connectorColor: ColorConsts.PLAYER_1,
                foodCollectCount: 0,
                enemyKillCount: 0
            }
        );   
        
        // player 2
        this.swarmData.addSwarmDef(
            {
                id: GameConsts.ID_PLAYER_2,
                ownerID: GameConsts.ID_PLAYER_2,
                unitColor: ColorConsts.PLAYER_2,
                maxUnitCount: playerUnitCount,
                targetSwarmID: -1,
                behaviorTree: null,
                currentUnitsAliveCount: 0,
                isAlive: true,
                unitLifeSpan: 10,
                maxSpeed: 1.2,
                wanderSpeed: .1,
                spawnRadius: 40,
                origin: new Vector2D(),
                currentTargetSwarmLocation: new Vector2D(),
                skin: AssetConsts.ASSET_UNIT_WORKER,
                positioningMode: "circle",
                unitType: UnitType.PLAYER,
                connectorColor: ColorConsts.PLAYER_2,
                foodCollectCount: 0,
                enemyKillCount: 0
            }
        );

        // player 3
        this.swarmData.addSwarmDef(
            {
                id: GameConsts.ID_PLAYER_3,
                ownerID: GameConsts.ID_PLAYER_3,
                unitColor: ColorConsts.PLAYER_3,
                maxUnitCount: playerUnitCount,
                targetSwarmID: -1,
                behaviorTree: null,
                currentUnitsAliveCount: 0,
                isAlive: true,
                unitLifeSpan: 10,
                maxSpeed: 1.2,
                wanderSpeed: .1,
                spawnRadius: 40,
                origin: new Vector2D(),
                currentTargetSwarmLocation: new Vector2D(),
                skin: AssetConsts.ASSET_UNIT_WORKER,
                positioningMode: "circle",
                unitType: UnitType.PLAYER,
                connectorColor: ColorConsts.PLAYER_3,
                foodCollectCount: 0,
                enemyKillCount: 0
            }
        );

        // player 4
        this.swarmData.addSwarmDef(
            {
                id: GameConsts.ID_PLAYER_4,
                ownerID: GameConsts.ID_PLAYER_4,
                unitColor: ColorConsts.PLAYER_4,
                maxUnitCount: playerUnitCount,
                targetSwarmID: -1,
                behaviorTree: null,
                currentUnitsAliveCount: 0,
                isAlive: true,
                unitLifeSpan: 10,
                maxSpeed: 1.2,
                wanderSpeed: .1,
                spawnRadius: 40,
                origin: new Vector2D(),
                currentTargetSwarmLocation: new Vector2D(),
                skin: AssetConsts.ASSET_UNIT_WORKER,
                positioningMode: "circle",
                unitType: UnitType.PLAYER,
                connectorColor: ColorConsts.PLAYER_4,
                foodCollectCount:0,
                enemyKillCount:0
            }
        );
    }

    //-----------------------------------------------------------------------------------------------------
    private initHighUnitCountSetup():void{
        //console.log("init swarmfactory");

        let playerUnitCount:number = 50;

        // player 1
        this.swarmData.addSwarmDef(
            {
                id: GameConsts.ID_PLAYER_1,
                ownerID: GameConsts.ID_PLAYER_1,
                unitColor: ColorConsts.PLAYER_1,
                maxUnitCount: playerUnitCount,
                targetSwarmID: -1,
                behaviorTree: null,
                currentUnitsAliveCount: 0,
                isAlive: true,
                unitLifeSpan: 10,
                maxSpeed: 1.2,
                wanderSpeed: .1,
                spawnRadius: 40,
                origin: new Vector2D(),
                currentTargetSwarmLocation: new Vector2D(),
                skin: AssetConsts.ASSET_UNIT_WORKER,
                positioningMode: "circle",
                unitType: UnitType.PLAYER,
                connectorColor: ColorConsts.PLAYER_1,
                foodCollectCount: 0,
                enemyKillCount: 0
            }
        );   
        
        // player 2
        this.swarmData.addSwarmDef(
            {
                id: GameConsts.ID_PLAYER_2,
                ownerID: GameConsts.ID_PLAYER_2,
                unitColor: ColorConsts.PLAYER_2,
                maxUnitCount: playerUnitCount,
                targetSwarmID: -1,
                behaviorTree: null,
                currentUnitsAliveCount: 0,
                isAlive: true,
                unitLifeSpan: 10,
                maxSpeed: 1.2,
                wanderSpeed: .1,
                spawnRadius: 40,
                origin: new Vector2D(),
                currentTargetSwarmLocation: new Vector2D(),
                skin: AssetConsts.ASSET_UNIT_WORKER,
                positioningMode: "circle",
                unitType: UnitType.PLAYER,
                connectorColor: ColorConsts.PLAYER_2,
                foodCollectCount: 0,
                enemyKillCount: 0
            }
        );

        // player 3
        this.swarmData.addSwarmDef(
            {
                id: GameConsts.ID_PLAYER_3,
                ownerID: GameConsts.ID_PLAYER_3,
                unitColor: ColorConsts.PLAYER_3,
                maxUnitCount: playerUnitCount,
                targetSwarmID: -1,
                behaviorTree: null,
                currentUnitsAliveCount: 0,
                isAlive: true,
                unitLifeSpan: 10,
                maxSpeed: 1.2,
                wanderSpeed: .1,
                spawnRadius: 40,
                origin: new Vector2D(),
                currentTargetSwarmLocation: new Vector2D(),
                skin: AssetConsts.ASSET_UNIT_WORKER,
                positioningMode: "circle",
                unitType: UnitType.PLAYER,
                connectorColor: ColorConsts.PLAYER_3,
                foodCollectCount: 0,
                enemyKillCount: 0
            }
        );

        // player 4
        this.swarmData.addSwarmDef(
            {
                id: GameConsts.ID_PLAYER_4,
                ownerID: GameConsts.ID_PLAYER_4,
                unitColor: ColorConsts.PLAYER_4,
                maxUnitCount: playerUnitCount,
                targetSwarmID: -1,
                behaviorTree: null,
                currentUnitsAliveCount: 0,
                isAlive: true,
                unitLifeSpan: 10,
                maxSpeed: 1.2,
                wanderSpeed: .1,
                spawnRadius: 40,
                origin: new Vector2D(),
                currentTargetSwarmLocation: new Vector2D(),
                skin: AssetConsts.ASSET_UNIT_WORKER,
                positioningMode: "circle",
                unitType: UnitType.PLAYER,
                connectorColor: ColorConsts.PLAYER_4,
                foodCollectCount:0,
                enemyKillCount:0
            }
        );
    }
}
