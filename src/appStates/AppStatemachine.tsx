import * as React from "react";
import PlayerList from './../components/PlayerList';
import StartMenu from "./../components/StartMenu";
import Instructions from "./../components/Instructions";
import SwarmEditorState from "./SwarmEditorState";
import IngameUI from "./../components/IngameUI";
import States from './States';
import { ReactNode } from 'react-redux';
import { Component } from "react";
import GameState from "./GameState";
import GameOverState from "./GameOverState";


class AppStatemachine extends Component<any,any>{
    
    private static instance;

    state = {
        current:States.START
    };

    constructor(props:any){
        super(props);
        AppStatemachine.instance = this;
    }

    public static changeState(stateID:number){
        if(stateID){
            AppStatemachine.instance.setState( {current:stateID} );
        }
        else{
            console.log("tried to set an undefined state: " + stateID);
        }
    }


    // RENDER METHODS
    renderStartMenu():ReactNode{
        return <StartMenu />
    }


    renderInstructions(){
        return <Instructions />
    }

    renderSwarmEditor(){
        return <SwarmEditorState />
    }

    renderGameOver(){
        return <GameOverState />;
               
    }

    renderIngameUI(){
        return <GameState />;

    }
    
    render(){
        let renderFunction:Function;
        
        switch(this.state.current){
            case States.START:
                renderFunction = () => { return this.renderStartMenu() };
                break;
            case States.ABOUT:
                renderFunction = () => { return this.renderInstructions() };
                break;
            case States.SWARM_EDITOR:
                renderFunction = () => { return this.renderSwarmEditor() };
                break;
            case States.MATCH:
                renderFunction = () => { return this.renderIngameUI() };
                break;
            case States.GAME_OVER:
                renderFunction = () => { return this.renderGameOver()} ;
                break;
            default: 
                console.log("Statemachine render: no valid state found, rendering nothing: " + this.state.current);
                break; // no renderings for null state
        }

        if(renderFunction){
            return (
                <div>
                    
                    {renderFunction()}
                </div>
            );
        }
    }

    // <Header /> <- include header image, pushing rest of UI down currently. rethink this. stack divs?
}

export default AppStatemachine;