import { Dialog } from "./Dialog";
import { GameEvents } from "../../GameEvents";

export class GameOverDialog extends Dialog{
    protected onClick(e):void{ 
        this.emit(GameEvents.START_MENUE);
    }

}