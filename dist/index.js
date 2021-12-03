(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["RextEditor"] = factory();
	else
		root["RextEditor"] = factory();
})(this, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/shaders/fragment_shader.frag":
/*!********************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/shaders/fragment_shader.frag ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/** * David Iglesias. All rights reserved */\nprecision mediump float;\nuniform sampler2D u_image;\nuniform vec2 u_textureSize;\nuniform float u_kernel[25];\nuniform float u_kernelWeight;\nuniform sampler2D u_lut;\nuniform float u_saturation;\nuniform float u_brightness;\nuniform float u_exposure;\nuniform float u_contrast;\nuniform float u_dehaze;\nuniform float u_atmosferic_light;\nuniform float u_masking;\nuniform vec3 u_temptint[3]; // RGB temptint, RGB lightFill, RGB darkFill\nuniform float u_bAndW;\nuniform float u_hdr;\nvarying vec2 v_texCoord;\nvoid main() {\n  \n\tvec2 pixel_size = vec2(1.0, 1.0) / u_textureSize;\n  \n\tvec3 center = texture2D(u_image, v_texCoord).rgb;\n\n  /* 5x5 kernel filter */\n  vec4 colorSum = texture2D(u_image, v_texCoord + pixel_size * vec2(-2, -2)) * u_kernel[0]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-1, -2)) * u_kernel[1]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(0, -2)) * u_kernel[2]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(1, -2)) * u_kernel[3]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(2, -2)) * u_kernel[4]\n\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-2, -1)) * u_kernel[5]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-1, -1)) * u_kernel[6]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(0, -1)) * u_kernel[7]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(1, -1)) * u_kernel[8]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(2, -1)) * u_kernel[9]\n\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-2, 0)) * u_kernel[10]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-1, 0)) * u_kernel[11]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(0, 0)) * u_kernel[12]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(1, 0)) * u_kernel[13]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(2, 0)) * u_kernel[14]\n\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-2, 1)) * u_kernel[15]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-1, 1)) * u_kernel[16]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(0, 1)) * u_kernel[17]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(1, 1)) * u_kernel[18]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(2, 1)) * u_kernel[19]\n\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-2, 2)) * u_kernel[20]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-1, 2)) * u_kernel[21]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(0, 2)) * u_kernel[22]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(1, 2)) * u_kernel[23]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(2, 2)) * u_kernel[24];\n\n\t/* Kernel filter mask */\n  vec3 rgb_pix = mix(center, (colorSum.rgb / u_kernelWeight), u_masking);\n\t\n\t/**\n\t * RGB to saturation/value conversion, in order to keep hue constant \n\t * sv_pixel = (saturation, value)\n\t */\n  float _max = max(rgb_pix.r, max(rgb_pix.g, rgb_pix.b));\n  float _min = min(rgb_pix.r, min(rgb_pix.g, rgb_pix.b));\n  vec2 sv_pixel = vec2(1.0 - _min / _max, _max);\n\n  sv_pixel.y = clamp(texture2D(u_lut, vec2(sv_pixel.y, 0.0)).a, 0.0, 1.0);\n\n\t/* Add saturation */\n  if (u_saturation != 0.0) {\n    sv_pixel.x *= (1.0 + u_saturation);\n  }\n\n  sv_pixel.x = clamp(sv_pixel.x, 0.0, 1.0);\n\n\t/* Brightness */\n  if (u_brightness != 0.0) {\n    sv_pixel.y = pow(sv_pixel.y, 1.0 - u_brightness * 0.6);\n  }\n\n\t/* HDR 'like' filter */\n  if (u_hdr != 0.0) {\n    sv_pixel.y = mix(sv_pixel.y, clamp(1.0 - pow(1.0 - pow(sv_pixel.y, 0.3), 0.42), 0.0, 1.0), u_hdr);\n  }\n\n  sv_pixel = clamp(sv_pixel, 0.0, 1.0);\n\t/* Return to RGB */\n  if (sv_pixel.x > 0.0) {\n    float k = -sv_pixel.x / (1.0 - _min / _max);\n    rgb_pix = (_max - rgb_pix) * k + _max;\n    rgb_pix *= sv_pixel.y / _max;\n  } else {\n    rgb_pix.r = rgb_pix.g = rgb_pix.b = sv_pixel.y;\n  }\n\n\t/* Dehaze */\n  if (u_dehaze != 0.0) {\n    float t = 1.0 / 25.0;\n    vec4 center = texture2D(u_image, v_texCoord);\n    vec2 pixel_size = vec2(1.0, 1.0) / u_textureSize;\n    float dark = 1.0;\n    const int radius = 1;\n    for (int ii = -radius; ii <= radius; ii++) {\n      for (int jj = -radius; jj <= radius; jj++) {\n        vec4 pix = texture2D(u_image, v_texCoord + pixel_size * vec2(ii, jj));\n        float _min = min(pix.r, min(pix.g, pix.b));\n        if (dark > _min) {\n          dark = _min;\n        }\n      }\n    }\n    float darkPix = min(center.r, min(center.g, center.b));\n    float diff = abs(darkPix - dark);\n    float mask = pow(diff, 3.0);\n    dark = mix(darkPix, dark, mask);\n    float mm = max(1.0 - dark, 0.2);\n    rgb_pix = mix(rgb_pix, ((rgb_pix - u_atmosferic_light) / mm + u_atmosferic_light), u_dehaze);\n  }\n\n\t/* Exposure */\n  rgb_pix += u_exposure;\n  rgb_pix = clamp(rgb_pix, 0.0, 1.0);\n\n\t/* Contrast */\n  float contrast = u_contrast + 1.0;\n  rgb_pix = contrast * (rgb_pix - 0.5) + 0.5;\n\t\n\t/* Apply tint filter */\n  rgb_pix *= u_temptint[0];\n  float mono = dot(rgb_pix, vec3(0.2126, 0.7152, 0.0722));\n  rgb_pix += mix(u_temptint[2], u_temptint[1], mono);\n\n\t/* Black&White filter */\n  if (u_bAndW != 0.0) {\n    rgb_pix = mix(rgb_pix, vec3(mono, mono, mono), u_bAndW);\n  }\n\n  gl_FragColor = vec4(rgb_pix, 1.0);\n\n}\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/shaders/vertex_shader.vert":
/*!******************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/shaders/vertex_shader.vert ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("attribute vec2 a_position;\nattribute vec2 a_texCoord;\nuniform vec2 u_resolution;\nvarying vec2 v_texCoord;\nuniform vec2 u_rotation;\nuniform vec2 u_rotation_center;\nuniform vec2 u_scale;\nuniform vec2 u_translate; \n\nvoid main() {\n\n  vec2 scaled = a_position * vec2(u_scale);\n  vec2 pos_r_t = scaled - u_rotation_center;\n  vec2 pos_rotated = vec2(\n    pos_r_t.x * u_rotation.y + pos_r_t.y * u_rotation.x,\n    pos_r_t.y * u_rotation.y - pos_r_t.x * u_rotation.x);\n  \n  vec2 dist = (pos_rotated + u_rotation_center) / u_resolution;\n\n  vec2 pos = vec2((dist + u_translate) * 2.0 - 1.0) * vec2(1, -1);\n  gl_Position = vec4(pos, 0, 1);\n  v_texCoord = a_texCoord;\n}\n");

/***/ }),

/***/ "./src/editor.ts":
/*!***********************!*\
  !*** ./src/editor.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RextEditor": () => (/* binding */ RextEditor)
/* harmony export */ });
/* harmony import */ var _lib_color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/color */ "./src/lib/color.ts");
/* harmony import */ var _lib_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/constants */ "./src/lib/constants.ts");
/* harmony import */ var _shaders_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shaders/index */ "./src/shaders/index.ts");
/* harmony import */ var _log_LogFacade__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./log/LogFacade */ "./src/log/LogFacade.ts");
/* harmony import */ var _lib_image_transforms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/image-transforms */ "./src/lib/image-transforms.ts");
/* harmony import */ var _shaders__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./shaders */ "./src/shaders.ts");
/* harmony import */ var _lib_context__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./lib/context */ "./src/lib/context.ts");







const clone = (obj) => JSON.parse(JSON.stringify(obj));
const CANVAS_OPTIONS = {
    alpha: false,
    antialias: false,
};
/* BEGIN WEBGL PART */
class RextEditor {
    constructor(canvas) {
        this.params = clone(_lib_constants__WEBPACK_IMPORTED_MODULE_1__.defaultParams);
        this.program = null;
        this.realImage = null;
        this.currentImage = null;
        this.context = null;
        this.config = _lib_constants__WEBPACK_IMPORTED_MODULE_1__.defaultConfig;
        this.onParamsChangeCallbacks = [];
        this.WIDTH = 0;
        this.HEIGHT = 0;
        this.log = new _log_LogFacade__WEBPACK_IMPORTED_MODULE_3__.LogFacade();
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
        this.LIGHT_MATCH = new Array(256).fill(0).map((v, i) => i);
        if (canvas) {
            this.setCanvas(canvas);
        }
    }
    setCanvas(canvas) {
        this.config.width = canvas.width;
        this.config.height = canvas.height;
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl", CANVAS_OPTIONS) || canvas.getContext("experimental-webgl", CANVAS_OPTIONS);
    }
    runCallback(callbackName) {
        switch (callbackName) {
            case "generateLightning":
                this.generateLightning();
            case "kernel_update":
                this.uniforms.kernel = (0,_lib_image_transforms__WEBPACK_IMPORTED_MODULE_4__.computeKernel)(this.params);
            case "updateTemptint":
                this.updateTemptint();
                return;
        }
        this.log.warn(`No callback ${callbackName} exists`);
    }
    onParamsChange(callback) {
        this.onParamsChangeCallbacks.push(callback);
    }
    updateParams(params) {
        /* Calculate difference */
        const updateKeys = Object.keys(this.params).filter(paramKey => {
            return this.params[paramKey] !== params[paramKey];
        });
        updateKeys.forEach(paramKey => {
            this._updateParam(paramKey, params[paramKey]);
        });
        const updates = this.getCallbacks(updateKeys);
        /* Update with callbacks */
        updates.forEach(callbackName => {
            this.runCallback(callbackName);
        });
        this.update();
        this.onParamsChangeCallbacks.forEach(callback => {
            if (callback) {
                try {
                    callback(this.params);
                }
                catch (err) {
                    // Ignored
                }
            }
        });
    }
    getCallbacks(updatedParams) {
        const callbacks = new Set(updatedParams.filter(key => _lib_constants__WEBPACK_IMPORTED_MODULE_1__.paramsCallbacks[key] !== undefined && _lib_constants__WEBPACK_IMPORTED_MODULE_1__.paramsCallbacks[key] !== null)
            .map(key => _lib_constants__WEBPACK_IMPORTED_MODULE_1__.paramsCallbacks[key])
            .reduce((acc, v) => acc.concat(v), []));
        return Array.from(callbacks);
    }
    // Do not call this method from any other function than updateParams
    _updateParam(param, value) {
        const keys = Object.keys(this.params);
        if (keys.includes(param)) {
            // @ts-ignore
            this.params[param] = value;
        }
        else {
            this.log.error(`Param ${param} does not exists`);
        }
    }
    autoZoom() {
        const widthX = this.config.width / this.WIDTH;
        const heightX = this.config.height / this.HEIGHT;
        const maxX = Math.max(widthX, heightX);
        this.setZoom(maxX);
    }
    setZoom(zoom) {
        this.updateParams({ ...this.params, zoom: zoom });
        this.update();
    }
    getWidth() {
        return this.WIDTH;
    }
    getHeight() {
        return this.HEIGHT;
    }
    setWidth(width) {
        this.WIDTH = width;
    }
    setHeight(height) {
        this.HEIGHT = height;
    }
    getCanvas() {
        return this.gl.canvas;
    }
    // FIXME: To Math class
    get2dRotation() {
        return [
            Math.sin(this.params.rotation),
            Math.cos(this.params.rotation)
        ];
    }
    get2dRotationCenter() {
        const x = (this.params.rotation_center.x + 1) * this.WIDTH / 2.0;
        const y = (this.params.rotation_center.y + 1) * this.HEIGHT / 2.0;
        return [x, y];
    }
    loadImage(url) {
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
            };
            image.onerror = (err) => {
                this.log.error("Error while loading the image.");
                reject(err);
            };
            this.currentImage = image;
            image.src = url;
            this.realImage = image;
        });
    }
    async load(url, config) {
        this.log.log("Version 1.4.0");
        // Save real image as a copy
        if (config !== undefined) {
            this.config = config;
        }
        await this.loadImage(url);
        return this;
    }
    setLog(log) {
        this.log = log;
    }
    // Temp and Tint
    updateTemptint() {
        this.uniforms.temptint = (0,_lib_image_transforms__WEBPACK_IMPORTED_MODULE_4__.tempTint)(this.params);
    }
    /**
     * Lightning generation:
     * Map brightness values depending on Brightness, Contrast... etc
     */
    generateLightning() {
        this.LIGHT_MATCH = (0,_lib_image_transforms__WEBPACK_IMPORTED_MODULE_4__.lightning)(this.params);
    }
    blob(type, quality) {
        return new Promise((resolve, reject) => {
            if (this.realImage === null) {
                this.log.warn('Called to blob without loaded image');
                return reject();
            }
            this.create(this.realImage);
            this.getCanvas().toBlob((blob) => {
                if (blob === null) {
                    this.log.error('Unable to generate the blob file');
                    return reject();
                }
                resolve(blob);
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
    create(image, preventRenderImage) {
        // Load GSLS programs
        try {
            const VERTEX_SHADER_CODE = (0,_shaders__WEBPACK_IMPORTED_MODULE_5__.createShader)(this.gl, this.gl.VERTEX_SHADER, _shaders_index__WEBPACK_IMPORTED_MODULE_2__.VERTEX_SHADER);
            const FRAGMENT_SHADER_CODE = (0,_shaders__WEBPACK_IMPORTED_MODULE_5__.createShader)(this.gl, this.gl.FRAGMENT_SHADER, _shaders_index__WEBPACK_IMPORTED_MODULE_2__.FRAGMENT_SHADER);
            this.program = (0,_shaders__WEBPACK_IMPORTED_MODULE_5__.createProgram)(this.gl, VERTEX_SHADER_CODE, FRAGMENT_SHADER_CODE);
        }
        catch (err) {
            return this.log.error(err);
        }
        this.context = new _lib_context__WEBPACK_IMPORTED_MODULE_6__.Context(this.gl, this.program);
        this.log.log("[IMAGE] width = " + this.WIDTH + ", height = " + this.HEIGHT);
        this.log.log("[CANVAS] width = " + this.canvas.width + ", height = " + this.canvas.height);
        this.setRectangle(this.context.createBuffer("ARRAY_BUFFER"), 0.0, 0.0, this.WIDTH, this.HEIGHT);
        this.setRectangle(this.context.createBuffer("TEXCOORD_BUFFER"), 0, 0, 1.0, 1.0);
        this.gl.activeTexture(this.gl.TEXTURE0);
        // Upload the image into the texture.
        (0,_shaders__WEBPACK_IMPORTED_MODULE_5__.createTexture)(this.gl);
        try {
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        }
        catch (err) {
            return this.log.error(err);
        }
        // Upload the LUT (contrast, brightness...)
        this.gl.activeTexture(this.gl.TEXTURE1);
        (0,_shaders__WEBPACK_IMPORTED_MODULE_5__.createTexture)(this.gl);
        this.gl.viewport(0, 0, this.WIDTH, this.HEIGHT);
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        if (!preventRenderImage) {
            this.update();
        }
    }
    fitCanvas(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
    update() {
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.ALPHA, 256, 1, 0, this.gl.ALPHA, this.gl.UNSIGNED_BYTE, new Uint8Array(this.LIGHT_MATCH));
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
            .concat((0,_lib_color__WEBPACK_IMPORTED_MODULE_0__.asArray)((0,_lib_color__WEBPACK_IMPORTED_MODULE_0__.hsv2rgb)({ x: this.params.lightColor * 360, y: this.params.lightSat, z: this.params.lightFill })))
            .concat((0,_lib_color__WEBPACK_IMPORTED_MODULE_0__.asArray)((0,_lib_color__WEBPACK_IMPORTED_MODULE_0__.hsv2rgb)({ x: this.params.darkColor * 360, y: this.params.darkSat, z: this.params.darkFill })))); // vec3 x3
        this.gl.uniform1f(this.context.getUniform("u_bAndW"), this.params.bAndW);
        this.gl.uniform1f(this.context.getUniform("u_hdr"), this.params.hdr);
        this.gl.uniform2fv(this.context.getUniform("u_rotation"), this.get2dRotation());
        this.gl.uniform2fv(this.context.getUniform("u_rotation_center"), this.get2dRotationCenter());
        this.gl.uniform2f(this.context.getUniform("u_scale"), this.params.scale.x, this.params.scale.y);
        this.gl.uniform2f(this.context.getUniform("u_translate"), this.params.translate.x, this.params.translate.y);
        // Show image
        this.gl.uniform1i(this.context.getUniform("u_lut"), 1); // TEXTURE 1
        // set the kernel and it's weight
        this.gl.uniform1fv(this.context.getUniform("u_kernel[0]"), this.uniforms.kernel);
        this.gl.uniform1f(this.context.getUniform("u_kernelWeight"), (0,_lib_image_transforms__WEBPACK_IMPORTED_MODULE_4__.sumArray)(this.uniforms.kernel));
        /* Adjust canvas size: Cropping */
        this.applyCrop();
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
    applyCrop() {
        const x2 = this.WIDTH * this.params.size.x;
        const y2 = this.HEIGHT * this.params.size.y;
        const cw = (this.params.zoom * x2);
        const ch = (this.params.zoom * y2);
        this.getCanvas().style.width = cw + "px";
        this.getCanvas().style.height = ch + "px";
        this.getCanvas().width = x2;
        this.getCanvas().height = y2;
    }
    setRectangle(buffer, x, y, width, height) {
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


/***/ }),

/***/ "./src/lib/color.ts":
/*!**************************!*\
  !*** ./src/lib/color.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getLuma": () => (/* binding */ getLuma),
/* harmony export */   "hsv2rgb": () => (/* binding */ hsv2rgb),
/* harmony export */   "asArray": () => (/* binding */ asArray)
/* harmony export */ });
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math */ "./src/lib/math.ts");
/**
 * Color space functions
 */

