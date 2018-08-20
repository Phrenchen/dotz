import ReducerConsts from "./ReducerConsts";
import { PlayerVO } from "../game/model/PlayerVO";
import { SwarmFormationEnum } from "../components/gameInteraction/SelectSwarmFormation";
import { SwarmBehaviourEnum } from "../components/gameInteraction/SelectSwarmBehaviour";
import ColorConsts from "../ColorConsts";

let defaultPlayerCount:number = 4;

let initialState = [];
let isFirstPlayer:boolean = true;
let id;
while(initialState.length < defaultPlayerCount){
    id = initialState.length + 1;
    initialState.push(
        {   
            id: id,
            playerName: "" + id,
            playerColor: ColorConsts.getColorByID(id),
            isActive: isFirstPlayer,
            isWinner: false,
            
            actionPoints: 0,
            unitCount: 0,
            totalKilledEnemies: 0,
            totalCollectedFood: 0,
            currentFormation: SwarmFormationEnum.NONE,
            currentBehaviour: SwarmBehaviourEnum.NONE
        }
    );
    isFirstPlayer = false;
}

function clonePlayer(p:PlayerVO):PlayerVO{
    return {
        id: p.id, 
        playerName: p.playerName,
        playerColor: p.playerColor,
        isActive: p.isActive,
        isWinner: p.isWinner,
        
        actionPoints: p.actionPoints,
        unitCount: p.unitCount,
        totalKilledEnemies: p.totalKilledEnemies,
        totalCollectedFood: p.totalCollectedFood,
        currentFormation: p.currentFormation,
        currentBehaviour: p.currentBehaviour
    };
}

