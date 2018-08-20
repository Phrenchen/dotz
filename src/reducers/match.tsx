import ReducerConsts from "./ReducerConsts";

let initialState = {
    isGameOver:false,
    remainingFood:0,
    remainingEnemies:0
};

function cloneMatch(m:any):any{
    return {
        isGameOver: m.isGameOver,
        remainingFood: m.remainingFood,
        remainingEnemies: m.remainingEnemies
    };
}

function match(state = initialState, action:any){
    Object.freeze(state);

    //console.log("reducing: PLAYERS: " + action.type);
    //console.log(state);
    //console.log(action);

    
    let newState = cloneMatch(state);

    switch(action.type){
        case ReducerConsts.GAME_START:
            newState.remainingFood = action.remainingFood;
            newState.remainingEnemies = action.remainingEnemies;
            break;
        case ReducerConsts.FOOD_COLLECTED:
            newState.remainingFood = state.remainingFood - 1;
            break;
        case ReducerConsts.ENEMY_KILLED:
            newState.remainingEnemies = (state.remainingEnemies - 1);
            break;
        case ReducerConsts.GAME_OVER:
            newState.isGameOver = action.isGameOver;
        default:
    }
    return newState;
}

export default match;