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


export const defaults : Params = {
  hdr: 0,
  exposure: 0,
	temperature: 0,
  tint: 0,
	brightness: 0, // [0-100]
	saturation: 0, // [0-100]
	contrast: 0, // [0-100]
	sharpen: 0,
	masking: 0,
	sharpen_radius: 0,
	radiance: 0,
	highlights: 0,
	shadows: 0,
	whites: 0,
	blacks: 0,
	dehaze: 0,
  bAndW: 0,
	atmosferic_light: 0,
  lightFill: 0,
  lightColor: 0,
  lightSat: 1,
  darkFill: 0,
  darkColor: 0,
  darkSat: 1
};
