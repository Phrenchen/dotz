export class TextHelper{

    public static TEXT_COLOR_DEFAULT:string = "#ffffff";
    public static TEXT_COLOR_BLACK:string = "#000000";
    public static TEXT_COLOR_ITEM_INFO:string = "#00ff00";
    public static TEXT_COLOR_CRITICAL:string = "#ff0000";
    


    public static TEXT_STYLE_DEFAULT:PIXI.TextStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 12,
            fontWeight: "normal",
            fill: [TextHelper.TEXT_COLOR_DEFAULT],
            wordWrap: true,
            wordWrapWidth: 100
        });

    public static TEXT_STYLE_TITLE:PIXI.TextStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 20,
            fontWeight: "bold",
            fill: [TextHelper.TEXT_COLOR_DEFAULT],
            wordWrap: false
    });

    public static TEXT_STYLE_BUTTON_LABEL:PIXI.TextStyle = new PIXI.TextStyle({
        fontFamily: "Arial",
        fontSize: 20,
        fontWeight: "bold",
        fill: [TextHelper.TEXT_COLOR_BLACK],
        wordWrap: false
});
}