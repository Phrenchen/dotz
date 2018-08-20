import * as React from 'react';
import { Component } from 'react';
import IngameUI from '../components/IngameUI';
import "./../css/ingameui.scss";
import { connect } from 'react-redux';
import { GameEvents } from '../game/GameEvents';
import { GameIndex } from '../game/GameIndex';
import { foodCollected, enemyKilled, playerExtinct, gameOver, gameStart, setPlayerActive, setSwarmBehaviour, setSwarmFormation } from '../actions';
import AppStatemachine from './AppStatemachine';
import { States } from './States';

class GameState extends Component<any,any>{

    private gameIndex:GameIndex;

    componentWillMount(){
        this.gameIndex = new GameIndex(this.props.players);      // initialize game asset loading and pixi launch

        // subscribe to game events
        this.gameIndex.on(GameEvents.PLAYER_UNIT_DEAD, (ownerID) => {
            this.props.onEnemyKilled(ownerID);
        });
        
        this.gameIndex.on(GameEvents.FOOD_COLLECTED, (ownerID) => {
            this.props.onFoodCollected(ownerID);
        });

        this.gameIndex.on(GameEvents.PLAYER_EXTINCT, (id) => {
            this.props.onPlayerExtinct(id);

            // check if there are any players alive. if not -> game over. TODO: conditions!
            let isAnyPlayerAlive:boolean = false;

            this.props.players.map((player) =>{
                if(player.unitCount > 0){
                    isAnyPlayerAlive = true;
                }
            });

            if(!isAnyPlayerAlive){
                AppStatemachine.changeState(States.GAME_OVER); 
            }

        });

        this.gameIndex.on(GameEvents.GAME_OVER, (ownerID) => {
            this.props.onGameOver(true);
            AppStatemachine.changeState(States.GAME_OVER); 
        });
        
        this.gameIndex.on(GameEvents.MATCH_UPDATE, () => {
            this.props.onGameStart(this.gameIndex.getRemainingFood(), this.gameIndex.getRemainingEnemies())
            this.gameIndex.start();
        });
    }

    componentWillUnmount(){
        this.gameIndex.setGameOver();       // leaving gamestate forces game into game over mode
    }
    
    render(){
        this.gameIndex.updatePlayers(this.props.players);

        return <IngameUI 
            players= {this.props.players}
            match= {this.props.match}
            onPlayerSelect= {this.props.onPlayerSelect}
            onSwarmBehaviourSelect= {this.props.onSwarmBehaviourSelect}
            onSwarmFormationSelect= {this.props.onSwarmFormationSelect}
            onSpawnFoodSwarm= {() => {
                this.gameIndex.spawnFood();
            }}
            onGameOver= {(isGameOver) => {
                this.props.onGameOver(isGameOver);  // ok
            }}
        />
    }
}

const mapStateToProps = function(state){
    return {
        players: state.players,
        match: state.match
    }
}

const mapDispatchToProps =  {
    onFoodCollected: foodCollected,
    onEnemyKilled: enemyKilled,
    onPlayerExtinct: playerExtinct,
    onGameOver: gameOver,
    onGameStart: gameStart,
    onPlayerSelect: setPlayerActive,
    onSwarmBehaviourSelect:setSwarmBehaviour,
    onSwarmFormationSelect:setSwarmFormation
}
export default connect(mapStateToProps, mapDispatchToProps)(GameState);