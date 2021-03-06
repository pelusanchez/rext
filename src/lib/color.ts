/**
 * Color space functions
 */

import { clamp } from "./math";
import { vec3 } from "../models/models";

export const getLuma = (rgb_pix: vec3) : number => {
  return 0.2126 * rgb_pix.x + 0.7152 * rgb_pix.y + 0.0722 * rgb_pix.z;
}

export const hsv2rgb = (pixel_hsv: vec3) : vec3  => {
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

export const asArray = (vec: vec3) => [ vec.x, vec.y, vec.z ];
