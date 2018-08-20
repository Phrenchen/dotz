import * as React from "react";
import { Component } from "react";
import AppStatemachine from "../appStates/AppStatemachine";
import { States } from "../appStates/States";

class ButtonShowAbout extends Component<any,any>{
    render(){
        return (
            <button 
                onClick={() => {
                    AppStatemachine.changeState(States.ABOUT);
            }}>
                tech
            </button>
        );
    }
}

export default ButtonShowAbout;