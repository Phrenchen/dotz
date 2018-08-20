import * as React from "react";
import { Component } from "react";
import AppStatemachine from "../appStates/AppStatemachine";
import { States } from "../appStates/States";
import { connect } from "react-redux";

class ButtonClearEditor extends Component<any,any>{
    render(){
        return (
            <button
                onClick={() => { 
                    this.props.onClear()
                }}>
                clear
            </button>
        );
    }
}

export default ButtonClearEditor;