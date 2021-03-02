import { getCuadraticFunction } from './math'
import { vec3 } from './models';
import { Params, defaults } from './params'
import { asArray, getLuma, hsv2rgb } from './color'
const FRAGMENT_SHADER = require('./fragment_shader.frag')
const VERTEX_SHADER = require('./vertex_shader.vert')

const RESOLUTION_LIMIT = 10000000;
const EDITION_RESOLUTION_LIMIT = 10000000 / 4;

function isWindow() {
  return window !== undefined;
}

function getRequestAnimationFrame() {
  const fallbackFunction = (fn: any) => { setTimeout(fn, 20); }
  if (!isWindow()) {
    return fallbackFunction;
  }
  return window.requestAnimationFrame ||
    (window as any).mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || 
    (window as any).msRequestAnimationFrame || 
    fallbackFunction;
}

const RAF = getRequestAnimationFrame();

const clone = (obj: any) => JSON.parse(JSON.stringify(obj));

const parameters = clone(defaults)


var realImage : any = null;


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
class RextEditor {

  params: Params = clone(defaults)
  gl : any = null;
  log: Log = new LogFacade()
  uniforms = {
    kernel: [
      0,0,0,0,0, 
      0,0,0,0,0,
      0,0,1,0,0,
      0,0,0,0,0,
      0,0,0,0,0],
    temptint: [1, 1, 1]
  }

  LIGHT_MATCH = (function() {
  	var _r = [];
  	for (var i = 0; i < 256; i++) {
  		_r[i] = i;
  	}
  	return _r;
  })();

