import { Unit } from "./Unit";
import { Swarm } from "./Swarm";

export default class SwarmHelper{

    public static assignNewTarget(unit:Unit, swarm:Swarm):void{
        let targetUnit:Unit = swarm.getNextUntargetedUnit();
    
        if(targetUnit){
            unit.setTargetUnit( targetUnit );
            targetUnit.hasBeenTargeted = true;
        }
    }
}