import * as React from 'react';
import { Component } from 'react';
import AddPlayer from "./../components/AddPlayer";
import PlayerList from '../components/PlayerList';
import States from './States';

import { connect } from 'react-redux';
import { addPlayer, changePlayerActionPoints, changePlayerUnitCount, setSpawnRadius, setMaxUnitCount, setUnitType } from "./../actions/index";
import AppStatemachine from './AppStatemachine';

import "./../css/swarm_configuration_styles.scss";

import { SwarmBehaviourEnum } from '../components/gameInteraction/SelectSwarmBehaviour';
import TopbarSwarmEditor from '../components/TopbarSwarmEditor';
import AttributeSlider from '../components/swarmeditor/AttributeSlider';
import { SimpleSwarmEmitter, SwarmEmitterEvent } from '../swe/SimpleSwarmEmitter';
import { Swarm } from '../game/swarm/Swarm';
import { Vector2D } from '../game/swarm/Vector2D';
import { AssetConsts } from '../game/AssetConsts';
import { MathHelper } from '../helper/MathHelper';
import { SwarmProperties, UnitType } from '../game/model/SwarmConfigTypes';
import ButtonClearEditor from '../components/ButtonClearEditor';
import { cloneSwarmProperties } from '../helper/CloneHelper';
import UnitTypeSelector from '../components/swarmeditor/UnitTypeSelector';
import HeaderMainBack from '../components/HeaderMainBack';

/**
 * contains attribute sliders for each behaviour
 * creates a preview swarm, updating its attributes at runtime
 */
class SwarmEditorState extends Component<any,any>{

    private swarmEmitter:SimpleSwarmEmitter;
    private isInitialMount:boolean = true;

    constructor(props){
        super(props);

        this.state = {
            selectedBehaviour: SwarmBehaviourEnum.NONE,
            swarms: new Array<Swarm>()
        };

    }
    // swarm properties
    private getDefaultProperties():SwarmProperties{
        let origin:Vector2D = new Vector2D(100, 100);

        return {
            id: -1,
            ownerID: -1,
            
            spawnRadius: 100,
            maxUnitCount: 100,

            positioningMode: "circle",
            origin: origin,

            unitColor: 0xFF0000,
            unitLifeSpan: 10,

            maxSpeed: 1.2,
            wanderSpeed: .1,

            targetSwarmID: -1,
            behaviorTree: null,

            isAlive: true,
            currentUnitsAliveCount: 0,
            currentTargetSwarmLocation: new Vector2D(),
            skin: AssetConsts.ASSET_UNIT_WORKER,
            unitType: UnitType.PLAYER,
            connectorColor: 0xFF0000,
            foodCollectCount: 0,
            enemyKillCount: 0
        }
    }

    private onCanvasClick = (e) => {
        let properties = cloneSwarmProperties(this.props.swarmEditorConfig);
        properties.origin = new Vector2D(e.clientX, e.clientY)
        this.swarmEmitter.create(properties);
    }

    // -----------------
    componentDidMount(){
        //console.log("swarm editor state mounted");
        if(this.isInitialMount){// only once
            this.isInitialMount = false;
            // only first mounting. resusing instance on re-mount
            this.swarmEmitter = new SimpleSwarmEmitter();
            this.swarmEmitter.addListener(SwarmEmitterEvent.READY, () =>{
                // what now?
                //console.log("swarm emitter ready");
                //this.swarmEmitter.create(this.getDefaultProperties());
            });
            this.swarmEmitter.init();

            let canvas = document.getElementById("gameContainer");
            canvas.addEventListener("pointerup", this.onCanvasClick);

        }
    }

    componentWillUnmount(){
        let canvas = document.getElementById("gameContainer");
            canvas.removeEventListener("pointerup", this.onCanvasClick);
    }

    render(){
        return (
            <div className="grid_ingame_ui">
                <HeaderMainBack />
                <TopbarSwarmEditor />
                
                <div className="content-center-fullwidth">
                    <UnitTypeSelector
                        id="unitType"
                        currentValue={this.props.swarmEditorConfig.unitType}
                        onValueChange={this.props.onUnitTypeChange}
                    />

                    <AttributeSlider
                        id="spawnRadius"
                        min="1"
                        max="100"
                        currentValue={this.props.swarmEditorConfig.spawnRadius}
                        onValueChange={this.props.onSpawnRadiusChange}
                    />
                    <AttributeSlider
                        id="maxUnitCount"
                        min="1"
                        max="100"
                        currentValue={this.props.swarmEditorConfig.maxUnitCount}
                        onValueChange={this.props.onMaxUnitCountChange}
                    />

                    {/*this.getUnderConstruction()*/}
                </div>
            </div>
        );
        /*
        <ButtonClearEditor
            onClear={() => {
                this.swarmEmitter.clear();
            }}
        />
        */
    }

    getUnderConstruction(){
        return (
            <div>
                <img src="under_construction.jpg" alt="work in progress :)" title="work in progress :)"/>
                <br />
                work in progress :)
            </div>
        );
    }
    
}


const mapStateToProps = function(state){
    return {
        players: state.players,
        match: state.match,
        swarmEditorConfig: state.swarmEditorConfig
    }
}

const mapDispatchToProps =  {
    onSpawnRadiusChange: setSpawnRadius,
    onMaxUnitCountChange: setMaxUnitCount,
    onUnitTypeChange: setUnitType
    
}
export default connect(mapStateToProps, mapDispatchToProps)(SwarmEditorState);