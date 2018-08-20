import { Dialog } from "./Dialog";
import { GameEvents } from "../../GameEvents";


export class DialogGameOver extends Dialog{
    protected onClick():void{
        console.log("game over dialog clicked");
        //this.emit(GameEvents.GAME_OVER);
    }
}