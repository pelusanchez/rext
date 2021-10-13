
import { getCuadraticFunction } from './lib/math'
import { Config, f2Number, Params } from './models/models';
import { asArray, hsv2rgb } from './lib/color'
import { defaultParams, paramsCallbacks, TEMP_DATA } from './lib/constants';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './shaders/index'
import { Log } from './log/log';
import { LogFacade } from './log/LogFacade';
import { computeKernel, sumArray, tempTint } from './lib/image-transforms';
import { createProgram, createShader, createTexture } from './shaders';

const clone = (obj: any) => JSON.parse(JSON.stringify(obj));

/* BEGIN WEBGL PART */
export class RextEditor {

  private params: Params = clone(defaultParams)
  private gl : WebGLRenderingContext;
  private canvas : HTMLCanvasElement;
  private program : any = null;
  private realImage : HTMLImageElement | null = null;
  private currentImage : HTMLImageElement | null = null;
  private pointers : any = {
    positionLocation: null,
    positionBuffer: null,
    texcoordLocation: null,
    texcoordBuffer: null,
    resolutionLocation: null,
    textureSizeLocation: null,
    kernelLocation: null,
    kernelWeightLocation: null,
    u_exposure: null,
    u_brightness: null,
    u_contrast: null,
    u_saturation: null,
    u_masking: null,
    u_dehaze: null,
    u_atmosferic_light: null,
    u_temptint: null,
    u_bAndW: null,
    u_hdr: null,
    u_lut: null,
    u_image: null,
    u_rotation: null,
    u_rotation_center: null,
    u_scale: null,
    u_translate: null,
  }

  private WIDTH: number = 0
  private HEIGHT: number = 0
  log: Log = new LogFacade()
  
  private config: Config = {
    resolutionLimit: 1000000,
    editionResolutionLimit: 1000000,
  }
  private uniforms = {
    kernel: [
      0,0,0,0,0, 
      0,0,0,0,0,
      0,0,1,0,0,
      0,0,0,0,0,
      0,0,0,0,0],
    temptint: [1, 1, 1]
  }

  private LIGHT_MATCH = (function() {
  	var _r = [];
  	for (var i = 0; i < 256; i++) {
  		_r[i] = i;
  	}
  	return _r;
  })();

  constructor(canvas?: HTMLCanvasElement, config?: Config) {
    if (canvas) {
      this.setCanvas(canvas);
    }
    if (config) {
      this.config = config
    }
  }

