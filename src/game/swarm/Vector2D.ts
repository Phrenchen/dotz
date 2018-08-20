/**
 * A basic 2-dimensional vector class.
 */
export class Vector2D
{
	public x:number;
	public y:number;
	
	/**
	 * Constructor.
	 */
	constructor(x:number = 0, y:number = 0)
	{
		this.x = x;
		this.y = y;
	}
	
	/**
	 * Can be used to visualize the vector. Generally used for debug purposes only.
	 * @param graphics The Graphics instance to draw the vector on.
	 * @param color The color of the line used to represent the vector.
	 */
	/*public draw(graphics:Graphics, color:uint = 0):void
	{
		graphics.lineStyle(0, color);
		graphics.moveTo(0, 0);
		graphics.lineTo(x, y);
	}*/
	
	/**
	 * Generates a copy of this vector.
	 * @return Vector2D A copy of this vector.
	 */
	public clone():Vector2D
	{
		return new Vector2D(this.x, this.y);
	}
	
	/**
	 * Sets this vector's x and y values, and thus length, to zero.
	 * @return Vector2D A reference to this vector.
	 */
	public zero():Vector2D
	{
		this.x = 0;
		this.y = 0;
		return this;
	}
	
	/**
	 * Whether or not this vector is equal to zero, i.e. its x, y, and length are zero.
	 * @return Boolean True if vector is zero, otherwise false.
	 */
	public  isZero():Boolean
	{
		return this.x == 0 && this.y == 0;
	}
	
	/**
	 * Sets / gets the length or magnitude of this vector. Changing the length will change the x and y but not the angle of this vector.
	 */
	public  setLength(value:number):void
	{
		var a:number = this.getAngle();
		this.x = Math.cos(a) * value;
		this.y = Math.sin(a) * value;
	}
	public  getLength():number
	{
		return Math.sqrt(this.getLengthSQ());
	}
	
	/**
	 * Gets the length of this vector, squared.
	 */
	public  getLengthSQ():number
	{
		return this.x * this.x + this.y * this.y;
	}
	
	/**
	 * Gets / sets the angle of this vector. Changing the angle changes the x and y but retains the same length.
	 */
	public  setAngle(value:number):void
	{
		var len:number = this.getLength();
		this.x = Math.cos(value) * len;
		this.y = Math.sin(value) * len;
	}
	public  getAngle():number
	{
		return Math.atan2(this.y, this.x);
	}
	
	/**
	 * Normalizes this vector. Equivalent to setting the length to one, but more efficient.
	 * @return Vector2D A reference to this vector. 
	 */
	public  normalize():Vector2D
	{
		if(this.getLength() == 0)
		{
			this.x = 1;
			return this;
		}
		var len:number = this.getLength();
		this.x /= len;
		this.y /= len;
		return this;
	}
	
	/**
	 * Ensures the length of the vector is no longer than the given value.
	 * @param max The maximum value this vector should be. If length is larger than max, it will be truncated to this value.
	 * @return Vector2D A reference to this vector.
	 */
	public  truncate(max:number):Vector2D
	{
		length = Math.min(max, this.getLength());
		return this;
	}
	
	/**
	 * Reverses the direction of this vector.
	 * @return Vector2D A reference to this vector.
	 */
	public  reverse():Vector2D
	{
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}
	
	/**
	 * Whether or not this vector is normalized, i.e. its length is equal to one.
	 * @return Boolean True if length is one, otherwise false.
	 */
	public  isNormalized():Boolean
	{
		return this.getLength() == 1.0;
	}
	
	/**
	 * Calculates the dot product of this vector and another given vector.
	 * @param v2 Another Vector2D instance.
	 * @return number The dot product of this vector and the one passed in as a parameter.
	 */
	public  dotProd(v2:Vector2D):number
	{
		return this.x * v2.x + this.y * v2.y;
	}
	
	/**
	 * Calculates the cross product of this vector and another given vector.
	 * @param v2 Another Vector2D instance.
	 * @return number The cross product of this vector and the one passed in as a parameter.
	 */
	public  crossProd(v2:Vector2D):number
	{
		return this.x * v2.y - this.y * v2.x;
	}
	
