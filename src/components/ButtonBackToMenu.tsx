import * as React from "react";
import { Component } from "react";
import AppStatemachine from "../appStates/AppStatemachine";
import { States } from "../appStates/States";

class ButtonBackToMenu extends Component<any,any>{
    render(){
        return (
            <button
                onClick={() => { 
                    AppStatemachine.changeState(States.START); 
                }}>
                back
            </button>
        );
    }
}

export default ButtonBackToMenu;