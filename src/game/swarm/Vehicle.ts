import { Vector2D } from "./Vector2D";


	
/**
 * Base class for moving characters.
 */
export class Vehicle
{
    // potential edge behaviors
    public static WRAP:String = "wrap";
    public static BOUNCE:String = "bounce";
    
    protected _edgeBehavior:String = Vehicle.BOUNCE;
    public mass:number = 50.0;          // 10
    public maxSpeed:number = 1;         // 1
    public position:Vector2D;
    public velocity:Vector2D;
    protected rotation: number;

    public stageWidth:number = 1920;
    public stageHeight:number = 1080;
    
    
    /**
     * Constructor.
     */
    constructor()
    {
        this.position = new Vector2D();
        this.velocity = new Vector2D();
    }
    
    
    /**
     * Handles all basic motion. Should be called on each frame / timer interval.
     */
    public update():void
    {
        // make sure velocity stays within max speed.
        this.velocity.truncate(this.maxSpeed);
        
        // add velocity to position
        this.position = this.position.add(this.velocity);
        
        // handle any edge behavior
        if(this._edgeBehavior == Vehicle.WRAP)
        {
            this.wrap();
        }
        else if(this._edgeBehavior == Vehicle.BOUNCE)
        {
            this.bounce();
        }
        
        // rotate heading to match velocity
        this.rotation = this.velocity.getAngle();// * 180 / Math.PI;		//TODO: check if starling rotation also uses radians
    }
    
    /**
     * Causes character to bounce off edge if edge is hit.
     */
    private  bounce():void
    {
        
        if(this.position.x > this.stageWidth)
        {
            this.position.x = this.stageWidth;
            this.velocity.x *= -1;
        }
        else if(this.position.x < 0)
        {
            this.position.x = 0;
            this.velocity.x *= -1;
        }
        
        if(this.position.y > this.stageHeight)
        {
            this.position.y = this.stageHeight;
            this.velocity.y *= -1;
        }
        else if(this.position.y < 0)
        {
            this.position.y = 0;
            this.velocity.y *= -1;
        }
    }
    
    
    /**
     * Causes character to wrap around to opposite edge if edge is hit.
     */
    private  wrap():void
    {
        if(this.position.x > this.stageWidth) this.position.x = 0;
        if(this.position.x < 0) this.position.x = this.stageWidth;
        if(this.position.y > this.stageHeight) this.position.y = 0;
        if(this.position.y < 0) this.position.y = this.stageHeight;  
    }
    
    /**
     * Sets / gets what will happen if character hits edge.
     */
    public  setEdgeBehavior(value:String):void
    {
        this._edgeBehavior = value;
    }
    public  getEdgeBehavior():String
    {
        return this._edgeBehavior;
    }
   
    
}