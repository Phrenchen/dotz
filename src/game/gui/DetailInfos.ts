import { TextFormats, TextFormatType } from "./TextFormats";
import { Colors } from "../../helper/VisualHelper";
import { SwarmProperties } from "../model/SwarmConfigTypes";



export class DetailInfos{
    public disp:PIXI.Container = new PIXI.Container();
    
    private properties: SwarmProperties;
    
    private items:Array<PIXI.Container> = new Array<PIXI.Container>();
    
    private background:PIXI.Graphics = new PIXI.Graphics();
    private txtFoodCollected: PIXI.Text;
    private txtUnits: PIXI.Text;
    private txtTitle: PIXI.Text;
    private txtEnemiesKilled:PIXI.Text;

    private padding:number = 5;


    constructor(swarmProperties:SwarmProperties){
        this.properties = swarmProperties;
  
        this.txtTitle = new PIXI.Text("Swarm info", TextFormats.getFormat(TextFormatType.title));
        this.txtUnits = new PIXI.Text(this.getUnitText(), TextFormats.getFormat(TextFormatType.default));
        this.txtFoodCollected = new PIXI.Text(this.getFoodText(), TextFormats.getFormat(TextFormatType.default));
        this.txtEnemiesKilled = new PIXI.Text(this.getEnemyText(), TextFormats.getFormat(TextFormatType.default));
        
        this.txtTitle.x += this.padding;
        this.txtTitle.y += this.padding;

        this.txtUnits.x += this.padding;
        this.txtUnits.y = this.txtTitle.y + this.txtTitle.height + this.padding;
        
        this.txtFoodCollected.x += this.padding;
        this.txtFoodCollected.y = this.txtUnits.y + this.txtUnits.height + this.padding;

        this.txtEnemiesKilled.x += this.padding;
        this.txtEnemiesKilled.y = this.txtFoodCollected.y + this.txtFoodCollected.height + this.padding ;

        this.items.push(this.txtTitle);
        this.items.push(this.txtUnits);
        this.items.push(this.txtFoodCollected);
        this.items.push(this.txtEnemiesKilled);
        
        this.disp.addChild(this.background);
        this.disp.addChild(this.txtTitle);
        this.disp.addChild(this.txtUnits);
        this.disp.addChild(this.txtFoodCollected);
        this.disp.addChild(this.txtEnemiesKilled);

        this.drawBackground();

    }

    private drawBackground():void{
        let maxWidth:number = 0;
        let maxHeight:number = 0;
        let item:PIXI.Container;
        let w:number;
        let h:number;
        
        // find max width and height
        this.items.forEach(element => {
            w = element.width;
            h = element.height;

            if(w > maxWidth){
                maxWidth = w;
            }
            maxHeight += h;     // add height of all items, assuming they are stacked vertically
        });

        // add border padding
        maxWidth += 2 * this.padding;
        maxHeight += (this.items.length + 1) *  this.padding;

        this.background.clear();
        this.background.lineStyle(1, Colors.white, 1);
        this.background.moveTo(0,0);
        this.background.beginFill(Colors.lightGrey, .5);
        this.background.drawRect(0, 0, maxWidth, maxHeight);
        this.background.endFill();
    }

    public update():void{
        this.txtUnits.text = this.getUnitText();
        this.txtFoodCollected.text = this.getFoodText();
        this.txtEnemiesKilled.text = this.getEnemyText();

        this.drawBackground();
    }

    private getUnitText():string{
        return "alive / total: " + this.properties.currentUnitsAliveCount + " / " + this.properties.maxUnitCount;
    }

    private getFoodText():string{
        return "food collected: " + this.properties.foodCollectCount;
    }

    private getEnemyText():string{
        return "enemy units killed: " + this.properties.enemyKillCount;
    }
}