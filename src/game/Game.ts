import { SystemRenderer, Point, Rectangle } from "pixi.js";
import { LaunchPad } from "./LaunchPad";

import { GlobalAppData } from "./GlobalAppData";
import { MathHelper } from "./../helper/MathHelper";
import { Map } from "./Map";
import { MapProperties } from "./MapProperties";
import { SwarmData } from "./swarm/SwarmData";
import { Hud } from "./gui/Hud";
import { MapFactory } from "./MapFactory";

import { GameData } from "./model/GameData";
import { GameConsts } from "./GameConsts";
import { GameEvents } from "./GameEvents";
import { EventEmitter } from "events";
import { PlayerVO } from "./model/PlayerVO";
import { SwarmFactory } from "./swarm/SwarmFactory";


// used by connector class (react) MapContainer
export interface IGame{
    getRemainingFood():number;
    getRemainingEnemies():number;
}

export class Game extends EventEmitter implements IGame{
    
    private mapFactory: MapFactory;
    private stageBackground:PIXI.Container;
    
    public stage:PIXI.Container;
    public map:Map;    
    public hud:Hud;
    
    public gameData:GameData;
    
    public isGameOver:boolean = false;
    


    constructor(){
        super();
    }

    public spawnFood():boolean{
        return this.map.spawnSwarm(GameConsts.ID_FOOD);
    }
    
    public getRemainingFood(): number {
        return this.map ? this.map.getRemainingFood() : 0;
    }
    public getRemainingEnemies(): number {
        return this.map ? this.map.getRemainingEnemies() : 0;
    }

    public start():void{
        this.gameLoop();
    }

    public setGameOver():void{
        this.isGameOver = true;
        this.map.dispose();
    }

    public init(renderer:any, stage:PIXI.Container, players:any){
        this.stage = stage;
        GlobalAppData.APP_RENDERER = renderer;
        GlobalAppData.viewport.width = window.innerWidth;
        GlobalAppData.viewport.height = window.innerHeight;

        this.mapFactory = new MapFactory( new SwarmFactory() );

        // static setup
        //this.map = this.mapFactory.createByID(new PIXI.Container());        
        
        let mapPaddingX:number = 10;
        let mapPaddingY:number = 10;
        let sectorWidth:number =  GlobalAppData.APP_RENDERER.screen.width / players.length;
        let sectorHeight:number =  GlobalAppData.APP_RENDERER.screen.height / players.length;
        let sectorSize:Point = new Point(sectorWidth, sectorHeight);

        // TODO: find out how many players
        // TODO NEXT
        //console.log(props.players);

        this.map = this.mapFactory.createDefaultMap(  new PIXI.Container(), 
                                                        players, 
                                                        new Rectangle(
                                                            0, 
                                                            0, 
                                                            GlobalAppData.APP_RENDERER.view.width, 
                                                            GlobalAppData.APP_RENDERER.screen.height
                                                        )
                                                    );
        this.map.on(GameEvents.PLAYER_UNIT_DEAD, (playerID:number) => {
            if(!this.isGameOver){
                //console.log("emitting: PLAYER_UNIT_DEAD");
                this.emit(GameEvents.PLAYER_UNIT_DEAD, playerID);
            }
        });

        this.map.on(GameEvents.FOOD_COLLECTED, (playerID:number) => {
            if(!this.isGameOver){
                //console.log("emitting: FOOD_COLLECTED");
                this.emit(GameEvents.FOOD_COLLECTED, playerID);
            }
        });

        this.map.on(GameEvents.PLAYER_EXTINCT, (id) => {
            if(!this.isGameOver){
                //console.log("emitting: PLAYER_EXTINCT");
                this.emit(GameEvents.PLAYER_EXTINCT, id);
            }
        });

        this.map.on(GameEvents.GAME_OVER, () => {
            // only announce game over once. hacky? :)
            if(!this.isGameOver){
                //console.log("emmitting: GAME_OVER");

                this.setGameOver();
                this.emit(GameEvents.GAME_OVER);
            }
        });
       
        this.hud = new Hud(new PIXI.Container());
        
        //this.map.disp.x = 20;
        this.map.disp.y = this.hud.disp.y + this.hud.disp.height + 20;
        
        //this.gameDialogs = new GameDialogs(new PIXI.Container());
        
        this.stage.addChild(this.map.disp);
        this.stage.addChild(this.hud.disp);
        
        this.updateOnStageResize();
    }

    public updateOnStageResize():void{
        GlobalAppData.viewport.width = window.innerWidth;
        GlobalAppData.viewport.height = window.innerHeight;
        
        //this.drawBackground();
        if(this.map){
            this.map.updateOnStageResize();
        }
    }

    private gameLoop = () =>{
        requestAnimationFrame(this.gameLoop);

        if(!this.isGameOver){
            this.map.update();
            GlobalAppData.APP_RENDERER.render(this.stage);
        }

    }

    public updatePlayers(players:Array<PlayerVO>):void{
        if(this.map){
            this.map.updatePlayers(players);
        }
    }
}