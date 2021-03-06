export interface Params {
    hdr: number;
    exposure: number;
    temperature: number;
    tint: number;
    brightness: number;
    saturation: number;
    contrast: number;
    sharpen: number;
    masking: number;
    sharpen_radius: number;
    radiance: number;
    highlights: number;
    shadows: number;
    whites: number;
    blacks: number;
    dehaze: number;
    bAndW: number;
    atmosferic_light: number;
    lightFill: number;
    lightColor: number;
    lightSat: number;
    darkFill: number;
    darkColor: number;
    darkSat: number;
}
export declare const defaults: Params;
