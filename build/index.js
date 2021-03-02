/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var RextEditor;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/fragment_shader.frag":
/*!**********************************!*\
  !*** ./src/fragment_shader.frag ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"/**\\n * David Iglesias. All rights reserved\\n */\\nprecision mediump float;\\n\\n// our texture\\nuniform sampler2D u_image;\\nuniform vec2 u_textureSize;\\nuniform float u_kernel[25];\\nuniform float u_kernelWeight;\\n\\nuniform sampler2D u_lut; \\n\\nuniform float u_saturation;\\nuniform float u_vibrance;\\nuniform float u_brightness;\\nuniform float u_exposure;\\nuniform float u_contrast;\\n\\nuniform float u_dehaze;\\nuniform float u_atmosferic_light;\\nuniform float u_masking;\\nuniform vec3 u_temptint[3]; // RGB temptint, RGB lightFill, RGB darkFill\\nuniform float u_bAndW;\\n\\nuniform float u_hdr;\\n\\n// the texCoords passed in from the vertex shader.\\nvarying vec2 v_texCoord;\\n\\n\\n// Get light match\\nfloat getLightMatch(float val) {\\n\\tfloat _r = texture2D(u_lut, vec2(val, 0.0)).a;\\n\\treturn clamp(_r, 0.0, 1.0);\\n}\\n\\n/**\\n *\\tgetTransmission\\n *  Compute transmission map\\n */\\nfloat getTransmission() {\\n\\tfloat t = 1.0 / 25.0;\\n\\tvec4 center = texture2D(u_image, v_texCoord);\\n\\n\\tvec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\\n\\tfloat dark = 1.0;\\n\\tconst int radius = 1;\\n\\tfor (int ii = -radius; ii <= radius; ii++ ) {\\n\\t\\tfor(int jj = -radius; jj <= radius; jj++) {\\n\\t\\t\\tvec4 pix = texture2D(u_image, v_texCoord + onePixel * vec2( ii,  jj));\\n\\t\\t\\tfloat _min = min(pix.r, min(pix.g, pix.b));\\n\\t\\t\\tif (dark > _min) { dark = _min; }\\n\\t\\t}\\n\\t}\\n\\n\\tfloat darkPix = min(center.r, min(center.g, center.b));\\n\\tfloat diff = abs(darkPix - dark);\\n\\tfloat mask = pow(diff, 3.0);\\n\\tdark = mix(darkPix, dark, mask);\\n\\n\\treturn 1.0 - dark;\\n}\\n\\nfloat getLuma(vec3 rgb_pix) {\\n\\t/* RGB to luminosity. Each channel has different weights */\\n\\treturn dot(rgb_pix, vec3(0.2126, 0.7152, 0.0722));\\n}\\n\\n\\n\\nfloat getV(vec3 pix) {\\n\\treturn max(pix.r, max(pix.g, pix.b));\\n}\\n\\n// Returns min and max value\\nvec2 localContrast() {\\n\\tvec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\\n\\tfloat _min = 1.0;\\n\\tfloat _max = 0.0;\\n\\tfor (int i = -2; i <= 2; i++) {\\n\\t\\tfor(int j = -2; j <= 2; j++) {\\n\\t\\t\\t_max = max(getV(texture2D(u_image, v_texCoord + onePixel * vec2( i,  j)).rgb), _max);\\n\\t\\t\\t_min = min(getV(texture2D(u_image, v_texCoord + onePixel * vec2( i,  j)).rgb), _min);\\n\\t\\t}\\n\\t}\\n\\treturn vec2(_min, _max);\\n}\\n\\nfloat getHDR(float val) {\\n\\n\\t// Contrast stretch \\n\\tfloat midVal = 1.0 - pow(1.0 - pow(val, 0.3), 0.42);\\n\\treturn clamp(midVal, 0.0, 1.0);\\n}\\n\\n\\nvec4 image_process(vec4 PIXEL_COLOR) {\\n\\n\\t/*\\n\\t\\tColor (Hue) preservation: \\n\\t\\t\\tInstead of converting color to a 'hue independent' color space, use\\n\\t  \\tthe maximun value of the rgb channels and the factor.\\n\\t\\t\\tsv_pixel = [(saturation), ('lightness')]\\n\\t*/\\t\\n \\tfloat _max = max(PIXEL_COLOR.r, max(PIXEL_COLOR.g, PIXEL_COLOR.b));\\n \\tfloat _min = min(PIXEL_COLOR.r, min(PIXEL_COLOR.g, PIXEL_COLOR.b));\\n \\tvec2 sv_pixel = vec2(1.0 - _min / _max, _max);\\n\\n\\tsv_pixel.y = getLightMatch(sv_pixel.y);\\n\\n\\tif (u_vibrance != 1.0) { /* Apply vibrance */\\n\\t\\tsv_pixel.x = pow(sv_pixel.x, u_vibrance);\\n\\t}\\n\\n\\tif (u_saturation != 0.0) { /* Apply saturation */\\n\\t\\tsv_pixel.x += u_saturation;\\n\\t}\\n\\n\\t/* Value constraints [0, 1]: Prevents saturation */\\n\\tsv_pixel.x = clamp(sv_pixel.x, 0.0, 1.0);\\n\\n\\tsv_pixel.y = pow(sv_pixel.y, 1.0 - u_brightness * 0.6);\\n\\n\\t/* High Dynamic Range 'effect' */\\n\\tif (u_hdr != 0.0) {\\n\\t\\tsv_pixel.y = mix(sv_pixel.y, getHDR(sv_pixel.y), u_hdr);\\n\\t}\\n\\n\\tfloat contrast = u_contrast + 1.0;\\n\\tsv_pixel.y = contrast * (sv_pixel.y - 0.5) + 0.5;\\n\\tsv_pixel.x = clamp(sv_pixel.x, 0.0, 1.0);\\n\\tsv_pixel.y = clamp(sv_pixel.y, 0.0, 1.0);\\n\\t\\n\\t// Transform sv to rgb\\n\\tvec3 rgb_pix = vec3(PIXEL_COLOR.r, PIXEL_COLOR.g, PIXEL_COLOR.b);\\n\\tif (sv_pixel.x > 0.0) {\\n\\t\\tfloat k = - sv_pixel.x / (1.0 - _min / _max);\\n\\t\\t// Update saturation\\n\\t\\trgb_pix = (_max - rgb_pix) * k + _max;\\n\\t\\t// Update value\\n\\t\\trgb_pix *= sv_pixel.y / _max;\\n\\t} else {\\n\\t\\trgb_pix.r = rgb_pix.g = rgb_pix.b = sv_pixel.y;\\n\\t}\\n\\n\\t/* Now we dont need constant hue. Usiing rgb space */\\n\\n\\tif (u_dehaze != 0.0) { /* Dehaze small algorightm */\\n\\t\\tfloat transmision = getTransmission();\\n\\t\\tfloat mm = max(transmision, 0.2);\\n\\t\\trgb_pix = mix(rgb_pix, ((rgb_pix - u_atmosferic_light) / mm + u_atmosferic_light), u_dehaze); \\n\\t}\\n\\n\\trgb_pix += u_exposure; /* Exposure as simply add a value to the channels */\\n\\n\\trgb_pix = clamp(rgb_pix, 0.0, 1.0);\\t\\n\\n\\t// Temptint operations (TINT AND TEMPERATURE)\\n\\trgb_pix *= u_temptint[0];\\n\\n\\t// Lightfill operations\\n\\tfloat mono = getLuma(rgb_pix);\\n\\trgb_pix += mix(u_temptint[2], u_temptint[1], mono);\\n\\t\\n\\t// Black and White\\n\\tif (u_bAndW != 0.0) {\\n\\t\\trgb_pix.r = mix(rgb_pix.r, mono, u_bAndW);\\n\\t\\trgb_pix.g = mix(rgb_pix.g, mono, u_bAndW);\\n\\t\\trgb_pix.b = mix(rgb_pix.b, mono, u_bAndW);\\n\\t}\\n\\n\\treturn vec4(rgb_pix, 1.0);\\n}\\n\\nvoid main() {\\n  vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\\n  vec4 center = texture2D(u_image, v_texCoord);\\n\\n  // \\n  // 5x5 kernel \\n  vec4 colorSum =\\n  \\ttexture2D(u_image, v_texCoord + onePixel * vec2(-2, -2)) * u_kernel[0] +\\n    texture2D(u_image, v_texCoord + onePixel * vec2( -1, -2)) * u_kernel[1] +\\n    texture2D(u_image, v_texCoord + onePixel * vec2( 0, -2)) * u_kernel[2] +\\n    texture2D(u_image, v_texCoord + onePixel * vec2( 1, -2)) * u_kernel[3] +\\n    texture2D(u_image, v_texCoord + onePixel * vec2( 2, -2)) * u_kernel[4] +\\n\\n    texture2D(u_image, v_texCoord + onePixel * vec2( -2, -1)) * u_kernel[5] +\\n    texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)) * u_kernel[6] +\\n    texture2D(u_image, v_texCoord + onePixel * vec2( 0, -1)) * u_kernel[7] +\\n    texture2D(u_image, v_texCoord + onePixel * vec2( 1, -1)) * u_kernel[8] +\\n    texture2D(u_image, v_texCoord + onePixel * vec2( 2, -1)) * u_kernel[9] +\\n\\n    texture2D(u_image, v_texCoord + onePixel * vec2( -2, 0)) * u_kernel[10] +\\n    texture2D(u_image, v_texCoord + onePixel * vec2(-1,  0)) * u_kernel[11] +\\n    texture2D(u_image, v_texCoord + onePixel * vec2( 0,  0)) * u_kernel[12] + // Center\\n    texture2D(u_image, v_texCoord + onePixel * vec2( 1,  0)) * u_kernel[13] +\\n    texture2D(u_image, v_texCoord + onePixel * vec2( 2, 0)) * u_kernel[14] +\\n\\n    texture2D(u_image, v_texCoord + onePixel * vec2(-2,  1)) * u_kernel[15] +\\n    texture2D(u_image, v_texCoord + onePixel * vec2(-1,  1)) * u_kernel[16] +\\n    texture2D(u_image, v_texCoord + onePixel * vec2( 0,  1)) * u_kernel[17] +\\n    texture2D(u_image, v_texCoord + onePixel * vec2( 1,  1)) * u_kernel[18] +\\n    texture2D(u_image, v_texCoord + onePixel * vec2( 2,  1)) * u_kernel[19] +\\n\\n    texture2D(u_image, v_texCoord + onePixel * vec2(-2,  2)) * u_kernel[20] +\\n    texture2D(u_image, v_texCoord + onePixel * vec2(-1,  2)) * u_kernel[21] +\\n    texture2D(u_image, v_texCoord + onePixel * vec2( 0,  2)) * u_kernel[22] +\\n    texture2D(u_image, v_texCoord + onePixel * vec2( 1,  2)) * u_kernel[23] +\\n    texture2D(u_image, v_texCoord + onePixel * vec2( 2,  2)) * u_kernel[24];\\n\\n\\n\\n\\n  vec4 masking = mix(center, vec4((colorSum / u_kernelWeight).rgb, 1), u_masking);\\n\\n  gl_FragColor = image_process(masking);\\n}\\n\");\n\n//# sourceURL=webpack://RextEditor/./src/fragment_shader.frag?");