  public setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.gl = canvas.getContext("webgl") || (canvas.getContext("experimental-webgl") as WebGLRenderingContext);
  }

  runCallback(callbackName: string) {
    switch (callbackName) {
      // @ts-ignore
      case "generateLightning":
        this.generateLightning();
      // @ts-ignore
      case "kernel_update":
        this.uniforms.kernel = computeKernel(this.params);
      case "updateTemptint":
        this.updateTemptint();
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

  private updateParam(param: string, value: number | f2Number) {
    const keys = Object.keys(this.params)
    if (keys.includes(param)) {
      // @ts-ignore
      this.params[param] = value
    } else {
      this.log.error(`Param ${param} does not exists`)
    }
  }

  public resize(width: number, height: number) {
    if (this.realImage == null) {
      this.log.warn('Resize called without image');
      return;
    }
    const image = new Image();
    image.width = width
    image.height = height
    this.loadImage(image);
  	image.src = this.realImage.src;
  }

  public getWidth() {
    return this.WIDTH;
  }
  
  public getHeight() {
    return this.HEIGHT;
  }
  
  public rotateFrom(x: number, y: number) {
    this.params.rotation_center.x = x;
    this.params.rotation_center.y = y;
  }
  
  public rotateFromCenter(x: number, y: number) {
    this.params.rotation_center.x = 0;
    this.params.rotation_center.y = 0;
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
  
  private loadImage(image: HTMLImageElement) {
    image.onload = () => {
      if (this.currentImage == null) {
        this.log.warn('Load Image called without image.');
        return;
      }
      this.create(this.currentImage);
    }
    image.onerror = () => {
      this.log.error("Error while loading the image.")
    }
    this.currentImage = image
  }

  load(url: string) {
    this.log.log("Version 1.2.6")
    // Save real image as a copy
  	this.realImage = new Image();
    this.loadImage(this.realImage);
  	this.realImage.src = url;
  }

  setLog(log: Log) {
    this.log = log;
  }

  // Temp and Tint
  updateTemptint() { // Temperature in kelvin
    this.uniforms.temptint = tempTint(this.params);
  }

  /**
   * Lightning generation:
   * Map brightness values depending on Brightness, Contrast... etc
   */
  generateLightning () {
    var blacks = this.params.blacks;
    var shadows = this.params.shadows;
    var highlights = this.params.highlights;
    var whites = this.params.whites;
    var radiance = this.params.radiance;
  	var f = getCuadraticFunction(
  			blacks,
  			shadows + 0.33,
  			highlights + 0.66,
  			whites + 1,
  			0,  0.33, 0.66, 1);


  	for (var i = 0; i < 256; i++) {
  		var pixel_value = i / 256;

  		// Brightness
  		if (pixel_value > 1) { pixel_value = 1; }
  		if (pixel_value < 0) { pixel_value = 0; }

  		// Contrast
   		if (pixel_value > 1) { pixel_value = 1; }
  		if (pixel_value < 0) { pixel_value = 0; }
  		
  	  // Radiance part
  		if (radiance != 0) {
        const f_radiance = getCuadraticFunction(
          0,
          0.33 - radiance * 0.11,
          0.66 + radiance * 0.11,
          1,
          0, 0.33, 0.66, 1);
  			pixel_value = f_radiance(pixel_value);
  		}
  		pixel_value = f(pixel_value);
  		if (pixel_value > 1) { pixel_value = 1; }
  		if (pixel_value < 0) { pixel_value = 0; }
  		this.LIGHT_MATCH[i] =  pixel_value * 255; 
  	}
  }

  blob(type?: string, quality?: number) : Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (this.realImage === null) {
        this.log.warn('Called to blob without loaded image');
        return reject();
      }
      this.create(this.realImage);
      this.canvas.toBlob((blob) => {
        if (blob === null) {
          this.log.error('Unable to generate the blob file');
          return reject();
        }
        resolve(blob)
      }, type || "image/jpeg", quality || 0.95);
    })
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

    // look up where the vertex data needs to go.
    this.pointers.positionLocation = this.gl.getAttribLocation(this.program, "a_position");
    this.pointers.texcoordLocation = this.gl.getAttribLocation(this.program, "a_texCoord");

    // Create a buffer to put three 2d clip space points in
    this.pointers.positionBuffer = this.gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointers.positionBuffer);
    
    // Set a rectangle the same size as the image.
    this.WIDTH = image.width;
    this.HEIGHT = image.height;
    this.gl.canvas.width = this.WIDTH;
    this.gl.canvas.height = this.HEIGHT;

    this.log.log("[IMAGE] width = " + this.WIDTH + ", height = " + this.HEIGHT);

    this.setRectangle(0, 0, this.WIDTH, this.HEIGHT);

    // Create the rectangle 
    this.pointers.texcoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointers.texcoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
        0.0,  0.0,
        1.0,  0.0,
        0.0,  1.0,
        0.0,  1.0,
        1.0,  0.0,
        1.0,  1.0,
    ]), this.gl.STATIC_DRAW);

  	this.gl.activeTexture(this.gl.TEXTURE0);

    // Upload the image into the texture.
    createTexture(this.gl);
    try {
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
    } catch(err) {
      return this.log.error(err);
    }

    this.pointers.u_image = this.gl.getUniformLocation(this.program, "u_image");
  	
    // lookup uniforms
    this.pointers.resolutionLocation    = this.gl.getUniformLocation(this.program, "u_resolution");
    this.pointers.textureSizeLocation   = this.gl.getUniformLocation(this.program, "u_textureSize");
    this.pointers.kernelLocation        = this.gl.getUniformLocation(this.program, "u_kernel[0]");
    this.pointers.kernelWeightLocation  = this.gl.getUniformLocation(this.program, "u_kernelWeight");
    this.pointers.u_exposure            = this.gl.getUniformLocation(this.program, "u_exposure");
    this.pointers.u_brightness          = this.gl.getUniformLocation(this.program, "u_brightness");
    this.pointers.u_contrast            = this.gl.getUniformLocation(this.program, "u_contrast");
    this.pointers.u_saturation          = this.gl.getUniformLocation(this.program, "u_saturation");
    this.pointers.u_masking             = this.gl.getUniformLocation(this.program, "u_masking");
    this.pointers.u_dehaze              = this.gl.getUniformLocation(this.program, "u_dehaze");
    this.pointers.u_atmosferic_light    = this.gl.getUniformLocation(this.program, "u_atmosferic_light");
    this.pointers.u_temptint            = this.gl.getUniformLocation(this.program, "u_temptint[0]");
    this.pointers.u_bAndW               = this.gl.getUniformLocation(this.program, "u_bAndW");
    this.pointers.u_hdr                 = this.gl.getUniformLocation(this.program, "u_hdr");
    this.pointers.u_rotation            = this.gl.getUniformLocation(this.program, "u_rotation");
    this.pointers.u_rotation_center     = this.gl.getUniformLocation(this.program, "u_rotation_center");
    this.pointers.u_scale               = this.gl.getUniformLocation(this.program, "u_scale");
    this.pointers.u_translate           = this.gl.getUniformLocation(this.program, "u_translate");

    this.pointers.u_lut = this.gl.getUniformLocation(this.program, "u_lut");
    // Upload the LUT (contrast, brightness...)
    this.gl.activeTexture(this.gl.TEXTURE1);

    const LUTTexture = createTexture(this.gl);   

    this.gl.viewport(0, 0, this.WIDTH, this.HEIGHT);
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    if (!preventRenderImage) { 
      this.update();
    }
  }

  update() {

    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.ALPHA, 256, 1, 0, this.gl.ALPHA, this.gl.UNSIGNED_BYTE,
        new Uint8Array(this.LIGHT_MATCH));

    this.gl.useProgram(this.program);
    this.gl.enableVertexAttribArray(this.pointers.positionLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointers.positionBuffer);

    this.gl.vertexAttribPointer(this.pointers.positionLocation, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.pointers.texcoordLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointers.texcoordBuffer);

    this.gl.vertexAttribPointer(this.pointers.texcoordLocation, 2, this.gl.FLOAT, false, 0, 0);

    // set the resolution
    this.gl.uniform2f(this.pointers.resolutionLocation, this.WIDTH, this.HEIGHT);

    // set the size of the image
    this.gl.uniform2f(this.pointers.textureSizeLocation, this.WIDTH, this.HEIGHT);

    // Set the parameters values
    this.gl.uniform1f(this.pointers.u_brightness, this.params.brightness);
    this.gl.uniform1f(this.pointers.u_contrast, this.params.contrast);
    this.gl.uniform1f(this.pointers.u_exposure, this.params.exposure);
    this.gl.uniform1f(this.pointers.u_contrast, this.params.contrast);
    this.gl.uniform1f(this.pointers.u_saturation, this.params.saturation);
    this.gl.uniform1f(this.pointers.u_masking, this.params.masking);
    this.gl.uniform1f(this.pointers.u_dehaze, this.params.dehaze);
    this.gl.uniform1f(this.pointers.u_atmosferic_light, this.params.atmosferic_light);
    this.gl.uniform3fv(this.pointers.u_temptint, this.uniforms.temptint
      .concat(asArray(hsv2rgb({ x: this.params.lightColor * 360, y: this.params.lightSat, z: this.params.lightFill })))
      .concat(asArray(hsv2rgb({ x: this.params.darkColor * 360, y: this.params.darkSat, z: this.params.darkFill })))); // vec3 x3
    this.gl.uniform1f(this.pointers.u_bAndW, this.params.bAndW);
    this.gl.uniform1f(this.pointers.u_hdr, this.params.hdr);
    this.gl.uniform2fv(this.pointers.u_rotation, this.get2dRotation() );
    this.gl.uniform2fv(this.pointers.u_rotation_center, this.get2dRotationCenter() );
    this.gl.uniform2f(this.pointers.u_scale, this.params.scale.x, this.params.scale.y );
    this.gl.uniform2f(this.pointers.u_translate, this.params.translate.x, this.params.translate.y );

    // Show image
    this.gl.uniform1i(this.pointers.u_image, 0); // TEXTURE 0
    this.gl.uniform1i(this.pointers.u_lut, 1); // TEXTURE 1
    
    // set the kernel and it's weight
    this.gl.uniform1fv(this.pointers.kernelLocation, this.uniforms.kernel);
    this.gl.uniform1f(this.pointers.kernelWeightLocation, sumArray(this.uniforms.kernel));

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  private setRectangle(x: number, y: number, width: number, height: number) {
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
