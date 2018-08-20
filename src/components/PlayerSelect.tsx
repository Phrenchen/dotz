import * as React from "react";
import { Component } from "react";
import "./../css/ingameui.scss";
import SelectSwarmBehaviour, { SwarmBehaviourEnum } from "./gameInteraction/SelectSwarmBehaviour";
import { SwarmFormationEnum } from "./gameInteraction/SelectSwarmFormation";

class PlayerSelect extends Component<any,any>{

    constructor(props){
        super(props);
    }

    render(){
        //console.log("rendering ingame player stats ");
        //console.log(this.props);

        return (
            <div
                id={"playerstats_" + this.props.id}
                className={"playerstats playerstats_" + this.props.id}
                onClick={() => {
                    this.props.onPlayerSelect(this.props.id, !this.props.isActive);     // toggle active status
                }}>
                <h4>{ this.getTitle() }</h4>
            </div>
        );

        // match stats -> add player stats
        // toggle match stats visibility (add button top right corner "show stats")
        /*unit count: {this.props.unitCount}
        <br />
        food collected: {this.props.totalCollectedFood}
        <br />
        enemies killed: {this.props.totalKilledEnemies}*/
    }
    
    private getTitle():string{
        let name:string = this.props.playerName + (this.props.isActive ? " (*) " : "");
        let behaviour:string = this.props.currentBehaviour !== SwarmBehaviourEnum.NONE ? (", " + this.props.currentBehaviour) : "";
        let formation:string = this.props.currentFormation !== SwarmFormationEnum.NONE ? (", " + this.props.currentFormation) : "";
        return name + behaviour + formation;
    }
}
export default PlayerSelect;