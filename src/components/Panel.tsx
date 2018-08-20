import * as React from "react";
import { Component } from "react";
import "./../css/Panel.scss";

export default class Panel extends Component<any,any> {

    panelTitleClassName(){
        if(this.props.getTitleClassName){
            return this.props.getTitleClassName();
        }
        return "Panel-centered";
    }

    panelContentClassName(){
        // set by parent
        if(this.props.getContentClassName){
            return this.props.getContentClassName();
        }
        return "Panel-centered";
    }

    getPanelClassName(){
        // set by parent
        if(this.props.getPanelClassName){
            return this.props.getPanelClassName();
        }
        return "Panel";
    }

    render() {
        
        return (
            <div className={this.getPanelClassName()}>
                <h1 className={this.panelTitleClassName() }>
                    {this.props.title}
                </h1>
                <div className={ this.panelContentClassName() }>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

/*
Panel.propTypes = {
    title: React.PropTypes.string.isRequired
}
*/
//export default Panel;