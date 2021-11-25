var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { asArray, hsv2rgb } from './lib/color';
import { defaultConfig, defaultParams, paramsCallbacks } from './lib/constants';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './shaders/index';
import { LogFacade } from './log/LogFacade';
import { computeKernel, lightning, sumArray, tempTint } from './lib/image-transforms';
import { createProgram, createShader, createTexture } from './shaders';
import { Context } from './lib/context';
var clone = function (obj) { return JSON.parse(JSON.stringify(obj)); };
var CANVAS_OPTIONS = {
    alpha: false,
    antialias: false,
};
/* BEGIN WEBGL PART */
var RextEditor = /** @class */ (function () {
    function RextEditor(canvas) {
        this.params = clone(defaultParams);
        this.program = null;
        this.realImage = null;
        this.currentImage = null;
        this.context = null;
        this.config = defaultConfig;
        this.onParamsChangeCallbacks = [];
        this.WIDTH = 0;
        this.HEIGHT = 0;
        this.log = new LogFacade();
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
        this.LIGHT_MATCH = new Array(256).fill(0).map(function (v, i) { return i; });
        if (canvas) {
            this.setCanvas(canvas);
        }
    }
    RextEditor.prototype.setCanvas = function (canvas) {
        this.config.width = canvas.width;
        this.config.height = canvas.height;
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl", CANVAS_OPTIONS) || canvas.getContext("experimental-webgl", CANVAS_OPTIONS);
    };
    RextEditor.prototype.runCallback = function (callbackName) {
        switch (callbackName) {
            case "generateLightning":
                this.generateLightning();
            case "kernel_update":
                this.uniforms.kernel = computeKernel(this.params);
            case "updateTemptint":
                this.updateTemptint();
                return;
        }
        this.log.warn("No callback " + callbackName + " exists");
    };
    RextEditor.prototype.onParamsChange = function (callback) {
        this.onParamsChangeCallbacks.push(callback);
    };
    RextEditor.prototype.updateParams = function (params) {
        var _this = this;
        /* Calculate difference */
        var updateKeys = Object.keys(this.params).filter(function (paramKey) {
            return _this.params[paramKey] !== params[paramKey];
        });
        updateKeys.forEach(function (paramKey) {
            _this._updateParam(paramKey, params[paramKey]);
        });
        var updates = this.getCallbacks(updateKeys);
        /* Update with callbacks */
        updates.forEach(function (callbackName) {
            _this.runCallback(callbackName);
        });
        this.update();
        this.onParamsChangeCallbacks.forEach(function (callback) {
            if (callback) {
                try {
                    callback(_this.params);
                }
                catch (err) {
                    // Ignored
                }
            }
        });
    };
    RextEditor.prototype.getCallbacks = function (updatedParams) {
        var callbacks = new Set(updatedParams.filter(function (key) { return paramsCallbacks[key] !== undefined && paramsCallbacks[key] !== null; })
            .map(function (key) { return paramsCallbacks[key]; })
            .reduce(function (acc, v) { return acc.concat(v); }, []));
        return Array.from(callbacks);
    };
    // Do not call this method from any other function than updateParams
    RextEditor.prototype._updateParam = function (param, value) {
        var keys = Object.keys(this.params);
        if (keys.includes(param)) {
            // @ts-ignore
            this.params[param] = value;
        }
        else {
            this.log.error("Param " + param + " does not exists");
        }
    };
    RextEditor.prototype.autoZoom = function () {
        var widthX = this.config.width / this.WIDTH;
        var heightX = this.config.height / this.HEIGHT;
        var maxX = Math.max(widthX, heightX);
        this.setZoom(maxX);
    };
    RextEditor.prototype.setZoom = function (zoom) {
        this.updateParams(__assign(__assign({}, this.params), { zoom: zoom }));
        this.update();
    };
    RextEditor.prototype.getWidth = function () {
        return this.WIDTH;
    };
    RextEditor.prototype.getHeight = function () {
        return this.HEIGHT;
    };
    RextEditor.prototype.setWidth = function (width) {
        this.WIDTH = width;
    };
    RextEditor.prototype.setHeight = function (height) {
        this.HEIGHT = height;
    };
    RextEditor.prototype.getCanvas = function () {
        return this.gl.canvas;
    };
    // FIXME: To Math class
    RextEditor.prototype.get2dRotation = function () {
        return [
            Math.sin(this.params.rotation),
            Math.cos(this.params.rotation)
        ];
    };
    RextEditor.prototype.get2dRotationCenter = function () {
        var x = (this.params.rotation_center.x + 1) * this.WIDTH / 2.0;
        var y = (this.params.rotation_center.y + 1) * this.HEIGHT / 2.0;
        return [x, y];
    };
    RextEditor.prototype.loadImage = function (url) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var image = new Image();
            image.onload = function () {
                if (_this.currentImage == null) {
                    _this.log.warn('Load Image called without image.');
                    return;
                }
                _this.WIDTH = image.width;
                _this.HEIGHT = image.height;
                _this.fitCanvas(image.width, image.height);
                _this.create(_this.currentImage);
                resolve();
            };
            image.onerror = function (err) {
                _this.log.error("Error while loading the image.");
                reject(err);
            };
            _this.currentImage = image;
            image.src = url;
            _this.realImage = image;
        });
    };
    RextEditor.prototype.load = function (url, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.log.log("Version 1.2.8");
                        // Save real image as a copy
                        if (config !== undefined) {
                            this.config = config;
                        }
                        return [4 /*yield*/, this.loadImage(url)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    RextEditor.prototype.setLog = function (log) {
        this.log = log;
    };
    // Temp and Tint
    RextEditor.prototype.updateTemptint = function () {
        this.uniforms.temptint = tempTint(this.params);
    };
    /**
     * Lightning generation:
     * Map brightness values depending on Brightness, Contrast... etc
     */
    RextEditor.prototype.generateLightning = function () {
        this.LIGHT_MATCH = lightning(this.params);
    };
    RextEditor.prototype.blob = function (type, quality) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.realImage === null) {
                _this.log.warn('Called to blob without loaded image');
                return reject();
            }
            _this.create(_this.realImage);
            _this.getCanvas().toBlob(function (blob) {
                if (blob === null) {
                    _this.log.error('Unable to generate the blob file');
                    return reject();
                }
                resolve(blob);
            }, type || "image/jpeg", quality || 1);
        });
    };
    /**
     * create
     * Prepare the environment to edit the image
     * image: Image element to edit (Image object)
     * context: webgl context. Default: __window.gl
     * SET_FULL_RES: no resize the image to edit. Default: false (resize the image)
     */
    RextEditor.prototype.create = function (image, preventRenderImage) {
        // Load GSLS programs
        try {
            var VERTEX_SHADER_CODE = createShader(this.gl, this.gl.VERTEX_SHADER, VERTEX_SHADER);
            var FRAGMENT_SHADER_CODE = createShader(this.gl, this.gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
            this.program = createProgram(this.gl, VERTEX_SHADER_CODE, FRAGMENT_SHADER_CODE);
        }
        catch (err) {
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
        }
        catch (err) {
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
    };
    RextEditor.prototype.fitCanvas = function (width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    };
    RextEditor.prototype.update = function () {
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
            .concat(asArray(hsv2rgb({ x: this.params.lightColor * 360, y: this.params.lightSat, z: this.params.lightFill })))
            .concat(asArray(hsv2rgb({ x: this.params.darkColor * 360, y: this.params.darkSat, z: this.params.darkFill })))); // vec3 x3
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
        this.gl.uniform1f(this.context.getUniform("u_kernelWeight"), sumArray(this.uniforms.kernel));
        /* Adjust canvas size: Cropping */
        this.applyCrop();
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    };
    RextEditor.prototype.applyCrop = function () {
        var x2 = this.WIDTH * this.params.size.x;
        var y2 = this.HEIGHT * this.params.size.y;
        var cw = (this.params.zoom * x2);
        var ch = (this.params.zoom * y2);
        this.getCanvas().style.width = cw + "px";
        this.getCanvas().style.height = ch + "px";
        this.getCanvas().width = x2;
        this.getCanvas().height = y2;
    };
    RextEditor.prototype.setRectangle = function (buffer, x, y, width, height) {
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
    };
    return RextEditor;
}());
export { RextEditor };
