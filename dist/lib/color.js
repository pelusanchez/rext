/**
 * Color space functions
 */
import { clamp } from "./math";
export var getLuma = function (rgb_pix) {
    return 0.2126 * rgb_pix.x + 0.7152 * rgb_pix.y + 0.0722 * rgb_pix.z;
};
export var hsv2rgb = function (pixel_hsv) {
    var a, d, c;
    var r, g, b;
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
    r = clamp(r, 0.0, 1.0);
    g = clamp(g, 0.0, 1.0);
    b = clamp(b, 0.0, 1.0);
    return { x: r, y: g, z: b };
};
export var asArray = function (vec) { return [vec.x, vec.y, vec.z]; };