/***/ }),

/***/ "./src/vertex_shader.vert":
/*!********************************!*\
  !*** ./src/vertex_shader.vert ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"attribute vec2 a_position;\\nattribute vec2 a_texCoord;\\nuniform vec2 u_resolution;\\nvarying vec2 v_texCoord;\\nvoid main() {\\n   vec2 dist = a_position / u_resolution;\\n   gl_Position = vec4( (dist * 2.0 - 1.0) * vec2(1, -1), 0, 1);\\n   v_texCoord = a_texCoord;\\n}\\n\");\n\n//# sourceURL=webpack://RextEditor/./src/vertex_shader.vert?");

/***/ }),

/***/ "./src/color.ts":
/*!**********************!*\
  !*** ./src/color.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getLuma\": () => (/* binding */ getLuma),\n/* harmony export */   \"hsv2rgb\": () => (/* binding */ hsv2rgb),\n/* harmony export */   \"asArray\": () => (/* binding */ asArray)\n/* harmony export */ });\n/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math */ \"./src/math.ts\");\n/**\n * Color space functions\n */\n\nvar getLuma = function (rgb_pix) {\n    return 0.2126 * rgb_pix.x + 0.7152 * rgb_pix.y + 0.0722 * rgb_pix.z;\n};\nvar hsv2rgb = function (pixel_hsv) {\n    var a, d, c;\n    var r, g, b;\n    a = pixel_hsv.z * pixel_hsv.y;\n    d = a * (1.0 - Math.abs((pixel_hsv.x / 60.0) % 2.0 - 1.0));\n    c = pixel_hsv.z - a;\n    if (pixel_hsv.x < 180.0) {\n        if (pixel_hsv.x < 60.0) {\n            r = pixel_hsv.z;\n            g = d + c;\n            b = c;\n        }\n        else if (pixel_hsv.x < 120.0) {\n            r = d + c;\n            g = pixel_hsv.z;\n            b = c;\n        }\n        else {\n            r = c;\n            g = pixel_hsv.z;\n            b = d + c;\n        }\n    }\n    else {\n        if (pixel_hsv.x < 240.0) {\n            r = c;\n            g = d + c;\n            b = pixel_hsv.z;\n        }\n        else if (pixel_hsv.x < 300.0) {\n            r = d + c;\n            g = c;\n            b = a + c;\n        }\n        else {\n            r = a + c;\n            g = c;\n            b = d + c;\n        }\n    }\n    r = (0,_math__WEBPACK_IMPORTED_MODULE_0__.clamp)(r, 0.0, 1.0);\n    g = (0,_math__WEBPACK_IMPORTED_MODULE_0__.clamp)(g, 0.0, 1.0);\n    b = (0,_math__WEBPACK_IMPORTED_MODULE_0__.clamp)(b, 0.0, 1.0);\n    return { x: r, y: g, z: b };\n};\nvar asArray = function (vec) { return [vec.x, vec.y, vec.z]; };\n\n\n//# sourceURL=webpack://RextEditor/./src/color.ts?");

