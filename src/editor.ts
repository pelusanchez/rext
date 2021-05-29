
import { getCuadraticFunction } from './lib/math'
import { Config, Params } from './models/models';
import { asArray, getLuma, hsv2rgb } from './lib/color'
import { defaultParams, paramsCallbacks, TEMP_DATA } from './lib/constants';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './shaders/index'

const clone = (obj: any) => JSON.parse(JSON.stringify(obj));

interface Log {
  log(msg: string) : void;
  warn(msg: string) : void;
  error(msg: string) : void;
}

class LogFacade implements Log {
  log(msg: string) {
    console.log(msg);
  }
  warn(msg: string) {
    console.warn(msg);
  }

  error(msg: string) {
    console.error(msg);
  }

}

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

  constructor(canvas: HTMLCanvasElement, config?: Config) {
    this.canvas = canvas
    this.gl = canvas.getContext("webgl") || (canvas.getContext("experimental-webgl") as WebGLRenderingContext);
    if (config) {
      this.config = config
    }
  }

  runCallback(callbackName: string) {
    switch (callbackName) {
      // @ts-ignore
      case "generateLightning":
        this.generateLightning();
      // @ts-ignore
      case "kernel_update":
        this.updateKernel();
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

  private updateParam(param: string, value: number) {
    const keys = Object.keys(this.params)
    if (keys.includes(param)) {
      // @ts-ignore
      this.params[param] = value
    } else {
      this.log.error(`Param ${param} does not exists`)
    }
  }

  resize(width: number, height: number) {
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

  rotate(radians: number) {

    this.params.rotation = radians;

  }

  private loadImage(image: HTMLImageElement) {
    image.onload = () => {
      if (this.currentImage == null) {
        this.log.warn('Load Image called without image');
        return;
      }
      this.render(this.currentImage);
    }
    image.onerror = () => {
      this.log.error("Error al cargar la imagen.")
    }
    this.currentImage = image
  }

  load(url: string) {
    this.log.log("Version 1")
    // Save real image as a copy
  	this.realImage = new Image();
    this.loadImage(this.realImage)
  	this.realImage.src = url;
  }

  setLog(log: Log) {
    this.log = log
  }

  updateKernel() {
  	// 3x3 kernel
  	var sharpness = - this.params.sharpen;
  	var radius = this.params.sharpen_radius;
    var radiance = this.params.radiance;
    var hdr = this.params.hdr;
  	
  	if (radiance != 0) {
  		sharpness -= 0.5 * radiance;
  		radius += 0.5 *  radiance;
  	}

    if (hdr != 0) {
      sharpness -= 0.5 * hdr;
      radius += 0.5 * hdr;
    }

  	var A = sharpness * Math.exp(- Math.pow(1    / radius, 2)); 
  	var B = sharpness * Math.exp(- Math.pow(1.41 / radius, 2));
  	var C = sharpness * Math.exp(- Math.pow(2    / radius, 2));
  	var D = sharpness * Math.exp(- Math.pow(2.24 / radius, 2));
  	var E = sharpness * Math.exp(- Math.pow(2.83 / radius, 2));
  	var X = 1;
  	if (sharpness < 0) {
  		X += 4 * Math.abs(E) + 8 * Math.abs(D) + 4 * Math.abs(C) + 4 * Math.abs(B) + 4 * Math.abs(A);
  	}

  	this.uniforms.kernel = [E, D, C, D, E,
  															D, B, A, B, D,
  															C, A, X, A, C,
  															D, B, A, B, D,
  															E, D, C, D, E];
  }

  // Temp and Tint
  updateTemptint() { // Temperature in kelvin
    let T = this.params.temperature
    let tint = this.params.tint
    let R, G, B;

    if (T < 0) {
      R = 1;
      const i = TEMP_DATA[Math.floor((T + 1) * 100)]; // Tab values, algorithm is hard
      G = i[0];
      B = i[1];
    } else {
      R = 0.0438785 / (Math.pow(T + 0.150127, 1.23675)) + 0.543991;
      G = 0.0305003 / (Math.pow(T + 0.163976, 1.23965)) + 0.69136;
      B = 1;
    }

    if (tint == -1) { // HACK
      tint = -0.99;
    }
    G += tint;

    // Luma correction
    var curr_luma = getLuma({x: R, y: G, z: B});
    var mult_K = 1 / curr_luma;

    // TODO
    this.uniforms.temptint = [R * mult_K, G * mult_K, B * mult_K];
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

  /**
   * kernelNormalization
   * Compute the total weight of the kernel in order to normalize it
   */
  kernelNormalization(kernel: number[]) : number {
    return kernel.reduce((a, b) => a + b);
  }

  blob(type?: string, quality?: number) : Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (this.realImage === null) {
        this.log.warn('Called to blob without loaded image');
        return reject();
      }
      this.render(this.realImage);
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
   * render
   * Prepare the environment to edit the image
   * image: Image element to edit (Image object)
   * context: webgl context. Default: __window.gl
   * SET_FULL_RES: no resize the image to edit. Default: false (resize the image)
   */


  private render(image: HTMLImageElement, preventRenderImage?: boolean) {
    // Load GSLS programs
    var VERTEX_SHADER_CODE = createShader(this.gl, this.gl.VERTEX_SHADER, VERTEX_SHADER);
  	var FRAGMENT_SHADER_CODE = createShader(this.gl, this.gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

    try {
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

    const originalImageTexture = createTexture(this.gl);
    // Upload the image into the texture.
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

    // Tell it to use our this.program (pair of shaders)
    this.gl.useProgram(this.program);

    // Turn on the position attribute
    this.gl.enableVertexAttribArray(this.pointers.positionLocation);

    // Bind the position buffer.
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointers.positionBuffer);

    this.gl.vertexAttribPointer(this.pointers.positionLocation, 2, this.gl.FLOAT, false, 0, 0);

    // Turn on the teccord attribute
    this.gl.enableVertexAttribArray(this.pointers.texcoordLocation);

    // Bind the position buffer.
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointers.texcoordBuffer);

    this.gl.vertexAttribPointer(this.pointers.texcoordLocation, 2, this.gl.FLOAT, false, 0, 0);

    // set the resolution
    this.gl.uniform2f(this.pointers.resolutionLocation, this.WIDTH, this.HEIGHT); //this.gl.canvas.width, this.gl.canvas.height);

    // set the size of the image
    this.gl.uniform2f(this.pointers.textureSizeLocation, this.WIDTH, this.HEIGHT);

    // Set the contrast
    this.gl.uniform1f(this.pointers.u_brightness, this.params.brightness);
    //this.gl.uniform1f(this.pointers.u_contrast, this.params.contrast);
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
    this.gl.uniform1f(this.pointers.u_rotation, this.params.rotation );

    // Show image
    this.gl.uniform1i(this.pointers.u_image, 0); // TEXTURE 0
    this.gl.uniform1i(this.pointers.u_lut, 1); // TEXTURE 1

    
    // set the kernel and it's weight
    this.gl.uniform1fv(this.pointers.kernelLocation, this.uniforms.kernel);
    this.gl.uniform1f(this.pointers.kernelWeightLocation, this.kernelNormalization(this.uniforms.kernel));

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

  // END WEBGL PART==================================================
}

function createShader(gl: any, type: any, source: any) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  gl.deleteShader(shader);
}


function createProgram(gl: any, vertexShader: any, fragmentShader: any) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  gl.deleteProgram(program);
}


function createTexture(gl: any) {
  var texture = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  return texture;
}
