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

export type KeyValue<V> = { 
  [key: string]: V
}

/* Trick for be able to do this.params[paramKey] */
export type ParamsAbs = KeyValue<number>

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
}
