import * as React from 'react';

import PlayerSetup from "./PlayerSetup";
import States from '../appStates/States';
import { Component } from 'react';


export default class PlayerList extends Component<any,any> {
   
    render() {
        return (
            <div>
            set up the players
            {
                // for each player: add PlayerSetup and pass props
                this.props.players.map( (player) => {
                    return <PlayerSetup 
                        key={player.id}
                        id={player.id}
                        playerName={player.playerName}
                        unitCount={player.unitCount}
                        actionPoints={player.actionPoints}
                        onChangeUnitCount={ (id, value) => {
                            this.props.changeUnitCount(id, value);
                        } }
                        onChangeActionPointCount={ (id, value) => {
                            this.props.changeActionPoints(id, value);
                        } }
                        
                    />
                })
            } 
                <br />
                <button onClick={() => { this.props.showStartMenu() }}>back</button>
                { this.getStartGameButton() }
            </div>
        )
    }
    
    // only show start game button if there is at least 1 player
    getStartGameButton(){
        return this.props.players.length > 0 ? <button onClick={() => { this.props.startGame() }}>start game</button> : null;
    }
}