import { vec2, Params, Config, Nullable } from './models/models';
import { asArray, hsv2rgb } from './lib/color'
import { defaultConfig, defaultParams, paramsCallbacks, TEMP_DATA } from './lib/constants';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './shaders/index'
import { Log } from './log/log';
import { LogFacade } from './log/LogFacade';
import { computeKernel, lightning, sumArray, tempTint } from './lib/image-transforms';
import { createProgram, createShader, createTexture } from './shaders';
import { Context } from './lib/context';

const clone = (obj: any) => JSON.parse(JSON.stringify(obj));
const CANVAS_OPTIONS: WebGLContextAttributes = { 
  alpha: false,
  antialias: false,
};

/* BEGIN WEBGL PART */
export class RextEditor {

  private params: Params = clone(defaultParams)
  private gl : WebGLRenderingContext;
  private canvas : HTMLCanvasElement;
  private program : any = null;
  private realImage : Nullable<HTMLImageElement> = null;
  private currentImage : Nullable<HTMLImageElement> = null;
  private context : Nullable<Context> = null;
  private config: Config = defaultConfig;

  private WIDTH: number = 0;
  private HEIGHT: number = 0;
  private log: Log = new LogFacade();
  
  private uniforms = {
    kernel: [
      0,0,0,0,0, 
      0,0,0,0,0,
      0,0,1,0,0,
      0,0,0,0,0,
      0,0,0,0,0],
    temptint: [1, 1, 1]
  }

  private LIGHT_MATCH = new Array(256).fill(0).map((v, i) => i);

  constructor(canvas?: HTMLCanvasElement) {
    if (canvas) {
      this.setCanvas(canvas);
    }
  }

  public setCanvas(canvas: HTMLCanvasElement) {
    this.config.width = canvas.width;
    this.config.height = canvas.height;
    this.canvas = canvas;
    this.gl = canvas.getContext("webgl", CANVAS_OPTIONS) || (canvas.getContext("experimental-webgl", CANVAS_OPTIONS) as WebGLRenderingContext);
  }

  runCallback(callbackName: string) {
    switch (callbackName) {
      case "generateLightning":
        this.generateLightning();
      case "kernel_update":
        this.uniforms.kernel = computeKernel(this.params);
      case "updateTemptint":
        this.updateTemptint();
        return;
    }
    this.log.warn(`No callback ${callbackName} exists`)
  }

  updateParams(params: Params) {
    /* Calculate difference */
    const updateKeys = Object.keys(this.params).filter(paramKey => {
      return this.params[paramKey] !== params[paramKey]
    })

    updateKeys.forEach(paramKey => {
      this.updateParam(paramKey, params[paramKey]);
    })

    const updates = this.getCallbacks(updateKeys);

    /* Update with callbacks */
    updates.forEach(callbackName => {
      this.runCallback(callbackName)
    })

    this.update();
  }

  getCallbacks(updatedParams: string[]) : string[] {
    const callbacks = new Set(
      updatedParams.filter(key => paramsCallbacks[key] !== undefined && paramsCallbacks[key] !== null)
      .map(key => paramsCallbacks[key])
      .reduce((acc, v) => acc.concat(v), []));
    return Array.from(callbacks)
  }

  private updateParam(param: string, value: number | vec2) {
    const keys = Object.keys(this.params)
    if (keys.includes(param)) {
      // @ts-ignore
      this.params[param] = value
    } else {
      this.log.error(`Param ${param} does not exists`)
    }
  }

  public autoZoom() {
    const widthX = this.config.width / this.WIDTH;
    const heightX = this.config.height / this.HEIGHT;
    const maxX = Math.max(widthX, heightX);
    this.setZoom(maxX);
  }

  public setZoom(zoom: number) {
    this.params.zoom = zoom;
    this.canvas.style.width = this.WIDTH * zoom + "px";
    this.canvas.style.height = this.HEIGHT * zoom + "px";
  }

