import { DialogManager } from "./DialogManager";
import { DialogGameStart } from "./DialogGameStart";
import { AvailableDialogs } from "./AvailableDialogs";
import { DialogProperties } from "./DialogProperties";
import { Colors } from "../../../helper/VisualHelper";
import { Dialog } from "./Dialog";
import { DialogGameOver } from "./DialogGameOver";


/**
 * instanciate all dialogs (GOOD IDEA??? probably not, if game grows. TODO!!!!!)
 * add aaaaall the dialogs to mana    showInitialDialog(): any {
        throw new Error("Method not implemented.");
    }
ger 
 */

export class GameDialogs{
    /*
    public container:PIXI.Container;

    constructor(container:PIXI.Container){
        this.container = container;
        DialogManager.container = container;
        
        this.init();
    }

    // add all dialogs to manager. 
    // possible issue: all dialogs are instanciated early...
    private init():void{
        DialogManager.addDialog(new DialogGameStart(AvailableDialogs.START));
        DialogManager.addDialog(new DialogGameOver(AvailableDialogs.GAME_OVER));

    }

    public showInitialDIalog():Dialog{
        return DialogManager.showDialog(AvailableDialogs.START, this.getProperties(AvailableDialogs.START));
    }

    public showGameOverDialog():Dialog{
        return DialogManager.showDialog(AvailableDialogs.GAME_OVER, this.getProperties(AvailableDialogs.GAME_OVER));
    }

    public hideDialogs():void{
        DialogManager.hideDialogs();
    }

    private getProperties(id:AvailableDialogs):DialogProperties{
        let props:DialogProperties;

        console.log("getting dialog properties for " + id);

        switch(id){

            case AvailableDialogs.GAME_OVER:
                props = {
                    dialogWidth:100,
                    dialogHeight:400,
                    autoCloseInSeconds:-1,
                    txtTitle: "GAME OVER!",
                    txtDescription: "some stats"
                };
                break;
            case AvailableDialogs.START:
            default:
                props = {
                    dialogWidth:400,
                    dialogHeight:200,
                    autoCloseInSeconds:-1,
                    txtTitle: "Welcome to sWARms AT WAR\n\nenjoy mindless little creatures\nharvest food and kill each other",
                    txtDescription: "click colored buttons to spawn a swarm.\ngame is over when no food is left.\ngood luck :)"
                };
                break;
        }
        return props;
    }
    */
}