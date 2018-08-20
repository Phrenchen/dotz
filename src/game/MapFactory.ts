import { MapProperties } from "./MapProperties";
import { Map } from "./Map";
import { SwarmData } from "./swarm/SwarmData";
import { Rectangle, Point } from "pixi.js";
import { GameConsts } from "./GameConsts";
import { Vector2D } from "./swarm/Vector2D";
import { AssetConsts } from "./AssetConsts";
import { VisualHelper } from "../helper/VisualHelper";
import { Swarm } from "./swarm/Swarm";
import { GlobalAppData } from "./GlobalAppData";
import { PlayerVO } from "./model/PlayerVO";
import { MathHelper } from "../helper/MathHelper";
import ColorConsts from "../ColorConsts";
import { SwarmProperties, UnitType } from "./model/SwarmConfigTypes";
import { SwarmFactory } from "./swarm/SwarmFactory";

export class MapFactory{

    private swarmFactory:SwarmFactory;

    constructor(swarmFactory:SwarmFactory){
        this.swarmFactory = swarmFactory;
    }

    // static setups
    public createDefaultMap(container:PIXI.Container, players:Array<PlayerVO>, viewport:Rectangle):Map{
        let map:Map;
        let properties:MapProperties;

        // ids 1-4 (n) are reserverd for the standard
        switch(players.length){
            default:
                //properties = this.getDefaultProperties();     // big cloud of food in center
                //properties = this.getDebugProperties();         // low amount of units for easier debugging
                properties = this.getNoFoodProperties();         // only player swarms, no food to harvest
                //properties = this.getHighUnitCountProperties();         // high amount of units for easier debugging
                break;
        }
        properties.players = players;
        //console.log(properties);
        map = new Map(container, this.swarmFactory, properties);
        return map;
    }

    private getDefaultProperties():MapProperties{
        let mapProperties:MapProperties = new MapProperties();
        let s:Array<SwarmProperties> = new Array<SwarmProperties>();

        let unitCount:number = 100;
        let spawnRadius:number = 200;
        let position:Vector2D = MathHelper.centerOfStage(GlobalAppData.APP_RENDERER.screen);
        //position.x -= spawnRadius * .5;       // don`t we need to adjust horizontally, too? doesnt seem so. position bug somewhere
        position.y -= spawnRadius * .5;

        s.push(
            {
                id:-1,                                  // modified by model
                ownerID: GameConsts.ID_FOOD,
                unitColor:0xFF0000,
                maxUnitCount: unitCount,
                positioningMode: "random",              // "random" or "circle". TODO: constants
                origin: position,

                targetSwarmID: -1,
                behaviorTree: null,

                // static
                currentUnitsAliveCount:0,
                isAlive:true,
                unitLifeSpan: 10,
                maxSpeed: 1,
                wanderSpeed: .1,
                spawnRadius: spawnRadius,
                currentTargetSwarmLocation: new Vector2D(),
                skin:AssetConsts.ASSET_FOOD,
                unitType: UnitType.FOOD,
                connectorColor:0x00FFFF,
                enemyKillCount:0,
                foodCollectCount:0
            }
        );
        mapProperties.swarms = s;
        return mapProperties;
    }

    private getDebugProperties():MapProperties{
        let mapProperties:MapProperties = new MapProperties();
        let s:Array<SwarmProperties> = new Array<SwarmProperties>();
        
        let unitCount:number = 10;
        let spawnRadius:number = 100;
        let position:Vector2D = MathHelper.centerOfStage(GlobalAppData.APP_RENDERER.screen);
        //position.x -= spawnRadius * .5;       // don`t we need to adjust horizontally, too? doesnt seem so. position bug somewhere
        position.y -= spawnRadius * .5;

        s.push(
            {
                id:-1,                                  // modified by model
                ownerID: GameConsts.ID_FOOD,
                unitColor:0xFF0000,
                maxUnitCount: unitCount,
                positioningMode: "circle",              // "random" or "circle". TODO: constants
                origin: position,

                targetSwarmID: -1,
                behaviorTree: null,

                enemyKillCount:0,
                foodCollectCount:0,

                // static
                currentUnitsAliveCount:0,
                isAlive:true,
                unitLifeSpan: 10,
                maxSpeed: 1,
                wanderSpeed: .1,
                spawnRadius: spawnRadius,
                currentTargetSwarmLocation: new Vector2D(),
                skin:AssetConsts.ASSET_FOOD,
                unitType: UnitType.FOOD,
                connectorColor:0x00FFFF
            }
        );
        mapProperties.swarms = s;
        return mapProperties;
    }

    private getNoFoodProperties():MapProperties{
        let mapProperties:MapProperties = new MapProperties();
        let unitCount:number = 100;
        let spawnRadius:number = 200;
        let position:Vector2D = MathHelper.centerOfStage(GlobalAppData.APP_RENDERER.screen);
        //position.x -= spawnRadius * .5;       // don`t we need to adjust horizontally, too? doesnt seem so. position bug somewhere
        position.y -= spawnRadius * .5;
        mapProperties.swarms = new Array<SwarmProperties>();        // refactoring food creation
        return mapProperties;
    }