  constructor() {

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
  generateLightningfunction () {
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


  	// Radiance part
  	if (radiance != 0) {
  		var f_radiance = getCuadraticFunction(
  			0,
  			0.33 - radiance * 0.11,
  			0.66 + radiance * 0.11,
  			1,
  			0, 0.33, 0.66, 1);
  	}

  	for (var i = 0; i < 256; i++) {
  		var pixel_value = i / 256;

  		// Brightness
  		if (pixel_value > 1) { pixel_value = 1; }
  		if (pixel_value < 0) { pixel_value = 0; }

  		// Contrast
   		if (pixel_value > 1) { pixel_value = 1; }
  		if (pixel_value < 0) { pixel_value = 0; }
  		
  		if (f_radiance) {
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

  /**
   * render
   * Prepare the environment to edit the image
   * image: Image element to edit (Image object)
   * context: webgl context. Default: __window.gl
   * SET_FULL_RES: no resize the image to edit. Default: false (resize the image)
   */


  render(image: any, preventRenderImage?: boolean) {
    
    // Load GSLS programs
    var VERTEX_SHADER_CODE = createShader(this.gl, this.gl.VERTEX_SHADER, __SHADERS__.VERTEX);
  	var FRAGMENT_SHADER_CODE = createShader(this.gl, this.gl.FRAGMENT_SHADER, __SHADERS__.FRAGMENT);

    let program : any;
    try {
    	program = createProgram(this.gl, VERTEX_SHADER_CODE, FRAGMENT_SHADER_CODE);
    } catch(err) {
    	return this.log.error(err);
    }

    // look up where the vertex data needs to go.
    const positionLocation = this.gl.getAttribLocation(program, "a_position");
    const texcoordLocation = this.gl.getAttribLocation(program, "a_texCoord");

    // Create a buffer to put three 2d clip space points in
    const positionBuffer = this.gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    
    // Set a rectangle the same size as the image.
    const WIDTH = image.width;
    const HEIGHT = image.height;
    this.gl.canvas.width = WIDTH;
    this.gl.canvas.height = HEIGHT;

    console.log("[IMAGE] width = " + WIDTH + ", height = " + HEIGHT);

    this.setRectangle(0, 0, WIDTH, HEIGHT);

    // Create the rectangle 
    const texcoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texcoordBuffer);
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

    const u_image = this.gl.getUniformLocation(program, "u_image");
  	
    // lookup uniforms
    const resolutionLocation    = this.gl.getUniformLocation(program, "u_resolution");
    const textureSizeLocation   = this.gl.getUniformLocation(program, "u_textureSize");
    const kernelLocation        = this.gl.getUniformLocation(program, "u_kernel[0]");
    const kernelWeightLocation  = this.gl.getUniformLocation(program, "u_kernelWeight");
    const u_exposure            = this.gl.getUniformLocation(program, "u_exposure");
    const u_brightness          = this.gl.getUniformLocation(program, "u_brightness");
    const u_contrast            = this.gl.getUniformLocation(program, "u_contrast");
    const u_saturation          = this.gl.getUniformLocation(program, "u_saturation");
    const u_masking             = this.gl.getUniformLocation(program, "u_masking");
    const u_dehaze              = this.gl.getUniformLocation(program, "u_dehaze");
    const u_atmosferic_light    = this.gl.getUniformLocation(program, "u_atmosferic_light");
    const u_temptint            = this.gl.getUniformLocation(program, "u_temptint[0]");
    const u_bAndW               = this.gl.getUniformLocation(program, "u_bAndW");
    const u_hdr                 = this.gl.getUniformLocation(program, "u_hdr");

    const u_lut = this.gl.getUniformLocation(program, "u_lut");
    // Upload the LUT (contrast, brightness...)
    this.gl.activeTexture(this.gl.TEXTURE1);

    const LUTTexture = createTexture(this.gl);   

    this.gl.viewport(0, 0, WIDTH, HEIGHT);
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    const update = () => {

      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.ALPHA, 256, 1, 0, this.gl.ALPHA, this.gl.UNSIGNED_BYTE,
          new Uint8Array(this.LIGHT_MATCH));

      // Tell it to use our program (pair of shaders)
      this.gl.useProgram(program);

      // Turn on the position attribute
      this.gl.enableVertexAttribArray(positionLocation);

      // Bind the position buffer.
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

      this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

      // Turn on the teccord attribute
      this.gl.enableVertexAttribArray(texcoordLocation);

      // Bind the position buffer.
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texcoordBuffer);

      this.gl.vertexAttribPointer(texcoordLocation, 2, this.gl.FLOAT, false, 0, 0);

      // set the resolution
      this.gl.uniform2f(resolutionLocation, WIDTH, HEIGHT); //this.gl.canvas.width, this.gl.canvas.height);

      // set the size of the image
      this.gl.uniform2f(textureSizeLocation, WIDTH, HEIGHT);

      // Set the contrast
      this.gl.uniform1f(u_brightness, this.params.brightness);
      //this.gl.uniform1f(u_contrast, this.params.contrast);
      this.gl.uniform1f(u_exposure, this.params.exposure);
      this.gl.uniform1f(u_contrast, this.params.contrast);
      this.gl.uniform1f(u_saturation, this.params.saturation);
      this.gl.uniform1f(u_masking, this.params.masking);
      this.gl.uniform1f(u_dehaze, this.params.dehaze);
      this.gl.uniform1f(u_atmosferic_light, this.params.atmosferic_light);
      this.gl.uniform3fv(u_temptint, this.uniforms.temptint
        .concat(asArray(hsv2rgb({ x: this.params.lightColor * 360, y: this.params.lightSat, z: this.params.lightFill })))
        .concat(asArray(hsv2rgb({ x: this.params.darkColor * 360, y: this.params.darkSat, z: this.params.darkFill })))); // vec3 x3
      this.gl.uniform1f(u_bAndW, this.params.bAndW);
      this.gl.uniform1f(u_hdr, this.params.hdr);

      // Show image
      this.gl.uniform1i(u_image, 0); // TEXTURE 0
  		this.gl.uniform1i(u_lut, 1); // TEXTURE 1

      
      // set the kernel and it's weight
      this.gl.uniform1fv(kernelLocation, this.uniforms.kernel);
      this.gl.uniform1f(kernelWeightLocation, this.kernelNormalization(this.uniforms.kernel));

      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
    if (!preventRenderImage) { 
      update();
    }
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

  loadImageFromUrl(url: string) {

    realImage = new Image();
  	realImage.src = url;
    realImage.onload = function() {
      if (realImage.width * realImage.height > RESOLUTION_LIMIT) {
        var K = realImage.height / realImage.width;
        realImage.height = Math.floor(Math.sqrt(K * RESOLUTION_LIMIT));
        realImage.width = Math.floor(realImage.height / K);
      }
    }
    var img = new Image();

    // Some JPG files are not accepted by graphic card,
    // the following code are to convert it to png image
    img.onerror = () => {
      this.log.error("Error al cargar la imagen.")
    }

    img.onload = () => {
      try {
        var canvas = document.createElement("canvas");

        if (img.height * img.width > EDITION_RESOLUTION_LIMIT) {
          var _H = Math.sqrt(EDITION_RESOLUTION_LIMIT * img.height / img.width);
          var _W = img.width / img.height * _H;
          canvas.width = _W;
          canvas.height = _H;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }


        var resizeImageCanvas = canvas.getContext("2d");
        resizeImageCanvas.imageSmoothingEnabled = true;
        resizeImageCanvas.drawImage(img, 0, 0, canvas.width, canvas.height);

        var _img = new Image();
        _img.src = canvas.toDataURL("image/png");

        _img.onload = () => {
          this.render(_img);
        }
        
      } catch(err) {
        this.log.error(err);
      }
    }
    
    img.src = url;

  }

  /* BOOT CODE */
  initGL(imageElm: any) {

  	this.gl = imageElm.getContext("webgl") || imageElm.getContext("experimental-webgl");
  	if (!this.gl) {
  		alert("Error: No webgl detected");
  	}

  	imageElm.addEventListener("change", (e: Event) => {
      let imageReader = new FileReader();
      const target : any = e.target;
      if (target.files[0]) {
        this.loadImageFromUrl(URL.createObjectURL(target.files[0]))
      }
  	})
  };
}

function createShader(gl: any, type: any, source: any) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}


function createProgram(gl: any, vertexShader: any, fragmentShader: any) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  
  console.log(gl.getProgramInfoLog(program));
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
