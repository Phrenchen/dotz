import * as React from "react";
import { Component } from "react";
import AppStatemachine from "../appStates/AppStatemachine";
import { States } from "../appStates/States";

class HeaderMain extends Component<any,any>{
    render(){
        return (
            <div 
                className="header-ingame">
                <h1>Dotz!</h1>
            </div>
        );
    }
}
export default HeaderMain;