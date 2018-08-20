import { Game, IGame } from "./Game";

import * as PIXI from 'pixi.js';
import { AssetConsts } from "./AssetConsts";
import { EventEmitter } from "events";
import { GameEvents } from "./GameEvents";
import { PlayerVO } from "./model/PlayerVO";
import { GameConsts } from "./GameConsts";

/** 
 * receives array of players from the owning react component´s store 
 * 
 * provides API to UI
 * 
*/



export class GameIndex extends EventEmitter implements IGame{

    private game:Game;

    // interface
    public getRemainingFood(): number {
        return this.game.getRemainingFood();
    }
    public getRemainingEnemies(): number {
        return this.game.getRemainingEnemies();
    }

    public start():void{
        //this.emit(GameEvents.PLAYER_UNIT_DEAD, 999999999);
    }

    public setGameOver():void{
        this.game.setGameOver();
    }
    
    public updatePlayers(players:Array<PlayerVO>):void{
        this.game.updatePlayers(players);
    }

    /**
     * returns success (spawned food)
     */
    public spawnFood():boolean{
        let hasSpawned:boolean = this.game.spawnFood();
    
        if(hasSpawned){
            this.emit(GameEvents.MATCH_UPDATE);
        }

        return hasSpawned;
    }

    //-----------------
    constructor(players){
        super();

        let container:HTMLCanvasElement = document.getElementById("gameContainer") as HTMLCanvasElement;
        var renderer = PIXI.autoDetectRenderer(640, 480, {antialias:true, view:container});
        renderer.view.style.display = "block";
        renderer.autoResize = true;
        renderer.resize(window.innerWidth, window.innerHeight);
        
        var stage = new PIXI.Container();
        this.game = new Game();
        this.game.updateOnStageResize();
        //------------------------------------------------------------------------------------------------
        // ADD LISTENERS and emit to listening UI
        this.game.on(GameEvents.PLAYER_UNIT_DEAD, (playerID:number) => {
            //console.log("GameIndex-> PLAYER_UNIT_DEAD: " + playerID);
            this.emit(GameEvents.PLAYER_UNIT_DEAD, playerID);
        });

        this.game.on(GameEvents.FOOD_COLLECTED, (playerID:number) => {
            //console.log("GameIndex-> FOOD_COLLECTED by: " + playerID);
            this.emit(GameEvents.FOOD_COLLECTED, playerID);
        });

        this.game.on(GameEvents.PLAYER_EXTINCT, (playerID:number) => {
            //console.log("GameIndex-> PLAYER_EXTINCT by: " + playerID);
            this.emit(GameEvents.PLAYER_EXTINCT, playerID);
        });

        this.game.on(GameEvents.GAME_OVER, () => {
            //console.log("GameIndex-> GAME_OVER");
            this.emit(GameEvents.GAME_OVER);
        });
        //------------------------------------------------------------------------------------------------

        try{
            // load spritesheet. todo: asset management
            if(!PIXI.loader.loading){
                PIXI.loader
                //.add("spritesheets/launcher.json")
                .add(AssetConsts.SPRITESHEET_LAUNCHER)
                .load( () => {
                    //console.log("assets loaded! start game!");
                    this.game.init(renderer, stage, players);        // pass stage? root container for rendering
                    this.game.start();
                    this.emit(GameEvents.MATCH_UPDATE);
                });
            }
        }
        catch(e){
            //console.log("so what now? start game!");
            this.game.init(renderer, stage, players);        // pass stage? root container for rendering
            this.game.start();
            this.emit(GameEvents.MATCH_UPDATE);
        }

        

        window.addEventListener('resize', (e) => { 
            //console.log("window resize");
            //renderer.resize(window.innerWidth, window.innerHeight);
            //canvasPlayground.updateOnStageResize();

            var w = window.innerWidth;
            var h = window.innerHeight;

            renderer.view.style.width = w + "px";
            renderer.view.style.height = h + "px";
            renderer.resize(w,h);

            this.game.updateOnStageResize();
        });

        window.addEventListener('deviceOrientation', (e) => { 
            //console.log("device orientation");
            renderer.resize(window.innerWidth, window.innerHeight);
            this.game.updateOnStageResize();
        });
        
    }
}