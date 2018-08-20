export class AssetConsts{
    public static SPRITESHEET_LAUNCHER:string = "./spritesheets/swarms_assets.json";
    
    public static ASSET_FOOD:string = "food.png";
    public static ASSET_UNIT_WORKER:string = "unit_worker.png";
    
    public static ASSET_DIALOG_BACKGROUND:string = "dialog_background.png";



    public static getLauncherNameByID(id:number):string{
        return AssetConsts["ASSET_LAUNCHER_PLAYER_" + id];
    }

    public static getUnitNameByID(id:number):string{
        return AssetConsts["ASSET_UNIT_PLAYER_" + id];
    }
}