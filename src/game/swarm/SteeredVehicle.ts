import { Vehicle } from "./Vehicle";
import { Vector2D } from "./Vector2D";
import { Circle } from "./Circle";

export class SteeredVehicle extends Vehicle
{
    public steeringForce:Vector2D;

    public maxForce:number = 5;           // 1
    public arrivalThreshold:number = 100;  // 100
    public wanderAngle:number = 0;
    public wanderDistance:number = 10;     // 10
    public wanderRadius:number = 5;       // 5
    public wanderRange:number = 1;        // 1
    public pathIndex:number = 0;
    public pathThreshold:number = 20;
    public avoidDistance:number = 300;
    public avoidBuffer:number = 20;
    public inSightDist:number = 200;        // 200
    public tooCloseDist:number = 1;        // 60
    
    constructor()
    {
        super();
        this.steeringForce = new Vector2D();
    }
    
    public update():void
    {
        this.steeringForce.truncate(this.maxForce);
        this.steeringForce = this.steeringForce.divide(this.mass);
        this.velocity = this.velocity.add(this.steeringForce);
        //this.steeringForce = new Vector2D();
        super.update();
    }
    
    public seek(target:Vector2D):void
    {
        let desiredVelocity:Vector2D = target.subtract(this.position);
        desiredVelocity.normalize();
        desiredVelocity = desiredVelocity.multiply(this.maxSpeed);
        let force:Vector2D = desiredVelocity.subtract(this.velocity);
        this.steeringForce = this.steeringForce.add(force);
    }
    
    public flee(target:Vector2D):void
    {
        let desiredVelocity:Vector2D = target.subtract(this.position);
        desiredVelocity.normalize();
        desiredVelocity = desiredVelocity.multiply(this.maxSpeed);
        let force:Vector2D = desiredVelocity.subtract(this.velocity);
        this.steeringForce = this.steeringForce.subtract(force);
    }
    
    public arrive(target:Vector2D):void
    {
        let desiredVelocity:Vector2D = target.subtract(this.position);
        desiredVelocity.normalize();
        
        let dist:number = this.position.dist(target);
        if(dist > this.arrivalThreshold)
        {
            desiredVelocity = desiredVelocity.multiply(this.maxSpeed);
        }
        else
        {
            desiredVelocity = desiredVelocity.multiply(this.maxSpeed * dist / this.arrivalThreshold);
        }
        
        let force:Vector2D = desiredVelocity.subtract(this.velocity);
        this.steeringForce = this.steeringForce.add(force);
    }
    
    public pursue(target:Vehicle):void
    {
        let lookAheadTime:number = this.position.dist(target.position) / this.maxSpeed;
        let predictedTarget:Vector2D = target.position.add(target.velocity.multiply(lookAheadTime));
        this.seek(predictedTarget);
    }
    
    public evade(target:Vehicle):void
    {
        let lookAheadTime:number = this.position.dist(target.position) / this.maxSpeed;
        let predictedTarget:Vector2D = target.position.subtract(target.velocity.multiply(lookAheadTime));
        this.flee(predictedTarget);
    }
    
    public wander():void
    {
        let center:Vector2D = this.velocity.clone().normalize().multiply(this.wanderDistance);
        let offset:Vector2D = new Vector2D(0);
        offset.setLength(this.wanderRadius);
        offset.setAngle(this.wanderAngle);
        this.wanderAngle += Math.random() * this.wanderRange - this.wanderRange * .5;
        let force:Vector2D = center.add(offset);
        this.steeringForce = this.steeringForce.add(force);
    }
    
    public avoid(circles:Array<Circle>):void
    {
        for( let i:number = 0; i < circles.length; i++)
        {
             let circle:Circle = circles[i] as Circle;
             let heading:Vector2D = this.velocity.clone().normalize();
            
            // vector between circle and vehicle:
             let difference:Vector2D = circle.position.subtract(this.position);
             let dotProd:number = difference.dotProd(heading);
            
            // if circle is in front of vehicle...
            if(dotProd > 0)
            {
                // vector to represent "feeler" arm
                let feeler:Vector2D = heading.multiply(this.avoidDistance);
                // project difference vector onto feeler
                let projection:Vector2D = heading.multiply(dotProd);
                // distance from circle to feeler
                let dist:number = projection.subtract(difference).getLength();
                
                // if feeler intersects circle (plus buffer),
                //and projection is less than feeler length,
                // we will collide, so need to steer
                if(dist < circle.radius + this.avoidBuffer &&
                    projection.getLength() < feeler.getLength())
                {
                    // calculate a force +/- 90 degrees from vector to circle
                    let force:Vector2D = heading.multiply(this.maxSpeed);
                    force.setAngle(force.getAngle() + difference.sign(this.velocity) * Math.PI / 2);
                    
                    // scale this force by distance to circle.
                    // the further away, the smaller the force
                    force = force.multiply(1.0 - projection.getLength() /
                                                    feeler.getLength());
                    
                    // add to steering force
                    this.steeringForce = this.steeringForce.add(force);
                    
                    // braking force
                    this.velocity = this.velocity.multiply(projection.getLength() / feeler.getLength());
                }
            }
        }
    }
    
    public followPath(path:Array<Vector2D>, loop:Boolean = false):void
    {
        let wayPoint:Vector2D = path[this.pathIndex];
        if(wayPoint == null) return;
        if(this.position.dist(wayPoint) < this.pathThreshold)
        {
            if(this.pathIndex >= path.length - 1)
            {
                if(loop)
                {
                    this.pathIndex = 0;
                }
            }
            else
            {
                this.pathIndex++;
            }
        }
        if(this.pathIndex >= path.length - 1 && !loop)
        {
            this.arrive(wayPoint);
        }
        else
        {
            this.seek(wayPoint);
        }
    }
    
    public flock(vehicles:Array<Vehicle>):void
    {
        let averageVelocity:Vector2D = this.velocity.clone();
        let averagePosition:Vector2D = new Vector2D();
        let inSightCount:number = 0;
        for( let i:number = 0; i < vehicles.length; i++)
        {
            let vehicle:Vehicle = vehicles[i] as Vehicle;
            if(vehicle != this && this.inSight(vehicle))
            {
                averageVelocity = averageVelocity.add(vehicle.velocity);
                averagePosition = averagePosition.add(vehicle.position);
                if(this.tooClose(vehicle)){
                    this.flee(vehicle.position);
                    //console.log("too close, should flee");
                }
                inSightCount++;
            }
        }

        if(inSightCount > 0)
        {
            //console.log("flocking and found neighbours: " + inSightCount);
            averageVelocity = averageVelocity.divide(inSightCount);
            averagePosition = averagePosition.divide(inSightCount);
            this.seek(averagePosition);
            this.steeringForce.add(averageVelocity.subtract(this.velocity));
        }
    }
    
    public inSight(vehicle:Vehicle):Boolean		
    {
        if(this.position.dist(vehicle.position) > this.inSightDist) return false;
        let heading:Vector2D = this.velocity.clone().normalize();
        let difference:Vector2D = vehicle.position.subtract(this.position);
        let dotProd:number = difference.dotProd(heading);
        
        if(dotProd < 0) return false;
        return true;
    }
    
    public tooClose(vehicle:Vehicle):Boolean
    {
        return this.position.dist(vehicle.position) < this.tooCloseDist;
    }
}