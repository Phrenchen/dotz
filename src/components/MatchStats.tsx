import * as React from "react";
import { Component } from "react";
import PlayerResultsPanel from "./PlayerResultsPanel";

class MatchStats extends Component<any,any>{

    render(){
        return (
            <div className="topbar-wide">
                { "remaining food: " + this.props.remainingFood}
                <br />
                { "killed units: " + Math.abs(this.props.remainingEnemies)}
                <br />
                <PlayerResultsPanel
                    players={ this.props.players }
                    sortPlayers={false}
                />
            </div>
        );
    }

}

export default MatchStats;