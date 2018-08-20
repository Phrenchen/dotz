import { Rectangle } from "pixi.js";

export class DebugHelper{
    
    // prints every attribute + value
    public static analyzeObject(obj:Object):void{
        console.log("analyzing: " + obj);
        for(let att in obj){
            try{
                console.log(att + " = " + obj[att]);
            }
            catch(e){
                console.log("error analyzing: " + att);
            }
        }
        console.log("----");
    }

    public static drawGrid(graphics:PIXI.Graphics, viewport:Rectangle, offsetX:number, offsetY:number):void{
        let numColumns:number = Math.floor(viewport.width / offsetX);
        let numRows:number = Math.floor(viewport.height / offsetY);
        console.log("cols & rows: " + numColumns, numRows);

        graphics.clear();
        graphics.lineStyle(1, 0xFF0000);

        let posX:number = 0;
        let posY:number = 0;

        // draw verticals
        for(let c:number= 0; c<numColumns; c++){
            posX = c * offsetX;
            graphics.moveTo(posX, 0);
            graphics.lineTo(posX, viewport.height);
        }

        // horizontals
        for(let r:number = 0; r<numRows; r++){
            posY = r * offsetY;
            graphics.moveTo(0, posY);
            graphics.lineTo(viewport.width, posY);
        }
    }
}