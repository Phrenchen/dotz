import * as React from "react";
import States from "../appStates/States";
import { Component } from "react";
import AppStatemachine from "../appStates/AppStatemachine";

class MatchActionPanel extends Component<any,any>{
    render(){
        return (
            <div className="topbar-single-next-to-header">
                <button
                    onClick={()=>{
                        this.props.onGameOver(true);
                        AppStatemachine.changeState(States.GAME_OVER);
                    }}
                >
                back
                </button>
            </div>
        );
    }
    /*
                <button
                    onClick={()=>{
                        this.props.onSpawnFoodSwarm();
                    }}
                >
                spawn food
                </button>
                */
}

export default MatchActionPanel;