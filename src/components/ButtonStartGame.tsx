import * as React from "react";
import { Component } from "react";
import AppStatemachine from "../appStates/AppStatemachine";
import { States } from "../appStates/States";
import { connect } from "react-redux";

class ButtonStartGame extends Component<any,any>{
    render(){
        return (
            <button
                onClick={() => { 
                    AppStatemachine.changeState(States.MATCH);
                }}>
                new game
            </button>
        );
    }
}

const mapStateToProps = function(state){
    return {
        players: state.players
    }
}

export default connect(mapStateToProps)(ButtonStartGame);