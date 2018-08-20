import * as React from "react";
import States from "./../appStates/States";
import { Component } from "react";
import AppStatemachine from "../appStates/AppStatemachine";
import { connect } from "react-redux";
import HeaderMain from "./HeaderMain";
import ButtonStartGame from "./ButtonStartGame";
import ButtonShowAbout from "./ButtonShowAbout";
import ContentStartPage from "./ContentStartPage";
import TopbarMain from "./TopbarMain";
import ButtonSwarmEditor from "./ButtonSwarmEditor";

class StartMenu extends Component<any,any>{

    constructor(props:any){
        super(props);

        this.state = {};
    }

    render(){
        return (
            <div className="grid_ingame_ui">
                <HeaderMain />
                <TopbarMain />
                <div className="startmenu">
                    <ButtonStartGame />
                    <ButtonSwarmEditor />
                    <ButtonShowAbout />
                </div>
                <ContentStartPage />

            </div>
        );
    }
}
const mapStateToProps = function(state){
    return {
        players: state.players
    }
}

export default connect(mapStateToProps)(StartMenu);