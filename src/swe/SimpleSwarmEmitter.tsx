import * as PIXI from 'pixi.js';
import { EventEmitter } from "events";
import { Swarm } from "../game/swarm/Swarm";
import { AssetConsts } from "../game/AssetConsts";
import { Vector2D } from "../game/swarm/Vector2D";
import { SwarmFactory } from '../game/swarm/SwarmFactory';
import { SwarmProperties } from '../game/model/SwarmConfigTypes';
import { SwarmBehaviourTree } from './SwarmBehaviourTree';

export class SwarmEmitterEvent{
    public static READY:string = "READY";
}

export class SimpleSwarmEmitter extends EventEmitter{
    
    public swarms:Array<Swarm> = new Array<Swarm>();

    private renderer:any;
    private stage:PIXI.Container = new PIXI.Container();
    private swarmFactory:SwarmFactory = new SwarmFactory();

    private originMarkerContainer:PIXI.Container = new PIXI.Container();

    constructor(){
        super();
        this.stage.addChild(this.originMarkerContainer);
    }
    
    public init(canvasID:string = "gameContainer"):void{
        let container:HTMLCanvasElement = document.getElementById(canvasID) as HTMLCanvasElement;
        this.renderer = PIXI.autoDetectRenderer(640, 480, {antialias:true, view:container});
        this.renderer.view.style.display = "block";
        this.renderer.autoResize = true;
        this.renderer.resize(window.innerWidth, window.innerHeight);
        
        // load assets
        try{
            if(!PIXI.loader.loading){
                PIXI.loader
                .add(AssetConsts.SPRITESHEET_LAUNCHER)
                .load( () => {
                    //console.log("assets loaded");
                    this.emit(SwarmEmitterEvent.READY);
                });
            }
        }
        catch(e){
            //console.log("trying to reload assets? done");
            this.emit(SwarmEmitterEvent.READY);
        }

        window.addEventListener('resize', (e) => { 
            var w = window.innerWidth;
            var h = window.innerHeight;

            this.renderer.view.style.width = w + "px";
            this.renderer.view.style.height = h + "px";
            this.renderer.resize(w,h);
        });

        window.addEventListener('deviceOrientation', (e) => { 
            this.renderer.resize(window.innerWidth, window.innerHeight);
        });
        
        this.gameLoop();
    }

    public clear():void{
        this.swarms.map((swarm) => {
            swarm.dispose();
        });
        this.swarms.length = 0;
    }
    
    private gameLoop = () =>{
        requestAnimationFrame(this.gameLoop);
        let pointerPosition:Vector2D = new Vector2D();
        let originMarker:PIXI.Sprite;
        let counter:number = 0;

        this.swarms.map((swarm) => {
            swarm.update(pointerPosition);
            
            
            // draw center for each swarm
            originMarker = this.originMarkerContainer.getChildAt(counter) as PIXI.Sprite;
            originMarker.x = swarm.properties.origin.x;
            originMarker.y = swarm.properties.origin.y;

            counter++;
        });

        this.renderer.render(this.stage);
    }
    
    private createSwarmOrigin(properties:SwarmProperties):PIXI.Sprite{
        let textures = PIXI.loader.resources[AssetConsts.SPRITESHEET_LAUNCHER].textures as any;
        let sprite = new PIXI.Sprite( textures[AssetConsts.ASSET_UNIT_WORKER] );
        sprite.tint = properties.unitColor;
        sprite.x = properties.origin.x - sprite.width * .5;
        sprite.y = properties.origin.y - sprite.height * .5;
        return sprite;
    }
    
    public create(properties:SwarmProperties = null):Swarm{
        let swarm = this.swarmFactory.create(properties, this.stage);
        swarm.properties.id = this.swarms.length + 1;
        swarm.updateOnStageResize(window.innerWidth, window.innerHeight);
        swarm.properties.behaviorTree = new SwarmBehaviourTree(swarm, this.swarms);
        this.swarms.push(swarm);
        
        // add white marker for the origin
        this.originMarkerContainer.addChild( this.createSwarmOrigin(swarm.properties) );
        
        return swarm;
    }
}
