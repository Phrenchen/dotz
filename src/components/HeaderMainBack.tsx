import * as React from "react";
import { Component } from "react";
import AppStatemachine from "../appStates/AppStatemachine";
import { States } from "../appStates/States";

class HeaderMainBack extends Component<any,any>{
    render(){
        return (
            <div 
                className="header-ingame"
                onClick={() => { 
                    AppStatemachine.changeState(States.START); 
                }}
                >
                <h1>Dotz!</h1>
                (back)
            </div>
        );
    }
}

export default HeaderMainBack;