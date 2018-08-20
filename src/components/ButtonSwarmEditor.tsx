import * as React from "react";
import { Component } from "react";
import AppStatemachine from "../appStates/AppStatemachine";
import { States } from "../appStates/States";
import { connect } from "react-redux";

class ButtonSwarmEditor extends Component<any,any>{
    render(){
        return (
            <button
                onClick={() => { 
                    AppStatemachine.changeState(States.SWARM_EDITOR);
                }}>
                configure swarms
            </button>
        );
    }
}

export default ButtonSwarmEditor;