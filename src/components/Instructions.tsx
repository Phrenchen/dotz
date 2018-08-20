import * as React from "react";
import States from "../appStates/States";
import { Component } from "react";
import AppStatemachine from "../appStates/AppStatemachine";
import ButtonStartGame from "./ButtonStartGame";
import ContentAboutPage from "./ContentAboutPage";
import TopbarAbout from "./TopbarAbout";
import HeaderMainBack from "./HeaderMainBack";

class Instructions extends Component<any,any>{

    render(){
        return (
            <div className="grid_ingame_ui">
                <HeaderMainBack />
                <TopbarAbout />
                <ContentAboutPage />
            </div>
        );
    }
}

export default Instructions;