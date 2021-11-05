export interface vec3 {
    x: number;
    y: number;
    z: number;
}
export interface Config {
    resolutionLimit: number;
    editionResolutionLimit: number;
}
export declare type KeyValue<V> = {
    [key: string]: V;
};
export interface vec2 {
    x: number;
    y: number;
}
export declare type ParamsAbs = KeyValue<number | vec2>;
export interface Params extends ParamsAbs {
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
    rotation: number;
    rotation_center: vec2;
    scale: vec2;
    translate: vec2;
}
