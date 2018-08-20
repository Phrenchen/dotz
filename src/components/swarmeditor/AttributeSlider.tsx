import * as React from 'react';
import { Component } from 'react';

class AttributeSlider extends Component<any, any>{

    constructor(props){
        super(props);
    }

    private onSliderChange = (e) =>{
        let value:number = parseInt( (e.target as HTMLInputElement).value );
        this.props.onValueChange(value);
    }

    // has acccess to dom elements
    componentDidMount(){
        let slider:HTMLInputElement = document.getElementById(this.props.id) as HTMLInputElement; // "selector_maxSpeed"
        
        slider.addEventListener("change", this.onSliderChange);
        slider.value = this.props.currentValue;
    }
    
    componentWillUnmount(){
        let slider:HTMLInputElement = document.getElementById(this.props.id) as HTMLInputElement; // "selector_maxSpeed"
        slider.removeEventListener("change", this.onSliderChange);

    }
    
    render(){
        //console.log("rendering attribute slider");
        //console.log(this.props);
        
        return (
            <div className="slidecontainer">
                <input 
                    type="range" 
                    className="slider" 
                    id={this.props.id}
                    min={this.props.min} 
                    max={this.props.max} 
                />
                {this.props.id + ": " + this.props.currentValue}
            </div>
        );
    }
}
export default AttributeSlider;