// pure method. dont modify state
function players(state = initialState, action:any) {
    //console.log("reducing: PLAYERS: " + action.type);
    //console.log(state);
    //console.log(action);
    
    Object.freeze(state);

    let player;
    let newState;
    let playerClone;

    switch(action.type){
        // *********************************************************************************
        case ReducerConsts.ADD_PLAYER:
            let maxPlayerId = 0;
            for(let player of state) {
                if (player.id > maxPlayerId) {
                    maxPlayerId = player.id;
                }
            }

           // adding new player with highest id
           // create new array, existing array + add item without modifying the original
           newState = [
               ...state, 
               {
                   id: maxPlayerId + 1, 
                   playerName: action.playerName, 
                   playerColor: ColorConsts.getColorByID(maxPlayerId + 1),
                   isActive: false,
                   isWinner: false,
                   actionPoints: action.actionPoints, 
                   unitCount: action.unitCount,
                   totalKilledEnemies: 0,
                   totalCollectedFood:0,
                   currentFormation: SwarmFormationEnum.NONE,
                   currentBehaviour: SwarmBehaviourEnum.NONE
                }
            ];
            break;
        // *********************************************************************************
        
        // ############### MODIFY ALL PLAYERS
        // all players get an update for their isActive status
        case ReducerConsts.SET_PLAYER_ACTIVE:
            newState = new Array<PlayerVO>();
            
            for(let i = 0; i<state.length; i++){
                playerClone = clonePlayer(state[i]);
                playerClone.isActive = (action.id === playerClone.id && action.isActive);
                newState.push(playerClone);
            }
            break;

        case ReducerConsts.DECLARE_WINNER:
            let winnerID:number = -1;
            let maxFood:number = 0;
        
            newState = new Array<PlayerVO>();

            // find player with most food collected -> winner
            state.map((player) => {
                if(player.totalCollectedFood > maxFood){
                    winnerID = player.id;
                    maxFood = player.totalCollectedFood;
                }
            });

            for(let i = 0; i<state.length; i++){
                playerClone = clonePlayer(state[i]);
                playerClone.isActive = false;
                playerClone.isWinner = playerClone.id === winnerID;     // set winner
                newState.push(playerClone);
            }
            break;
        // ############### MODIFY ALL PLAYERS END #################################################
        
        // MODIFY SINGLE PLAYER
        case ReducerConsts.CHANGE_PLAYER_ACTION_POINTS:
            for(let i = 0; i<state.length; i++){
                player = state[i];
                // find player
                if(player.id === action.id){
                    playerClone = clonePlayer(player);
                    //TODO: dirty hack (stupid me...): action.unitCount somehow is of type string instead of number. multipliying by 1 implicitly casts? 
                    playerClone.actionPoints = action.actionPoints * 1,

                    // remove old player, create new player modify attributes, add to new array
                    newState = [
                        ...state.slice(0,i),
                        ...[ playerClone ],
                        ...state.slice(i + 1)
                    ];
                }
            }
            break;
        case ReducerConsts.CHANGE_PLAYER_UNIT_COUNT:
            for(let i = 0; i<state.length; i++){
                player = state[i];
                // find player
                if(player.id === action.id){
                    playerClone = clonePlayer(player);
                    //TODO: dirty hack (stupid me...): action.unitCount somehow is of type string instead of number. multipliying by 1 implicitly casts? 
                    playerClone.unitCount = action.unitCount * 1,

                    // remove old player, create new player modify attributes, add to new array
                    newState = [
                        ...state.slice(0,i),
                        ...[ playerClone ],
                        ...state.slice(i + 1)
                    ];
                }
            }
            break;
        case ReducerConsts.SET_SWARM_BEHAVIOUR:
            for(let i = 0; i<state.length; i++){
                player = state[i];
                // find player
                if(player.isActive){
                    // remove old player, create new player modify attributes, add to new array
                    playerClone = clonePlayer(player);
                    playerClone.currentBehaviour = action.behaviour;

                    newState = [
                        ...state.slice(0,i),
                        ...[playerClone],
                        ...state.slice(i + 1)
                    ];
                }
            }
            break;
        case ReducerConsts.SET_SWARM_FORMATION:
            for(let i = 0; i<state.length; i++){
                player = state[i];
                // find player
                if(player.isActive){
                    // remove old player, create new player modify attributes, add to new array
                    playerClone = clonePlayer(player);
                    playerClone.currentFormation = action.formation;

                    newState = [
                        ...state.slice(0,i),
                        ...[playerClone],
                        ...state.slice(i + 1)
                    ];
                }
            }
            break;
        case ReducerConsts.FOOD_COLLECTED:
            for(let i = 0; i<state.length; i++){
                player = state[i];
                // find player
                if(player.id === action.id){
                    // remove old player, create new player modify attributes, add to new array
                    playerClone = clonePlayer(player);
                    playerClone.totalCollectedFood++;

                    newState = [
                        ...state.slice(0,i),
                        ...[playerClone],
                        ...state.slice(i + 1)
                    ];
                }
            }
            break;
        case ReducerConsts.ENEMY_KILLED:
            for(let i = 0; i<state.length; i++){
                player = state[i];
                // find player
                if(player.id === action.id){
                    // remove old player, create new player modify attributes, add to new array
                    playerClone = clonePlayer(player);
                    playerClone.totalKilledEnemies++;

                    newState = [
                        ...state.slice(0,i),
                        ...[playerClone],
                        ...state.slice(i + 1)
                    ];
                }
            }
            break;
        
        case ReducerConsts.PLAYER_KILLED:
            //console.log("reducing player killed: " + action.id);
            /*for(let i = 0; i<state.length; i++){
                player = state[i];
                // find player
                if(player.id === action.id){
                    // remove old player, create new player modify attributes, add to new array
                    playerClone = clonePlayer(player);
                    

                    newState = [
                        ...state.slice(0,i),
                        ...[playerClone],
                        ...state.slice(i + 1)
                    ];
                }
            }
            */
            break;
        case ReducerConsts.RESET_DATA:
            newState = [];
            break;
        default:
            break;
    }

    return newState ? newState : state;
}
export default players;