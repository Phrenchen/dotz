import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { setSwarmBehaviour, setSwarmFormation } from "../actions";
import SelectSwarmFormation from "./gameInteraction/SelectSwarmFormation";
import SelectSwarmBehaviour, { SwarmBehaviourEnum } from "./gameInteraction/SelectSwarmBehaviour";

class ActionPanel extends Component<any,any>{
    render(){
        return (
            <div className="grid_actionpanel">
                <SelectSwarmBehaviour 
                    currentBehaviour={this.props.currentBehaviour}
                    onSelectBehaviour={ (b:SwarmBehaviourEnum) => {
                        this.props.onSwarmBehaviourSelect(b);
                    }}
                    />  
            </div>
        );
        /*<SelectSwarmFormation 
            currentFormation={this.props.currentFormation}
            onSelectFormation={ (b:SwarmBehaviourEnum) => {
                this.props.onSwarmFormationSelect(b);
            }}
        />*/
    }
}

const mapStateToProps = function(state){
    return {
        players: state.players
    }
}

const mapDispatchToProps =  {
    onSwarmBehaviourSelect:setSwarmBehaviour,
    onSwarmFormationSelect:setSwarmFormation
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionPanel);