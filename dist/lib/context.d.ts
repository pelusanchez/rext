export declare class Context {
    private gl;
    private program;
    constructor(gl: WebGLRenderingContext, program: WebGLProgram);
    private pointers;
    private atributes;
    private buffers;
    getUniform(uniform: string): any;
    getAttribute(atribute: string): any;
    createBuffer(bufferName: string): any;
    getBuffer(bufferName: string): any;
}
