
/**
 * static class providing helper methods to create backgrounds etc.
 */
import { TextHelper } from "./TextHelper";
import { Vector2D } from "../game/swarm/Vector2D";
import { ScreenAnchor, Alignment } from "../game/gui/TextFormats";
import { basename } from "path";

import { Rectangle } from "pixi.js";

export enum Colors{
    white = 0xFFFFFF,
    lightGrey = 0xCCCCCC,
    darkGrey = 0x666666,
    black = 0x000000,
    red = 0xFF0000
}


export class VisualHelper {

    public static createLabeledButton(labelStr:string, width:number, height:number, fillColor:number):PIXI.Container{
        let btn:PIXI.Container = new PIXI.Container();
        let txt:PIXI.Text = new PIXI.Text(labelStr, TextHelper.TEXT_STYLE_BUTTON_LABEL);
        txt.x = width / 2 - txt.width / 2;
        txt.y = height / 2 - txt.height / 2;
        
        let bg:PIXI.Graphics = VisualHelper.createRectangleGraphic(width, height, fillColor, 1, 10);
        btn.addChild(bg);
        btn.addChild(txt);
        btn.interactive = true;
        btn.buttonMode = true;

        return btn;
    }

    public static createRectangleGraphic(w:number, h:number, fillColor:number, alpha:number, cornerRadius:number = 0):PIXI.Graphics{
        let graphics:PIXI.Graphics = new PIXI.Graphics();
        graphics.interactive = true;
        graphics.beginFill(fillColor, alpha);
        
        if(cornerRadius > 0){
            graphics.drawRoundedRect(0,0, w, h, cornerRadius);
        }
        else{
            graphics.drawRect(0,0,w,h);
        }
        graphics.endFill;

        return graphics;
    }

    public static calculatePositionsOnCircle(numPositions:number, radius:number, centerInSlice:boolean = false):Array<Vector2D> {
        var positions:Array<Vector2D> = new Array<Vector2D>();
        var angleOffset:number = 360 / numPositions;
        var pos:Vector2D;
        var centerOffset:number = centerInSlice ? angleOffset / 2 : 0;
        
        for (var i:number = 0; i < numPositions; i++) {
            pos = VisualHelper.pointOnCircle(radius, i * angleOffset + centerOffset, new Vector2D(0, 0));
            
            positions.push(pos);
        }
        return positions;
    }
    
    public static pointOnCircle(radius:number, angleInDegrees:number, origin:Vector2D):Vector2D {
        var angleInRadians:number = angleInDegrees * Math.PI / 180;
        var x:number = radius * Math.cos(angleInRadians) + origin.x;
        var y:number = radius * Math.sin(angleInRadians) + origin.y;
        
        return new Vector2D(x, y);
    }

    public static align(elements:Array<PIXI.Container>, screenAnchor:ScreenAnchor, alignment:Alignment, viewPort:Rectangle, screenPadding:PIXI.Point = new PIXI.Point, elementPadding:PIXI.Point = new PIXI.Point()):void{
        let numElements:number = elements.length;
        let lastElement:PIXI.Container;
        let currentElement:PIXI.Container = elements[0];
        
        // for first element
        switch(screenAnchor){
            case ScreenAnchor.topLeft:
                currentElement.x = screenPadding.x;
                currentElement.y = screenPadding.y;
                break;
            case ScreenAnchor.topCenter:
                currentElement.x = viewPort.width * .5 - currentElement.width * .5;
                currentElement.y = screenPadding.y;
                break;
            case ScreenAnchor.topRight:
                currentElement.x = viewPort.width - currentElement.width - screenPadding.x;
                currentElement.y = screenPadding.y;
                break;
            case ScreenAnchor.centerLeft:
                currentElement.x = screenPadding.x;
                currentElement.y = viewPort.height * .5 - currentElement.height * .5;     
                break;
            case ScreenAnchor.centerCenter:
                currentElement.x = viewPort.width * .5 - currentElement.width * .5;
                currentElement.y = viewPort.height * .5 - currentElement.height * .5;
                break;
            case ScreenAnchor.centerRight:
                currentElement.x = viewPort.width - currentElement.width - screenPadding.x;
                currentElement.y = viewPort.height * .5 - currentElement.height * .5;
                break;
            case ScreenAnchor.bottomLeft:
                currentElement.x = screenPadding.x;
                currentElement.y = viewPort.height - currentElement.height;     
                break;
            case ScreenAnchor.bottomCenter:
                currentElement.x = viewPort.width * .5 - currentElement.width * .5;
                currentElement.y = viewPort.height - currentElement.height;
                break;
            case ScreenAnchor.bottomRight:
                currentElement.x = viewPort.width - currentElement.width - screenPadding.x;
                currentElement.y = viewPort.height - currentElement.height;
                break;
            default:
            // leave element at 0,0
            break;
        }
        
        // following elements orientate themselves to lastElement, depending on alignment
        
        // continue with 2nd element
        for(let i:number = 1; i<numElements; i++){
            lastElement = currentElement;
            currentElement = elements[i];
            
            if(alignment == Alignment.horizontal){
                currentElement.x = lastElement.x + lastElement.width + elementPadding.x;
                currentElement.y = lastElement.y + lastElement.height * .5 - currentElement.height * .5;
            }
            else{   // vertical
                currentElement.x = lastElement.x + lastElement.width * .5 - currentElement.width * .5;
                currentElement.y = lastElement.y + lastElement.height + elementPadding.y;
            }
        }
    }

    public static scaleToFit(disp:PIXI.Container, maxSize:Rectangle):void 
    {
        var dispSizeRatio:number = disp.height / disp.width;
        var rectRatio:number = maxSize.height / maxSize.width;
        var scale:number;
        
        if (dispSizeRatio > rectRatio) {
            scale = maxSize.width / disp.width;
            disp.width *= scale;
            disp.height *= scale;
        }
        else if (dispSizeRatio < rectRatio) {
            scale = maxSize.height / disp.height;
            disp.width *= scale;
            disp.height *= scale;
        }
    }
}