    private getHighUnitCountProperties():MapProperties{
        let mapProperties:MapProperties = new MapProperties();
        let s:Array<SwarmProperties> = new Array<SwarmProperties>();
        
        let borderPadding:number = 50;
        let randomBlobUnitCount:number = 1000;
        let circleUnitCount:number = 100;
        let spawnRadius:number = 100;
        let centerOfStage:Vector2D = MathHelper.centerOfStage(GlobalAppData.APP_RENDERER.screen);
        //centerOfStage.x -= spawnRadius * .5;       // don`t we need to adjust horizontally, too? doesnt seem so. position bug somewhere
        centerOfStage.y -= spawnRadius * .5;
        
        let leftCenter:Vector2D = MathHelper.leftCenter(GlobalAppData.APP_RENDERER.screen);
        leftCenter.x += (spawnRadius + borderPadding);

        let rightCenter:Vector2D = MathHelper.rightCenter(GlobalAppData.APP_RENDERER.screen);
        rightCenter.x -= (spawnRadius + borderPadding);

        let centerTop:Vector2D = MathHelper.centerTop(GlobalAppData.APP_RENDERER.screen);
        centerTop.y += (spawnRadius + borderPadding);
        
        let centerBottom:Vector2D = MathHelper.centerBottom(GlobalAppData.APP_RENDERER.screen);
        centerBottom.y -= (spawnRadius + borderPadding);

        s.push(
            {
                id:-1,                                  // modified by model
                ownerID: GameConsts.ID_FOOD,
                unitColor:ColorConsts.UNIT_FOOD,
                maxUnitCount: randomBlobUnitCount,
                positioningMode: "circle",              // "random" or "circle". TODO: constants
                origin: centerOfStage,
                
                targetSwarmID: -1,
                behaviorTree: null,

                enemyKillCount:0,
                foodCollectCount:0,

                // static
                currentUnitsAliveCount:0,
                isAlive:true,
                unitLifeSpan: 10,
                maxSpeed: 1,
                wanderSpeed: .1,
                spawnRadius: spawnRadius,
                currentTargetSwarmLocation: new Vector2D(),
                skin:AssetConsts.ASSET_FOOD,
                unitType: UnitType.FOOD,
                connectorColor:0x00FFFF
            }
        );

        // LEFT CIRCLE
        s.push(
            {
                id:-1,                                  // modified by model
                ownerID: GameConsts.ID_FOOD,
                unitColor:ColorConsts.UNIT_FOOD,
                maxUnitCount: circleUnitCount,
                positioningMode: "circle",              // "random" or "circle". TODO: constants
                origin: leftCenter,
                
                targetSwarmID: -1,
                behaviorTree: null,

                enemyKillCount:0,
                foodCollectCount:0,

                // static
                currentUnitsAliveCount:0,
                isAlive:true,
                unitLifeSpan: 10,
                maxSpeed: 1,
                wanderSpeed: .1,
                spawnRadius: spawnRadius,
                currentTargetSwarmLocation: new Vector2D(),
                skin:AssetConsts.ASSET_FOOD,
                unitType: UnitType.FOOD,
                connectorColor:0x00FFFF
            }
        );


        // RIGHT CIRCLE
        s.push(
            {
                id:-1,                                  // modified by model
                ownerID: GameConsts.ID_FOOD,
                unitColor:ColorConsts.UNIT_FOOD,
                maxUnitCount: circleUnitCount,
                positioningMode: "circle",              // "random" or "circle". TODO: constants
                origin: rightCenter,

                targetSwarmID: -1,
                behaviorTree: null,

                enemyKillCount:0,
                foodCollectCount:0,

                // static
                currentUnitsAliveCount:0,
                isAlive:true,
                unitLifeSpan: 10,
                maxSpeed: 1,
                wanderSpeed: .1,
                spawnRadius: spawnRadius,
                currentTargetSwarmLocation: new Vector2D(),
                skin:AssetConsts.ASSET_FOOD,
                unitType: UnitType.FOOD,
                connectorColor:0x00FFFF
            }
        );


        // TOP CIRCLE
        s.push(
            {
                id:-1,                                  // modified by model
                ownerID: GameConsts.ID_FOOD,
                unitColor:ColorConsts.UNIT_FOOD,
                maxUnitCount: circleUnitCount,
                positioningMode: "circle",              // "random" or "circle". TODO: constants
                origin: centerTop,

                targetSwarmID: -1,
                behaviorTree: null,

                enemyKillCount:0,
                foodCollectCount:0,

                // static
                currentUnitsAliveCount:0,
                isAlive:true,
                unitLifeSpan: 10,
                maxSpeed: 1,
                wanderSpeed: .1,
                spawnRadius: spawnRadius,
                currentTargetSwarmLocation: new Vector2D(),
                skin:AssetConsts.ASSET_FOOD,
                unitType: UnitType.FOOD,
                connectorColor:0x00FFFF
            }
        );


        // BOTTOM CIRCLE
        s.push(
            {
                id:-1,                                  // modified by model
                ownerID: GameConsts.ID_FOOD,
                unitColor:ColorConsts.UNIT_FOOD,
                maxUnitCount: circleUnitCount,
                positioningMode: "circle",              // "random" or "circle". TODO: constants
                origin: centerBottom,

                targetSwarmID: -1,
                behaviorTree: null,

                enemyKillCount:0,
                foodCollectCount:0,

                // static
                currentUnitsAliveCount:0,
                isAlive:true,
                unitLifeSpan: 10,
                maxSpeed: 1,
                wanderSpeed: .1,
                spawnRadius: spawnRadius,
                currentTargetSwarmLocation: new Vector2D(),
                skin:AssetConsts.ASSET_FOOD,
                unitType: UnitType.FOOD,
                connectorColor:0x00FFFF
            }
        );

        mapProperties.swarms = s;
        return mapProperties;
    }
}