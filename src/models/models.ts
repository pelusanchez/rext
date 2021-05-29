export interface vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Config {
  resolutionLimit: number;
  editionResolutionLimit: number;
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

  rotation: number;
}
