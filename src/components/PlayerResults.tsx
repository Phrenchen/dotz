import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

/**
 * presentational container.
 * receives data + callbacks. does not modify
 */
class PlayerResults extends Component<any,any>{
    
    render(){
        return (
            <div className={ this.getClassName()}>
            {this.props.playerName}: {this.props.totalCollectedFood}, {this.props.totalKilledEnemies}
            </div>
        );
        /*
        <h3>{this.props.playerName}</h3>
        <h3>{"food collected: " + this.props.totalCollectedFood}</h3>
        <h3>{"enemy killed: " + this.props.totalKilledEnemies}</h3>
        */
    }

    getClassName(){
        const winner = (this.props.isWinner ? "_winner" : "");
        return "player_results" + winner + " " +
            "player_results_" + this.props.id;
    }
}
export default PlayerResults;