const getLuma = (rgb_pix) => {
    return 0.2126 * rgb_pix.x + 0.7152 * rgb_pix.y + 0.0722 * rgb_pix.z;
};
const hsv2rgb = (pixel_hsv) => {
    let a, d, c;
    let r, g, b;
    a = pixel_hsv.z * pixel_hsv.y;
    d = a * (1.0 - Math.abs((pixel_hsv.x / 60.0) % 2.0 - 1.0));
    c = pixel_hsv.z - a;
    if (pixel_hsv.x < 180.0) {
        if (pixel_hsv.x < 60.0) {
            r = pixel_hsv.z;
            g = d + c;
            b = c;
        }
        else if (pixel_hsv.x < 120.0) {
            r = d + c;
            g = pixel_hsv.z;
            b = c;
        }
        else {
            r = c;
            g = pixel_hsv.z;
            b = d + c;
        }
    }
    else {
        if (pixel_hsv.x < 240.0) {
            r = c;
            g = d + c;
            b = pixel_hsv.z;
        }
        else if (pixel_hsv.x < 300.0) {
            r = d + c;
            g = c;
            b = a + c;
        }
        else {
            r = a + c;
            g = c;
            b = d + c;
        }
    }
    r = (0,_math__WEBPACK_IMPORTED_MODULE_0__.clamp)(r, 0.0, 1.0);
    g = (0,_math__WEBPACK_IMPORTED_MODULE_0__.clamp)(g, 0.0, 1.0);
    b = (0,_math__WEBPACK_IMPORTED_MODULE_0__.clamp)(b, 0.0, 1.0);
    return { x: r, y: g, z: b };
};
const asArray = (vec) => [vec.x, vec.y, vec.z];


/***/ }),

/***/ "./src/lib/constants.ts":
/*!******************************!*\
  !*** ./src/lib/constants.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "defaultConfig": () => (/* binding */ defaultConfig),
/* harmony export */   "defaultParams": () => (/* binding */ defaultParams),
/* harmony export */   "paramsCallbacks": () => (/* binding */ paramsCallbacks),
/* harmony export */   "TEMP_DATA": () => (/* binding */ TEMP_DATA)
/* harmony export */ });
const defaultConfig = {
    resolutionLimit: -1,
    editionResolutionLimit: -1,
};
const defaultParams = {
    hdr: 0,
    exposure: 0,
    temperature: 0,
    tint: 0,
    brightness: 0,
    saturation: 0,
    contrast: 0,
    sharpen: 0,
    masking: 0,
    sharpen_radius: 0,
    radiance: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    dehaze: 0,
    bAndW: 0,
    atmosferic_light: 0,
    lightFill: 0,
    lightColor: 0,
    lightSat: 1,
    darkFill: 0,
    darkColor: 0,
    darkSat: 1,
    rotation: 0,
    rotation_center: {
        x: 0,
        y: 0,
    },
    scale: {
        x: 1,
        y: 1,
    },
    translate: {
        x: 0,
        y: 0,
    },
    size: {
        x: 1,
        y: 1,
    },
    zoom: 1,
};
/**
 * Callbacks needed to be recalculated when changing parameters
 */
const paramsCallbacks = {
    contrast: ["generateLightning"],
    whites: ["generateLightning"],
    highlights: ["generateLightning"],
    shadows: ["generateLightning"],
    blacks: ["generateLightning"],
    radiance: ["generateLightning", "kernel_update"],
    hdr: ["kernel_update"],
    temperature: ["updateTemptint"],
    tint: ["updateTemptint"],
    sharpen: ["kernel_update"],
    sharpen_radius: ["kernel_update"],
};
/**
 * Temperature map
 */
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


/***/ }),

/***/ "./src/lib/context.ts":
/*!****************************!*\
  !*** ./src/lib/context.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Context": () => (/* binding */ Context)
/* harmony export */ });
class Context {
    constructor(gl, program) {
        this.gl = gl;
        this.program = program;
        this.pointers = {};
        this.atributes = {};
        this.buffers = {};
    }
    ;
    getUniform(uniform) {
        if (!this.pointers[uniform]) {
            this.pointers[uniform] = this.gl.getUniformLocation(this.program, uniform);
        }
        return this.pointers[uniform];
    }
    getAttribute(atribute) {
        if (!this.atributes[atribute]) {
            this.atributes[atribute] = this.gl.getAttribLocation(this.program, atribute);
        }
        return this.atributes[atribute];
    }
    createBuffer(bufferName) {
        this.buffers[bufferName] = this.gl.createBuffer();
        return this.buffers[bufferName];
    }
    getBuffer(bufferName) {
        return this.buffers[bufferName];
    }
}


/***/ }),

/***/ "./src/lib/image-transforms.ts":
/*!*************************************!*\
  !*** ./src/lib/image-transforms.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "computeKernel": () => (/* binding */ computeKernel),
/* harmony export */   "tempTint": () => (/* binding */ tempTint),
/* harmony export */   "lightning": () => (/* binding */ lightning),
/* harmony export */   "sumArray": () => (/* binding */ sumArray)
/* harmony export */ });
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./color */ "./src/lib/color.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./src/lib/constants.ts");
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./math */ "./src/lib/math.ts");



/**
 * Computes an 3x3 kernel for image processing
 */
const computeKernel = (params) => {
    let sharpness = -params.sharpen;
    let radius = params.sharpen_radius;
    const radiance = params.radiance;
    const hdr = params.hdr;
    if (radiance != 0) {
        sharpness -= 0.5 * radiance;
        radius += 0.5 * radiance;
    }
    if (hdr != 0) {
        sharpness -= 0.5 * hdr;
        radius += 0.5 * hdr;
    }
    const A = sharpness * Math.exp(-Math.pow(1 / radius, 2));
    const B = sharpness * Math.exp(-Math.pow(1.41 / radius, 2));
    const C = sharpness * Math.exp(-Math.pow(2 / radius, 2));
    const D = sharpness * Math.exp(-Math.pow(2.24 / radius, 2));
    const E = sharpness * Math.exp(-Math.pow(2.83 / radius, 2));
    let X = 1;
    if (sharpness < 0) {
        X += 4 * Math.abs(E) + 8 * Math.abs(D) + 4 * Math.abs(C) + 4 * Math.abs(B) + 4 * Math.abs(A);
    }
    return [E, D, C, D, E,
        D, B, A, B, D,
        C, A, X, A, C,
        D, B, A, B, D,
        E, D, C, D, E];
};
const tempTint = (params) => {
    let T = params.temperature;
    let tint = params.tint;
    let R, G, B;
    if (T < 0) {
        R = 1;
        const i = _constants__WEBPACK_IMPORTED_MODULE_1__.TEMP_DATA[Math.floor((T + 1) * 100)]; // Tab values, algorithm is hard
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
    var curr_luma = (0,_color__WEBPACK_IMPORTED_MODULE_0__.getLuma)({ x: R, y: G, z: B });
    var mult_K = 1 / curr_luma;
    return [R * mult_K, G * mult_K, B * mult_K];
};
const lightning = (params) => {
    const func = (0,_math__WEBPACK_IMPORTED_MODULE_2__.getCuadraticFunction)(params.blacks, params.shadows + 0.33, params.highlights + 0.66, params.whites + 1, 0, 0.33, 0.66, 1);
    let f_radiance = null;
    if (params.radiance != 0) {
        f_radiance = (0,_math__WEBPACK_IMPORTED_MODULE_2__.getCuadraticFunction)(0, 0.33 - params.radiance * 0.11, 0.66 + params.radiance * 0.11, 1, 0, 0.33, 0.66, 1);
    }
    const LIGHT_MATCH = [];
    for (let i = 0; i <= 255; i++) {
        let pixel_value = i / 255;
        // Radiance part
        if (params.radiance != 0) {
            pixel_value = f_radiance(pixel_value);
        }
        pixel_value = func(pixel_value);
        if (pixel_value > 1) {
            pixel_value = 1;
        }
        if (pixel_value < 0) {
            pixel_value = 0;
        }
        LIGHT_MATCH[i] = pixel_value * 255;
    }
    return LIGHT_MATCH;
};
/**
 * kernelNormalization
 * Compute the total weight of the kernel in order to normalize it
 */
const sumArray = (kernel) => kernel.reduce((a, b) => a + b);


/***/ }),

/***/ "./src/lib/math.ts":
/*!*************************!*\
  !*** ./src/lib/math.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "clamp": () => (/* binding */ clamp),
/* harmony export */   "resTreatment": () => (/* binding */ resTreatment),
/* harmony export */   "getCuadraticFunction": () => (/* binding */ getCuadraticFunction)
/* harmony export */ });
const clamp = (a, b, c) => {
    return (a < b) ? b : (a > c) ? c : a;
};
const resTreatment = (arr) => arr.map(v => Math.round(v * 1000) / 1000);
const getCuadraticFunction = (a, b, c, d, aa = 0, bb = 0.33, cc = 0.66, dd = 1) => {
    const aaS = Math.pow(aa, 2);
    const bbS = Math.pow(bb, 2);
    const ccS = Math.pow(cc, 2);
    const ddS = Math.pow(dd, 2);
    const aaT = aaS * aa;
    const bbT = bbS * bb;
    const ccT = ccS * cc;
    const ddT = ddS * dd;
    const res = resTreatment(solve4x4([aaT, bbT, ccT, ddT], [aaS, bbS, ccS, ddS], [aa, bb, cc, dd], [a, b, c, d]));
    return function (x) {
        let _r = res[3];
        let xx = x;
        _r += res[2] * xx;
        xx *= x;
        _r += res[1] * xx;
        xx *= x;
        _r += res[0] * xx;
        return _r;
    };
};
function solve4x4(w, x, y, s) {
    let S, W, X, Y, Z;
    let _S, _W, _X, _Y, _Z;
    const Aa = y[2] - y[3];
    const Ad = w[2] - w[3];
    const Ab = x[2] - x[3];
    const Ah = s[2] - s[3];
    const Ac = x[2] * y[3] - y[2] * x[3];
    const Af = w[2] * y[3] - y[2] * w[3];
    const Ag = w[2] * x[3] - x[2] * w[3];
    const Ai = s[2] * y[3] - y[2] * s[3];
    const Aj = s[2] * x[3] - x[2] * s[3];
    const Ak = w[2] * s[3] - s[2] * w[3];
    const Al = x[2] * s[3] - s[2] * x[3];
    const Am = y[2] * s[3] - s[2] * y[3];
    W = x[1] * Aa - y[1] * Ab + Ac;
    X = w[1] * Aa - y[1] * Ad + Af;
    Y = w[1] * Ab - x[1] * Ad + Ag;
    Z = w[1] * Ac - x[1] * Af + y[1] * Ag;
    _S = w[0] * W - x[0] * X + y[0] * Y - Z;
    S = x[1] * Aa - y[1] * Ab + Ac;
    X = s[1] * Aa - y[1] * Ah + Ai;
    Y = s[1] * Ab - x[1] * Ah + Aj;
    Z = s[1] * Ac - x[1] * Ai + y[1] * Aj;
    _W = s[0] * S - x[0] * X + y[0] * Y - Z;
    W = s[1] * Aa - y[1] * Ah + Ai;
    S = w[1] * Aa - y[1] * Ad + Af;
    Y = w[1] * Ah - s[1] * Ad + Ak;
    Z = w[1] * Ai - s[1] * Af + y[1] * Ak;
    _X = w[0] * W - s[0] * S + y[0] * Y - Z;
    W = x[1] * Ah - s[1] * Ab + Al;
    X = w[1] * Ah - s[1] * Ad + Ak;
    S = w[1] * Ab - x[1] * Ad + Ag;
    Z = w[1] * Al - x[1] * Ak + s[1] * Ag;
    _Y = w[0] * W - x[0] * X + s[0] * S - Z;
    W = x[1] * Am - y[1] * Al + s[1] * Ac;
    X = w[1] * Am - y[1] * Ak + s[1] * Af;
    Y = w[1] * Al - x[1] * Ak + s[1] * Ag;
    S = w[1] * Ac - x[1] * Af + y[1] * Ag;
    _Z = w[0] * W - x[0] * X + y[0] * Y - s[0] * S;
    return [_W / _S, _X / _S, _Y / _S, _Z / _S];
}


/***/ }),

/***/ "./src/log/LogFacade.ts":
/*!******************************!*\
  !*** ./src/log/LogFacade.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LogFacade": () => (/* binding */ LogFacade)
/* harmony export */ });
class LogFacade {
    log(msg) {
        console.log(msg);
    }
    warn(msg) {
        console.warn(msg);
    }
    error(msg) {
        console.error(msg);
    }
}


/***/ }),

/***/ "./src/shaders.ts":
/*!************************!*\
  !*** ./src/shaders.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createShader": () => (/* binding */ createShader),
/* harmony export */   "createProgram": () => (/* binding */ createProgram),
/* harmony export */   "createTexture": () => (/* binding */ createTexture)
/* harmony export */ });
const createShader = (gl, type, source) => {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.warn(gl.getError());
    gl.deleteShader(shader);
    throw new Error("Unable to create a WebGL shader.");
};
const createProgram = (gl, vertexShader, fragmentShader) => {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    console.warn(gl.getError());
    gl.deleteProgram(program);
    throw new Error("Unable to create a WebGL Program.");
};
const createTexture = (gl) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return texture;
};


/***/ }),

/***/ "./src/shaders/index.ts":
/*!******************************!*\
  !*** ./src/shaders/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FRAGMENT_SHADER": () => (/* reexport safe */ _raw_loader_fragment_shader_frag__WEBPACK_IMPORTED_MODULE_0__.default),
/* harmony export */   "VERTEX_SHADER": () => (/* reexport safe */ _raw_loader_vertex_shader_vert__WEBPACK_IMPORTED_MODULE_1__.default)
/* harmony export */ });
/* harmony import */ var _raw_loader_fragment_shader_frag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !!raw-loader!./fragment_shader.frag */ "./node_modules/raw-loader/dist/cjs.js!./src/shaders/fragment_shader.frag");
/* harmony import */ var _raw_loader_vertex_shader_vert__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!raw-loader!./vertex_shader.vert */ "./node_modules/raw-loader/dist/cjs.js!./src/shaders/vertex_shader.vert");





