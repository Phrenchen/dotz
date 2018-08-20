import { AvailableDialogs } from "./AvailableDialogs";
import { Dialog } from "./Dialog";
import { DialogProperties } from "./DialogProperties";
//import { HashTable } from "../../../helper/HashTable";
import { GlobalAppData } from "../../GlobalAppData";
import { DialogEvent } from "./DialogEvent";
import { VisualHelper } from "../../../helper/VisualHelper";
import { Rectangle } from "pixi.js";

/**
 * - shows / hides dialogs
 * - stores dialogs -> extra model necessary?
 * 
 * question: it currently expects instances of dialogs. 
 */

class EmptyDialog extends Dialog{}


export class DialogManager{
/*
    public static container:PIXI.Container;
    private static emptyDialog:Dialog = new EmptyDialog(AvailableDialogs.EMPTY);
    //private static dialogs:HashTable<Dialog> = {};

    public static addDialog(d:Dialog):void{
        DialogManager.dialogs[d.id] = d;
    }



    public static showDialog(id:AvailableDialogs, properties:DialogProperties):Dialog{
        let dialog:Dialog = DialogManager.dialogs[id];

        if(dialog != null){
            DialogManager.container.addChild(dialog.disp);
            dialog.setProperties(properties);

            // debug scaling
            let viewport:Rectangle = GlobalAppData.viewport.clone();
            
            viewport.width -= 300;
            viewport.height -= 200;

            //VisualHelper.scaleToFit(dialog.disp, viewport);
            dialog.show();

            // center dialog on stage
            dialog.disp.x = GlobalAppData.APP_RENDERER.screen.width * .5 - dialog.disp.width * .5;
            dialog.disp.y = GlobalAppData.APP_RENDERER.screen.height * .5 - dialog.disp.height * .5;

            dialog.on(DialogEvent.CLOSE_DIALOG, (e) => {DialogManager.onDialogClosed(e)} );

            return dialog;
        }
        return DialogManager.emptyDialog;       // return null illegal?
    }
    
    private static onDialogClosed(e):void{
        console.log("on dialog closed: check queue. do we need to display next dialog? " + e);
        //DialogManager.dialogs[e].hide();

        //TODO: dispatch event? required to inform anyone?
    }

    public static hideDialogs():void{
        for(let d in DialogManager.dialogs){
            console.log("hide dialog:" + d + ": " + DialogManager.dialogs[d]);
            DialogManager.dialogs[d].hide();
        }
    }
    */
}