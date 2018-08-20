import { SwarmBehaviourEnum } from "../../components/gameInteraction/SelectSwarmBehaviour";
import { SwarmFormationEnum } from "../../components/gameInteraction/SelectSwarmFormation";

export class PlayerVO{
    id:number;
    playerName:string;
    playerColor:number;
    isWinner:boolean;
    isActive:boolean;
    
    actionPoints:number;
    unitCount:number;
    totalCollectedFood:number;
    totalKilledEnemies:number;
    
    currentFormation:SwarmFormationEnum;
    currentBehaviour:SwarmBehaviourEnum;

    public static sortByFoodThenEnemies(players):Array<PlayerVO>{
        let sortedPlayers:Array<PlayerVO> = players.slice(0);

        sortedPlayers.sort((p1, p2) => {
            if(p1.totalCollectedFood > p2.totalCollectedFood){
                return -1;
            }
            else if(p1.totalCollectedFood < p2.totalCollectedFood){
                return 1;
            }
            else{       // equal food count
                if(p1.totalKilledEnemies > p2.totalKilledEnemies){
                    return -1;
                }
                else if(p1.totalKilledEnemies < p2.totalKilledEnemies){
                    return 1;
                }
                return 0;   // equal food and enemies
            }
        });

        return sortedPlayers;
    }
}