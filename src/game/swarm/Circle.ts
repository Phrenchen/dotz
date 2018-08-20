import { Vector2D } from "./Vector2D";

export class Circle
{
    public radius:number;
    public position:Vector2D;

    constructor(radius:number, position:Vector2D)
    {
        this.position = position;
        this.radius = radius;
    }
}
