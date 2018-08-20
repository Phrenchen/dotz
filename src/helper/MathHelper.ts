import { Vector2D } from "../game/swarm/Vector2D";
import { VisualHelper } from "./VisualHelper";
import { Rectangle } from "pixi.js";

export class MathHelper{
    
    public static getRandomInt(min, max):number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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

    public static centerOfStage(viewport:Rectangle):Vector2D{
        return new Vector2D(
            viewport.width * .5,
            viewport.height * .5
        );
    }

    public static leftCenter(viewport:Rectangle):Vector2D{
        return new Vector2D(
            0,
            viewport.height * .5
        );
    }

    public static rightCenter(viewport:Rectangle):Vector2D{
        return new Vector2D(
            viewport.width,
            viewport.height * .5
        );
    }

    public static centerTop(viewport:Rectangle):Vector2D{
        return new Vector2D(
            viewport.width * .5,
            0
        );
    }

    public static centerBottom(viewport:Rectangle):Vector2D{
        return new Vector2D(
            viewport.width * .5,
            viewport.height
        );
    }
}