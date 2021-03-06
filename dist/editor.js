import { getCuadraticFunction } from './lib/math';
import { asArray, getLuma, hsv2rgb } from './lib/color';
import { defaultParams, paramsCallbacks, TEMP_DATA } from './lib/constants';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './shaders/index';
var clone = function (obj) { return JSON.parse(JSON.stringify(obj)); };
var realImage = null;
var LogFacade = /** @class */ (function () {
    function LogFacade() {
    }
    LogFacade.prototype.log = function (msg) {
        console.log(msg);
    };
    LogFacade.prototype.warn = function (msg) {
        console.warn(msg);
    };
    LogFacade.prototype.error = function (msg) {
        console.error(msg);
    };
    return LogFacade;
}());
/* BEGIN WEBGL PART */
var RextEditor = /** @class */ (function () {
    function RextEditor(canvas, config) {
        this.params = clone(defaultParams);
        this.gl = null;
        this.program = null;
        this.pointers = {
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
        };
        this.WIDTH = 0;
        this.HEIGHT = 0;
        this.log = new LogFacade();
        this.config = {
            resolutionLimit: 1000000,
            editionResolutionLimit: 1000000,
        };
        this.uniforms = {
            kernel: [
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0
            ],
            temptint: [1, 1, 1]
        };
        this.LIGHT_MATCH = (function () {
            var _r = [];
            for (var i = 0; i < 256; i++) {
                _r[i] = i;
            }
            return _r;
        })();
        if (canvas) {
            this.setCanvas(canvas);
        }
        if (config) {
            this.config = config;
        }
    }
    RextEditor.prototype.setCanvas = function (canvas) {
        this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    };
    RextEditor.prototype.runCallback = function (callbackName) {
        switch (callbackName) {
            case "generateLightning":
                this.generateLightning();
            case "kernel_update":
                this.updateKernel();
            case "updateTemptint":
                this.updateTemptint();
        }
        this.log.warn("No callback " + callbackName + " exists");
    };
    RextEditor.prototype.updateParams = function (params) {
        var _this = this;
        /* Calculate difference */
        var updateKeys = Object.keys(this.params).filter(function (paramKey) {
            return _this.params[paramKey] !== params[paramKey];
        });
        updateKeys.forEach(function (paramKey) {
            _this.updateParam(paramKey, params[paramKey]);
        });
        var updates = this.getCallbacks(updateKeys);
        /* Update with callbacks */
        updates.forEach(function (callbackName) {
            _this.runCallback(callbackName);
        });
        this.update();
    };
    RextEditor.prototype.getCallbacks = function (updatedParams) {
        var callbacks = new Set(updatedParams.filter(function (key) { return paramsCallbacks[key] !== undefined && paramsCallbacks[key] !== null; })
            .map(function (key) { return paramsCallbacks[key]; })
            .reduce(function (acc, v) { return acc.concat(v); }, []));
        return Array.from(callbacks);
    };
    RextEditor.prototype.updateParam = function (param, value) {
        var keys = Object.keys(this.params);
        if (keys.includes(param)) {
            // @ts-ignore
            this.params[param] = value;
        }
        else {
            this.log.error("Param " + param + " does not exists");
        }
    };
    RextEditor.prototype.load = function (url) {
        var _this = this;
        // Save real image as a copy
        realImage = new Image();
        realImage.src = url;
        realImage.onload = function () {
            if (realImage.width * realImage.height > _this.config.resolutionLimit) {
                var K = realImage.height / realImage.width;
                realImage.height = Math.floor(Math.sqrt(K * _this.config.resolutionLimit));
                realImage.width = Math.floor(realImage.height / K);
            }
        };
        var img = new Image();
        // Some JPG files are not accepted by graphic card,
        // the following code are to convert it to png image
        img.onerror = function () {
            _this.log.error("Error al cargar la imagen.");
        };
        img.onload = function () {
            try {
                var canvas = document.createElement("canvas");
                if (img.height * img.width > _this.config.editionResolutionLimit) {
                    var _H = Math.sqrt(_this.config.editionResolutionLimit * img.height / img.width);
                    var _W = img.width / img.height * _H;
                    canvas.width = _W;
                    canvas.height = _H;
                }
                else {
                    canvas.width = img.width;
                    canvas.height = img.height;
                }
                var resizeImageCanvas = canvas.getContext("2d");
                resizeImageCanvas.imageSmoothingEnabled = true;
                resizeImageCanvas.drawImage(img, 0, 0, canvas.width, canvas.height);
                var _img_1 = new Image();
                _img_1.src = canvas.toDataURL("image/png");
                _img_1.onload = function () {
                    _this.render(_img_1);
                };
            }
            catch (err) {
                _this.log.error(err);
            }
        };
        img.src = url;
    };
    RextEditor.prototype.setLog = function (log) {
        this.log = log;
    };
    RextEditor.prototype.updateKernel = function () {
        // 3x3 kernel
        var sharpness = -this.params.sharpen;
        var radius = this.params.sharpen_radius;
        var radiance = this.params.radiance;
        var hdr = this.params.hdr;
        if (radiance != 0) {
            sharpness -= 0.5 * radiance;
            radius += 0.5 * radiance;
        }
        if (hdr != 0) {
            sharpness -= 0.5 * hdr;
            radius += 0.5 * hdr;
        }
        var A = sharpness * Math.exp(-Math.pow(1 / radius, 2));
        var B = sharpness * Math.exp(-Math.pow(1.41 / radius, 2));
        var C = sharpness * Math.exp(-Math.pow(2 / radius, 2));
        var D = sharpness * Math.exp(-Math.pow(2.24 / radius, 2));
        var E = sharpness * Math.exp(-Math.pow(2.83 / radius, 2));
        var X = 1;
        if (sharpness < 0) {
            X += 4 * Math.abs(E) + 8 * Math.abs(D) + 4 * Math.abs(C) + 4 * Math.abs(B) + 4 * Math.abs(A);
        }
        this.uniforms.kernel = [E, D, C, D, E,
            D, B, A, B, D,
            C, A, X, A, C,
            D, B, A, B, D,
            E, D, C, D, E];
    };
    // Temp and Tint
    RextEditor.prototype.updateTemptint = function () {
        var T = this.params.temperature;
        var tint = this.params.tint;
        var R, G, B;
        if (T < 0) {
            R = 1;
            var i = TEMP_DATA[Math.floor((T + 1) * 100)]; // Tab values, algorithm is hard
            G = i[0];
            B = i[1];
        }
        else {
            R = 0.0438785 / (Math.pow(T + 0.150127, 1.23675)) + 0.543991;
            G = 0.0305003 / (Math.pow(T + 0.163976, 1.23965)) + 0.69136;
            B = 1;
        }
        if (tint == -1) { // HACK
            tint = -0.99;
        }
        G += tint;
        // Luma correction
        var curr_luma = getLuma({ x: R, y: G, z: B });
        var mult_K = 1 / curr_luma;
        // TODO
        this.uniforms.temptint = [R * mult_K, G * mult_K, B * mult_K];
    };
    /**
     * Lightning generation:
     * Map brightness values depending on Brightness, Contrast... etc
     */
    RextEditor.prototype.generateLightning = function () {
        var blacks = this.params.blacks;
        var shadows = this.params.shadows;
        var highlights = this.params.highlights;
        var whites = this.params.whites;
        var radiance = this.params.radiance;
        var f = getCuadraticFunction(blacks, shadows + 0.33, highlights + 0.66, whites + 1, 0, 0.33, 0.66, 1);
        // Radiance part
        if (radiance != 0) {
            var f_radiance = getCuadraticFunction(0, 0.33 - radiance * 0.11, 0.66 + radiance * 0.11, 1, 0, 0.33, 0.66, 1);
        }
        for (var i = 0; i < 256; i++) {
            var pixel_value = i / 256;
            // Brightness
            if (pixel_value > 1) {
                pixel_value = 1;
            }
            if (pixel_value < 0) {
                pixel_value = 0;
            }
            // Contrast
            if (pixel_value > 1) {
                pixel_value = 1;
            }
            if (pixel_value < 0) {
                pixel_value = 0;
            }
            if (f_radiance) {
                pixel_value = f_radiance(pixel_value);
            }
            pixel_value = f(pixel_value);
            if (pixel_value > 1) {
                pixel_value = 1;
            }
            if (pixel_value < 0) {
                pixel_value = 0;
            }
            this.LIGHT_MATCH[i] = pixel_value * 255;
        }
    };
    /**
     * kernelNormalization
     * Compute the total weight of the kernel in order to normalize it
     */
    RextEditor.prototype.kernelNormalization = function (kernel) {
        return kernel.reduce(function (a, b) { return a + b; });
    };
    /**
     * render
     * Prepare the environment to edit the image
     * image: Image element to edit (Image object)
     * context: webgl context. Default: __window.gl
     * SET_FULL_RES: no resize the image to edit. Default: false (resize the image)
     */
    RextEditor.prototype.render = function (image, preventRenderImage) {
        // Load GSLS programs
        var VERTEX_SHADER_CODE = createShader(this.gl, this.gl.VERTEX_SHADER, VERTEX_SHADER);
        var FRAGMENT_SHADER_CODE = createShader(this.gl, this.gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
        try {
            this.program = createProgram(this.gl, VERTEX_SHADER_CODE, FRAGMENT_SHADER_CODE);
        }
        catch (err) {
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
        console.log("[IMAGE] width = " + this.WIDTH + ", height = " + this.HEIGHT);
        this.setRectangle(0, 0, this.WIDTH, this.HEIGHT);
        // Create the rectangle 
        this.pointers.texcoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointers.texcoordBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0,
        ]), this.gl.STATIC_DRAW);
        this.gl.activeTexture(this.gl.TEXTURE0);
        var originalImageTexture = createTexture(this.gl);
        // Upload the image into the texture.
        try {
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        }
        catch (err) {
            return this.log.error(err);
        }
        this.pointers.u_image = this.gl.getUniformLocation(this.program, "u_image");
        // lookup uniforms
        this.pointers.resolutionLocation = this.gl.getUniformLocation(this.program, "u_resolution");
        this.pointers.textureSizeLocation = this.gl.getUniformLocation(this.program, "u_textureSize");
        this.pointers.kernelLocation = this.gl.getUniformLocation(this.program, "u_kernel[0]");
        this.pointers.kernelWeightLocation = this.gl.getUniformLocation(this.program, "u_kernelWeight");
        this.pointers.u_exposure = this.gl.getUniformLocation(this.program, "u_exposure");
        this.pointers.u_brightness = this.gl.getUniformLocation(this.program, "u_brightness");
        this.pointers.u_contrast = this.gl.getUniformLocation(this.program, "u_contrast");
        this.pointers.u_saturation = this.gl.getUniformLocation(this.program, "u_saturation");
        this.pointers.u_masking = this.gl.getUniformLocation(this.program, "u_masking");
        this.pointers.u_dehaze = this.gl.getUniformLocation(this.program, "u_dehaze");
        this.pointers.u_atmosferic_light = this.gl.getUniformLocation(this.program, "u_atmosferic_light");
        this.pointers.u_temptint = this.gl.getUniformLocation(this.program, "u_temptint[0]");
        this.pointers.u_bAndW = this.gl.getUniformLocation(this.program, "u_bAndW");
        this.pointers.u_hdr = this.gl.getUniformLocation(this.program, "u_hdr");
        this.pointers.u_lut = this.gl.getUniformLocation(this.program, "u_lut");
        // Upload the LUT (contrast, brightness...)
        this.gl.activeTexture(this.gl.TEXTURE1);
        var LUTTexture = createTexture(this.gl);
        this.gl.viewport(0, 0, this.WIDTH, this.HEIGHT);
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        if (!preventRenderImage) {
            this.update();
        }
    };
    RextEditor.prototype.update = function () {
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.ALPHA, 256, 1, 0, this.gl.ALPHA, this.gl.UNSIGNED_BYTE, new Uint8Array(this.LIGHT_MATCH));
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
        // Show image
        this.gl.uniform1i(this.pointers.u_image, 0); // TEXTURE 0
        this.gl.uniform1i(this.pointers.u_lut, 1); // TEXTURE 1
        // set the kernel and it's weight
        this.gl.uniform1fv(this.pointers.kernelLocation, this.uniforms.kernel);
        this.gl.uniform1f(this.pointers.kernelWeightLocation, this.kernelNormalization(this.uniforms.kernel));
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    };
    RextEditor.prototype.setRectangle = function (x, y, width, height) {
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
    };
    return RextEditor;
}());
export { RextEditor };
function createShader(gl, type, source) {
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
function createProgram(gl, vertexShader, fragmentShader) {
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
function createTexture(gl) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return texture;
}
