import { Dialog } from "./Dialog";
import { GameEvents } from "../../GameEvents";


export class DialogGameStart extends Dialog{
    protected onClick():void{
        this.emit(GameEvents.START_GAME);
    }
}