/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RextEditor": () => (/* reexport safe */ _editor__WEBPACK_IMPORTED_MODULE_0__.RextEditor)
/* harmony export */ });
/* harmony import */ var _editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./editor */ "./src/editor.ts");


})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9SZXh0RWRpdG9yL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9SZXh0RWRpdG9yLy4vc3JjL3NoYWRlcnMvZnJhZ21lbnRfc2hhZGVyLmZyYWciLCJ3ZWJwYWNrOi8vUmV4dEVkaXRvci8uL3NyYy9zaGFkZXJzL3ZlcnRleF9zaGFkZXIudmVydCIsIndlYnBhY2s6Ly9SZXh0RWRpdG9yLy4vc3JjL2VkaXRvci50cyIsIndlYnBhY2s6Ly9SZXh0RWRpdG9yLy4vc3JjL2xpYi9jb2xvci50cyIsIndlYnBhY2s6Ly9SZXh0RWRpdG9yLy4vc3JjL2xpYi9jb25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vUmV4dEVkaXRvci8uL3NyYy9saWIvY29udGV4dC50cyIsIndlYnBhY2s6Ly9SZXh0RWRpdG9yLy4vc3JjL2xpYi9pbWFnZS10cmFuc2Zvcm1zLnRzIiwid2VicGFjazovL1JleHRFZGl0b3IvLi9zcmMvbGliL21hdGgudHMiLCJ3ZWJwYWNrOi8vUmV4dEVkaXRvci8uL3NyYy9sb2cvTG9nRmFjYWRlLnRzIiwid2VicGFjazovL1JleHRFZGl0b3IvLi9zcmMvc2hhZGVycy50cyIsIndlYnBhY2s6Ly9SZXh0RWRpdG9yLy4vc3JjL3NoYWRlcnMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vUmV4dEVkaXRvci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9SZXh0RWRpdG9yL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9SZXh0RWRpdG9yL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vUmV4dEVkaXRvci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL1JleHRFZGl0b3IvLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87Ozs7Ozs7Ozs7Ozs7O0FDVkEsaUVBQWUsdUVBQXVFLDRCQUE0Qiw2QkFBNkIsNkJBQTZCLCtCQUErQiwwQkFBMEIsNkJBQTZCLDZCQUE2QiwyQkFBMkIsMkJBQTJCLHlCQUF5QixtQ0FBbUMsMEJBQTBCLDZCQUE2QixxRUFBcUUsc0JBQXNCLDBCQUEwQixlQUFlLHlEQUF5RCx5REFBeUQsMmdFQUEyZ0UseUdBQXlHLDJMQUEyTCwyREFBMkQsa0RBQWtELDhFQUE4RSx3REFBd0QseUNBQXlDLEtBQUssK0NBQStDLG9EQUFvRCw2REFBNkQsS0FBSyxvREFBb0Qsd0dBQXdHLEtBQUssMkNBQTJDLGtEQUFrRCxrREFBa0QsNENBQTRDLG1DQUFtQyxLQUFLLE9BQU8scURBQXFELEtBQUssNENBQTRDLDJCQUEyQixtREFBbUQsdURBQXVELHVCQUF1QiwyQkFBMkIsNEJBQTRCLGNBQWMsUUFBUSw4QkFBOEIsY0FBYyxRQUFRLGdGQUFnRixxREFBcUQsNEJBQTRCLHdCQUF3QixXQUFXLFNBQVMsT0FBTyw2REFBNkQsdUNBQXVDLGtDQUFrQyxzQ0FBc0Msc0NBQXNDLG1HQUFtRyxLQUFLLDhDQUE4Qyx1Q0FBdUMsMERBQTBELCtDQUErQyw0REFBNEQsNERBQTRELHVEQUF1RCx1REFBdUQsOERBQThELEtBQUssd0NBQXdDLEtBQUssR0FBRyxFOzs7Ozs7Ozs7Ozs7OztBQ0F0dUssaUVBQWUsMkJBQTJCLDRCQUE0Qiw0QkFBNEIsMEJBQTBCLDBCQUEwQixpQ0FBaUMsdUJBQXVCLDJCQUEyQixrQkFBa0IsK0NBQStDLDhDQUE4QyxpSkFBaUoscUVBQXFFLHNFQUFzRSxrQ0FBa0MsNEJBQTRCLEdBQUcsR0FBRyxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBem9CO0FBQ2lDO0FBQ2Y7QUFDckI7QUFDMEM7QUFDZjtBQUMvQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0EsNEJBQTRCLHlEQUFhO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLHlEQUFhO0FBQ25DO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixxREFBUztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLG9FQUFhO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLGFBQWE7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSw4REFBOEQsMkRBQWUsdUJBQXVCLDJEQUFlO0FBQ25ILHdCQUF3QiwyREFBZTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLE1BQU07QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLDZCQUE2QjtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQywrREFBUTtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsZ0VBQVM7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxzREFBWSxpQ0FBaUMseURBQWE7QUFDakcseUNBQXlDLHNEQUFZLG1DQUFtQywyREFBZTtBQUN2RywyQkFBMkIsdURBQWE7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsaURBQU87QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSx1REFBYTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSx1REFBYTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixtREFBTyxDQUFDLG1EQUFPLEVBQUUscUZBQXFGO0FBQzFILG9CQUFvQixtREFBTyxDQUFDLG1EQUFPLEVBQUUsa0ZBQWtGLEtBQUs7QUFDNUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0Q7QUFDQTtBQUNBLHFFQUFxRSwrREFBUTtBQUM3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JUQTtBQUNBO0FBQ0E7QUFDK0I7QUFDeEI7QUFDUDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLDRDQUFLO0FBQ2IsUUFBUSw0Q0FBSztBQUNiLFFBQVEsNENBQUs7QUFDYixZQUFZO0FBQ1o7QUFDTzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcERBO0FBQ1A7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDektPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVCa0M7QUFDTTtBQUNNO0FBQzlDO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGlEQUFTLDRCQUE0QjtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLCtDQUFPLEVBQUUsbUJBQW1CO0FBQ2hEO0FBQ0E7QUFDQTtBQUNPO0FBQ1AsaUJBQWlCLDJEQUFvQjtBQUNyQztBQUNBO0FBQ0EscUJBQXFCLDJEQUFvQjtBQUN6QztBQUNBO0FBQ0EsbUJBQW1CLFVBQVU7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3RGQTtBQUNQO0FBQ0E7QUFDTztBQUNBO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDbEVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVk87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pDa0U7QUFDSjtBQUNwQjs7Ozs7OztVQ0YxQztVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0NyQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7Ozs7QUNOc0MiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJSZXh0RWRpdG9yXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlJleHRFZGl0b3JcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCJleHBvcnQgZGVmYXVsdCBcIi8qKiAqIERhdmlkIElnbGVzaWFzLiBBbGwgcmlnaHRzIHJlc2VydmVkICovXFxucHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdV9pbWFnZTtcXG51bmlmb3JtIHZlYzIgdV90ZXh0dXJlU2l6ZTtcXG51bmlmb3JtIGZsb2F0IHVfa2VybmVsWzI1XTtcXG51bmlmb3JtIGZsb2F0IHVfa2VybmVsV2VpZ2h0O1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVfbHV0O1xcbnVuaWZvcm0gZmxvYXQgdV9zYXR1cmF0aW9uO1xcbnVuaWZvcm0gZmxvYXQgdV9icmlnaHRuZXNzO1xcbnVuaWZvcm0gZmxvYXQgdV9leHBvc3VyZTtcXG51bmlmb3JtIGZsb2F0IHVfY29udHJhc3Q7XFxudW5pZm9ybSBmbG9hdCB1X2RlaGF6ZTtcXG51bmlmb3JtIGZsb2F0IHVfYXRtb3NmZXJpY19saWdodDtcXG51bmlmb3JtIGZsb2F0IHVfbWFza2luZztcXG51bmlmb3JtIHZlYzMgdV90ZW1wdGludFszXTsgLy8gUkdCIHRlbXB0aW50LCBSR0IgbGlnaHRGaWxsLCBSR0IgZGFya0ZpbGxcXG51bmlmb3JtIGZsb2F0IHVfYkFuZFc7XFxudW5pZm9ybSBmbG9hdCB1X2hkcjtcXG52YXJ5aW5nIHZlYzIgdl90ZXhDb29yZDtcXG52b2lkIG1haW4oKSB7XFxuICBcXG5cXHR2ZWMyIHBpeGVsX3NpemUgPSB2ZWMyKDEuMCwgMS4wKSAvIHVfdGV4dHVyZVNpemU7XFxuICBcXG5cXHR2ZWMzIGNlbnRlciA9IHRleHR1cmUyRCh1X2ltYWdlLCB2X3RleENvb3JkKS5yZ2I7XFxuXFxuICAvKiA1eDUga2VybmVsIGZpbHRlciAqL1xcbiAgdmVjNCBjb2xvclN1bSA9IHRleHR1cmUyRCh1X2ltYWdlLCB2X3RleENvb3JkICsgcGl4ZWxfc2l6ZSAqIHZlYzIoLTIsIC0yKSkgKiB1X2tlcm5lbFswXVxcblxcdFxcdCArIHRleHR1cmUyRCh1X2ltYWdlLCB2X3RleENvb3JkICsgcGl4ZWxfc2l6ZSAqIHZlYzIoLTEsIC0yKSkgKiB1X2tlcm5lbFsxXVxcblxcdFxcdCArIHRleHR1cmUyRCh1X2ltYWdlLCB2X3RleENvb3JkICsgcGl4ZWxfc2l6ZSAqIHZlYzIoMCwgLTIpKSAqIHVfa2VybmVsWzJdXFxuXFx0XFx0ICsgdGV4dHVyZTJEKHVfaW1hZ2UsIHZfdGV4Q29vcmQgKyBwaXhlbF9zaXplICogdmVjMigxLCAtMikpICogdV9rZXJuZWxbM11cXG5cXHRcXHQgKyB0ZXh0dXJlMkQodV9pbWFnZSwgdl90ZXhDb29yZCArIHBpeGVsX3NpemUgKiB2ZWMyKDIsIC0yKSkgKiB1X2tlcm5lbFs0XVxcblxcblxcdFxcdCArIHRleHR1cmUyRCh1X2ltYWdlLCB2X3RleENvb3JkICsgcGl4ZWxfc2l6ZSAqIHZlYzIoLTIsIC0xKSkgKiB1X2tlcm5lbFs1XVxcblxcdFxcdCArIHRleHR1cmUyRCh1X2ltYWdlLCB2X3RleENvb3JkICsgcGl4ZWxfc2l6ZSAqIHZlYzIoLTEsIC0xKSkgKiB1X2tlcm5lbFs2XVxcblxcdFxcdCArIHRleHR1cmUyRCh1X2ltYWdlLCB2X3RleENvb3JkICsgcGl4ZWxfc2l6ZSAqIHZlYzIoMCwgLTEpKSAqIHVfa2VybmVsWzddXFxuXFx0XFx0ICsgdGV4dHVyZTJEKHVfaW1hZ2UsIHZfdGV4Q29vcmQgKyBwaXhlbF9zaXplICogdmVjMigxLCAtMSkpICogdV9rZXJuZWxbOF1cXG5cXHRcXHQgKyB0ZXh0dXJlMkQodV9pbWFnZSwgdl90ZXhDb29yZCArIHBpeGVsX3NpemUgKiB2ZWMyKDIsIC0xKSkgKiB1X2tlcm5lbFs5XVxcblxcblxcdFxcdCArIHRleHR1cmUyRCh1X2ltYWdlLCB2X3RleENvb3JkICsgcGl4ZWxfc2l6ZSAqIHZlYzIoLTIsIDApKSAqIHVfa2VybmVsWzEwXVxcblxcdFxcdCArIHRleHR1cmUyRCh1X2ltYWdlLCB2X3RleENvb3JkICsgcGl4ZWxfc2l6ZSAqIHZlYzIoLTEsIDApKSAqIHVfa2VybmVsWzExXVxcblxcdFxcdCArIHRleHR1cmUyRCh1X2ltYWdlLCB2X3RleENvb3JkICsgcGl4ZWxfc2l6ZSAqIHZlYzIoMCwgMCkpICogdV9rZXJuZWxbMTJdXFxuXFx0XFx0ICsgdGV4dHVyZTJEKHVfaW1hZ2UsIHZfdGV4Q29vcmQgKyBwaXhlbF9zaXplICogdmVjMigxLCAwKSkgKiB1X2tlcm5lbFsxM11cXG5cXHRcXHQgKyB0ZXh0dXJlMkQodV9pbWFnZSwgdl90ZXhDb29yZCArIHBpeGVsX3NpemUgKiB2ZWMyKDIsIDApKSAqIHVfa2VybmVsWzE0XVxcblxcblxcdFxcdCArIHRleHR1cmUyRCh1X2ltYWdlLCB2X3RleENvb3JkICsgcGl4ZWxfc2l6ZSAqIHZlYzIoLTIsIDEpKSAqIHVfa2VybmVsWzE1XVxcblxcdFxcdCArIHRleHR1cmUyRCh1X2ltYWdlLCB2X3RleENvb3JkICsgcGl4ZWxfc2l6ZSAqIHZlYzIoLTEsIDEpKSAqIHVfa2VybmVsWzE2XVxcblxcdFxcdCArIHRleHR1cmUyRCh1X2ltYWdlLCB2X3RleENvb3JkICsgcGl4ZWxfc2l6ZSAqIHZlYzIoMCwgMSkpICogdV9rZXJuZWxbMTddXFxuXFx0XFx0ICsgdGV4dHVyZTJEKHVfaW1hZ2UsIHZfdGV4Q29vcmQgKyBwaXhlbF9zaXplICogdmVjMigxLCAxKSkgKiB1X2tlcm5lbFsxOF1cXG5cXHRcXHQgKyB0ZXh0dXJlMkQodV9pbWFnZSwgdl90ZXhDb29yZCArIHBpeGVsX3NpemUgKiB2ZWMyKDIsIDEpKSAqIHVfa2VybmVsWzE5XVxcblxcblxcdFxcdCArIHRleHR1cmUyRCh1X2ltYWdlLCB2X3RleENvb3JkICsgcGl4ZWxfc2l6ZSAqIHZlYzIoLTIsIDIpKSAqIHVfa2VybmVsWzIwXVxcblxcdFxcdCArIHRleHR1cmUyRCh1X2ltYWdlLCB2X3RleENvb3JkICsgcGl4ZWxfc2l6ZSAqIHZlYzIoLTEsIDIpKSAqIHVfa2VybmVsWzIxXVxcblxcdFxcdCArIHRleHR1cmUyRCh1X2ltYWdlLCB2X3RleENvb3JkICsgcGl4ZWxfc2l6ZSAqIHZlYzIoMCwgMikpICogdV9rZXJuZWxbMjJdXFxuXFx0XFx0ICsgdGV4dHVyZTJEKHVfaW1hZ2UsIHZfdGV4Q29vcmQgKyBwaXhlbF9zaXplICogdmVjMigxLCAyKSkgKiB1X2tlcm5lbFsyM11cXG5cXHRcXHQgKyB0ZXh0dXJlMkQodV9pbWFnZSwgdl90ZXhDb29yZCArIHBpeGVsX3NpemUgKiB2ZWMyKDIsIDIpKSAqIHVfa2VybmVsWzI0XTtcXG5cXG5cXHQvKiBLZXJuZWwgZmlsdGVyIG1hc2sgKi9cXG4gIHZlYzMgcmdiX3BpeCA9IG1peChjZW50ZXIsIChjb2xvclN1bS5yZ2IgLyB1X2tlcm5lbFdlaWdodCksIHVfbWFza2luZyk7XFxuXFx0XFxuXFx0LyoqXFxuXFx0ICogUkdCIHRvIHNhdHVyYXRpb24vdmFsdWUgY29udmVyc2lvbiwgaW4gb3JkZXIgdG8ga2VlcCBodWUgY29uc3RhbnQgXFxuXFx0ICogc3ZfcGl4ZWwgPSAoc2F0dXJhdGlvbiwgdmFsdWUpXFxuXFx0ICovXFxuICBmbG9hdCBfbWF4ID0gbWF4KHJnYl9waXguciwgbWF4KHJnYl9waXguZywgcmdiX3BpeC5iKSk7XFxuICBmbG9hdCBfbWluID0gbWluKHJnYl9waXguciwgbWluKHJnYl9waXguZywgcmdiX3BpeC5iKSk7XFxuICB2ZWMyIHN2X3BpeGVsID0gdmVjMigxLjAgLSBfbWluIC8gX21heCwgX21heCk7XFxuXFxuICBzdl9waXhlbC55ID0gY2xhbXAodGV4dHVyZTJEKHVfbHV0LCB2ZWMyKHN2X3BpeGVsLnksIDAuMCkpLmEsIDAuMCwgMS4wKTtcXG5cXG5cXHQvKiBBZGQgc2F0dXJhdGlvbiAqL1xcbiAgaWYgKHVfc2F0dXJhdGlvbiAhPSAwLjApIHtcXG4gICAgc3ZfcGl4ZWwueCAqPSAoMS4wICsgdV9zYXR1cmF0aW9uKTtcXG4gIH1cXG5cXG4gIHN2X3BpeGVsLnggPSBjbGFtcChzdl9waXhlbC54LCAwLjAsIDEuMCk7XFxuXFxuXFx0LyogQnJpZ2h0bmVzcyAqL1xcbiAgaWYgKHVfYnJpZ2h0bmVzcyAhPSAwLjApIHtcXG4gICAgc3ZfcGl4ZWwueSA9IHBvdyhzdl9waXhlbC55LCAxLjAgLSB1X2JyaWdodG5lc3MgKiAwLjYpO1xcbiAgfVxcblxcblxcdC8qIEhEUiAnbGlrZScgZmlsdGVyICovXFxuICBpZiAodV9oZHIgIT0gMC4wKSB7XFxuICAgIHN2X3BpeGVsLnkgPSBtaXgoc3ZfcGl4ZWwueSwgY2xhbXAoMS4wIC0gcG93KDEuMCAtIHBvdyhzdl9waXhlbC55LCAwLjMpLCAwLjQyKSwgMC4wLCAxLjApLCB1X2hkcik7XFxuICB9XFxuXFxuICBzdl9waXhlbCA9IGNsYW1wKHN2X3BpeGVsLCAwLjAsIDEuMCk7XFxuXFx0LyogUmV0dXJuIHRvIFJHQiAqL1xcbiAgaWYgKHN2X3BpeGVsLnggPiAwLjApIHtcXG4gICAgZmxvYXQgayA9IC1zdl9waXhlbC54IC8gKDEuMCAtIF9taW4gLyBfbWF4KTtcXG4gICAgcmdiX3BpeCA9IChfbWF4IC0gcmdiX3BpeCkgKiBrICsgX21heDtcXG4gICAgcmdiX3BpeCAqPSBzdl9waXhlbC55IC8gX21heDtcXG4gIH0gZWxzZSB7XFxuICAgIHJnYl9waXguciA9IHJnYl9waXguZyA9IHJnYl9waXguYiA9IHN2X3BpeGVsLnk7XFxuICB9XFxuXFxuXFx0LyogRGVoYXplICovXFxuICBpZiAodV9kZWhhemUgIT0gMC4wKSB7XFxuICAgIGZsb2F0IHQgPSAxLjAgLyAyNS4wO1xcbiAgICB2ZWM0IGNlbnRlciA9IHRleHR1cmUyRCh1X2ltYWdlLCB2X3RleENvb3JkKTtcXG4gICAgdmVjMiBwaXhlbF9zaXplID0gdmVjMigxLjAsIDEuMCkgLyB1X3RleHR1cmVTaXplO1xcbiAgICBmbG9hdCBkYXJrID0gMS4wO1xcbiAgICBjb25zdCBpbnQgcmFkaXVzID0gMTtcXG4gICAgZm9yIChpbnQgaWkgPSAtcmFkaXVzOyBpaSA8PSByYWRpdXM7IGlpKyspIHtcXG4gICAgICBmb3IgKGludCBqaiA9IC1yYWRpdXM7IGpqIDw9IHJhZGl1czsgamorKykge1xcbiAgICAgICAgdmVjNCBwaXggPSB0ZXh0dXJlMkQodV9pbWFnZSwgdl90ZXhDb29yZCArIHBpeGVsX3NpemUgKiB2ZWMyKGlpLCBqaikpO1xcbiAgICAgICAgZmxvYXQgX21pbiA9IG1pbihwaXguciwgbWluKHBpeC5nLCBwaXguYikpO1xcbiAgICAgICAgaWYgKGRhcmsgPiBfbWluKSB7XFxuICAgICAgICAgIGRhcmsgPSBfbWluO1xcbiAgICAgICAgfVxcbiAgICAgIH1cXG4gICAgfVxcbiAgICBmbG9hdCBkYXJrUGl4ID0gbWluKGNlbnRlci5yLCBtaW4oY2VudGVyLmcsIGNlbnRlci5iKSk7XFxuICAgIGZsb2F0IGRpZmYgPSBhYnMoZGFya1BpeCAtIGRhcmspO1xcbiAgICBmbG9hdCBtYXNrID0gcG93KGRpZmYsIDMuMCk7XFxuICAgIGRhcmsgPSBtaXgoZGFya1BpeCwgZGFyaywgbWFzayk7XFxuICAgIGZsb2F0IG1tID0gbWF4KDEuMCAtIGRhcmssIDAuMik7XFxuICAgIHJnYl9waXggPSBtaXgocmdiX3BpeCwgKChyZ2JfcGl4IC0gdV9hdG1vc2ZlcmljX2xpZ2h0KSAvIG1tICsgdV9hdG1vc2ZlcmljX2xpZ2h0KSwgdV9kZWhhemUpO1xcbiAgfVxcblxcblxcdC8qIEV4cG9zdXJlICovXFxuICByZ2JfcGl4ICs9IHVfZXhwb3N1cmU7XFxuICByZ2JfcGl4ID0gY2xhbXAocmdiX3BpeCwgMC4wLCAxLjApO1xcblxcblxcdC8qIENvbnRyYXN0ICovXFxuICBmbG9hdCBjb250cmFzdCA9IHVfY29udHJhc3QgKyAxLjA7XFxuICByZ2JfcGl4ID0gY29udHJhc3QgKiAocmdiX3BpeCAtIDAuNSkgKyAwLjU7XFxuXFx0XFxuXFx0LyogQXBwbHkgdGludCBmaWx0ZXIgKi9cXG4gIHJnYl9waXggKj0gdV90ZW1wdGludFswXTtcXG4gIGZsb2F0IG1vbm8gPSBkb3QocmdiX3BpeCwgdmVjMygwLjIxMjYsIDAuNzE1MiwgMC4wNzIyKSk7XFxuICByZ2JfcGl4ICs9IG1peCh1X3RlbXB0aW50WzJdLCB1X3RlbXB0aW50WzFdLCBtb25vKTtcXG5cXG5cXHQvKiBCbGFjayZXaGl0ZSBmaWx0ZXIgKi9cXG4gIGlmICh1X2JBbmRXICE9IDAuMCkge1xcbiAgICByZ2JfcGl4ID0gbWl4KHJnYl9waXgsIHZlYzMobW9ubywgbW9ubywgbW9ubyksIHVfYkFuZFcpO1xcbiAgfVxcblxcbiAgZ2xfRnJhZ0NvbG9yID0gdmVjNChyZ2JfcGl4LCAxLjApO1xcblxcbn1cXG5cIjsiLCJleHBvcnQgZGVmYXVsdCBcImF0dHJpYnV0ZSB2ZWMyIGFfcG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYV90ZXhDb29yZDtcXG51bmlmb3JtIHZlYzIgdV9yZXNvbHV0aW9uO1xcbnZhcnlpbmcgdmVjMiB2X3RleENvb3JkO1xcbnVuaWZvcm0gdmVjMiB1X3JvdGF0aW9uO1xcbnVuaWZvcm0gdmVjMiB1X3JvdGF0aW9uX2NlbnRlcjtcXG51bmlmb3JtIHZlYzIgdV9zY2FsZTtcXG51bmlmb3JtIHZlYzIgdV90cmFuc2xhdGU7IFxcblxcbnZvaWQgbWFpbigpIHtcXG5cXG4gIHZlYzIgc2NhbGVkID0gYV9wb3NpdGlvbiAqIHZlYzIodV9zY2FsZSk7XFxuICB2ZWMyIHBvc19yX3QgPSBzY2FsZWQgLSB1X3JvdGF0aW9uX2NlbnRlcjtcXG4gIHZlYzIgcG9zX3JvdGF0ZWQgPSB2ZWMyKFxcbiAgICBwb3Nfcl90LnggKiB1X3JvdGF0aW9uLnkgKyBwb3Nfcl90LnkgKiB1X3JvdGF0aW9uLngsXFxuICAgIHBvc19yX3QueSAqIHVfcm90YXRpb24ueSAtIHBvc19yX3QueCAqIHVfcm90YXRpb24ueCk7XFxuICBcXG4gIHZlYzIgZGlzdCA9IChwb3Nfcm90YXRlZCArIHVfcm90YXRpb25fY2VudGVyKSAvIHVfcmVzb2x1dGlvbjtcXG5cXG4gIHZlYzIgcG9zID0gdmVjMigoZGlzdCArIHVfdHJhbnNsYXRlKSAqIDIuMCAtIDEuMCkgKiB2ZWMyKDEsIC0xKTtcXG4gIGdsX1Bvc2l0aW9uID0gdmVjNChwb3MsIDAsIDEpO1xcbiAgdl90ZXhDb29yZCA9IGFfdGV4Q29vcmQ7XFxufVxcblwiOyIsImltcG9ydCB7IGFzQXJyYXksIGhzdjJyZ2IgfSBmcm9tICcuL2xpYi9jb2xvcic7XG5pbXBvcnQgeyBkZWZhdWx0Q29uZmlnLCBkZWZhdWx0UGFyYW1zLCBwYXJhbXNDYWxsYmFja3MgfSBmcm9tICcuL2xpYi9jb25zdGFudHMnO1xuaW1wb3J0IHsgRlJBR01FTlRfU0hBREVSLCBWRVJURVhfU0hBREVSIH0gZnJvbSAnLi9zaGFkZXJzL2luZGV4JztcbmltcG9ydCB7IExvZ0ZhY2FkZSB9IGZyb20gJy4vbG9nL0xvZ0ZhY2FkZSc7XG5pbXBvcnQgeyBjb21wdXRlS2VybmVsLCBsaWdodG5pbmcsIHN1bUFycmF5LCB0ZW1wVGludCB9IGZyb20gJy4vbGliL2ltYWdlLXRyYW5zZm9ybXMnO1xuaW1wb3J0IHsgY3JlYXRlUHJvZ3JhbSwgY3JlYXRlU2hhZGVyLCBjcmVhdGVUZXh0dXJlIH0gZnJvbSAnLi9zaGFkZXJzJztcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL2xpYi9jb250ZXh0JztcbmNvbnN0IGNsb25lID0gKG9iaikgPT4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcbmNvbnN0IENBTlZBU19PUFRJT05TID0ge1xuICAgIGFscGhhOiBmYWxzZSxcbiAgICBhbnRpYWxpYXM6IGZhbHNlLFxufTtcbi8qIEJFR0lOIFdFQkdMIFBBUlQgKi9cbmV4cG9ydCBjbGFzcyBSZXh0RWRpdG9yIHtcbiAgICBjb25zdHJ1Y3RvcihjYW52YXMpIHtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBjbG9uZShkZWZhdWx0UGFyYW1zKTtcbiAgICAgICAgdGhpcy5wcm9ncmFtID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZWFsSW1hZ2UgPSBudWxsO1xuICAgICAgICB0aGlzLmN1cnJlbnRJbWFnZSA9IG51bGw7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IG51bGw7XG4gICAgICAgIHRoaXMuY29uZmlnID0gZGVmYXVsdENvbmZpZztcbiAgICAgICAgdGhpcy5vblBhcmFtc0NoYW5nZUNhbGxiYWNrcyA9IFtdO1xuICAgICAgICB0aGlzLldJRFRIID0gMDtcbiAgICAgICAgdGhpcy5IRUlHSFQgPSAwO1xuICAgICAgICB0aGlzLmxvZyA9IG5ldyBMb2dGYWNhZGUoKTtcbiAgICAgICAgdGhpcy51bmlmb3JtcyA9IHtcbiAgICAgICAgICAgIGtlcm5lbDogW1xuICAgICAgICAgICAgICAgIDAsIDAsIDAsIDAsIDAsXG4gICAgICAgICAgICAgICAgMCwgMCwgMCwgMCwgMCxcbiAgICAgICAgICAgICAgICAwLCAwLCAxLCAwLCAwLFxuICAgICAgICAgICAgICAgIDAsIDAsIDAsIDAsIDAsXG4gICAgICAgICAgICAgICAgMCwgMCwgMCwgMCwgMFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHRlbXB0aW50OiBbMSwgMSwgMV1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5MSUdIVF9NQVRDSCA9IG5ldyBBcnJheSgyNTYpLmZpbGwoMCkubWFwKCh2LCBpKSA9PiBpKTtcbiAgICAgICAgaWYgKGNhbnZhcykge1xuICAgICAgICAgICAgdGhpcy5zZXRDYW52YXMoY2FudmFzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzZXRDYW52YXMoY2FudmFzKSB7XG4gICAgICAgIHRoaXMuY29uZmlnLndpZHRoID0gY2FudmFzLndpZHRoO1xuICAgICAgICB0aGlzLmNvbmZpZy5oZWlnaHQgPSBjYW52YXMuaGVpZ2h0O1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgICAgICAgdGhpcy5nbCA9IGNhbnZhcy5nZXRDb250ZXh0KFwid2ViZ2xcIiwgQ0FOVkFTX09QVElPTlMpIHx8IGNhbnZhcy5nZXRDb250ZXh0KFwiZXhwZXJpbWVudGFsLXdlYmdsXCIsIENBTlZBU19PUFRJT05TKTtcbiAgICB9XG4gICAgcnVuQ2FsbGJhY2soY2FsbGJhY2tOYW1lKSB7XG4gICAgICAgIHN3aXRjaCAoY2FsbGJhY2tOYW1lKSB7XG4gICAgICAgICAgICBjYXNlIFwiZ2VuZXJhdGVMaWdodG5pbmdcIjpcbiAgICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlTGlnaHRuaW5nKCk7XG4gICAgICAgICAgICBjYXNlIFwia2VybmVsX3VwZGF0ZVwiOlxuICAgICAgICAgICAgICAgIHRoaXMudW5pZm9ybXMua2VybmVsID0gY29tcHV0ZUtlcm5lbCh0aGlzLnBhcmFtcyk7XG4gICAgICAgICAgICBjYXNlIFwidXBkYXRlVGVtcHRpbnRcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVRlbXB0aW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9nLndhcm4oYE5vIGNhbGxiYWNrICR7Y2FsbGJhY2tOYW1lfSBleGlzdHNgKTtcbiAgICB9XG4gICAgb25QYXJhbXNDaGFuZ2UoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5vblBhcmFtc0NoYW5nZUNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICB9XG4gICAgdXBkYXRlUGFyYW1zKHBhcmFtcykge1xuICAgICAgICAvKiBDYWxjdWxhdGUgZGlmZmVyZW5jZSAqL1xuICAgICAgICBjb25zdCB1cGRhdGVLZXlzID0gT2JqZWN0LmtleXModGhpcy5wYXJhbXMpLmZpbHRlcihwYXJhbUtleSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJhbXNbcGFyYW1LZXldICE9PSBwYXJhbXNbcGFyYW1LZXldO1xuICAgICAgICB9KTtcbiAgICAgICAgdXBkYXRlS2V5cy5mb3JFYWNoKHBhcmFtS2V5ID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBhcmFtKHBhcmFtS2V5LCBwYXJhbXNbcGFyYW1LZXldKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHVwZGF0ZXMgPSB0aGlzLmdldENhbGxiYWNrcyh1cGRhdGVLZXlzKTtcbiAgICAgICAgLyogVXBkYXRlIHdpdGggY2FsbGJhY2tzICovXG4gICAgICAgIHVwZGF0ZXMuZm9yRWFjaChjYWxsYmFja05hbWUgPT4ge1xuICAgICAgICAgICAgdGhpcy5ydW5DYWxsYmFjayhjYWxsYmFja05hbWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgdGhpcy5vblBhcmFtc0NoYW5nZUNhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrID0+IHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRoaXMucGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZ25vcmVkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0Q2FsbGJhY2tzKHVwZGF0ZWRQYXJhbXMpIHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2tzID0gbmV3IFNldCh1cGRhdGVkUGFyYW1zLmZpbHRlcihrZXkgPT4gcGFyYW1zQ2FsbGJhY2tzW2tleV0gIT09IHVuZGVmaW5lZCAmJiBwYXJhbXNDYWxsYmFja3Nba2V5XSAhPT0gbnVsbClcbiAgICAgICAgICAgIC5tYXAoa2V5ID0+IHBhcmFtc0NhbGxiYWNrc1trZXldKVxuICAgICAgICAgICAgLnJlZHVjZSgoYWNjLCB2KSA9PiBhY2MuY29uY2F0KHYpLCBbXSkpO1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShjYWxsYmFja3MpO1xuICAgIH1cbiAgICAvLyBEbyBub3QgY2FsbCB0aGlzIG1ldGhvZCBmcm9tIGFueSBvdGhlciBmdW5jdGlvbiB0aGFuIHVwZGF0ZVBhcmFtc1xuICAgIF91cGRhdGVQYXJhbShwYXJhbSwgdmFsdWUpIHtcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMucGFyYW1zKTtcbiAgICAgICAgaWYgKGtleXMuaW5jbHVkZXMocGFyYW0pKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICB0aGlzLnBhcmFtc1twYXJhbV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKGBQYXJhbSAke3BhcmFtfSBkb2VzIG5vdCBleGlzdHNgKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhdXRvWm9vbSgpIHtcbiAgICAgICAgY29uc3Qgd2lkdGhYID0gdGhpcy5jb25maWcud2lkdGggLyB0aGlzLldJRFRIO1xuICAgICAgICBjb25zdCBoZWlnaHRYID0gdGhpcy5jb25maWcuaGVpZ2h0IC8gdGhpcy5IRUlHSFQ7XG4gICAgICAgIGNvbnN0IG1heFggPSBNYXRoLm1heCh3aWR0aFgsIGhlaWdodFgpO1xuICAgICAgICB0aGlzLnNldFpvb20obWF4WCk7XG4gICAgfVxuICAgIHNldFpvb20oem9vbSkge1xuICAgICAgICB0aGlzLnVwZGF0ZVBhcmFtcyh7IC4uLnRoaXMucGFyYW1zLCB6b29tOiB6b29tIH0pO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgIH1cbiAgICBnZXRXaWR0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuV0lEVEg7XG4gICAgfVxuICAgIGdldEhlaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuSEVJR0hUO1xuICAgIH1cbiAgICBzZXRXaWR0aCh3aWR0aCkge1xuICAgICAgICB0aGlzLldJRFRIID0gd2lkdGg7XG4gICAgfVxuICAgIHNldEhlaWdodChoZWlnaHQpIHtcbiAgICAgICAgdGhpcy5IRUlHSFQgPSBoZWlnaHQ7XG4gICAgfVxuICAgIGdldENhbnZhcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2wuY2FudmFzO1xuICAgIH1cbiAgICAvLyBGSVhNRTogVG8gTWF0aCBjbGFzc1xuICAgIGdldDJkUm90YXRpb24oKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBNYXRoLnNpbih0aGlzLnBhcmFtcy5yb3RhdGlvbiksXG4gICAgICAgICAgICBNYXRoLmNvcyh0aGlzLnBhcmFtcy5yb3RhdGlvbilcbiAgICAgICAgXTtcbiAgICB9XG4gICAgZ2V0MmRSb3RhdGlvbkNlbnRlcigpIHtcbiAgICAgICAgY29uc3QgeCA9ICh0aGlzLnBhcmFtcy5yb3RhdGlvbl9jZW50ZXIueCArIDEpICogdGhpcy5XSURUSCAvIDIuMDtcbiAgICAgICAgY29uc3QgeSA9ICh0aGlzLnBhcmFtcy5yb3RhdGlvbl9jZW50ZXIueSArIDEpICogdGhpcy5IRUlHSFQgLyAyLjA7XG4gICAgICAgIHJldHVybiBbeCwgeV07XG4gICAgfVxuICAgIGxvYWRJbWFnZSh1cmwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICBpbWFnZS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEltYWdlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cud2FybignTG9hZCBJbWFnZSBjYWxsZWQgd2l0aG91dCBpbWFnZS4nKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLldJRFRIID0gaW1hZ2Uud2lkdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5IRUlHSFQgPSBpbWFnZS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5maXRDYW52YXMoaW1hZ2Uud2lkdGgsIGltYWdlLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGUodGhpcy5jdXJyZW50SW1hZ2UpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpbWFnZS5vbmVycm9yID0gKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKFwiRXJyb3Igd2hpbGUgbG9hZGluZyB0aGUgaW1hZ2UuXCIpO1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEltYWdlID0gaW1hZ2U7XG4gICAgICAgICAgICBpbWFnZS5zcmMgPSB1cmw7XG4gICAgICAgICAgICB0aGlzLnJlYWxJbWFnZSA9IGltYWdlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYXN5bmMgbG9hZCh1cmwsIGNvbmZpZykge1xuICAgICAgICB0aGlzLmxvZy5sb2coXCJWZXJzaW9uIDEuNC4wXCIpO1xuICAgICAgICAvLyBTYXZlIHJlYWwgaW1hZ2UgYXMgYSBjb3B5XG4gICAgICAgIGlmIChjb25maWcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkSW1hZ2UodXJsKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHNldExvZyhsb2cpIHtcbiAgICAgICAgdGhpcy5sb2cgPSBsb2c7XG4gICAgfVxuICAgIC8vIFRlbXAgYW5kIFRpbnRcbiAgICB1cGRhdGVUZW1wdGludCgpIHtcbiAgICAgICAgdGhpcy51bmlmb3Jtcy50ZW1wdGludCA9IHRlbXBUaW50KHRoaXMucGFyYW1zKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTGlnaHRuaW5nIGdlbmVyYXRpb246XG4gICAgICogTWFwIGJyaWdodG5lc3MgdmFsdWVzIGRlcGVuZGluZyBvbiBCcmlnaHRuZXNzLCBDb250cmFzdC4uLiBldGNcbiAgICAgKi9cbiAgICBnZW5lcmF0ZUxpZ2h0bmluZygpIHtcbiAgICAgICAgdGhpcy5MSUdIVF9NQVRDSCA9IGxpZ2h0bmluZyh0aGlzLnBhcmFtcyk7XG4gICAgfVxuICAgIGJsb2IodHlwZSwgcXVhbGl0eSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMucmVhbEltYWdlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2cud2FybignQ2FsbGVkIHRvIGJsb2Igd2l0aG91dCBsb2FkZWQgaW1hZ2UnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZSh0aGlzLnJlYWxJbWFnZSk7XG4gICAgICAgICAgICB0aGlzLmdldENhbnZhcygpLnRvQmxvYigoYmxvYikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChibG9iID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKCdVbmFibGUgdG8gZ2VuZXJhdGUgdGhlIGJsb2IgZmlsZScpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc29sdmUoYmxvYik7XG4gICAgICAgICAgICB9LCB0eXBlIHx8IFwiaW1hZ2UvanBlZ1wiLCBxdWFsaXR5IHx8IDEpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogY3JlYXRlXG4gICAgICogUHJlcGFyZSB0aGUgZW52aXJvbm1lbnQgdG8gZWRpdCB0aGUgaW1hZ2VcbiAgICAgKiBpbWFnZTogSW1hZ2UgZWxlbWVudCB0byBlZGl0IChJbWFnZSBvYmplY3QpXG4gICAgICogY29udGV4dDogd2ViZ2wgY29udGV4dC4gRGVmYXVsdDogX193aW5kb3cuZ2xcbiAgICAgKiBTRVRfRlVMTF9SRVM6IG5vIHJlc2l6ZSB0aGUgaW1hZ2UgdG8gZWRpdC4gRGVmYXVsdDogZmFsc2UgKHJlc2l6ZSB0aGUgaW1hZ2UpXG4gICAgICovXG4gICAgY3JlYXRlKGltYWdlLCBwcmV2ZW50UmVuZGVySW1hZ2UpIHtcbiAgICAgICAgLy8gTG9hZCBHU0xTIHByb2dyYW1zXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBWRVJURVhfU0hBREVSX0NPREUgPSBjcmVhdGVTaGFkZXIodGhpcy5nbCwgdGhpcy5nbC5WRVJURVhfU0hBREVSLCBWRVJURVhfU0hBREVSKTtcbiAgICAgICAgICAgIGNvbnN0IEZSQUdNRU5UX1NIQURFUl9DT0RFID0gY3JlYXRlU2hhZGVyKHRoaXMuZ2wsIHRoaXMuZ2wuRlJBR01FTlRfU0hBREVSLCBGUkFHTUVOVF9TSEFERVIpO1xuICAgICAgICAgICAgdGhpcy5wcm9ncmFtID0gY3JlYXRlUHJvZ3JhbSh0aGlzLmdsLCBWRVJURVhfU0hBREVSX0NPREUsIEZSQUdNRU5UX1NIQURFUl9DT0RFKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2cuZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbnRleHQgPSBuZXcgQ29udGV4dCh0aGlzLmdsLCB0aGlzLnByb2dyYW0pO1xuICAgICAgICB0aGlzLmxvZy5sb2coXCJbSU1BR0VdIHdpZHRoID0gXCIgKyB0aGlzLldJRFRIICsgXCIsIGhlaWdodCA9IFwiICsgdGhpcy5IRUlHSFQpO1xuICAgICAgICB0aGlzLmxvZy5sb2coXCJbQ0FOVkFTXSB3aWR0aCA9IFwiICsgdGhpcy5jYW52YXMud2lkdGggKyBcIiwgaGVpZ2h0ID0gXCIgKyB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuICAgICAgICB0aGlzLnNldFJlY3RhbmdsZSh0aGlzLmNvbnRleHQuY3JlYXRlQnVmZmVyKFwiQVJSQVlfQlVGRkVSXCIpLCAwLjAsIDAuMCwgdGhpcy5XSURUSCwgdGhpcy5IRUlHSFQpO1xuICAgICAgICB0aGlzLnNldFJlY3RhbmdsZSh0aGlzLmNvbnRleHQuY3JlYXRlQnVmZmVyKFwiVEVYQ09PUkRfQlVGRkVSXCIpLCAwLCAwLCAxLjAsIDEuMCk7XG4gICAgICAgIHRoaXMuZ2wuYWN0aXZlVGV4dHVyZSh0aGlzLmdsLlRFWFRVUkUwKTtcbiAgICAgICAgLy8gVXBsb2FkIHRoZSBpbWFnZSBpbnRvIHRoZSB0ZXh0dXJlLlxuICAgICAgICBjcmVhdGVUZXh0dXJlKHRoaXMuZ2wpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5nbC50ZXhJbWFnZTJEKHRoaXMuZ2wuVEVYVFVSRV8yRCwgMCwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuVU5TSUdORURfQllURSwgaW1hZ2UpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvZy5lcnJvcihlcnIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFVwbG9hZCB0aGUgTFVUIChjb250cmFzdCwgYnJpZ2h0bmVzcy4uLilcbiAgICAgICAgdGhpcy5nbC5hY3RpdmVUZXh0dXJlKHRoaXMuZ2wuVEVYVFVSRTEpO1xuICAgICAgICBjcmVhdGVUZXh0dXJlKHRoaXMuZ2wpO1xuICAgICAgICB0aGlzLmdsLnZpZXdwb3J0KDAsIDAsIHRoaXMuV0lEVEgsIHRoaXMuSEVJR0hUKTtcbiAgICAgICAgdGhpcy5nbC5jbGVhckNvbG9yKDAsIDAsIDAsIDApO1xuICAgICAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XG4gICAgICAgIGlmICghcHJldmVudFJlbmRlckltYWdlKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZpdENhbnZhcyh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gd2lkdGg7XG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IGhlaWdodDtcbiAgICB9XG4gICAgdXBkYXRlKCkge1xuICAgICAgICB0aGlzLmdsLnRleEltYWdlMkQodGhpcy5nbC5URVhUVVJFXzJELCAwLCB0aGlzLmdsLkFMUEhBLCAyNTYsIDEsIDAsIHRoaXMuZ2wuQUxQSEEsIHRoaXMuZ2wuVU5TSUdORURfQllURSwgbmV3IFVpbnQ4QXJyYXkodGhpcy5MSUdIVF9NQVRDSCkpO1xuICAgICAgICB0aGlzLmdsLnVzZVByb2dyYW0odGhpcy5wcm9ncmFtKTtcbiAgICAgICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLmNvbnRleHQuZ2V0QXR0cmlidXRlKFwiYV9wb3NpdGlvblwiKSk7XG4gICAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdGhpcy5jb250ZXh0LmdldEJ1ZmZlcihcIkFSUkFZX0JVRkZFUlwiKSk7XG4gICAgICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLmNvbnRleHQuZ2V0QXR0cmlidXRlKFwiYV9wb3NpdGlvblwiKSwgMiwgdGhpcy5nbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuICAgICAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuY29udGV4dC5nZXRBdHRyaWJ1dGUoXCJhX3RleENvb3JkXCIpKTtcbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmNvbnRleHQuZ2V0QnVmZmVyKFwiVEVYQ09PUkRfQlVGRkVSXCIpKTtcbiAgICAgICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMuY29udGV4dC5nZXRBdHRyaWJ1dGUoXCJhX3RleENvb3JkXCIpLCAyLCB0aGlzLmdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG4gICAgICAgIHRoaXMuZ2wudW5pZm9ybTJmKHRoaXMuY29udGV4dC5nZXRVbmlmb3JtKFwidV9yZXNvbHV0aW9uXCIpLCB0aGlzLldJRFRILCB0aGlzLkhFSUdIVCk7XG4gICAgICAgIHRoaXMuZ2wudW5pZm9ybTJmKHRoaXMuY29udGV4dC5nZXRVbmlmb3JtKFwidV90ZXh0dXJlU2l6ZVwiKSwgdGhpcy5XSURUSCwgdGhpcy5IRUlHSFQpO1xuICAgICAgICB0aGlzLmdsLnVuaWZvcm0xZih0aGlzLmNvbnRleHQuZ2V0VW5pZm9ybShcInVfYnJpZ2h0bmVzc1wiKSwgdGhpcy5wYXJhbXMuYnJpZ2h0bmVzcyk7XG4gICAgICAgIHRoaXMuZ2wudW5pZm9ybTFmKHRoaXMuY29udGV4dC5nZXRVbmlmb3JtKFwidV9jb250cmFzdFwiKSwgdGhpcy5wYXJhbXMuY29udHJhc3QpO1xuICAgICAgICB0aGlzLmdsLnVuaWZvcm0xZih0aGlzLmNvbnRleHQuZ2V0VW5pZm9ybShcInVfZXhwb3N1cmVcIiksIHRoaXMucGFyYW1zLmV4cG9zdXJlKTtcbiAgICAgICAgdGhpcy5nbC51bmlmb3JtMWYodGhpcy5jb250ZXh0LmdldFVuaWZvcm0oXCJ1X2NvbnRyYXN0XCIpLCB0aGlzLnBhcmFtcy5jb250cmFzdCk7XG4gICAgICAgIHRoaXMuZ2wudW5pZm9ybTFmKHRoaXMuY29udGV4dC5nZXRVbmlmb3JtKFwidV9zYXR1cmF0aW9uXCIpLCB0aGlzLnBhcmFtcy5zYXR1cmF0aW9uKTtcbiAgICAgICAgdGhpcy5nbC51bmlmb3JtMWYodGhpcy5jb250ZXh0LmdldFVuaWZvcm0oXCJ1X21hc2tpbmdcIiksIHRoaXMucGFyYW1zLm1hc2tpbmcpO1xuICAgICAgICB0aGlzLmdsLnVuaWZvcm0xZih0aGlzLmNvbnRleHQuZ2V0VW5pZm9ybShcInVfZGVoYXplXCIpLCB0aGlzLnBhcmFtcy5kZWhhemUpO1xuICAgICAgICB0aGlzLmdsLnVuaWZvcm0xZih0aGlzLmNvbnRleHQuZ2V0VW5pZm9ybShcInVfYXRtb3NmZXJpY19saWdodFwiKSwgdGhpcy5wYXJhbXMuYXRtb3NmZXJpY19saWdodCk7XG4gICAgICAgIHRoaXMuZ2wudW5pZm9ybTNmdih0aGlzLmNvbnRleHQuZ2V0VW5pZm9ybShcInVfdGVtcHRpbnRbMF1cIiksIHRoaXMudW5pZm9ybXMudGVtcHRpbnRcbiAgICAgICAgICAgIC5jb25jYXQoYXNBcnJheShoc3YycmdiKHsgeDogdGhpcy5wYXJhbXMubGlnaHRDb2xvciAqIDM2MCwgeTogdGhpcy5wYXJhbXMubGlnaHRTYXQsIHo6IHRoaXMucGFyYW1zLmxpZ2h0RmlsbCB9KSkpXG4gICAgICAgICAgICAuY29uY2F0KGFzQXJyYXkoaHN2MnJnYih7IHg6IHRoaXMucGFyYW1zLmRhcmtDb2xvciAqIDM2MCwgeTogdGhpcy5wYXJhbXMuZGFya1NhdCwgejogdGhpcy5wYXJhbXMuZGFya0ZpbGwgfSkpKSk7IC8vIHZlYzMgeDNcbiAgICAgICAgdGhpcy5nbC51bmlmb3JtMWYodGhpcy5jb250ZXh0LmdldFVuaWZvcm0oXCJ1X2JBbmRXXCIpLCB0aGlzLnBhcmFtcy5iQW5kVyk7XG4gICAgICAgIHRoaXMuZ2wudW5pZm9ybTFmKHRoaXMuY29udGV4dC5nZXRVbmlmb3JtKFwidV9oZHJcIiksIHRoaXMucGFyYW1zLmhkcik7XG4gICAgICAgIHRoaXMuZ2wudW5pZm9ybTJmdih0aGlzLmNvbnRleHQuZ2V0VW5pZm9ybShcInVfcm90YXRpb25cIiksIHRoaXMuZ2V0MmRSb3RhdGlvbigpKTtcbiAgICAgICAgdGhpcy5nbC51bmlmb3JtMmZ2KHRoaXMuY29udGV4dC5nZXRVbmlmb3JtKFwidV9yb3RhdGlvbl9jZW50ZXJcIiksIHRoaXMuZ2V0MmRSb3RhdGlvbkNlbnRlcigpKTtcbiAgICAgICAgdGhpcy5nbC51bmlmb3JtMmYodGhpcy5jb250ZXh0LmdldFVuaWZvcm0oXCJ1X3NjYWxlXCIpLCB0aGlzLnBhcmFtcy5zY2FsZS54LCB0aGlzLnBhcmFtcy5zY2FsZS55KTtcbiAgICAgICAgdGhpcy5nbC51bmlmb3JtMmYodGhpcy5jb250ZXh0LmdldFVuaWZvcm0oXCJ1X3RyYW5zbGF0ZVwiKSwgdGhpcy5wYXJhbXMudHJhbnNsYXRlLngsIHRoaXMucGFyYW1zLnRyYW5zbGF0ZS55KTtcbiAgICAgICAgLy8gU2hvdyBpbWFnZVxuICAgICAgICB0aGlzLmdsLnVuaWZvcm0xaSh0aGlzLmNvbnRleHQuZ2V0VW5pZm9ybShcInVfbHV0XCIpLCAxKTsgLy8gVEVYVFVSRSAxXG4gICAgICAgIC8vIHNldCB0aGUga2VybmVsIGFuZCBpdCdzIHdlaWdodFxuICAgICAgICB0aGlzLmdsLnVuaWZvcm0xZnYodGhpcy5jb250ZXh0LmdldFVuaWZvcm0oXCJ1X2tlcm5lbFswXVwiKSwgdGhpcy51bmlmb3Jtcy5rZXJuZWwpO1xuICAgICAgICB0aGlzLmdsLnVuaWZvcm0xZih0aGlzLmNvbnRleHQuZ2V0VW5pZm9ybShcInVfa2VybmVsV2VpZ2h0XCIpLCBzdW1BcnJheSh0aGlzLnVuaWZvcm1zLmtlcm5lbCkpO1xuICAgICAgICAvKiBBZGp1c3QgY2FudmFzIHNpemU6IENyb3BwaW5nICovXG4gICAgICAgIHRoaXMuYXBwbHlDcm9wKCk7XG4gICAgICAgIHRoaXMuZ2wuZHJhd0FycmF5cyh0aGlzLmdsLlRSSUFOR0xFUywgMCwgNik7XG4gICAgfVxuICAgIGFwcGx5Q3JvcCgpIHtcbiAgICAgICAgY29uc3QgeDIgPSB0aGlzLldJRFRIICogdGhpcy5wYXJhbXMuc2l6ZS54O1xuICAgICAgICBjb25zdCB5MiA9IHRoaXMuSEVJR0hUICogdGhpcy5wYXJhbXMuc2l6ZS55O1xuICAgICAgICBjb25zdCBjdyA9ICh0aGlzLnBhcmFtcy56b29tICogeDIpO1xuICAgICAgICBjb25zdCBjaCA9ICh0aGlzLnBhcmFtcy56b29tICogeTIpO1xuICAgICAgICB0aGlzLmdldENhbnZhcygpLnN0eWxlLndpZHRoID0gY3cgKyBcInB4XCI7XG4gICAgICAgIHRoaXMuZ2V0Q2FudmFzKCkuc3R5bGUuaGVpZ2h0ID0gY2ggKyBcInB4XCI7XG4gICAgICAgIHRoaXMuZ2V0Q2FudmFzKCkud2lkdGggPSB4MjtcbiAgICAgICAgdGhpcy5nZXRDYW52YXMoKS5oZWlnaHQgPSB5MjtcbiAgICB9XG4gICAgc2V0UmVjdGFuZ2xlKGJ1ZmZlciwgeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIGJ1ZmZlcik7XG4gICAgICAgIHZhciB4MSA9IHg7XG4gICAgICAgIHZhciB4MiA9IHggKyB3aWR0aDtcbiAgICAgICAgdmFyIHkxID0geTtcbiAgICAgICAgdmFyIHkyID0geSArIGhlaWdodDtcbiAgICAgICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KFtcbiAgICAgICAgICAgIHgxLCB5MSxcbiAgICAgICAgICAgIHgyLCB5MSxcbiAgICAgICAgICAgIHgxLCB5MixcbiAgICAgICAgICAgIHgxLCB5MixcbiAgICAgICAgICAgIHgyLCB5MSxcbiAgICAgICAgICAgIHgyLCB5MixcbiAgICAgICAgXSksIHRoaXMuZ2wuU1RBVElDX0RSQVcpO1xuICAgIH1cbn1cbiIsIi8qKlxuICogQ29sb3Igc3BhY2UgZnVuY3Rpb25zXG4gKi9cbmltcG9ydCB7IGNsYW1wIH0gZnJvbSBcIi4vbWF0aFwiO1xuZXhwb3J0IGNvbnN0IGdldEx1bWEgPSAocmdiX3BpeCkgPT4ge1xuICAgIHJldHVybiAwLjIxMjYgKiByZ2JfcGl4LnggKyAwLjcxNTIgKiByZ2JfcGl4LnkgKyAwLjA3MjIgKiByZ2JfcGl4Lno7XG59O1xuZXhwb3J0IGNvbnN0IGhzdjJyZ2IgPSAocGl4ZWxfaHN2KSA9PiB7XG4gICAgbGV0IGEsIGQsIGM7XG4gICAgbGV0IHIsIGcsIGI7XG4gICAgYSA9IHBpeGVsX2hzdi56ICogcGl4ZWxfaHN2Lnk7XG4gICAgZCA9IGEgKiAoMS4wIC0gTWF0aC5hYnMoKHBpeGVsX2hzdi54IC8gNjAuMCkgJSAyLjAgLSAxLjApKTtcbiAgICBjID0gcGl4ZWxfaHN2LnogLSBhO1xuICAgIGlmIChwaXhlbF9oc3YueCA8IDE4MC4wKSB7XG4gICAgICAgIGlmIChwaXhlbF9oc3YueCA8IDYwLjApIHtcbiAgICAgICAgICAgIHIgPSBwaXhlbF9oc3YuejtcbiAgICAgICAgICAgIGcgPSBkICsgYztcbiAgICAgICAgICAgIGIgPSBjO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHBpeGVsX2hzdi54IDwgMTIwLjApIHtcbiAgICAgICAgICAgIHIgPSBkICsgYztcbiAgICAgICAgICAgIGcgPSBwaXhlbF9oc3YuejtcbiAgICAgICAgICAgIGIgPSBjO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgciA9IGM7XG4gICAgICAgICAgICBnID0gcGl4ZWxfaHN2Lno7XG4gICAgICAgICAgICBiID0gZCArIGM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChwaXhlbF9oc3YueCA8IDI0MC4wKSB7XG4gICAgICAgICAgICByID0gYztcbiAgICAgICAgICAgIGcgPSBkICsgYztcbiAgICAgICAgICAgIGIgPSBwaXhlbF9oc3YuejtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChwaXhlbF9oc3YueCA8IDMwMC4wKSB7XG4gICAgICAgICAgICByID0gZCArIGM7XG4gICAgICAgICAgICBnID0gYztcbiAgICAgICAgICAgIGIgPSBhICsgYztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHIgPSBhICsgYztcbiAgICAgICAgICAgIGcgPSBjO1xuICAgICAgICAgICAgYiA9IGQgKyBjO1xuICAgICAgICB9XG4gICAgfVxuICAgIHIgPSBjbGFtcChyLCAwLjAsIDEuMCk7XG4gICAgZyA9IGNsYW1wKGcsIDAuMCwgMS4wKTtcbiAgICBiID0gY2xhbXAoYiwgMC4wLCAxLjApO1xuICAgIHJldHVybiB7IHg6IHIsIHk6IGcsIHo6IGIgfTtcbn07XG5leHBvcnQgY29uc3QgYXNBcnJheSA9ICh2ZWMpID0+IFt2ZWMueCwgdmVjLnksIHZlYy56XTtcbiIsImV4cG9ydCBjb25zdCBkZWZhdWx0Q29uZmlnID0ge1xuICAgIHJlc29sdXRpb25MaW1pdDogLTEsXG4gICAgZWRpdGlvblJlc29sdXRpb25MaW1pdDogLTEsXG59O1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRQYXJhbXMgPSB7XG4gICAgaGRyOiAwLFxuICAgIGV4cG9zdXJlOiAwLFxuICAgIHRlbXBlcmF0dXJlOiAwLFxuICAgIHRpbnQ6IDAsXG4gICAgYnJpZ2h0bmVzczogMCxcbiAgICBzYXR1cmF0aW9uOiAwLFxuICAgIGNvbnRyYXN0OiAwLFxuICAgIHNoYXJwZW46IDAsXG4gICAgbWFza2luZzogMCxcbiAgICBzaGFycGVuX3JhZGl1czogMCxcbiAgICByYWRpYW5jZTogMCxcbiAgICBoaWdobGlnaHRzOiAwLFxuICAgIHNoYWRvd3M6IDAsXG4gICAgd2hpdGVzOiAwLFxuICAgIGJsYWNrczogMCxcbiAgICBkZWhhemU6IDAsXG4gICAgYkFuZFc6IDAsXG4gICAgYXRtb3NmZXJpY19saWdodDogMCxcbiAgICBsaWdodEZpbGw6IDAsXG4gICAgbGlnaHRDb2xvcjogMCxcbiAgICBsaWdodFNhdDogMSxcbiAgICBkYXJrRmlsbDogMCxcbiAgICBkYXJrQ29sb3I6IDAsXG4gICAgZGFya1NhdDogMSxcbiAgICByb3RhdGlvbjogMCxcbiAgICByb3RhdGlvbl9jZW50ZXI6IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMCxcbiAgICB9LFxuICAgIHNjYWxlOiB7XG4gICAgICAgIHg6IDEsXG4gICAgICAgIHk6IDEsXG4gICAgfSxcbiAgICB0cmFuc2xhdGU6IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMCxcbiAgICB9LFxuICAgIHNpemU6IHtcbiAgICAgICAgeDogMSxcbiAgICAgICAgeTogMSxcbiAgICB9LFxuICAgIHpvb206IDEsXG59O1xuLyoqXG4gKiBDYWxsYmFja3MgbmVlZGVkIHRvIGJlIHJlY2FsY3VsYXRlZCB3aGVuIGNoYW5naW5nIHBhcmFtZXRlcnNcbiAqL1xuZXhwb3J0IGNvbnN0IHBhcmFtc0NhbGxiYWNrcyA9IHtcbiAgICBjb250cmFzdDogW1wiZ2VuZXJhdGVMaWdodG5pbmdcIl0sXG4gICAgd2hpdGVzOiBbXCJnZW5lcmF0ZUxpZ2h0bmluZ1wiXSxcbiAgICBoaWdobGlnaHRzOiBbXCJnZW5lcmF0ZUxpZ2h0bmluZ1wiXSxcbiAgICBzaGFkb3dzOiBbXCJnZW5lcmF0ZUxpZ2h0bmluZ1wiXSxcbiAgICBibGFja3M6IFtcImdlbmVyYXRlTGlnaHRuaW5nXCJdLFxuICAgIHJhZGlhbmNlOiBbXCJnZW5lcmF0ZUxpZ2h0bmluZ1wiLCBcImtlcm5lbF91cGRhdGVcIl0sXG4gICAgaGRyOiBbXCJrZXJuZWxfdXBkYXRlXCJdLFxuICAgIHRlbXBlcmF0dXJlOiBbXCJ1cGRhdGVUZW1wdGludFwiXSxcbiAgICB0aW50OiBbXCJ1cGRhdGVUZW1wdGludFwiXSxcbiAgICBzaGFycGVuOiBbXCJrZXJuZWxfdXBkYXRlXCJdLFxuICAgIHNoYXJwZW5fcmFkaXVzOiBbXCJrZXJuZWxfdXBkYXRlXCJdLFxufTtcbi8qKlxuICogVGVtcGVyYXR1cmUgbWFwXG4gKi9cbmV4cG9ydCBjb25zdCBURU1QX0RBVEEgPSBbXG4gICAgWzAuNjE2NzQyNjA2OTg2NTAwMiwgMC4wMTc2NTc5ODE3MTA4MjMwNzddLFxuICAgIFswLjU4Mzg2MjQ5ODIwNDEyOTMsIDAuMDY0NDc3NTQ3ODc4NzQ5OTNdLFxuICAgIFswLjU2NjY1NzAxNTc3ODQ5MDMsIDAuMTAxMDc2OTM1OTk3NTgzOF0sXG4gICAgWzAuNTYwMDIxNTAxNzg0NjUxOCwgMC4xMzAxMjA1NDM1OTgwODc5NV0sXG4gICAgWzAuNTYwMzQ2MDkwMTMyODQ2NSwgMC4xNTM3MDI4MjMzODM0MzQxNl0sXG4gICAgWzAuNTY1MTQxNDAxNTYzODE5NSwgMC4xNzM0MDcxMTA5MjU5Nzg5XSxcbiAgICBbMC41NzI3MTU3OTA1MjIzMzkzLCAwLjE5MDQwNDE3ODc2MDc2NjY1XSxcbiAgICBbMC41ODE5MzA1OTE5MzA2NDY5LCAwLjIwNTU0Nzg3OTcwMTgyNjQ3XSxcbiAgICBbMC41OTIwMjUzMTczOTc2NTQzLCAwLjIxOTQ1NDM5Njg2MDY3M10sXG4gICAgWzAuNjAyNDk2NDk3MzExMzI3MywgMC4yMzI1NjM2MTA3NzAwMTA3OF0sXG4gICAgWzAuNjEzMDE0OTIzNjg4NDE1LCAwLjI0NTE4NTE1NzQ0MjMzNDRdLFxuICAgIFswLjYyMzM2OTQ2ODE0NDg4NjMsIDAuMjU3NTMyNTU0MTg2NTM5Ml0sXG4gICAgWzAuNjMzNDI4OTkxODQ5NTAyLCAwLjI2OTc0ODQxODk1MTk1NzRdLFxuICAgIFswLjY0MzExNjQ4NzMxNjMwNTYsIDAuMjgxOTIzMTcwMDA0NjI2M10sXG4gICAgWzAuNjUyMzkxNDc3Nzc2NzE5OCwgMC4yOTQxMDg5ODIyNTQ3NjE0NV0sXG4gICAgWzAuNjYxMjM4MDAwNDQzNzgwMiwgMC4zMDYzMzAyODQ2NjgzMDMxNF0sXG4gICAgWzAuNjY5NjU2Mzc4NjY4MDI0NiwgMC4zMTg1OTE3MTUzMjkzNTM0M10sXG4gICAgWzAuNjc3NjU3NTc2MTM5MDk1MiwgMC4zMzA4ODQxODU5NTczODRdLFxuICAgIFswLjY4NTI1OTMxODgzNjM2MDMsIDAuMzQzMTg5NTIxMDU1Njg2MjNdLFxuICAgIFswLjY5MjQ4MzQzMjY4MDY3MjEsIDAuMzU1NDg0MDA2NzI5MjM1OF0sXG4gICAgWzAuNjk5MzU0MDIwNjE2NDE2OCwgMC4zNjc3NDEwOTM4MjgxMjM2NF0sXG4gICAgWzAuNzA1ODk2MjIxMjE5MzU5LCAwLjM3OTkzMzQzNzIxMDc5OTc1XSxcbiAgICBbMC43MTIxMzUzNzEwNzA4NTQsIDAuMzkyMDM0NDA4OTEwNDE5NV0sXG4gICAgWzAuNzE4MDk2NDQ3NzE5OTg4MywgMC40MDQwMTkxOTE4MDI0MTY2XSxcbiAgICBbMC43MjM4MDM3MDc0NDc4MTgyLCAwLjQxNTg2NTUzNzg4NDIzNTc1XSxcbiAgICBbMC43MjkyODA0NTc4MTUwMDI4LCAwLjQyNzU1NDI1ODY5MDc5NjA1XSxcbiAgICBbMC43MzQ1NDg5MjI4Mjc1MDgzLCAwLjQzOTA2OTUwMjgwMjE2NTMzXSxcbiAgICBbMC43Mzk2MzAxNzA5OTEyNTQ1LCAwLjQ1MDM5ODg2NTYwMzAwMjVdLFxuICAgIFswLjc0NDU0NDA4NTIyNzg2NTEsIDAuNDYxNTMzMzY4NjAwNjM4MV0sXG4gICAgWzAuNzQ5MzA5MzU5NzM3NTI2MSwgMC40NzI0NjczMzkxNTcyMTM0NV0sXG4gICAgWzAuNzUzOTQzNTEzMjA0NDk0OCwgMC40ODMxOTgyMTYwODgxMDc1XSxcbiAgICBbMC43NTg0NjI5MTA3ODU1Njk3LCAwLjQ5MzcyNjMwMTk4ODcwMTFdLFxuICAgIFswLjc2Mjg4Mjc4OTQ3NjU0NDIsIDAuNTA0MDU0NDc5MjIxOTE3Nl0sXG4gICAgWzAuNzY3MjE3MjgyOTc1Nzg2MSwgMC41MTQxODc5MDMxMjE2ODc1XSxcbiAgICBbMC43NzU2ODEyNTY2OTkwMzY4LCAwLjUzMzkwMDU1OTYwNzA2NzRdLFxuICAgIFswLjc3NTY4MTI1NjY5OTAzNjgsIDAuNTMzOTAwNTU5NjA3MDY3NF0sXG4gICAgWzAuNzc5ODMzNjUzNTg0NzgzNCwgMC41NDM0OTg1ODM2ODgyNjgxXSxcbiAgICBbMC43ODM5NDY1MDkyOTAzODUxLCAwLjU1MjkzODgwMjMwMTg3OV0sXG4gICAgWzAuNzg4MDI4NjM2ODIzNDU5NiwgMC41NjIyMzI5NTMzMzcyOTM4XSxcbiAgICBbMC43OTIwODc3Njk2ODYzNzIyLCAwLjU3MTM5MzE3MTI1NDMzMjVdLFxuICAgIFswLjc5NjEzMDUzNDYwMTEzNCwgMC41ODA0MzE3MDQxODQ5ODk3XSxcbiAgICBbMC44MDAxNjI0MTM2MDQ1MTY2LCAwLjU4OTM2MDY0MjMwNzQ3MTVdLFxuICAgIFswLjgwNDE4NzY5NTExODA1MzQsIDAuNTk4MTkxNjU2NzQ0MjQyNl0sXG4gICAgWzAuODA4MjA5NDEzNjczMjU4OSwgMC42MDY5MzU3NDc4MDc1OTk3XSxcbiAgICBbMC44MTIyMjkyNzgwNTg1NzgxLCAwLjYxNTYwMzAwMTEzNDA2MzNdLFxuICAgIFswLjgxNjI0NzU4Nzc1NzQ3NDMsIDAuNjI0MjAyMzUwMDk2NzMxXSxcbiAgICBbMC44MjAyNjMxMzc2ODA0NjU5LCAwLjYzMjc0MTM0Mjg1NDIxNDhdLFxuICAgIFswLjgyNDI3MzExMTM2NjEzMDIsIDAuNjQxMjI1OTEyNDc3MjcxMl0sXG4gICAgWzAuODI4MjcyOTYzMDQ2OTg2MywgMC42NDk2NjAxNDg3ODY4OTAyXSxcbiAgICBbMC44MzIyNTYyODkyNTgzMDcyLCAwLjY1ODA0NjA3MDgzOTU3MDVdLFxuICAgIFswLjgzNjIxNDY5MTAxODE1NTMsIDAuNjY2MzgzMzk5NDA4NDI2M10sXG4gICAgWzAuODQwMTM3NjI4MDM5NTM4OCwgMC42NzQ2NjkzMjkzMzY5MDc1XSxcbiAgICBbMC44NDQwMTIyNjY5NTYzNDA2LCAwLjY4Mjg5ODMwMjI5MDQzODddLFxuICAgIFswLjg0NzgyMzMyNjE2MzU2NzEsIDAuNjkxMDYxNzgxMjA1MTg3XSxcbiAgICBbMC44NTE1NTI5MjA1OTIxODY4LCAwLjY5OTE0ODAyODYzNjE0ODNdLFxuICAgIFswLjg1Nzg1MTUyNzQ4NjAzMjgsIDAuNzE0MzMyODUxMTE3ODY1N10sXG4gICAgWzAuODYzMDM0OTE2NjAwNDY4MywgMC43MjM2MTQ1NTg4ODQ1XSxcbiAgICBbMC44NjMwMzQ5MTY2MDA0NjgzLCAwLjcyMzYxNDU1ODg4NDVdLFxuICAgIFswLjg2Nzg4NjY1MTk4ODM3NzQsIDAuNzMyNjMwNTI2NjkyOTc5OF0sXG4gICAgWzAuODcyNDI2NTQxNzM1MTQzOCwgMC43NDEzOTIwODI0MDM5NTU1XSxcbiAgICBbMC44NzY2NzQ2OTM4MTEyODc5LCAwLjc0OTkxMDYyNjA5NjEwODZdLFxuICAgIFswLjg4MDY1MTQyNTU0MTQzNjIsIDAuNzU4MTk3NTY5OTU4MTE4OV0sXG4gICAgWzAuODg0Mzc3MTczMDcyOTgzMiwgMC43NjYyNjQyODU4NTA1ODg2XSxcbiAgICBbMC44ODc4NzI0MDA4NDQ5NjE0LCAwLjc3NDEyMjA1OTkxNDc5NTFdLFxuICAgIFswLjg5MTE1NzUxMTA1Njg2NjgsIDAuNzgxNzgyMDUzNjIxOTQ3NV0sXG4gICAgWzAuODk0MjUyNzUzMTM3NDIxNiwgMC43ODkyNTUyNzA2Nzk1NzY4XSxcbiAgICBbMC44OTcxNzgxMzMyMTMzNzkyLCAwLjc5NjU1MjUyOTIzOTAwMzRdLFxuICAgIFswLjkwMjU5NzU3MjE2MTU5NTUsIDAuODEwNjYxMzgxODY2OTQ3M10sXG4gICAgWzAuOTA1MTI5NjExOTk2ODI2MiwgMC44MTc0OTM0OTgyNTMzNjIxXSxcbiAgICBbMC45MDUxMjk2MTE5OTY4MjYyLCAwLjgxNzQ5MzQ5ODI1MzM2MjFdLFxuICAgIFswLjkwNzU2NzU3MDY5MTA0MjIsIDAuODI0MTkwNjc0MzQ2NTIyOF0sXG4gICAgWzAuOTA5OTI4ODc5ODkzMjg1MiwgMC44MzA3NjI1MzQyMDAzNDI2XSxcbiAgICBbMC45MTIyMzAxODQ3NjMzOTQsIDAuODM3MjE4NDMzNzM4MjcwOV0sXG4gICAgWzAuOTE0NDg3MjUzNDQxMDE2LCAwLjg0MzU2NzQ1NzE4ODQ5NDFdLFxuICAgIFswLjkxNjcxNDg4NjUxNDI0ODUsIDAuODQ5ODE4NDE1NTI5Mjk3Ml0sXG4gICAgWzAuOTE4OTI2ODI2NDg4MzMwMSwgMC44NTU5Nzk4NDY2NzIzNzk0XSxcbiAgICBbMC45MjExMzU2NjcyNTQ3NTg2LCAwLjg2MjA2MDAxNzEzODM1M10sXG4gICAgWzAuOTIzMzUyNzYzNTU5ODYxMSwgMC44NjgwNjY5MjUwMDMzNjgxXSxcbiAgICBbMC45Mjc4NTA0MDI4NTg1MTY2LCAwLjg3OTg5MTYyODAyNjc4ODZdLFxuICAgIFswLjkzMDE0NjY0NDgzODM3OTcsIDAuODg1NzI0MTE3NjE1MjA2Nl0sXG4gICAgWzAuOTMyNDgyMzU5MjY3MTc1NCwgMC44OTE1MTI3NDUzNzA5NTQyXSxcbiAgICBbMC45MzQ4NjEzNDcxOTc2NjY4LCAwLjg5NzI2NDI0MzEwOTk5NjldLFxuICAgIFswLjkzNDg2MTM0NzE5NzY2NjgsIDAuODk3MjY0MjQzMTA5OTk2OV0sXG4gICAgWzAuOTM3Mjg1NjI3MzUwNDYxNSwgMC45MDI5ODUxMDg4NzQ4MzY5XSxcbiAgICBbMC45Mzk3NTUzNDU1ODI1NTM2LCAwLjkwODY4MTYxNDMwNDgzNDRdLFxuICAgIFswLjk0MjI2ODY4NDM1NjM3MDEsIDAuOTE0MzU5ODEyMTk2NTY3NV0sXG4gICAgWzAuOTQ0ODIxNzcyMjA4NDA1OCwgMC45MjAwMjU1NDQxODI0MTI4XSxcbiAgICBbMC45NDc0MDg1OTMyMTgxNzcsIDAuOTI1Njg0NDQ4NDY1MzM5XSxcbiAgICBbMC45NTAwMjA4OTY0NzY3NDI5LCAwLjkzMTM0MTk2NzU1NjY4OV0sXG4gICAgWzAuOTU1Mjc3MjI3OTc2NzUwMSwgMC45NDI2NzM2ODc4NDM1NjI2XSxcbiAgICBbMC45NTc4OTI3NjQ2Nzg0MjU3LCAwLjk0ODM1Nzg2NDQyNjIxNjNdLFxuICAgIFswLjk2MDQ3NjYxOTQ4NzEzMDgsIDAuOTU0MDYwNjIxNDU1MTcxXSxcbiAgICBbMC45NjMwMDgwMDg1ODQ3NzE0LCAwLjk1OTc4NjUzNjM0ODQ2NzRdLFxuICAgIFswLjk2NTQ2MzM2OTk3Nzg4OSwgMC45NjU1NDAwMzUyMjc3MzMyXSxcbiAgICBbMC45NjU0NjMzNjk5Nzc4ODksIDAuOTY1NTQwMDM1MjI3NzMzMl0sXG4gICAgWzAuOTY3ODE2MjcyOTY2MjczNiwgMC45NzEzMjUzOTk3NDYyNDAxXSxcbiAgICBbMC45NzAwMzczMjc2MTE5NzU0LCAwLjk3NzE0Njc3MzcxMzE3ODNdLFxuICAgIFswLjk3MjA5NDA5NDIwODA0NTIsIDAuOTgzMDA4MTY5NTA2MzIxM10sXG4gICAgWzAuOTczOTUwOTkyNzQ3MTI2NiwgMC45ODg5MTM0NzQyNjc3MDg4XSxcbiAgICBbMC45NzU1NjkyMTIzOTA3MywgMC45OTQ4NjY0NTU4NzkwNzU2XSxcbiAgICBbMC45NzgyMzk2NDE2NTkzOTgzLCAxXVxuXTtcbiIsImV4cG9ydCBjbGFzcyBDb250ZXh0IHtcbiAgICBjb25zdHJ1Y3RvcihnbCwgcHJvZ3JhbSkge1xuICAgICAgICB0aGlzLmdsID0gZ2w7XG4gICAgICAgIHRoaXMucHJvZ3JhbSA9IHByb2dyYW07XG4gICAgICAgIHRoaXMucG9pbnRlcnMgPSB7fTtcbiAgICAgICAgdGhpcy5hdHJpYnV0ZXMgPSB7fTtcbiAgICAgICAgdGhpcy5idWZmZXJzID0ge307XG4gICAgfVxuICAgIDtcbiAgICBnZXRVbmlmb3JtKHVuaWZvcm0pIHtcbiAgICAgICAgaWYgKCF0aGlzLnBvaW50ZXJzW3VuaWZvcm1dKSB7XG4gICAgICAgICAgICB0aGlzLnBvaW50ZXJzW3VuaWZvcm1dID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5wcm9ncmFtLCB1bmlmb3JtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5wb2ludGVyc1t1bmlmb3JtXTtcbiAgICB9XG4gICAgZ2V0QXR0cmlidXRlKGF0cmlidXRlKSB7XG4gICAgICAgIGlmICghdGhpcy5hdHJpYnV0ZXNbYXRyaWJ1dGVdKSB7XG4gICAgICAgICAgICB0aGlzLmF0cmlidXRlc1thdHJpYnV0ZV0gPSB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKHRoaXMucHJvZ3JhbSwgYXRyaWJ1dGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmF0cmlidXRlc1thdHJpYnV0ZV07XG4gICAgfVxuICAgIGNyZWF0ZUJ1ZmZlcihidWZmZXJOYW1lKSB7XG4gICAgICAgIHRoaXMuYnVmZmVyc1tidWZmZXJOYW1lXSA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmJ1ZmZlcnNbYnVmZmVyTmFtZV07XG4gICAgfVxuICAgIGdldEJ1ZmZlcihidWZmZXJOYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJ1ZmZlcnNbYnVmZmVyTmFtZV07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgZ2V0THVtYSB9IGZyb20gXCIuL2NvbG9yXCI7XG5pbXBvcnQgeyBURU1QX0RBVEEgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IGdldEN1YWRyYXRpY0Z1bmN0aW9uIH0gZnJvbSBcIi4vbWF0aFwiO1xuLyoqXG4gKiBDb21wdXRlcyBhbiAzeDMga2VybmVsIGZvciBpbWFnZSBwcm9jZXNzaW5nXG4gKi9cbmV4cG9ydCBjb25zdCBjb21wdXRlS2VybmVsID0gKHBhcmFtcykgPT4ge1xuICAgIGxldCBzaGFycG5lc3MgPSAtcGFyYW1zLnNoYXJwZW47XG4gICAgbGV0IHJhZGl1cyA9IHBhcmFtcy5zaGFycGVuX3JhZGl1cztcbiAgICBjb25zdCByYWRpYW5jZSA9IHBhcmFtcy5yYWRpYW5jZTtcbiAgICBjb25zdCBoZHIgPSBwYXJhbXMuaGRyO1xuICAgIGlmIChyYWRpYW5jZSAhPSAwKSB7XG4gICAgICAgIHNoYXJwbmVzcyAtPSAwLjUgKiByYWRpYW5jZTtcbiAgICAgICAgcmFkaXVzICs9IDAuNSAqIHJhZGlhbmNlO1xuICAgIH1cbiAgICBpZiAoaGRyICE9IDApIHtcbiAgICAgICAgc2hhcnBuZXNzIC09IDAuNSAqIGhkcjtcbiAgICAgICAgcmFkaXVzICs9IDAuNSAqIGhkcjtcbiAgICB9XG4gICAgY29uc3QgQSA9IHNoYXJwbmVzcyAqIE1hdGguZXhwKC1NYXRoLnBvdygxIC8gcmFkaXVzLCAyKSk7XG4gICAgY29uc3QgQiA9IHNoYXJwbmVzcyAqIE1hdGguZXhwKC1NYXRoLnBvdygxLjQxIC8gcmFkaXVzLCAyKSk7XG4gICAgY29uc3QgQyA9IHNoYXJwbmVzcyAqIE1hdGguZXhwKC1NYXRoLnBvdygyIC8gcmFkaXVzLCAyKSk7XG4gICAgY29uc3QgRCA9IHNoYXJwbmVzcyAqIE1hdGguZXhwKC1NYXRoLnBvdygyLjI0IC8gcmFkaXVzLCAyKSk7XG4gICAgY29uc3QgRSA9IHNoYXJwbmVzcyAqIE1hdGguZXhwKC1NYXRoLnBvdygyLjgzIC8gcmFkaXVzLCAyKSk7XG4gICAgbGV0IFggPSAxO1xuICAgIGlmIChzaGFycG5lc3MgPCAwKSB7XG4gICAgICAgIFggKz0gNCAqIE1hdGguYWJzKEUpICsgOCAqIE1hdGguYWJzKEQpICsgNCAqIE1hdGguYWJzKEMpICsgNCAqIE1hdGguYWJzKEIpICsgNCAqIE1hdGguYWJzKEEpO1xuICAgIH1cbiAgICByZXR1cm4gW0UsIEQsIEMsIEQsIEUsXG4gICAgICAgIEQsIEIsIEEsIEIsIEQsXG4gICAgICAgIEMsIEEsIFgsIEEsIEMsXG4gICAgICAgIEQsIEIsIEEsIEIsIEQsXG4gICAgICAgIEUsIEQsIEMsIEQsIEVdO1xufTtcbmV4cG9ydCBjb25zdCB0ZW1wVGludCA9IChwYXJhbXMpID0+IHtcbiAgICBsZXQgVCA9IHBhcmFtcy50ZW1wZXJhdHVyZTtcbiAgICBsZXQgdGludCA9IHBhcmFtcy50aW50O1xuICAgIGxldCBSLCBHLCBCO1xuICAgIGlmIChUIDwgMCkge1xuICAgICAgICBSID0gMTtcbiAgICAgICAgY29uc3QgaSA9IFRFTVBfREFUQVtNYXRoLmZsb29yKChUICsgMSkgKiAxMDApXTsgLy8gVGFiIHZhbHVlcywgYWxnb3JpdGhtIGlzIGhhcmRcbiAgICAgICAgRyA9IGlbMF07XG4gICAgICAgIEIgPSBpWzFdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgUiA9IDAuMDQzODc4NSAvIChNYXRoLnBvdyhUICsgMC4xNTAxMjcsIDEuMjM2NzUpKSArIDAuNTQzOTkxO1xuICAgICAgICBHID0gMC4wMzA1MDAzIC8gKE1hdGgucG93KFQgKyAwLjE2Mzk3NiwgMS4yMzk2NSkpICsgMC42OTEzNjtcbiAgICAgICAgQiA9IDE7XG4gICAgfVxuICAgIGlmICh0aW50ID09IC0xKSB7IC8vIEhBQ0tcbiAgICAgICAgdGludCA9IC0wLjk5O1xuICAgIH1cbiAgICBHICs9IHRpbnQ7XG4gICAgLy8gTHVtYSBjb3JyZWN0aW9uXG4gICAgdmFyIGN1cnJfbHVtYSA9IGdldEx1bWEoeyB4OiBSLCB5OiBHLCB6OiBCIH0pO1xuICAgIHZhciBtdWx0X0sgPSAxIC8gY3Vycl9sdW1hO1xuICAgIHJldHVybiBbUiAqIG11bHRfSywgRyAqIG11bHRfSywgQiAqIG11bHRfS107XG59O1xuZXhwb3J0IGNvbnN0IGxpZ2h0bmluZyA9IChwYXJhbXMpID0+IHtcbiAgICBjb25zdCBmdW5jID0gZ2V0Q3VhZHJhdGljRnVuY3Rpb24ocGFyYW1zLmJsYWNrcywgcGFyYW1zLnNoYWRvd3MgKyAwLjMzLCBwYXJhbXMuaGlnaGxpZ2h0cyArIDAuNjYsIHBhcmFtcy53aGl0ZXMgKyAxLCAwLCAwLjMzLCAwLjY2LCAxKTtcbiAgICBsZXQgZl9yYWRpYW5jZSA9IG51bGw7XG4gICAgaWYgKHBhcmFtcy5yYWRpYW5jZSAhPSAwKSB7XG4gICAgICAgIGZfcmFkaWFuY2UgPSBnZXRDdWFkcmF0aWNGdW5jdGlvbigwLCAwLjMzIC0gcGFyYW1zLnJhZGlhbmNlICogMC4xMSwgMC42NiArIHBhcmFtcy5yYWRpYW5jZSAqIDAuMTEsIDEsIDAsIDAuMzMsIDAuNjYsIDEpO1xuICAgIH1cbiAgICBjb25zdCBMSUdIVF9NQVRDSCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IDI1NTsgaSsrKSB7XG4gICAgICAgIGxldCBwaXhlbF92YWx1ZSA9IGkgLyAyNTU7XG4gICAgICAgIC8vIFJhZGlhbmNlIHBhcnRcbiAgICAgICAgaWYgKHBhcmFtcy5yYWRpYW5jZSAhPSAwKSB7XG4gICAgICAgICAgICBwaXhlbF92YWx1ZSA9IGZfcmFkaWFuY2UocGl4ZWxfdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHBpeGVsX3ZhbHVlID0gZnVuYyhwaXhlbF92YWx1ZSk7XG4gICAgICAgIGlmIChwaXhlbF92YWx1ZSA+IDEpIHtcbiAgICAgICAgICAgIHBpeGVsX3ZhbHVlID0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGl4ZWxfdmFsdWUgPCAwKSB7XG4gICAgICAgICAgICBwaXhlbF92YWx1ZSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgTElHSFRfTUFUQ0hbaV0gPSBwaXhlbF92YWx1ZSAqIDI1NTtcbiAgICB9XG4gICAgcmV0dXJuIExJR0hUX01BVENIO1xufTtcbi8qKlxuICoga2VybmVsTm9ybWFsaXphdGlvblxuICogQ29tcHV0ZSB0aGUgdG90YWwgd2VpZ2h0IG9mIHRoZSBrZXJuZWwgaW4gb3JkZXIgdG8gbm9ybWFsaXplIGl0XG4gKi9cbmV4cG9ydCBjb25zdCBzdW1BcnJheSA9IChrZXJuZWwpID0+IGtlcm5lbC5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKTtcbiIsImV4cG9ydCBjb25zdCBjbGFtcCA9IChhLCBiLCBjKSA9PiB7XG4gICAgcmV0dXJuIChhIDwgYikgPyBiIDogKGEgPiBjKSA/IGMgOiBhO1xufTtcbmV4cG9ydCBjb25zdCByZXNUcmVhdG1lbnQgPSAoYXJyKSA9PiBhcnIubWFwKHYgPT4gTWF0aC5yb3VuZCh2ICogMTAwMCkgLyAxMDAwKTtcbmV4cG9ydCBjb25zdCBnZXRDdWFkcmF0aWNGdW5jdGlvbiA9IChhLCBiLCBjLCBkLCBhYSA9IDAsIGJiID0gMC4zMywgY2MgPSAwLjY2LCBkZCA9IDEpID0+IHtcbiAgICBjb25zdCBhYVMgPSBNYXRoLnBvdyhhYSwgMik7XG4gICAgY29uc3QgYmJTID0gTWF0aC5wb3coYmIsIDIpO1xuICAgIGNvbnN0IGNjUyA9IE1hdGgucG93KGNjLCAyKTtcbiAgICBjb25zdCBkZFMgPSBNYXRoLnBvdyhkZCwgMik7XG4gICAgY29uc3QgYWFUID0gYWFTICogYWE7XG4gICAgY29uc3QgYmJUID0gYmJTICogYmI7XG4gICAgY29uc3QgY2NUID0gY2NTICogY2M7XG4gICAgY29uc3QgZGRUID0gZGRTICogZGQ7XG4gICAgY29uc3QgcmVzID0gcmVzVHJlYXRtZW50KHNvbHZlNHg0KFthYVQsIGJiVCwgY2NULCBkZFRdLCBbYWFTLCBiYlMsIGNjUywgZGRTXSwgW2FhLCBiYiwgY2MsIGRkXSwgW2EsIGIsIGMsIGRdKSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh4KSB7XG4gICAgICAgIGxldCBfciA9IHJlc1szXTtcbiAgICAgICAgbGV0IHh4ID0geDtcbiAgICAgICAgX3IgKz0gcmVzWzJdICogeHg7XG4gICAgICAgIHh4ICo9IHg7XG4gICAgICAgIF9yICs9IHJlc1sxXSAqIHh4O1xuICAgICAgICB4eCAqPSB4O1xuICAgICAgICBfciArPSByZXNbMF0gKiB4eDtcbiAgICAgICAgcmV0dXJuIF9yO1xuICAgIH07XG59O1xuZnVuY3Rpb24gc29sdmU0eDQodywgeCwgeSwgcykge1xuICAgIGxldCBTLCBXLCBYLCBZLCBaO1xuICAgIGxldCBfUywgX1csIF9YLCBfWSwgX1o7XG4gICAgY29uc3QgQWEgPSB5WzJdIC0geVszXTtcbiAgICBjb25zdCBBZCA9IHdbMl0gLSB3WzNdO1xuICAgIGNvbnN0IEFiID0geFsyXSAtIHhbM107XG4gICAgY29uc3QgQWggPSBzWzJdIC0gc1szXTtcbiAgICBjb25zdCBBYyA9IHhbMl0gKiB5WzNdIC0geVsyXSAqIHhbM107XG4gICAgY29uc3QgQWYgPSB3WzJdICogeVszXSAtIHlbMl0gKiB3WzNdO1xuICAgIGNvbnN0IEFnID0gd1syXSAqIHhbM10gLSB4WzJdICogd1szXTtcbiAgICBjb25zdCBBaSA9IHNbMl0gKiB5WzNdIC0geVsyXSAqIHNbM107XG4gICAgY29uc3QgQWogPSBzWzJdICogeFszXSAtIHhbMl0gKiBzWzNdO1xuICAgIGNvbnN0IEFrID0gd1syXSAqIHNbM10gLSBzWzJdICogd1szXTtcbiAgICBjb25zdCBBbCA9IHhbMl0gKiBzWzNdIC0gc1syXSAqIHhbM107XG4gICAgY29uc3QgQW0gPSB5WzJdICogc1szXSAtIHNbMl0gKiB5WzNdO1xuICAgIFcgPSB4WzFdICogQWEgLSB5WzFdICogQWIgKyBBYztcbiAgICBYID0gd1sxXSAqIEFhIC0geVsxXSAqIEFkICsgQWY7XG4gICAgWSA9IHdbMV0gKiBBYiAtIHhbMV0gKiBBZCArIEFnO1xuICAgIFogPSB3WzFdICogQWMgLSB4WzFdICogQWYgKyB5WzFdICogQWc7XG4gICAgX1MgPSB3WzBdICogVyAtIHhbMF0gKiBYICsgeVswXSAqIFkgLSBaO1xuICAgIFMgPSB4WzFdICogQWEgLSB5WzFdICogQWIgKyBBYztcbiAgICBYID0gc1sxXSAqIEFhIC0geVsxXSAqIEFoICsgQWk7XG4gICAgWSA9IHNbMV0gKiBBYiAtIHhbMV0gKiBBaCArIEFqO1xuICAgIFogPSBzWzFdICogQWMgLSB4WzFdICogQWkgKyB5WzFdICogQWo7XG4gICAgX1cgPSBzWzBdICogUyAtIHhbMF0gKiBYICsgeVswXSAqIFkgLSBaO1xuICAgIFcgPSBzWzFdICogQWEgLSB5WzFdICogQWggKyBBaTtcbiAgICBTID0gd1sxXSAqIEFhIC0geVsxXSAqIEFkICsgQWY7XG4gICAgWSA9IHdbMV0gKiBBaCAtIHNbMV0gKiBBZCArIEFrO1xuICAgIFogPSB3WzFdICogQWkgLSBzWzFdICogQWYgKyB5WzFdICogQWs7XG4gICAgX1ggPSB3WzBdICogVyAtIHNbMF0gKiBTICsgeVswXSAqIFkgLSBaO1xuICAgIFcgPSB4WzFdICogQWggLSBzWzFdICogQWIgKyBBbDtcbiAgICBYID0gd1sxXSAqIEFoIC0gc1sxXSAqIEFkICsgQWs7XG4gICAgUyA9IHdbMV0gKiBBYiAtIHhbMV0gKiBBZCArIEFnO1xuICAgIFogPSB3WzFdICogQWwgLSB4WzFdICogQWsgKyBzWzFdICogQWc7XG4gICAgX1kgPSB3WzBdICogVyAtIHhbMF0gKiBYICsgc1swXSAqIFMgLSBaO1xuICAgIFcgPSB4WzFdICogQW0gLSB5WzFdICogQWwgKyBzWzFdICogQWM7XG4gICAgWCA9IHdbMV0gKiBBbSAtIHlbMV0gKiBBayArIHNbMV0gKiBBZjtcbiAgICBZID0gd1sxXSAqIEFsIC0geFsxXSAqIEFrICsgc1sxXSAqIEFnO1xuICAgIFMgPSB3WzFdICogQWMgLSB4WzFdICogQWYgKyB5WzFdICogQWc7XG4gICAgX1ogPSB3WzBdICogVyAtIHhbMF0gKiBYICsgeVswXSAqIFkgLSBzWzBdICogUztcbiAgICByZXR1cm4gW19XIC8gX1MsIF9YIC8gX1MsIF9ZIC8gX1MsIF9aIC8gX1NdO1xufVxuIiwiZXhwb3J0IGNsYXNzIExvZ0ZhY2FkZSB7XG4gICAgbG9nKG1zZykge1xuICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgIH1cbiAgICB3YXJuKG1zZykge1xuICAgICAgICBjb25zb2xlLndhcm4obXNnKTtcbiAgICB9XG4gICAgZXJyb3IobXNnKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICB9XG59XG4iLCJleHBvcnQgY29uc3QgY3JlYXRlU2hhZGVyID0gKGdsLCB0eXBlLCBzb3VyY2UpID0+IHtcbiAgICB2YXIgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKHR5cGUpO1xuICAgIGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XG4gICAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xuICAgIHZhciBzdWNjZXNzID0gZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpO1xuICAgIGlmIChzdWNjZXNzKSB7XG4gICAgICAgIHJldHVybiBzaGFkZXI7XG4gICAgfVxuICAgIGNvbnNvbGUud2FybihnbC5nZXRFcnJvcigpKTtcbiAgICBnbC5kZWxldGVTaGFkZXIoc2hhZGVyKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gY3JlYXRlIGEgV2ViR0wgc2hhZGVyLlwiKTtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlUHJvZ3JhbSA9IChnbCwgdmVydGV4U2hhZGVyLCBmcmFnbWVudFNoYWRlcikgPT4ge1xuICAgIGNvbnN0IHByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG4gICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZlcnRleFNoYWRlcik7XG4gICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIGZyYWdtZW50U2hhZGVyKTtcbiAgICBnbC5saW5rUHJvZ3JhbShwcm9ncmFtKTtcbiAgICBjb25zdCBzdWNjZXNzID0gZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtLCBnbC5MSU5LX1NUQVRVUyk7XG4gICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgICAgcmV0dXJuIHByb2dyYW07XG4gICAgfVxuICAgIGNvbnNvbGUud2FybihnbC5nZXRFcnJvcigpKTtcbiAgICBnbC5kZWxldGVQcm9ncmFtKHByb2dyYW0pO1xuICAgIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byBjcmVhdGUgYSBXZWJHTCBQcm9ncmFtLlwiKTtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlVGV4dHVyZSA9IChnbCkgPT4ge1xuICAgIGNvbnN0IHRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG4gICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSk7XG4gICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSk7XG4gICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSk7XG4gICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLk5FQVJFU1QpO1xuICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5ORUFSRVNUKTtcbiAgICByZXR1cm4gdGV4dHVyZTtcbn07XG4iLCJpbXBvcnQgRlJBR01FTlRfU0hBREVSIGZyb20gJyEhcmF3LWxvYWRlciEuL2ZyYWdtZW50X3NoYWRlci5mcmFnJztcbmltcG9ydCBWRVJURVhfU0hBREVSIGZyb20gJyEhcmF3LWxvYWRlciEuL3ZlcnRleF9zaGFkZXIudmVydCc7XG5leHBvcnQgeyBGUkFHTUVOVF9TSEFERVIsIFZFUlRFWF9TSEFERVIgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImV4cG9ydCB7IFJleHRFZGl0b3IgfSBmcm9tICcuL2VkaXRvcic7XG4iXSwic291cmNlUm9vdCI6IiJ9