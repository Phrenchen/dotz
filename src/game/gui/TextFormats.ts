export enum TextFormatType{
    default,
    title,
    error
}

export enum ScreenAnchor{
    topLeft = 1,
    topCenter,
    topRight,
    
    centerLeft,
    centerCenter,
    centerRight,

    bottomLeft,
    bottomCenter,
    bottomRight
}

export enum Alignment{
    horizontal = 0,
    vertical
}

export class TextFormats{

    public static getFormat(formatType:TextFormatType):PIXI.TextStyleOptions{
        let result:PIXI.TextStyleOptions;


        switch(formatType){
            case TextFormatType.title:
                result = {fontFamily:"Arial", fontSize:24, fill:0xCCCCCC, align:"center"};
                break;
            case TextFormatType.error:
                result = {fontFamily:"Arial", fontSize:20, fill:0xFF0000, align:"center"};
                break;
            default: 
                result = {fontFamily:"Arial", fontSize:12, fill:0xCCCCCC, align:"center"};
                break;
        }


        return result;
    }

}