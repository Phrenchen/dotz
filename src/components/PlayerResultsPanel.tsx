import * as React from "react";
import { Component } from "react";
import { PlayerVO } from "../game/model/PlayerVO";
import PlayerResults from "./PlayerResults";

class PlayerResultsPanel extends Component<any,any>{
    render(){
        // sort...should that not be done by reducer?
        let players:Array<PlayerVO> = this.props.sortPlayers ? PlayerVO.sortByFoodThenEnemies(this.props.players) : this.props.players;

        return (
            <div className="grid-gameover-player-results">
                {
                    players.map( (player:PlayerVO) => {
                        return (
                            <PlayerResults
                                id={player.id}
                                playerName={player.playerName}
                                playerColor={player.playerColor}
                                isWinner={player.isWinner}
                                totalCollectedFood={player.totalCollectedFood}
                                totalKilledEnemies={player.totalKilledEnemies}
                            />
                        )
                    })
                }
            </div>
        );
    }
}
export default PlayerResultsPanel;