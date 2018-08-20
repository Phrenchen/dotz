import { BehaviorTreeStatus, BehaviorTreeBuilder, BehaviorTreeNodeInterface } from "fluent-behavior-tree";
import { Swarm } from "../../game/swarm/Swarm";
import { UnitType } from "../../game/model/SwarmConfigTypes";
import { SwarmBehaviour } from "../../game/swarm/SwarmBehaviour";
import { MathHelper } from "../../helper/MathHelper";
import { Vector2D } from "../../game/swarm/Vector2D";

export function getDefendSwarmStrategy(swarm:Swarm, swarms:Array<Swarm>, limitStrategyToType:UnitType, targetUnitType:UnitType):BehaviorTreeNodeInterface{
    let nearestSwarm:Swarm;
    let lastSwarm:number = -1;
    let playerExists:boolean = SwarmBehaviour.getNearestSwarm(swarm, swarms, UnitType.PLAYER) != null;

    return new BehaviorTreeBuilder()
        .sequence("protectFood")
            .do("findFoodSwarm", async (t) =>{
                if(swarm.properties.unitType == UnitType.ENEMY){
                    
                    // if there are player swarms -> fail early
                    if(playerExists){
                        return BehaviorTreeStatus.Failure;
                    }
                    
                    // find nearest food swarm
                    nearestSwarm = SwarmBehaviour.getNearestSwarm(swarm, swarms, UnitType.FOOD, lastSwarm);
                    
                    if(nearestSwarm){
                        lastSwarm = nearestSwarm.properties.id;   // only remember last
                        //ignoreSwarms.push(nearestSwarm.properties.id);
                        return BehaviorTreeStatus.Success;      // assigned target positions on circle for each unit
                    }
                    //console.log("no food swarm to protect");
                    return BehaviorTreeStatus.Failure;      // no food swarm found
                }
                //console.log("i am no enemy");
                return BehaviorTreeStatus.Failure;
            })
            .do("assignPositions", async (t) => {
                let radius:number = nearestSwarm.properties.spawnRadius + 20;
                let positions:Array<Vector2D> = MathHelper.calculatePositionsOnCircle(swarm.units.length, radius);
                let origin:Vector2D = nearestSwarm.properties.origin;
                let counter:number = 0;

                swarm.units.map((unit) => {
                    unit.targetPosition = positions[counter].add(origin);
                    counter++;
                });
                //console.log("assigned unit targetPositions");
                return BehaviorTreeStatus.Success;
        })
        .do("seekTargetPositions", async (t) => {
            let distance:number;
            let numUnitsArrived:number = 0;
            let arrivalThreshold:number;

            if(playerExists){
                return BehaviorTreeStatus.Failure;
            }

            swarm.units.map((unit) => {
                // check distance for every unit to targetPosition
                distance = unit.position.dist(unit.targetPosition);
                arrivalThreshold = unit.arrivalThreshold;
                arrivalThreshold = 5;

                if(distance < arrivalThreshold){
                    numUnitsArrived++;
                }
            });
            if(numUnitsArrived == swarm.units.length){
                //console.log("enemy arrived at food defense positions");
                return BehaviorTreeStatus.Success;
            }
            //console.log("seeking");
            return BehaviorTreeStatus.Running;
        })
        .end()
        .build();
}