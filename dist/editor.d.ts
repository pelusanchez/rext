import { Config, Params } from './models/models';
interface Log {
    log(msg: string): void;
    warn(msg: string): void;
    error(msg: string): void;
}
export declare class RextEditor {
    private params;
    private gl;
    private program;
    private pointers;
    private WIDTH;
    private HEIGHT;
    private log;
    private config;
    private uniforms;
    private LIGHT_MATCH;
    constructor(canvas?: HTMLCanvasElement, config?: Config);
    setCanvas(canvas: HTMLCanvasElement): void;
    runCallback(callbackName: "generateLightning" | "kernel_update" | "updateTempTint"): void;
    updateParams(params: Params): void;
    updateParam(param: string, value: number): void;
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
export {};
