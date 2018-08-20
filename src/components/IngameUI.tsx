import * as React from "react";
import States from "../appStates/States";
import PlayerSelect from "./PlayerSelect";
import { Component } from "react";
import AppStatemachine from "../appStates/AppStatemachine";
import { connect } from "react-redux";

import { PlayerVO } from "../game/model/PlayerVO";
import { SwarmBehaviourEnum } from "./gameInteraction/SelectSwarmBehaviour";
import { SwarmFormationEnum } from "./gameInteraction/SelectSwarmFormation";
import ActionPanel from "./ActionPanel";

//import "./../css/ingameui.scss"
import "./../css/ingame_grid_ui.scss"
import MatchStats from "./MatchStats";
import MatchActionPanel from "./MatchActionPanel";
import HeaderMainBack from "./HeaderMainBack";

class IngameUI extends Component<any,any>{

    render(){
        //console.log("-----------------> rendering IngameUI");
        //console.log(this.props);

        // check if this panel should be rendered
        if(!this.props.players){
            return (<div>
               <button 
                        onClick={() => { 
                            AppStatemachine.changeState(States.START) } 
                        }>
                        no players to render. -> back to menu
                    </button>
            </div>);
        }
        /*
        <MatchActionPanel 
            onSpawnFoodSwarm={() =>{
                this.props.onSpawnFoodSwarm();
            }}
            onGameOver= {(isGameOver) => {
                this.props.onGameOver(isGameOver);
            }}
        />
        */
        return (
            <div className="grid_ingame_ui">
                <HeaderMainBack />
                <MatchStats 
                    remainingFood={ this.props.match.remainingFood }
                    remainingEnemies={ this.props.match.remainingEnemies }
                    players={this.props.players}
                />
                <div className="ingamePlayerSelection">
                    {
                        this.props.players.map( (player:PlayerVO) => {
                            return (
                                
                                    <PlayerSelect key={player.id} 
                                            id={player.id} 
                                            playerName={player.playerName} 
                                            playerColor={player.playerColor}
                                            isActive={player.isActive}
                                            isWinner={player.isWinner}
                                            actionPoints={player.actionPoints} 
                                            unitCount={player.unitCount}
                                            totalCollectedFood={player.totalCollectedFood}
                                            totalKilledEnemies={player.totalKilledEnemies}
                                            currentFormation={ player.currentFormation}
                                            currentBehaviour={ player.currentBehaviour}

                                            onPlayerSelect={(playerID, doSelect) => {
                                                this.props.onPlayerSelect(playerID, doSelect);
                                            }}
                                            />
                            )
                        })
                    } 
                </div>
                {this.getActionPanel()}  
            </div>
        );
    }

    private getActionPanel(){
        //return  this.hasSelectedPlayer() ? <ActionPanel /> : null;
        return null;
    }

    private hasSelectedPlayer(){
        let isSelected:boolean = false;

        this.props.players.map((player) => {
            if(player.isActive){
                isSelected = true;
            }
        });
        return isSelected;
    }
}

export default IngameUI;