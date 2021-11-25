import { Params } from "../models/models";
/**
 * Computes an 3x3 kernel for image processing
 */
export declare const computeKernel: (params: Pick<Params, 'sharpen' | 'sharpen_radius' | 'radiance' | 'hdr'>) => number[];
export declare const tempTint: (params: Pick<Params, 'temperature' | 'tint'>) => number[];
export declare const lightning: (params: Pick<Params, 'blacks' | 'shadows' | 'highlights' | 'whites' | 'radiance'>) => number[];
/**
 * kernelNormalization
 * Compute the total weight of the kernel in order to normalize it
 */
export declare const sumArray: (kernel: number[]) => number;
