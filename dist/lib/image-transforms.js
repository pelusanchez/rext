import { getLuma } from "./color";
import { TEMP_DATA } from "./constants";
import { getCuadraticFunction } from "./math";
/**
 * Computes an 3x3 kernel for image processing
 */
export var computeKernel = function (params) {
    var sharpness = -params.sharpen;
    var radius = params.sharpen_radius;
    var radiance = params.radiance;
    var hdr = params.hdr;
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
    return [E, D, C, D, E,
        D, B, A, B, D,
        C, A, X, A, C,
        D, B, A, B, D,
        E, D, C, D, E];
};
export var tempTint = function (params) {
    var T = params.temperature;
    var tint = params.tint;
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
    return [R * mult_K, G * mult_K, B * mult_K];
};
export var lightning = function (params) {
    var func = getCuadraticFunction(params.blacks, params.shadows + 0.33, params.highlights + 0.66, params.whites + 1, 0, 0.33, 0.66, 1);
    var f_radiance = null;
    if (params.radiance != 0) {
        f_radiance = getCuadraticFunction(0, 0.33 - params.radiance * 0.11, 0.66 + params.radiance * 0.11, 1, 0, 0.33, 0.66, 1);
    }
    var LIGHT_MATCH = [];
    for (var i = 0; i <= 255; i++) {
        var pixel_value = i / 255;
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
export var sumArray = function (kernel) { return kernel.reduce(function (a, b) { return a + b; }); };