/***/ }),

/***/ "./src/editor.ts":
/*!***********************!*\
  !*** ./src/editor.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"RextEditor\": () => (/* binding */ RextEditor)\n/* harmony export */ });\n/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math */ \"./src/math.ts\");\n/* harmony import */ var _params__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./params */ \"./src/params.ts\");\n/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./color */ \"./src/color.ts\");\n\n\n\nvar FRAGMENT_SHADER = __webpack_require__(/*! ./fragment_shader.frag */ \"./src/fragment_shader.frag\").default;\nvar VERTEX_SHADER = __webpack_require__(/*! ./vertex_shader.vert */ \"./src/vertex_shader.vert\").default;\nfunction isWindow() {\n    return window !== undefined;\n}\nfunction getRequestAnimationFrame() {\n    var fallbackFunction = function (fn) { setTimeout(fn, 20); };\n    if (!isWindow()) {\n        return fallbackFunction;\n    }\n    return window.requestAnimationFrame ||\n        window.mozRequestAnimationFrame ||\n        window.webkitRequestAnimationFrame ||\n        window.msRequestAnimationFrame ||\n        fallbackFunction;\n}\nvar RAF = getRequestAnimationFrame();\nvar clone = function (obj) { return JSON.parse(JSON.stringify(obj)); };\nvar parameters = clone(_params__WEBPACK_IMPORTED_MODULE_1__.defaults);\nvar realImage = null;\nvar LogFacade = /** @class */ (function () {\n    function LogFacade() {\n    }\n    LogFacade.prototype.log = function (msg) {\n        console.log(msg);\n    };\n    LogFacade.prototype.warn = function (msg) {\n        console.warn(msg);\n    };\n    LogFacade.prototype.error = function (msg) {\n        console.error(msg);\n    };\n    return LogFacade;\n}());\n/* BEGIN WEBGL PART */\nvar RextEditor = /** @class */ (function () {\n    function RextEditor(canvas, config) {\n        this.params = clone(_params__WEBPACK_IMPORTED_MODULE_1__.defaults);\n        this.gl = null;\n        this.program = null;\n        this.pointers = {\n            positionLocation: null,\n            positionBuffer: null,\n            texcoordLocation: null,\n            texcoordBuffer: null,\n            resolutionLocation: null,\n            textureSizeLocation: null,\n            kernelLocation: null,\n            kernelWeightLocation: null,\n            u_exposure: null,\n            u_brightness: null,\n            u_contrast: null,\n            u_saturation: null,\n            u_masking: null,\n            u_dehaze: null,\n            u_atmosferic_light: null,\n            u_temptint: null,\n            u_bAndW: null,\n            u_hdr: null,\n            u_lut: null,\n            u_image: null,\n        };\n        this.WIDTH = 0;\n        this.HEIGHT = 0;\n        this.log = new LogFacade();\n        this.config = {\n            resolutionLimit: 1000000,\n            editionResolutionLimit: 1000000,\n        };\n        this.uniforms = {\n            kernel: [\n                0, 0, 0, 0, 0,\n                0, 0, 0, 0, 0,\n                0, 0, 1, 0, 0,\n                0, 0, 0, 0, 0,\n                0, 0, 0, 0, 0\n            ],\n            temptint: [1, 1, 1]\n        };\n        this.LIGHT_MATCH = (function () {\n            var _r = [];\n            for (var i = 0; i < 256; i++) {\n                _r[i] = i;\n            }\n            return _r;\n        })();\n        console.log(\"Constructor called\");\n        this.gl = canvas.getContext(\"webgl\") || canvas.getContext(\"experimental-webgl\");\n        if (config) {\n            this.config = config;\n        }\n    }\n    RextEditor.prototype.updateParam = function (param, value) {\n        var keys = Object.keys(this.params);\n        if (keys.includes(param)) {\n            // @ts-ignore\n            this.params[param] = value;\n            this.update();\n        }\n        else {\n            this.log.error(\"Param \" + param + \" does not exists\");\n        }\n    };\n    RextEditor.prototype.load = function (url) {\n        var _this = this;\n        // Save real image as a copy\n        realImage = new Image();\n        realImage.src = url;\n        realImage.onload = function () {\n            if (realImage.width * realImage.height > _this.config.resolutionLimit) {\n                var K = realImage.height / realImage.width;\n                realImage.height = Math.floor(Math.sqrt(K * _this.config.resolutionLimit));\n                realImage.width = Math.floor(realImage.height / K);\n            }\n        };\n        var img = new Image();\n        // Some JPG files are not accepted by graphic card,\n        // the following code are to convert it to png image\n        img.onerror = function () {\n            _this.log.error(\"Error al cargar la imagen.\");\n        };\n        img.onload = function () {\n            try {\n                var canvas = document.createElement(\"canvas\");\n                if (img.height * img.width > _this.config.editionResolutionLimit) {\n                    var _H = Math.sqrt(_this.config.editionResolutionLimit * img.height / img.width);\n                    var _W = img.width / img.height * _H;\n                    canvas.width = _W;\n                    canvas.height = _H;\n                }\n                else {\n                    canvas.width = img.width;\n                    canvas.height = img.height;\n                }\n                var resizeImageCanvas = canvas.getContext(\"2d\");\n                resizeImageCanvas.imageSmoothingEnabled = true;\n                resizeImageCanvas.drawImage(img, 0, 0, canvas.width, canvas.height);\n                var _img_1 = new Image();\n                _img_1.src = canvas.toDataURL(\"image/png\");\n                _img_1.onload = function () {\n                    _this.render(_img_1);\n                };\n            }\n            catch (err) {\n                _this.log.error(err);\n            }\n        };\n        img.src = url;\n    };\n    RextEditor.prototype.setLog = function (log) {\n        this.log = log;\n    };\n    RextEditor.prototype.updateKernel = function () {\n        // 3x3 kernel\n        var sharpness = -this.params.sharpen;\n        var radius = this.params.sharpen_radius;\n        var radiance = this.params.radiance;\n        var hdr = this.params.hdr;\n        if (radiance != 0) {\n            sharpness -= 0.5 * radiance;\n            radius += 0.5 * radiance;\n        }\n        if (hdr != 0) {\n            sharpness -= 0.5 * hdr;\n            radius += 0.5 * hdr;\n        }\n        var A = sharpness * Math.exp(-Math.pow(1 / radius, 2));\n        var B = sharpness * Math.exp(-Math.pow(1.41 / radius, 2));\n        var C = sharpness * Math.exp(-Math.pow(2 / radius, 2));\n        var D = sharpness * Math.exp(-Math.pow(2.24 / radius, 2));\n        var E = sharpness * Math.exp(-Math.pow(2.83 / radius, 2));\n        var X = 1;\n        if (sharpness < 0) {\n            X += 4 * Math.abs(E) + 8 * Math.abs(D) + 4 * Math.abs(C) + 4 * Math.abs(B) + 4 * Math.abs(A);\n        }\n        this.uniforms.kernel = [E, D, C, D, E,\n            D, B, A, B, D,\n            C, A, X, A, C,\n            D, B, A, B, D,\n            E, D, C, D, E];\n    };\n    // Temp and Tint\n    RextEditor.prototype.updateTemptint = function () {\n        var T = this.params.temperature;\n        var tint = this.params.tint;\n        var R, G, B;\n        if (T < 0) {\n            R = 1;\n            var i = TEMP_DATA[Math.floor((T + 1) * 100)]; // Tab values, algorithm is hard\n            G = i[0];\n            B = i[1];\n        }\n        else {\n            R = 0.0438785 / (Math.pow(T + 0.150127, 1.23675)) + 0.543991;\n            G = 0.0305003 / (Math.pow(T + 0.163976, 1.23965)) + 0.69136;\n            B = 1;\n        }\n        if (tint == -1) { // HACK\n            tint = -0.99;\n        }\n        G += tint;\n        // Luma correction\n        var curr_luma = (0,_color__WEBPACK_IMPORTED_MODULE_2__.getLuma)({ x: R, y: G, z: B });\n        var mult_K = 1 / curr_luma;\n        // TODO\n        this.uniforms.temptint = [R * mult_K, G * mult_K, B * mult_K];\n    };\n    /**\n     * Lightning generation:\n     * Map brightness values depending on Brightness, Contrast... etc\n     */\n    RextEditor.prototype.generateLightningfunction = function () {\n        var blacks = this.params.blacks;\n        var shadows = this.params.shadows;\n        var highlights = this.params.highlights;\n        var whites = this.params.whites;\n        var radiance = this.params.radiance;\n        var f = (0,_math__WEBPACK_IMPORTED_MODULE_0__.getCuadraticFunction)(blacks, shadows + 0.33, highlights + 0.66, whites + 1, 0, 0.33, 0.66, 1);\n        // Radiance part\n        if (radiance != 0) {\n            var f_radiance = (0,_math__WEBPACK_IMPORTED_MODULE_0__.getCuadraticFunction)(0, 0.33 - radiance * 0.11, 0.66 + radiance * 0.11, 1, 0, 0.33, 0.66, 1);\n        }\n        for (var i = 0; i < 256; i++) {\n            var pixel_value = i / 256;\n            // Brightness\n            if (pixel_value > 1) {\n                pixel_value = 1;\n            }\n            if (pixel_value < 0) {\n                pixel_value = 0;\n            }\n            // Contrast\n            if (pixel_value > 1) {\n                pixel_value = 1;\n            }\n            if (pixel_value < 0) {\n                pixel_value = 0;\n            }\n            if (f_radiance) {\n                pixel_value = f_radiance(pixel_value);\n            }\n            pixel_value = f(pixel_value);\n            if (pixel_value > 1) {\n                pixel_value = 1;\n            }\n            if (pixel_value < 0) {\n                pixel_value = 0;\n            }\n            this.LIGHT_MATCH[i] = pixel_value * 255;\n        }\n    };\n    /**\n     * kernelNormalization\n     * Compute the total weight of the kernel in order to normalize it\n     */\n    RextEditor.prototype.kernelNormalization = function (kernel) {\n        return kernel.reduce(function (a, b) { return a + b; });\n    };\n    /**\n     * render\n     * Prepare the environment to edit the image\n     * image: Image element to edit (Image object)\n     * context: webgl context. Default: __window.gl\n     * SET_FULL_RES: no resize the image to edit. Default: false (resize the image)\n     */\n    RextEditor.prototype.render = function (image, preventRenderImage) {\n        // Load GSLS programs\n        var VERTEX_SHADER_CODE = createShader(this.gl, this.gl.VERTEX_SHADER, VERTEX_SHADER);\n        var FRAGMENT_SHADER_CODE = createShader(this.gl, this.gl.FRAGMENT_SHADER, FRAGMENT_SHADER);\n        try {\n            this.program = createProgram(this.gl, VERTEX_SHADER_CODE, FRAGMENT_SHADER_CODE);\n        }\n        catch (err) {\n            return this.log.error(err);\n        }\n        // look up where the vertex data needs to go.\n        this.pointers.positionLocation = this.gl.getAttribLocation(this.program, \"a_position\");\n        this.pointers.texcoordLocation = this.gl.getAttribLocation(this.program, \"a_texCoord\");\n        // Create a buffer to put three 2d clip space points in\n        this.pointers.positionBuffer = this.gl.createBuffer();\n        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)\n        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointers.positionBuffer);\n        // Set a rectangle the same size as the image.\n        this.WIDTH = image.width;\n        this.HEIGHT = image.height;\n        this.gl.canvas.width = this.WIDTH;\n        this.gl.canvas.height = this.HEIGHT;\n        console.log(\"[IMAGE] width = \" + this.WIDTH + \", height = \" + this.HEIGHT);\n        this.setRectangle(0, 0, this.WIDTH, this.HEIGHT);\n        // Create the rectangle \n        this.pointers.texcoordBuffer = this.gl.createBuffer();\n        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointers.texcoordBuffer);\n        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([\n            0.0, 0.0,\n            1.0, 0.0,\n            0.0, 1.0,\n            0.0, 1.0,\n            1.0, 0.0,\n            1.0, 1.0,\n        ]), this.gl.STATIC_DRAW);\n        this.gl.activeTexture(this.gl.TEXTURE0);\n        var originalImageTexture = createTexture(this.gl);\n        // Upload the image into the texture.\n        try {\n            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);\n        }\n        catch (err) {\n            return this.log.error(err);\n        }\n        this.pointers.u_image = this.gl.getUniformLocation(this.program, \"u_image\");\n        // lookup uniforms\n        this.pointers.resolutionLocation = this.gl.getUniformLocation(this.program, \"u_resolution\");\n        this.pointers.textureSizeLocation = this.gl.getUniformLocation(this.program, \"u_textureSize\");\n        this.pointers.kernelLocation = this.gl.getUniformLocation(this.program, \"u_kernel[0]\");\n        this.pointers.kernelWeightLocation = this.gl.getUniformLocation(this.program, \"u_kernelWeight\");\n        this.pointers.u_exposure = this.gl.getUniformLocation(this.program, \"u_exposure\");\n        this.pointers.u_brightness = this.gl.getUniformLocation(this.program, \"u_brightness\");\n        this.pointers.u_contrast = this.gl.getUniformLocation(this.program, \"u_contrast\");\n        this.pointers.u_saturation = this.gl.getUniformLocation(this.program, \"u_saturation\");\n        this.pointers.u_masking = this.gl.getUniformLocation(this.program, \"u_masking\");\n        this.pointers.u_dehaze = this.gl.getUniformLocation(this.program, \"u_dehaze\");\n        this.pointers.u_atmosferic_light = this.gl.getUniformLocation(this.program, \"u_atmosferic_light\");\n        this.pointers.u_temptint = this.gl.getUniformLocation(this.program, \"u_temptint[0]\");\n        this.pointers.u_bAndW = this.gl.getUniformLocation(this.program, \"u_bAndW\");\n        this.pointers.u_hdr = this.gl.getUniformLocation(this.program, \"u_hdr\");\n        this.pointers.u_lut = this.gl.getUniformLocation(this.program, \"u_lut\");\n        // Upload the LUT (contrast, brightness...)\n        this.gl.activeTexture(this.gl.TEXTURE1);\n        var LUTTexture = createTexture(this.gl);\n        this.gl.viewport(0, 0, this.WIDTH, this.HEIGHT);\n        this.gl.clearColor(0, 0, 0, 0);\n        this.gl.clear(this.gl.COLOR_BUFFER_BIT);\n        if (!preventRenderImage) {\n            this.update();\n        }\n    };\n    RextEditor.prototype.update = function () {\n        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.ALPHA, 256, 1, 0, this.gl.ALPHA, this.gl.UNSIGNED_BYTE, new Uint8Array(this.LIGHT_MATCH));\n        // Tell it to use our this.program (pair of shaders)\n        this.gl.useProgram(this.program);\n        // Turn on the position attribute\n        this.gl.enableVertexAttribArray(this.pointers.positionLocation);\n        // Bind the position buffer.\n        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointers.positionBuffer);\n        this.gl.vertexAttribPointer(this.pointers.positionLocation, 2, this.gl.FLOAT, false, 0, 0);\n        // Turn on the teccord attribute\n        this.gl.enableVertexAttribArray(this.pointers.texcoordLocation);\n        // Bind the position buffer.\n        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointers.texcoordBuffer);\n        this.gl.vertexAttribPointer(this.pointers.texcoordLocation, 2, this.gl.FLOAT, false, 0, 0);\n        // set the resolution\n        this.gl.uniform2f(this.pointers.resolutionLocation, this.WIDTH, this.HEIGHT); //this.gl.canvas.width, this.gl.canvas.height);\n        // set the size of the image\n        this.gl.uniform2f(this.pointers.textureSizeLocation, this.WIDTH, this.HEIGHT);\n        // Set the contrast\n        this.gl.uniform1f(this.pointers.u_brightness, this.params.brightness);\n        //this.gl.uniform1f(this.pointers.u_contrast, this.params.contrast);\n        this.gl.uniform1f(this.pointers.u_exposure, this.params.exposure);\n        this.gl.uniform1f(this.pointers.u_contrast, this.params.contrast);\n        this.gl.uniform1f(this.pointers.u_saturation, this.params.saturation);\n        this.gl.uniform1f(this.pointers.u_masking, this.params.masking);\n        this.gl.uniform1f(this.pointers.u_dehaze, this.params.dehaze);\n        this.gl.uniform1f(this.pointers.u_atmosferic_light, this.params.atmosferic_light);\n        this.gl.uniform3fv(this.pointers.u_temptint, this.uniforms.temptint\n            .concat((0,_color__WEBPACK_IMPORTED_MODULE_2__.asArray)((0,_color__WEBPACK_IMPORTED_MODULE_2__.hsv2rgb)({ x: this.params.lightColor * 360, y: this.params.lightSat, z: this.params.lightFill })))\n            .concat((0,_color__WEBPACK_IMPORTED_MODULE_2__.asArray)((0,_color__WEBPACK_IMPORTED_MODULE_2__.hsv2rgb)({ x: this.params.darkColor * 360, y: this.params.darkSat, z: this.params.darkFill })))); // vec3 x3\n        this.gl.uniform1f(this.pointers.u_bAndW, this.params.bAndW);\n        this.gl.uniform1f(this.pointers.u_hdr, this.params.hdr);\n        // Show image\n        this.gl.uniform1i(this.pointers.u_image, 0); // TEXTURE 0\n        this.gl.uniform1i(this.pointers.u_lut, 1); // TEXTURE 1\n        // set the kernel and it's weight\n        this.gl.uniform1fv(this.pointers.kernelLocation, this.uniforms.kernel);\n        this.gl.uniform1f(this.pointers.kernelWeightLocation, this.kernelNormalization(this.uniforms.kernel));\n        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);\n    };\n    RextEditor.prototype.setRectangle = function (x, y, width, height) {\n        var x1 = x;\n        var x2 = x + width;\n        var y1 = y;\n        var y2 = y + height;\n        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([\n            x1, y1,\n            x2, y1,\n            x1, y2,\n            x1, y2,\n            x2, y1,\n            x2, y2,\n        ]), this.gl.STATIC_DRAW);\n    };\n    return RextEditor;\n}());\n\nfunction createShader(gl, type, source) {\n    var shader = gl.createShader(type);\n    gl.shaderSource(shader, source);\n    gl.compileShader(shader);\n    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);\n    if (success) {\n        return shader;\n    }\n    console.log(gl.getShaderInfoLog(shader));\n    gl.deleteShader(shader);\n}\nfunction createProgram(gl, vertexShader, fragmentShader) {\n    var program = gl.createProgram();\n    gl.attachShader(program, vertexShader);\n    gl.attachShader(program, fragmentShader);\n    gl.linkProgram(program);\n    var success = gl.getProgramParameter(program, gl.LINK_STATUS);\n    if (success) {\n        return program;\n    }\n    console.log(gl.getProgramInfoLog(program));\n    gl.deleteProgram(program);\n}\nfunction createTexture(gl) {\n    var texture = gl.createTexture();\n    gl.bindTexture(gl.TEXTURE_2D, texture);\n    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);\n    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);\n    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);\n    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);\n    return texture;\n}\n\n\n//# sourceURL=webpack://RextEditor/./src/editor.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"RextEditor\": () => (/* reexport safe */ _editor__WEBPACK_IMPORTED_MODULE_0__.RextEditor)\n/* harmony export */ });\n/* harmony import */ var _editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./editor */ \"./src/editor.ts\");\n\n\n\n\n//# sourceURL=webpack://RextEditor/./src/index.ts?");

