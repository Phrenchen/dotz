import { PlayerVO } from "./model/PlayerVO";
import { SwarmProperties } from "./model/SwarmConfigTypes";


export class MapProperties{

    public swarms:Array<SwarmProperties>;
    public players:Array<PlayerVO>;

    public foodRefills:number = 5;      // 1 = one initial food creation. no refill
    public foorRefillDelay:number = 10000;  // milliseconds
    
    constructor(){}

    public hasActivePlayer():boolean{
        return this.getActivePlayerID() != -1;
    }

    public getActivePlayerID():number{
        let activePlayerID:number = -1;

        this.players.map((player) => {
            if(player.isActive){
                activePlayerID = player.id;
            }
        });
        return activePlayerID;
    }
}