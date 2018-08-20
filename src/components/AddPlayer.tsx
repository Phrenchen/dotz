import * as React from 'react';
import { Component } from 'react';
import { addPlayer } from "./../actions/index";
import { connect } from 'react-redux';
import { SwarmBehaviourEnum } from './gameInteraction/SelectSwarmBehaviour';
import { SwarmFormationEnum } from './gameInteraction/SelectSwarmFormation';


class AddPlayer extends Component<any,any> {

    private nameHasBeenModified:boolean = false;

    constructor(props:any) {
        super(props);
        
        this.state = {
            id:-1,
            playerName: this.getPlayerName(),
            playerColor: 0xFF0000,
            isWinner:false,
            actionPoints: 0,
            unitCount: 0,
            isActive:false,         // player selects bei clicking the status component
            currentBehaviour:SwarmBehaviourEnum.NONE,       // PlayerAction.NONE
            currentFormation:SwarmFormationEnum.NONE
        };

        
    }
    
    render() {
        return (
            <div>
                add up to 4 players 
                <input 
                    defaultValue={this.getPlayerName()}
                    type="text" 
                    onChange={(event) => {
                        this.nameHasBeenModified = true;

                        this.setState({
                            id:-1,
                            playerName: event.target.value,
                            playerColor: this.state.playerColor,
                            isWinner: this.state.isWinner,
                            actionPoints: this.state.actionPoints,
                            unitCount: this.state.unitCount,
                            currentBehaviour: this.state.currentBehaviour,
                            currentFormation: this.state.currentFormation
                        })} 
                    }
                    />
                { this.getButtonAddPlayer() }
            </div>
        )
    }
    
    private getButtonAddPlayer(): any {
        if(this.state.playerName !== "" && this.props.showAddButton){
            return (
                <div>
                    <button onClick={() => { this.props.showStartMenu() }}>back</button>
                    <button 
                        onClick={() => { 
                            this.updatePlayerName();

                            this.props.onAddPlayer(
                                this.state.id, 
                                this.getPlayerName(),
                                this.state.actionPoints, 
                                this.state.unitCount
                            );
                            this.resetInput();
                        }}
                    >
                    add
                    </button>
                </div>
            );
        }
        return null;   
    }

    private resetInput():void{
        this.nameHasBeenModified = false;
        
        this.setState({
            id:-1,
            playerName: this.defaultPlayerName(),
            isWinner: this.state.isWinner,
            actionPoints: this.state.actionPoints,
            unitCount: this.state.unitCount,
            currentBehaviour: this.state.currentBehaviour,
            currentFormation: this.state.currentFormation
        }) 
    }

    private getPlayerName():string{
        return !this.nameHasBeenModified ? this.defaultPlayerName() : this.state.playerName;
    }

    private defaultPlayerName():string{
        return "Player " + (this.props.playerCount + 1);
    }

    private updatePlayerName():void{
        this.setState({
            id:-1,
            playerName: this.getPlayerName(),
            isWinner: this.state.isWinner,
            actionPoints: this.state.actionPoints,
            unitCount: this.state.unitCount,
            currentBehaviour: this.state.currentBehaviour,
            currentFormation: this.state.currentFormation
        });
    }
}
export default AddPlayer;