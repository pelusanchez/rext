export class Context {

  constructor(private gl: WebGLRenderingContext, private program: WebGLProgram) {};
  
  private pointers: any = {};
  private atributes: any = {};
  private buffers: any = {};

  public getUniform(uniform: string) {
    if (!this.pointers[uniform]) {
      this.pointers[uniform] = this.gl.getUniformLocation(this.program, uniform);
    }
    return this.pointers[uniform];
  }

  public getAttribute(atribute: string) {
    if (!this.atributes[atribute]) {
      this.atributes[atribute] = this.gl.getAttribLocation(this.program, atribute);
    }
    return this.atributes[atribute];
  }

  public createBuffer(bufferName: string) {
    this.buffers[bufferName] = this.gl.createBuffer();
    return this.buffers[bufferName];
  }

  public getBuffer(bufferName: string) {
    return this.buffers[bufferName];
  }
}
