import * as React from 'react';
import { Component } from 'react';

import PlayerResults from './../components/PlayerResults';
import PlayerResultsPanel from './../components/PlayerResultsPanel';
import GameOverStatusBar from './../components/GameOverStatusBar';
import { connect } from 'react-redux';
import HeaderMainBack from '../components/HeaderMainBack';

class GameOverState extends Component<any,any> {

    render(){
        return (
            <div className="grid_ingame_ui">
                <HeaderMainBack />
                <PlayerResultsPanel 
                    players={ this.props.players }
                    sortPlayers={true}
                />
                <GameOverStatusBar />
            </div>)
    }
}

const mapStateToProps = function(state){
    return {
        players: state.players,
        match: state.match
    }
}

export default connect(mapStateToProps)(GameOverState);
//export default GameOverState;