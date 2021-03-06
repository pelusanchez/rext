import { Config, UniformPointer } from './models';
import { Params } from './params';
interface Log {
    log(msg: string): void;
    warn(msg: string): void;
    error(msg: string): void;
}
export declare class RextEditor {
    params: Params;
    gl: WebGLRenderingContext;
    program: any;
    pointers: UniformPointer;
    WIDTH: number;
    HEIGHT: number;
    log: Log;
    config: Config;
    private uniforms;
    LIGHT_MATCH: number[];
    constructor(canvas?: HTMLCanvasElement, config?: Config);
    setCanvas(canvas: HTMLCanvasElement): void;
    updateParam(param: string, value: number): void;
    load(url: string): void;
    setLog(log: Log): void;
    updateKernel(): void;
    updateTemptint(): void;
    /**
     * Lightning generation:
     * Map brightness values depending on Brightness, Contrast... etc
     */
    generateLightningfunction(): void;
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
