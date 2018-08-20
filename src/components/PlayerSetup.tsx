import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

/**
 * presentational container.
 * receives data + callbacks. does not modify
 */
class PlayerSetup extends Component<any,any>{
    
    render(){
        //console.log("rendering player info");
        //console.log(this.props);
        
        return (
            <div>
                <h4>{this.props.playerName}</h4>
                
                recruits: 
                <input key="numUnits"
                    type="number"
                    placeholder={this.props.unitCount}
                    onChange={  
                        (event) => {
                            this.props.onChangeUnitCount(this.props.id, event.target.value);
                        }
                    }>
                </input>
                <br />
                action points: 
                <input key="numActionPoints" 
                    type="number"
                    placeholder={this.props.actionPoints}
                    onChange={ (event) => {
                            this.props.onChangeActionPointCount(this.props.id, event.target.value);
                        } 
                    }>
                </input>
                <br />
                <br />
               
            </div>
        );
    }
}
export default PlayerSetup;