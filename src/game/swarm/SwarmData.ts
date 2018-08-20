import { GameConsts } from "../GameConsts";
import { MathHelper } from "../../helper/MathHelper";
import { Vector2D } from "./Vector2D";
import { AssetConsts } from "../AssetConsts";
import { GlobalAppData } from "../GlobalAppData";
import { SwarmProperties, UnitType } from "../model/SwarmConfigTypes";

export class SwarmData{

    private swarmData:Array<SwarmProperties> = new Array<SwarmProperties>();
    public swarmCount:number = 0;

    constructor(){

        // add food
        this.swarmData.push(
            {
                id:-1,                                  // modified by model
                ownerID: GameConsts.ID_FOOD,
                unitColor:0xFFFFFF,                     // will be overwritten by owner
                maxUnitCount: 700,
                positioningMode: "random",              // "random" or "circle". TODO: constants
                origin: new Vector2D(), //MathHelper.centerOfStage(GlobalAppData.APP_RENDERER.screen),

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
                spawnRadius: 150,
                currentTargetSwarmLocation: new Vector2D(),
                skin:AssetConsts.ASSET_FOOD,
                unitType: UnitType.FOOD,
                connectorColor:0x00FFFF
            }
        );
    }

    public addSwarmDef(data:SwarmProperties):number{
        if(data === null){
            return -1;      // error code?
        }
        data.id = ++this.swarmCount;      // always grows -> used to create unique swarmIDs (but: reset resets! ...as expected)
        this.swarmData.push(data);
        //console.log("added swarm: " + data.id + " with unitType: " + data.unitType);
        return data.id;
    }
    
    public getPropertiesByID(id: number): SwarmProperties {
        for(let i:number = 0; i<this.swarmData.length; i++){
            if(this.swarmData[i].id === id){
                return this.clone( this.swarmData[i] );
            }
        }
        console.log("can´t find properties for id: " + id);
        return this.clone( this.swarmData[0] );;
    }

    public getPropertiesByOwnerID(id: number): SwarmProperties {
        for(let i:number = 0; i<this.swarmData.length; i++){
            if(this.swarmData[i].ownerID === id){
                return this.clone( this.swarmData[i] );
            }
        }
        console.log("can´t find properties for id: " + id);
        return this.clone( this.swarmData[0] );;
    }

    private clone(original:any): any {
        return Object.create(original);
    }
}