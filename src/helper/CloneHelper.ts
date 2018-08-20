import { SwarmProperties } from "../game/model/SwarmConfigTypes";

export function cloneSwarmProperties(state:any):SwarmProperties{
    return {
        id: state.id,
        ownerID: state.ownerID,
        
        spawnRadius: state.spawnRadius,
        positioningMode: state.positioningMode,
        origin: state.origin.clone(),

        targetSwarmID: state.targetSwarmID,
        behaviorTree: state.behaviorTree ? state.behaviorTree.clone() : null,

        unitColor: state.unitColor,
        maxUnitCount: state.maxUnitCount,
        unitLifeSpan: state.unitLifeSpan,

        maxSpeed: state.maxSpeed,
        wanderSpeed: state.wanderSpeed,


        isAlive: state.isAlive,
        currentUnitsAliveCount: state.currentUnitsAliveCount,
        currentTargetSwarmLocation: state.currentTargetSwarmLocation.clone(),
        skin: state.skin,
        unitType: state.unitType,
        connectorColor: state.connectorColor,
        foodCollectCount: state.foodCollectCount,
        enemyKillCount: state.enemyKillCount
    };
}