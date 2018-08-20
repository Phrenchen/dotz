import { BehaviorTreeStatus, BehaviorTreeNodeInterface, BehaviorTreeBuilder } from "fluent-behavior-tree";
import { Swarm } from "../../game/swarm/Swarm";
import { UnitType } from "../../game/model/SwarmConfigTypes";
import { SwarmBehaviour } from "../../game/swarm/SwarmBehaviour";
import SwarmHelper from "../../game/swarm/SwarmHelper";

export function getAttackSwarmStrategy(swarm:Swarm, swarms:Array<Swarm>, limitStrategyToType:UnitType, targetUnitType:UnitType):BehaviorTreeNodeInterface{
    let potentialTarget:Swarm;
    let nearestSwarm:Swarm;
    let targetSwarmHasBeenReplaced:boolean = true;
    let lastTargetSwarmID:number = -1;

    return new BehaviorTreeBuilder()
        .sequence("attackUnit")
            .do("findPlayerSwarm", async (t) =>{
                
                //2. check every other swarm if it is food
                if(swarm.properties.unitType == limitStrategyToType){       // only for enemy swarms, UnitType.ENEMY
                    //targetUnitType = UnitType.ALL;
                    nearestSwarm = SwarmBehaviour.getNearestSwarm(swarm, swarms, targetUnitType);       // UnitType.PLAYER
                    //console.log("executing attack unit behavior: " + swarms.length, limitStrategyToType, targetUnitType, nearestSwarm);
                    if(nearestSwarm){
                        swarm.properties.currentTargetSwarmLocation = nearestSwarm.properties.origin;
                        swarm.properties.targetSwarmID = nearestSwarm.properties.id;
                        
                      //console.log("found nearest swarm");
                        return BehaviorTreeStatus.Success;
                    }
                    return BehaviorTreeStatus.Failure;
                }
                //console.log("found no suitable swarm");
                return BehaviorTreeStatus.Failure;      // found no food swarm
            })
            .do("assignUnits", async (t) => {
                swarm.units.map((unit) => {
                    if(!unit.targetUnit){
                        SwarmHelper.assignNewTarget(unit, nearestSwarm);
                    }
                });
                //console.log("assigned units");
                return BehaviorTreeStatus.Success;
            })
            .do("seekTargetUnits", async (t) => {
                // check success
                if(nearestSwarm.properties.isAlive){
                    //console.log("player swarm still alive. seeking units");
                    swarm.units.map((unit) =>{
                        if(unit.targetUnit){
                            //console.log("seek");
                            unit.seek(unit.targetUnit.position);
                        }

                        if(swarm.checkUnitArrival(unit)){
                            SwarmHelper.assignNewTarget(unit, nearestSwarm);
                        }
                    });

                    if(swarm.hasArrived){
                        return BehaviorTreeStatus.Success;
                    }
                    else{
                        return BehaviorTreeStatus.Running;
                    }
                }
                else{
                    console.log("all units killed");

                    swarm.properties.targetSwarmID = -1;   // forget about dead player swarm
                    return BehaviorTreeStatus.Success;
                }
            })
            .end()
            .build();
}