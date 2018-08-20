import { Rectangle } from "pixi.js";

export class GlobalAppData{
    /**
     * convenience-class providing global access to PIXI.renderer etc.
     */

    public static APP_RENDERER:PIXI.SystemRenderer;

    public static viewport:Rectangle = new Rectangle(0, 0, 640, 480);   // updated onScreen-resize
}