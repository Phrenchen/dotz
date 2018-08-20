import * as React from "react";
import { Component } from "react";
import "./../../css/ingameui.scss";
import { SwarmBehaviour } from "../../game/swarm/SwarmBehaviour";

export enum SwarmBehaviourEnum{
    NONE="no behaviour",
    SEEK_FOOD="seek food",
    SEEK_ENEMY="seek enemy"
}


class SelectSwarmBehaviour extends Component<any,any>{
    render(){
        return (
            <div className={"game_interaction"}>
                <form>
                    <div className="cc-selector">
                        <label className="drinkcard-cc swarmBehaviour_seek_food">
                            <input type="radio" 
                                id="swarmBehaviour_seek_food"
                                value="swarmBehaviour_seek_food" 
                                name="behaviour"
                                checked={this.props.currentBehaviour === SwarmBehaviourEnum.SEEK_FOOD} 
                                onClick={() => {
                                    if(this.props.currentBehaviour !== SwarmBehaviourEnum.SEEK_FOOD){
                                        // update player
                                        this.props.onSelectBehaviour(SwarmBehaviourEnum.SEEK_FOOD);
                                    }
                                }}
                                />
                        </label>
                        <label className="drinkcard-cc swarmBehaviour_seek_enemy">
                            <input type="radio" 
                                id="swarmBehaviour_seek_enemy"
                                value="swarmBehaviour_seek_enemy" 
                                name="behaviour"
                                checked={this.props.currentBehaviour === SwarmBehaviourEnum.SEEK_ENEMY} 
                                onClick={() => {
                                    if(this.props.currentBehaviour !== SwarmBehaviourEnum.SEEK_ENEMY){
                                        // update player
                                        this.props.onSelectBehaviour(SwarmBehaviourEnum.SEEK_ENEMY);
                                    }
                                }}
                                />
                        </label>
                    </div>
                </form>
            </div>
        );
    }

    private currentSelectedBehaviourIs(b:SwarmBehaviour):boolean{
        return this.props.currentBehaviour === b;
    }
}

export default SelectSwarmBehaviour;