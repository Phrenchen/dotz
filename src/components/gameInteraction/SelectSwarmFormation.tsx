import * as React from "react";
import { Component } from "react";
import "./../../css/ingameui.scss";

export enum SwarmFormationEnum{
    NONE= "no formation",
    CIRCLE= "circle",
    GRID= "grid",
    RANDOM= "random"
}

class SelectSwarmFormation extends Component<any,any>{
    render(){
        return (
            <div className={"game_interaction"}>
                <form>
                    <div className="cc-selector">
                        <label className="drinkcard-cc swarmFormation_circle">
                            <input 
                                id="swarmFormation_circle"
                                value="swarmFormation_circle" 
                                type="radio" 
                                name="behaviour"
                                checked={this.props.currentFormation === SwarmFormationEnum.CIRCLE} 
                                onClick={() => {
                                    if(this.props.currentFormation !== SwarmFormationEnum.CIRCLE){
                                        // update player
                                        this.props.onSelectFormation(SwarmFormationEnum.CIRCLE);
                                    }
                                }}
                                />
                        </label>
                        <label className="drinkcard-cc swarmFormation_random">
                            <input 
                                id="swarmFormation_grid"
                                value="swarmFormation_grid"
                                type="radio" 
                                name="behaviour"
                                checked={this.props.currentFormation === SwarmFormationEnum.RANDOM} 
                                onClick={() => {
                                    if(this.props.currentFormation !== SwarmFormationEnum.RANDOM){
                                        // update player
                                        this.props.onSelectFormation(SwarmFormationEnum.RANDOM);
                                    }
                                }}
                                />
                        </label>
                    </div>
                </form>
            </div>
        );
    }
}
export default SelectSwarmFormation;