/***/ }),

/***/ "./src/math.ts":
/*!*********************!*\
  !*** ./src/math.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"clamp\": () => (/* binding */ clamp),\n/* harmony export */   \"getCuadraticFunction\": () => (/* binding */ getCuadraticFunction)\n/* harmony export */ });\nvar clamp = function (a, b, c) {\n    return (a < b) ? b : (a > c) ? c : a;\n};\nfunction resTreatment(arr) {\n    var l = arr.length;\n    for (var i = 0; i < l; i++) {\n        arr[i] = Math.round(arr[i] * 1000) / 1000;\n    }\n    return arr;\n}\n;\nvar getCuadraticFunction = function (a, b, c, d, aa, bb, cc, dd) {\n    if (aa === void 0) { aa = 0; }\n    if (bb === void 0) { bb = 0.33; }\n    if (cc === void 0) { cc = 0.66; }\n    if (dd === void 0) { dd = 1; }\n    var aaS = Math.pow(aa, 2);\n    var bbS = Math.pow(bb, 2);\n    var ccS = Math.pow(cc, 2);\n    var ddS = Math.pow(dd, 2);\n    var aaT = aaS * aa;\n    var bbT = bbS * bb;\n    var ccT = ccS * cc;\n    var ddT = ddS * dd;\n    var res = resTreatment(solve4x4([aaT, bbT, ccT, ddT], [aaS, bbS, ccS, ddS], [aa, bb, cc, dd], [a, b, c, d]));\n    return function (x) {\n        var _r = res[3];\n        var xx = x;\n        _r += res[2] * xx;\n        xx *= x;\n        _r += res[1] * xx;\n        xx *= x;\n        _r += res[0] * xx;\n        return _r;\n    };\n};\nfunction solve4x4(w, x, y, s) {\n    var S, W, X, Y, Z;\n    var _S, _W, _X, _Y, _Z;\n    var Aa = y[2] - y[3];\n    var Ad = w[2] - w[3];\n    var Ab = x[2] - x[3];\n    var Ah = s[2] - s[3];\n    var Ac = x[2] * y[3] - y[2] * x[3];\n    var Af = w[2] * y[3] - y[2] * w[3];\n    var Ag = w[2] * x[3] - x[2] * w[3];\n    var Ai = s[2] * y[3] - y[2] * s[3];\n    var Aj = s[2] * x[3] - x[2] * s[3];\n    var Ak = w[2] * s[3] - s[2] * w[3];\n    var Al = x[2] * s[3] - s[2] * x[3];\n    var Am = y[2] * s[3] - s[2] * y[3];\n    W = x[1] * Aa - y[1] * Ab + Ac;\n    X = w[1] * Aa - y[1] * Ad + Af;\n    Y = w[1] * Ab - x[1] * Ad + Ag;\n    Z = w[1] * Ac - x[1] * Af + y[1] * Ag;\n    _S = w[0] * W - x[0] * X + y[0] * Y - Z;\n    S = x[1] * Aa - y[1] * Ab + Ac;\n    X = s[1] * Aa - y[1] * Ah + Ai;\n    Y = s[1] * Ab - x[1] * Ah + Aj;\n    Z = s[1] * Ac - x[1] * Ai + y[1] * Aj;\n    _W = s[0] * S - x[0] * X + y[0] * Y - Z;\n    W = s[1] * Aa - y[1] * Ah + Ai;\n    S = w[1] * Aa - y[1] * Ad + Af;\n    Y = w[1] * Ah - s[1] * Ad + Ak;\n    Z = w[1] * Ai - s[1] * Af + y[1] * Ak;\n    _X = w[0] * W - s[0] * S + y[0] * Y - Z;\n    W = x[1] * Ah - s[1] * Ab + Al;\n    X = w[1] * Ah - s[1] * Ad + Ak;\n    S = w[1] * Ab - x[1] * Ad + Ag;\n    Z = w[1] * Al - x[1] * Ak + s[1] * Ag;\n    _Y = w[0] * W - x[0] * X + s[0] * S - Z;\n    W = x[1] * Am - y[1] * Al + s[1] * Ac;\n    X = w[1] * Am - y[1] * Ak + s[1] * Af;\n    Y = w[1] * Al - x[1] * Ak + s[1] * Ag;\n    S = w[1] * Ac - x[1] * Af + y[1] * Ag;\n    _Z = w[0] * W - x[0] * X + y[0] * Y - s[0] * S;\n    return [_W / _S, _X / _S, _Y / _S, _Z / _S];\n}\n\n\n//# sourceURL=webpack://RextEditor/./src/math.ts?");

/***/ }),

/***/ "./src/params.ts":
/*!***********************!*\
  !*** ./src/params.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"defaults\": () => (/* binding */ defaults)\n/* harmony export */ });\nvar defaults = {\n    hdr: 0,\n    exposure: 0,\n    temperature: 0,\n    tint: 0,\n    brightness: 0,\n    saturation: 0,\n    contrast: 0,\n    sharpen: 0,\n    masking: 0,\n    sharpen_radius: 0,\n    radiance: 0,\n    highlights: 0,\n    shadows: 0,\n    whites: 0,\n    blacks: 0,\n    dehaze: 0,\n    bAndW: 0,\n    atmosferic_light: 0,\n    lightFill: 0,\n    lightColor: 0,\n    lightSat: 1,\n    darkFill: 0,\n    darkColor: 0,\n    darkSat: 1\n};\n\n\n//# sourceURL=webpack://RextEditor/./src/params.ts?");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	RextEditor = __webpack_exports__;
/******/ 	
/******/ })()
;