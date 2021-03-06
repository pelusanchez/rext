export interface vec3 {
    x: number;
    y: number;
    z: number;
}
export interface Config {
    resolutionLimit: number;
    editionResolutionLimit: number;
}
export interface UniformPointer {
    positionLocation: any;
    positionBuffer: any;
    texcoordLocation: any;
    texcoordBuffer: any;
    resolutionLocation: any;
    textureSizeLocation: any;
    kernelLocation: any;
    kernelWeightLocation: any;
    u_exposure: any;
    u_brightness: any;
    u_contrast: any;
    u_saturation: any;
    u_masking: any;
    u_dehaze: any;
    u_atmosferic_light: any;
    u_temptint: any;
    u_bAndW: any;
    u_hdr: any;
    u_lut: any;
    u_image: any;
}
