import { Swarm } from "./Swarm";
import { Vector2D } from "./Vector2D";
import { UnitType } from "../model/SwarmConfigTypes";

export class SwarmBehaviour{

    public static getNearestSwarm(actor:Swarm, choices:Array<Swarm>, unitType:UnitType = UnitType.ALL, ignore:number = -1):Swarm{
        let minDistance:number = Number.MAX_VALUE;
        let numChoices:number = choices.length;
        let distance:number;
        let choice:Swarm;
        let minDistanceID:number = -1;
        
        for(let i:number = 0; i<numChoices; i++){
            choice = choices[i];
            //distance = actor.properties.currentTargetSwarmLocation.dist(choice.properties.currentTargetSwarmLocation);
            distance = actor.properties.origin.dist(choice.properties.origin);
            /* skip swarm if 
                - it is the actor itself OR
                - mismatching unitTypes OR
                - unitType is irrelevant
                - or it has no living units

            */
            if(choice.properties.id == actor.properties.id ||   // ignore identicals
                (unitType != UnitType.ALL && choice.properties.unitType != unitType) ||       // ignore wrong unittype
                //unitType == UnitType.ALL ||                     // all
                !choice.properties.isAlive ||   
                //ignoreIDs.indexOf(choice.properties.id) != -1
                ignore == choice.properties.id
            ){
                continue;       // ignore currentTarget. we only look for new targets
            }
            
            if(distance < minDistance){
                minDistance = distance;
                minDistanceID = i;
            }
        }
        
        if(minDistanceID >= 0 && minDistanceID < choices.length){
            //console.log("nearest swarm is alive: " + choices[minDistanceID].properties.isAlive);
            //console.log("found nearest swarm: " + choices[minDistanceID].properties.id);
            return choices[minDistanceID];
        }
        return null;
    }

    public static getNearestSwarmByPosition(position:Vector2D, choices:Array<Swarm>):Swarm{
        let minDistance:number = Number.MAX_VALUE;
        let numChoices:number = choices.length;
        let distance:number;
        let choice:Swarm;
        let minDistanceID:number = -1;
        
        for(let i:number = 0; i<numChoices; i++){
            choice = choices[i];
            distance = position.dist(choice.properties.currentTargetSwarmLocation);
            
            if(distance < minDistance){
                minDistance = distance;
                minDistanceID = i;
            }
        }
        return choices[minDistanceID != -1 ? minDistanceID : 0];
    }
}