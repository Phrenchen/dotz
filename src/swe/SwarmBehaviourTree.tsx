import { StateData, BehaviorTreeBuilder, BehaviorTreeStatus, BehaviorTreeNodeInterface } from "fluent-behavior-tree";
import { Swarm } from "../game/swarm/Swarm";
import { UnitType, SwarmProperties } from "../game/model/SwarmConfigTypes";
import { SwarmBehaviour } from "../game/swarm/SwarmBehaviour";
import { Vector2D } from "../game/swarm/Vector2D";
import { MathHelper } from "../helper/MathHelper";
import { Unit } from "../game/swarm/Unit";
import SwarmHelper from "../game/swarm/SwarmHelper";
import { getAttackSwarmStrategy } from "./swarmstrategies/StrategyAttackSwarm";
import { getDefendSwarmStrategy } from "./swarmstrategies/StrategyDefendSwarm";

export class SwarmBehaviourTree{
    
    private builder:BehaviorTreeBuilder = new BehaviorTreeBuilder();
    private tree:BehaviorTreeNodeInterface;
    private swarm:Swarm;
    private swarms:Swarm[];

    private lastUpdateTime:number = 0;


    constructor(swarm:Swarm, swarms:Swarm[]){
        this.swarm = swarm;
        this.swarms = swarms;
        this.tree = this.createTree();
    }

    private createTree():BehaviorTreeNodeInterface{
        return new BehaviorTreeBuilder()
        .selector("swarmStrategySelector")
        .splice(getAttackSwarmStrategy(this.swarm, this.swarms, UnitType.ENEMY, UnitType.PLAYER))
        .splice(getDefendSwarmStrategy(this.swarm, this.swarms, UnitType.ENEMY, UnitType.FOOD))
        .splice(getAttackSwarmStrategy(this.swarm, this.swarms, UnitType.PLAYER, UnitType.FOOD))
        .splice(getAttackSwarmStrategy(this.swarm, this.swarms, UnitType.PLAYER, UnitType.ENEMY))
        .end()
        .build();
    }

    public update(){
        let now:number = Date.now();
        let deltaTime:number = now - this.lastUpdateTime;
        this.lastUpdateTime = now;
        this.tree.tick(new StateData(deltaTime));

        this.swarm.units.map((unit) =>{
            unit.update();
        });
    }
}