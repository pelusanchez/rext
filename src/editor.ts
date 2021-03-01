import { getCuadraticFunction } from './math'
import { Params, defaults } from './params'

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

const clamp = (a: number, b: number, c: number) => {
  return (a < b) ? b : (a > c) ? c : a;
}

interface vec3 {
  x: number;
  y: number;
  z: number;
}

const asArray = (vec: vec3) => {
  return [ vec.x, vec.y, vec.z ]
}

const hsv2rgb = (pixel_hsv: vec3) : vec3  => {
  let a, d, c;
  let r, g, b;

  a = pixel_hsv.z * pixel_hsv.y;
  d = a * (1.0 - Math.abs( (pixel_hsv.x / 60.0) % 2.0 - 1.0));
  c = pixel_hsv.z - a;
  if (pixel_hsv.x < 180.0) {
    if (pixel_hsv.x < 60.0) {
      r = pixel_hsv.z;
      g = d + c;
      b = c;
    } else if (pixel_hsv.x < 120.0) {
      r = d + c;
      g = pixel_hsv.z;
      b = c;
    } else {
      r = c;
      g = pixel_hsv.z;
      b = d + c;
    }
  } else {
    if (pixel_hsv.x < 240.0) {
      r = c;
      g = d + c;
      b = pixel_hsv.z;
    } else if(pixel_hsv.x < 300.0) {
      r = d + c;
      g = c;
      b = a + c;
    } else {
      r = a + c;
      g = c;
      b = d + c;
    }
  }

  r = clamp(r, 0.0, 1.0);
  g = clamp(g, 0.0, 1.0);
  b = clamp(b, 0.0, 1.0);

  return {x: r, y: g, z: b};
}

const clone = (obj: any) => JSON.parse(JSON.stringify(obj));

const parameters = clone(defaults)


var realImage : any = null;

function getLuma(rgb_pix: vec3) : number {
  return 0.2126 * rgb_pix.x + 0.7152 * rgb_pix.y + 0.0722 * rgb_pix.z;
}

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

const TEMP_DATA = [
  [0.6167426069865002, 0.017657981710823077],
  [0.5838624982041293, 0.06447754787874993],
  [0.5666570157784903, 0.1010769359975838],
  [0.5600215017846518, 0.13012054359808795],
  [0.5603460901328465, 0.15370282338343416],
  [0.5651414015638195, 0.1734071109259789],
  [0.5727157905223393, 0.19040417876076665],
  [0.5819305919306469, 0.20554787970182647],
  [0.5920253173976543, 0.219454396860673],
  [0.6024964973113273, 0.23256361077001078],
  [0.613014923688415, 0.2451851574423344],
  [0.6233694681448863, 0.2575325541865392],
  [0.633428991849502, 0.2697484189519574],
  [0.6431164873163056, 0.2819231700046263],
  [0.6523914777767198, 0.29410898225476145],
  [0.6612380004437802, 0.30633028466830314],
  [0.6696563786680246, 0.31859171532935343],
  [0.6776575761390952, 0.330884185957384],
  [0.6852593188363603, 0.34318952105568623],
  [0.6924834326806721, 0.3554840067292358],
  [0.6993540206164168, 0.36774109382812364],
  [0.705896221219359, 0.37993343721079975],
  [0.712135371070854, 0.3920344089104195],
  [0.7180964477199883, 0.4040191918024166],
  [0.7238037074478182, 0.41586553788423575],
  [0.7292804578150028, 0.42755425869079605],
  [0.7345489228275083, 0.43906950280216533],
  [0.7396301709912545, 0.4503988656030025],
  [0.7445440852278651, 0.4615333686006381],
  [0.7493093597375261, 0.47246733915721345],
  [0.7539435132044948, 0.4831982160881075],
  [0.7584629107855697, 0.4937263019887011],
  [0.7628827894765442, 0.5040544792219176],
  [0.7672172829757861, 0.5141879031216875],
  [0.7756812566990368, 0.5339005596070674],
  [0.7756812566990368, 0.5339005596070674],
  [0.7798336535847834, 0.5434985836882681],
  [0.7839465092903851, 0.552938802301879],
  [0.7880286368234596, 0.5622329533372938],
  [0.7920877696863722, 0.5713931712543325],
  [0.796130534601134, 0.5804317041849897],
  [0.8001624136045166, 0.5893606423074715],
  [0.8041876951180534, 0.5981916567442426],
  [0.8082094136732589, 0.6069357478075997],
  [0.8122292780585781, 0.6156030011340633],
  [0.8162475877574743, 0.624202350096731],
  [0.8202631376804659, 0.6327413428542148],
  [0.8242731113661302, 0.6412259124772712],
  [0.8282729630469863, 0.6496601487868902],
  [0.8322562892583072, 0.6580460708395705],
  [0.8362146910181553, 0.6663833994084263],
  [0.8401376280395388, 0.6746693293369075],
  [0.8440122669563406, 0.6828983022904387],
  [0.8478233261635671, 0.691061781205187],
  [0.8515529205921868, 0.6991480286361483],
  [0.8578515274860328, 0.7143328511178657],
  [0.8630349166004683, 0.7236145588845],
  [0.8630349166004683, 0.7236145588845],
  [0.8678866519883774, 0.7326305266929798],
  [0.8724265417351438, 0.7413920824039555],
  [0.8766746938112879, 0.7499106260961086],
  [0.8806514255414362, 0.7581975699581189],
  [0.8843771730729832, 0.7662642858505886],
  [0.8878724008449614, 0.7741220599147951],
  [0.8911575110568668, 0.7817820536219475],
  [0.8942527531374216, 0.7892552706795768],
  [0.8971781332133792, 0.7965525292390034],
  [0.9025975721615955, 0.8106613818669473],
  [0.9051296119968262, 0.8174934982533621],
  [0.9051296119968262, 0.8174934982533621],
  [0.9075675706910422, 0.8241906743465228],
  [0.9099288798932852, 0.8307625342003426],
  [0.912230184763394, 0.8372184337382709],
  [0.914487253441016, 0.8435674571884941],
  [0.9167148865142485, 0.8498184155292972],
  [0.9189268264883301, 0.8559798466723794],
  [0.9211356672547586, 0.862060017138353],
  [0.9233527635598611, 0.8680669250033681],
  [0.9278504028585166, 0.8798916280267886],
  [0.9301466448383797, 0.8857241176152066],
  [0.9324823592671754, 0.8915127453709542],
  [0.9348613471976668, 0.8972642431099969],
  [0.9348613471976668, 0.8972642431099969],
  [0.9372856273504615, 0.9029851088748369],
  [0.9397553455825536, 0.9086816143048344],
  [0.9422686843563701, 0.9143598121965675],
  [0.9448217722084058, 0.9200255441824128],
  [0.947408593218177, 0.925684448465339],
  [0.9500208964767429, 0.931341967556689],
  [0.9552772279767501, 0.9426736878435626],
  [0.9578927646784257, 0.9483578644262163],
  [0.9604766194871308, 0.954060621455171],
  [0.9630080085847714, 0.9597865363484674],
  [0.965463369977889, 0.9655400352277332],
  [0.965463369977889, 0.9655400352277332],
  [0.9678162729662736, 0.9713253997462401],
  [0.9700373276119754, 0.9771467737131783],
  [0.9720940942080452, 0.9830081695063213],
  [0.9739509927471266, 0.9889134742677088],
  [0.97556921239073, 0.9948664558790756],
  [0.9782396416593983, 1]
];

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
