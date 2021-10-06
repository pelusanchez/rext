import { Config, f2Number, Params } from './models/models';
import { Log } from './log/log';
export declare class RextEditor {
    private params;
    private gl;
    private canvas;
    private program;
    private realImage;
    private currentImage;
    private pointers;
    private WIDTH;
    private HEIGHT;
    log: Log;
    private config;
    private uniforms;
    private LIGHT_MATCH;
    constructor(canvas?: HTMLCanvasElement, config?: Config);
    setCanvas(canvas: HTMLCanvasElement): void;
    runCallback(callbackName: string): void;
    updateParams(params: Params): void;
    getCallbacks(updatedParams: string[]): string[];
    private updateParam;
    resize(width: number, height: number): void;
    getWidth(): number;
    getHeight(): number;
    scale(scale: f2Number): void;
    rotate(radians: number): void;
    private get2dRotation;
    private loadImage;
    load(url: string): void;
    setLog(log: Log): void;
    updateKernel(): void;
    updateTemptint(): void;
    /**
     * Lightning generation:
     * Map brightness values depending on Brightness, Contrast... etc
     */
    generateLightning(): void;
    /**
     * kernelNormalization
     * Compute the total weight of the kernel in order to normalize it
     */
    kernelNormalization(kernel: number[]): number;
    blob(type?: string, quality?: number): Promise<Blob>;
    /**
     * render
     * Prepare the environment to edit the image
     * image: Image element to edit (Image object)
     * context: webgl context. Default: __window.gl
     * SET_FULL_RES: no resize the image to edit. Default: false (resize the image)
     */
    private render;
    update(): void;
    private setRectangle;
}
