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
};

export interface f2Number {
	x: number;
	y: number;
};

export interface f4Number {
	x: number;
	y: number;
	z: number;
	w: number;
};

export type ParamValue = number | f2Number | f4Number;
/* Trick for be able to do this.params[paramKey] */
export type ParamsAbs = KeyValue<ParamValue>

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
	rotation_center: f2Number;
	scale: f2Number;
	translate: f2Number;
	crop: f4Number;
}
