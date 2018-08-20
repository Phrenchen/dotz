import ReducerConsts from "../reducers/ReducerConsts";
import { SwarmBehaviourEnum } from "../components/gameInteraction/SelectSwarmBehaviour";
import { SwarmFormationEnum } from "../components/gameInteraction/SelectSwarmFormation";
import { UnitType } from "../game/model/SwarmConfigTypes";

export function addPlayer(id:number, playerName:string, actionPoints:number, unitCount:number) {
    return {    
        type: ReducerConsts.ADD_PLAYER, 
        id: id,
        playerName: playerName, 
        isWinner: false,
        actionPoints: actionPoints, 
        unitCount: unitCount,
        currentBehaviour: SwarmBehaviourEnum.NONE,
        currentFormation: SwarmFormationEnum.NONE
    };
}

export function changePlayerActionPoints(id:number, value:number){
    return {
        type: ReducerConsts.CHANGE_PLAYER_ACTION_POINTS, 
        id: id, 
        actionPoints: value
    };
}

export function changePlayerUnitCount(id:number, value:number){
    return {
                type: ReducerConsts.CHANGE_PLAYER_UNIT_COUNT,
                id: id,
                unitCount: value
            };
}

export function setPlayerActive(id:number, isActive){
    return {
            type: ReducerConsts.SET_PLAYER_ACTIVE,
            id: id,
            isActive: isActive
        };
}

export function setSwarmBehaviour(b:SwarmBehaviourEnum){
    return {
        type: ReducerConsts.SET_SWARM_BEHAVIOUR,
        behaviour: b
    };
}

export function setSwarmFormation(b:SwarmBehaviourEnum){
    return {
        type: ReducerConsts.SET_SWARM_FORMATION,
        formation: b
    };
}

export function foodCollected(id:number){
    return {
        type: ReducerConsts.FOOD_COLLECTED,
        id: id
    };
}

export function enemyKilled(id:number){
    return {
        type: ReducerConsts.ENEMY_KILLED,
        id: id
    };
}

export function playerExtinct(id:number){
    return {
        type: ReducerConsts.PLAYER_KILLED,
        id: id
    };
}

export function gameStart(remainingFood:number, remainingEnemies:number){
    return {
        type: ReducerConsts.GAME_START,
        remainingFood:remainingFood,
        remainingEnemies:remainingEnemies
    }
}

export function gameOver(isGameOver:boolean){
    return {
        type: ReducerConsts.GAME_OVER,
        isGameOver: isGameOver
    };
}

export function reset(){
    return {
        type:ReducerConsts.RESET_DATA
    };
}


// swarm editor configuration
export function setSpawnRadius(value:number){
    return {
        type: ReducerConsts.SET_SPAWN_RADIUS,
        value: value
    }
}

export function setMaxUnitCount(value:number){
    return {
        type: ReducerConsts.SET_MAX_UNIT_COUNT,
        value: value
    }
}

export function setUnitType(value:UnitType){
    return {
        type: ReducerConsts.SET_UNIT_TYPE,
        value: value
    }
}

