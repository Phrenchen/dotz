import { AssetConsts } from "./../AssetConsts";
//import { Vehicle } from "./swarm/Vehicle";
import { Unit } from "./Unit";

export class Food extends Unit{


    constructor(isPlayerUnit:boolean, unitColor:number){
        super(AssetConsts.ASSET_FOOD, isPlayerUnit, unitColor);
        this.sprite.scale.x = .3;
        this.sprite.scale.y = .3;
    }

}