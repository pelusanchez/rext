import { Params } from "../models/models";
import { TEMP_DATA } from "./constants";

/** 
 * Computes an 3x3 kernel for image processing 
 */ 
export const computeKernel = (params: Pick<Params, 'sharpen' | 'sharpen_radius' | 'radiance' | 'hdr'>): number[] => {
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

  const A = sharpness * Math.exp(- Math.pow(1 / radius, 2));
  const B = sharpness * Math.exp(- Math.pow(1.41 / radius, 2));
  const C = sharpness * Math.exp(- Math.pow(2 / radius, 2));
  const D = sharpness * Math.exp(- Math.pow(2.24 / radius, 2));
  const E = sharpness * Math.exp(- Math.pow(2.83 / radius, 2));

  let X = 1;
  if (sharpness < 0) {
    X += 4 * Math.abs(E) + 8 * Math.abs(D) + 4 * Math.abs(C) + 4 * Math.abs(B) + 4 * Math.abs(A);
  }

  return [E, D, C, D, E,
          D, B, A, B, D,
          C, A, X, A, C,
          D, B, A, B, D,
          E, D, C, D, E];

}

export const tempTint = (params: Pick<Params, 'temperature' | 'tint'>) => {

  let T = params.temperature
  let tint = params.tint
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
  return [R * mult_K, G * mult_K, B * mult_K];
}

/**
 * kernelNormalization
 * Compute the total weight of the kernel in order to normalize it
 */
export const kernelSum = (kernel: number[]) : number => kernel.reduce((a, b) => a + b);
