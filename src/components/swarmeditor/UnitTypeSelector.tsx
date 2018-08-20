import * as React from 'react';
import { Component } from 'react';
import { UnitType } from '../../game/model/SwarmConfigTypes';

class UnitTypeSelector extends Component<any, any>{

    constructor(props){
        super(props);
    }

    private onUnitChange = (e) =>{
        this.props.onValueChange(e.target.value);
    }

    // has acccess to dom elements
    componentDidMount(){
        let select:HTMLSelectElement = document.getElementById(this.props.id) as HTMLSelectElement; // "selector_maxSpeed"
        
        select.addEventListener("change", this.onUnitChange);
        select.value = this.props.currentValue;
    }
    
    componentWillUnmount(){
        let select:HTMLSelectElement = document.getElementById(this.props.id) as HTMLSelectElement; // "selector_maxSpeed"
        select.removeEventListener("change", this.onUnitChange);

    }
    
    render(){
        //console.log("rendering attribute slider");
        //console.log(this.props);
        
        return (
            <div className="unitTypeDropdown">
                <select 
                    id={this.props.id}
                    name="unittypes"

                    >
                    <option value={UnitType.PLAYER}>attacker</option>
                    <option value={UnitType.FOOD} selected>food</option>
                    <option value={UnitType.ENEMY}>patroling guard</option>
                </select>
            </div>
        );
    }
}
export default UnitTypeSelector;