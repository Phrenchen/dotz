import { Vector2D } from "../game/swarm/Vector2D";
import { AssetConsts } from "../game/AssetConsts";
import { UnitType, SwarmProperties } from "../game/model/SwarmConfigTypes";
import ReducerConsts from "./ReducerConsts";
import { cloneSwarmProperties } from "../helper/CloneHelper";
import ColorConsts from "../ColorConsts";

let initialState:SwarmProperties = {
    id: -1,
    ownerID: -1,
    
    spawnRadius: 30,
    maxUnitCount: 10,
    origin: new Vector2D(100, 100),
    
    targetSwarmID: -1,
    behaviorTree: null,

    unitType: UnitType.FOOD,
    positioningMode: "random",
    unitColor: 0xFF0000,
    unitLifeSpan: 10,
    maxSpeed: 1.2,
    wanderSpeed: .1,


    isAlive: true,
    currentUnitsAliveCount: 0,
    currentTargetSwarmLocation: new Vector2D(),
    skin: AssetConsts.ASSET_UNIT_WORKER,
    connectorColor: 0xFF0000,
    foodCollectCount: 0,
    enemyKillCount: 0
};




function swarmEditorConfig(state = initialState, action:any) {
    Object.freeze(state);

    //console.log("reducing swarm editor config");

    let newState = cloneSwarmProperties(state);

    switch(action.type){
        case ReducerConsts.SET_SPAWN_RADIUS:
            newState.spawnRadius = action.value
            break;
        case ReducerConsts.SET_MAX_UNIT_COUNT:
            newState.maxUnitCount = action.value
            break;
        case ReducerConsts.SET_UNIT_TYPE:
            newState.unitType = action.value
            newState.positioningMode = action.value == UnitType.FOOD ? "random" : "circle";
            newState.unitColor = action.value === UnitType.PLAYER ? ColorConsts.PLAYER_1 : ColorConsts.UNIT_FOOD;
            break;
        default: break;
    }

    return newState;
}

export default swarmEditorConfig;