import { EventEmitter } from "events";
import { GameEvents } from "./GameEvents";
import { Vector2D } from "./swarm/Vector2D";
import { DebugHelper } from "../helper/DebugHelper";


/** 
 * user input
 * communicates between UI and game
 * 
*/
export class InputControl extends EventEmitter{

    public init(disp:PIXI.Container):void{
        disp.interactive = true;
        
        let isMobile:boolean = (navigator.userAgent).indexOf("Mobile") != -1;
        
        if(isMobile){
            // mobile devices
            disp.on("touchstart", (e) => { 
                let firstTouch:any = e.data.originalEvent.changedTouches[0];
                if(firstTouch){
                    this.emit(GameEvents.TOUCH_START, 
                        new Vector2D(
                            firstTouch.clientX, 
                            firstTouch.clientY
                        )
                    );
                }
            });
    
            disp.on("touchend", (e) => { 
                let firstTouch:any = e.data.originalEvent.changedTouches[0];
                if(firstTouch){
                    this.emit(GameEvents.TOUCH_END, 
                        new Vector2D(
                            firstTouch.clientX,
                            firstTouch.clientY
                        )
                    );
                }
            });
        }
        else{
            // on desktop
            disp.on("pointerdown", (e) => { 
                let firstTouch:any = e.data.originalEvent;
                this.emit(GameEvents.TOUCH_START, 
                    new Vector2D(
                        firstTouch.clientX, 
                        firstTouch.clientY
                    )
                );
            });
            disp.on("pointerup", (e) => { 
                this.emit(GameEvents.TOUCH_END, 
                    new Vector2D(
                        e.data.originalEvent.clientX, 
                        e.data.originalEvent.clientY
                    )
                );
            });
        } 
    }
}