  public getWidth() {
    return this.WIDTH;
  }
  
  public getHeight() {
    return this.HEIGHT;
  }

  private setWidth(width: number) {
    this.WIDTH = width;
  }
  
  private setHeight(height: number) {
    this.HEIGHT = height;
  }

  private get2dRotation(): number[] {
    return [
      Math.sin(this.params.rotation),
      Math.cos(this.params.rotation)
    ];
  }

  private get2dRotationCenter(): number[] {
    const x = (this.params.rotation_center.x + 1) * this.WIDTH / 2.0;
    const y = (this.params.rotation_center.y + 1) * this.HEIGHT / 2.0;
    return [x, y];
  }
  
  private loadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        if (this.currentImage == null) {
          this.log.warn('Load Image called without image.');
          return;
        }
        this.WIDTH = image.width;
        this.HEIGHT = image.height;
        this.fitCanvas(image.width, image.height);
        this.create(this.currentImage);
        resolve();
      }
      image.onerror = (err) => {
        this.log.error("Error while loading the image.")
        reject(err)
      }
      this.currentImage = image;
      image.src = url;
      this.realImage = image;
    })
  }

  public async load(url: string, config?: Config) {
    this.log.log("Version 1.2.6")
    // Save real image as a copy
    if (config !== undefined) { 
      this.config = config;
    }
    await this.loadImage(url);
    return this;
  }

  public setLog(log: Log) {
    this.log = log;
  }

  // Temp and Tint
  private updateTemptint() { // Temperature in kelvin
    this.uniforms.temptint = tempTint(this.params);
  }

  /**
   * Lightning generation:
   * Map brightness values depending on Brightness, Contrast... etc
   */
  private generateLightning() {
    this.LIGHT_MATCH = lightning(this.params);
  }

  blob(type?: string, quality?: number) : Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (this.realImage === null) {
        this.log.warn('Called to blob without loaded image');
        return reject();
      }
      this.create(this.realImage);
      this.canvas.toBlob((blob: Blob) => {
        if (blob === null) {
          this.log.error('Unable to generate the blob file');
          return reject();
        }
        resolve(blob)
      }, type || "image/jpeg", quality || 1);
    });
  }

  /**
   * create
   * Prepare the environment to edit the image
   * image: Image element to edit (Image object)
   * context: webgl context. Default: __window.gl
   * SET_FULL_RES: no resize the image to edit. Default: false (resize the image)
   */
  private create(image: HTMLImageElement, preventRenderImage?: boolean) {
    // Load GSLS programs
    try {
      const VERTEX_SHADER_CODE = createShader(this.gl, this.gl.VERTEX_SHADER, VERTEX_SHADER);
      const FRAGMENT_SHADER_CODE = createShader(this.gl, this.gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    	this.program = createProgram(this.gl, VERTEX_SHADER_CODE, FRAGMENT_SHADER_CODE);
    } catch(err) {
    	return this.log.error(err);
    }
    this.context = new Context(this.gl, this.program);

    this.log.log("[IMAGE] width = " + this.WIDTH + ", height = " + this.HEIGHT);
    this.log.log("[CANVAS] width = " + this.canvas.width + ", height = " + this.canvas.height);

    this.setRectangle(this.context.createBuffer("ARRAY_BUFFER"), 0.0, 0.0, this.WIDTH, this.HEIGHT);
    this.setRectangle(this.context.createBuffer("TEXCOORD_BUFFER"), 0, 0, 1.0, 1.0);

  	this.gl.activeTexture(this.gl.TEXTURE0);

    // Upload the image into the texture.
    createTexture(this.gl);
    try {
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
    } catch(err) {
      return this.log.error(err);
    }

    // Upload the LUT (contrast, brightness...)
    this.gl.activeTexture(this.gl.TEXTURE1);

    createTexture(this.gl);   

    this.gl.viewport(0, 0, this.WIDTH, this.HEIGHT);
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    if (!preventRenderImage) { 
      this.update();
    }
  }

  private fitCanvas(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  private update() {
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.ALPHA, 256, 1, 0, this.gl.ALPHA, this.gl.UNSIGNED_BYTE,
        new Uint8Array(this.LIGHT_MATCH));

    this.gl.useProgram(this.program);
    this.gl.enableVertexAttribArray(this.context.getAttribute("a_position"));
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.context.getBuffer("ARRAY_BUFFER"));
    this.gl.vertexAttribPointer(this.context.getAttribute("a_position"), 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.context.getAttribute("a_texCoord"));

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.context.getBuffer("TEXCOORD_BUFFER"));
    this.gl.vertexAttribPointer(this.context.getAttribute("a_texCoord"), 2, this.gl.FLOAT, false, 0, 0);

    this.gl.uniform2f(this.context.getUniform("u_resolution"), this.WIDTH, this.HEIGHT);
    this.gl.uniform2f(this.context.getUniform("u_textureSize"), this.WIDTH, this.HEIGHT);
    this.gl.uniform1f(this.context.getUniform("u_brightness"), this.params.brightness);
    this.gl.uniform1f(this.context.getUniform("u_contrast"), this.params.contrast);
    this.gl.uniform1f(this.context.getUniform("u_exposure"), this.params.exposure);
    this.gl.uniform1f(this.context.getUniform("u_contrast"), this.params.contrast);
    this.gl.uniform1f(this.context.getUniform("u_saturation"), this.params.saturation);
    this.gl.uniform1f(this.context.getUniform("u_masking"), this.params.masking);
    this.gl.uniform1f(this.context.getUniform("u_dehaze"), this.params.dehaze);
    this.gl.uniform1f(this.context.getUniform("u_atmosferic_light"), this.params.atmosferic_light);
    this.gl.uniform3fv(this.context.getUniform("u_temptint[0]"), this.uniforms.temptint
      .concat(asArray(hsv2rgb({ x: this.params.lightColor * 360, y: this.params.lightSat, z: this.params.lightFill })))
      .concat(asArray(hsv2rgb({ x: this.params.darkColor * 360, y: this.params.darkSat, z: this.params.darkFill })))); // vec3 x3
    this.gl.uniform1f(this.context.getUniform("u_bAndW"), this.params.bAndW);
    this.gl.uniform1f(this.context.getUniform("u_hdr"), this.params.hdr);
    this.gl.uniform2fv(this.context.getUniform("u_rotation"), this.get2dRotation() );
    this.gl.uniform2fv(this.context.getUniform("u_rotation_center"), this.get2dRotationCenter() );
    this.gl.uniform2f(this.context.getUniform("u_scale"), this.params.scale.x, this.params.scale.y );
    this.gl.uniform2f(this.context.getUniform("u_translate"), this.params.translate.x, this.params.translate.y );

    // Show image
    this.gl.uniform1i(this.context.getUniform("u_lut"), 1); // TEXTURE 1
    
    // set the kernel and it's weight
    this.gl.uniform1fv(this.context.getUniform("u_kernel[0]"), this.uniforms.kernel);
    this.gl.uniform1f(this.context.getUniform("u_kernelWeight"), sumArray(this.uniforms.kernel));

    /* Adjust canvas size: Cropping */

    const x2 = this.WIDTH * this.params.size.x;
    const y2 = this.HEIGHT * this.params.size.y;
    this.canvas.style.width = this.params.zoom * x2 + "px";
    this.canvas.style.height = this.params.zoom * y2 + "px";
    this.canvas.width = x2;
    this.canvas.height = y2;

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
  
  private setRectangle(buffer: WebGLBuffer, x: number, y: number, width: number, height: number) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
       x1, y1,
       x2, y1,
       x1, y2,
       x1, y2,
       x2, y1,
       x2, y2,
    ]), this.gl.STATIC_DRAW);
  }

}
