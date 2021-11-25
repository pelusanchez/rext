import { Params, Config } from './models/models';
import { Log } from './log/log';
export declare class RextEditor {
    private params;
    private gl;
    private canvas;
    private program;
    private realImage;
    private currentImage;
    private context;
    private config;
    private onParamsChangeCallbacks;
    private WIDTH;
    private HEIGHT;
    private log;
    private uniforms;
    private LIGHT_MATCH;
    constructor(canvas?: HTMLCanvasElement);
    setCanvas(canvas: HTMLCanvasElement): void;
    runCallback(callbackName: string): void;
    onParamsChange(callback: Function): void;
    updateParams(params: Params): void;
    getCallbacks(updatedParams: string[]): string[];
    private _updateParam;
    autoZoom(): void;
    setZoom(zoom: number): void;
    getWidth(): number;
    getHeight(): number;
    private setWidth;
    private setHeight;
    private getCanvas;
    private get2dRotation;
    private get2dRotationCenter;
    private loadImage;
    load(url: string, config?: Config): Promise<this>;
    setLog(log: Log): void;
    private updateTemptint;
    /**
     * Lightning generation:
     * Map brightness values depending on Brightness, Contrast... etc
     */
    private generateLightning;
    blob(type?: string, quality?: number): Promise<Blob>;
    /**
     * create
     * Prepare the environment to edit the image
     * image: Image element to edit (Image object)
     * context: webgl context. Default: __window.gl
     * SET_FULL_RES: no resize the image to edit. Default: false (resize the image)
     */
    private create;
    private fitCanvas;
    private update;
    private applyCrop;
    private setRectangle;
}
