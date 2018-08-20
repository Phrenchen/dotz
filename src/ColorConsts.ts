import { GameConsts } from "./game/GameConsts";

export default class ColorConsts{
    // NOTE:
    // need to change values in ingame_grid_ui.scss!!
    public static PLAYER_1:number = 0xCFBB20;
    public static PLAYER_2:number = 0x6b69f8;
    public static PLAYER_3:number = 0x9C7728;
    public static PLAYER_4:number = 0x7F98A8;

    public static UNIT_ENEMY:number = 0xFF0000;
    public static UNIT_FOOD:number = 0x223b22;

    // end of duplicates
    
    
    /**
     * quick and dirty...
     * 
     */
    public static getColorByID(id:number){
        let color:number = 0xFF0000;

        switch(id){
            case GameConsts.ID_PLAYER_1:
            case GameConsts.ID_PLAYER_2:
            case GameConsts.ID_PLAYER_3:
            case GameConsts.ID_PLAYER_4:
                let attName:string = "PLAYER_" + id;    // ColorConsts.PLAYER_1, ColorConsts.PLAYER_2,...
                color = ColorConsts[attName];
                break;
            case GameConsts.ID_FOOD:
                color = ColorConsts.UNIT_FOOD;
                break;
            case GameConsts.ID_ENEMY_SOLDIER:
                color = ColorConsts.UNIT_ENEMY;
                break;
        }

        return color;
    }
}