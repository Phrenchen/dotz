import { Vector2D } from "../swarm/Vector2D";
import { SwarmBehaviourTree } from "../../swe/SwarmBehaviourTree";

export enum UnitType{
    ALL = "all",
    FOOD = "food",
    PLAYER = "player",
    ENEMY = "enemy"
}

export interface SwarmProperties{
    id:number;                  // unique, modified by model
    ownerID:number;             
    
    spawnRadius:number;
    maxUnitCount:number;
    origin:Vector2D;

    targetSwarmID:number;
    behaviorTree:SwarmBehaviourTree;

    unitType:UnitType,
    positioningMode:string,     // "circle" or "random"
    unitColor:number;
    unitLifeSpan:number;
    maxSpeed:number;
    wanderSpeed:number;
    
    isAlive:boolean;
    currentUnitsAliveCount:number;
    currentTargetSwarmLocation:Vector2D;        // check usage. i think this can be removed
    skin:string,
    connectorColor:number,
    foodCollectCount:number,
    enemyKillCount:number,

}