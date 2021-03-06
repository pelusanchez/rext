/**
 * Color space functions
 */
import { vec3 } from "../models/models";
export declare const getLuma: (rgb_pix: vec3) => number;
export declare const hsv2rgb: (pixel_hsv: vec3) => vec3;
export declare const asArray: (vec: vec3) => number[];
