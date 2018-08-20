import * as React from "react";
import States from "../appStates/States";
import { Component } from "react";
import AppStatemachine from "../appStates/AppStatemachine";

class GameOverStatusBar extends Component<any,any>{
    render(){
        return (
            <div className="topbar-wide">
                <h3>GAME OVER!</h3>
            </div>
        );
    }
}

export default GameOverStatusBar;