	/**
	 * Calculates the angle between two vectors.
	 * @param v1 The first Vector2D instance.
	 * @param v2 The second Vector2D instance.
	 * @return number the angle between the two given vectors.
	 */
	public static  angleBetween(v1:Vector2D, v2:Vector2D):number
	{
		if(!v1.isNormalized()) v1 = v1.clone().normalize();
		if(!v2.isNormalized()) v2 = v2.clone().normalize();
		return Math.acos(v1.dotProd(v2));
	}
	
	/**
	 * Determines if a given vector is to the right or left of this vector.
	 * @return int If to the left, returns -1. If to the right, +1.
	 */
	public  sign(v2:Vector2D):number
	{
		return this.getPerp().dotProd(v2) < 0 ? -1 : 1;
	}
	
	/**
	 * Finds a vector that is perpendicular to this vector.
	 * @return Vector2D A vector that is perpendicular to this vector.
	 */
	public  getPerp():Vector2D
	{
		return new Vector2D(-this.y, this.x);
	}
	
	/**
	 * Calculates the distance from this vector to another given vector.
	 * @param v2 A Vector2D instance.
	 * @return number The distance from this vector to the vector passed as a parameter.
	 */
	public  dist(v2:Vector2D):number
	{
		return Math.sqrt(this.distSQ(v2));
	}
	
	/**
	 * Calculates the distance squared from this vector to another given vector.
	 * @param v2 A Vector2D instance.
	 * @return number The distance squared from this vector to the vector passed as a parameter.
	 */
	public  distSQ(v2:Vector2D):number
	{
		var dx:number = v2.x - this.x;
		var dy:number = v2.y - this.y;
		return dx * dx + dy * dy;
	}
	
	/**
	 * Adds a vector to this vector, creating a new Vector2D instance to hold the result.
	 * @param v2 A Vector2D instance.
	 * @return Vector2D A new vector containing the results of the addition.
	 */
	public  add(v2:Vector2D):Vector2D
	{
		return new Vector2D(this.x + v2.x, this.y + v2.y);
	}
	
	/**
	 * Subtacts a vector to this vector, creating a new Vector2D instance to hold the result.
	 * @param v2 A Vector2D instance.
	 * @return Vector2D A new vector containing the results of the subtraction.
	 */
	public  subtract(v2:Vector2D):Vector2D
	{
		return new Vector2D(this.x - v2.x, this.y - v2.y);
	}
	
	/**
	 * Multiplies this vector by a value, creating a new Vector2D instance to hold the result.
	 * @param v2 A Vector2D instance.
	 * @return Vector2D A new vector containing the results of the multiplication.
	 */
	public  multiply(value:number):Vector2D
	{
		return new Vector2D(this.x * value, this.y * value);
	}
	
	/**
	 * Divides this vector by a value, creating a new Vector2D instance to hold the result.
	 * @param v2 A Vector2D instance.
	 * @return Vector2D A new vector containing the results of the division.
	 */
	public  divide(value:number):Vector2D
	{
		return new Vector2D(this.x / value, this.y / value);
	}
	
	/**
	 * Indicates whether this vector and another Vector2D instance are equal in value.
	 * @param v2 A Vector2D instance.
	 * @return Boolean True if the other vector is equal to this one, false if not.
	 */
	public  equals(v2:Vector2D):Boolean
	{
		return this.x == v2.x && this.y == v2.y;
	}
	
	/**
	 * Sets / gets the x value of this vector.
	 */
	public  setX(value:number):void
	{
		this.x = value;
	}
	
	/**
	 * Sets / gets the y value of this vector.
	 */
	public  setY(value:number):void
	{
		this.y = value;
	}
	
	/**
	 * Generates a string representation of this vector.
	 * @return String A description of this vector.
	 */
	public  toString():String
	{
		return "[Vector2D (x:" + this.x + ", y:" + this.y + ")]";
	}
}