const FRAGMENT_SHADER = `/** * David Iglesias. All rights reserved */
precision mediump float;
uniform sampler2D u_image;
uniform vec2 u_textureSize;
uniform float u_kernel[25];
uniform float u_kernelWeight;
uniform sampler2D u_lut;
uniform float u_saturation;
uniform float u_brightness;
uniform float u_exposure;
uniform float u_contrast;
uniform float u_dehaze;
uniform float u_atmosferic_light;
uniform float u_masking;
uniform vec3 u_temptint[3]; // RGB temptint, RGB lightFill, RGB darkFill
uniform float u_bAndW;
uniform float u_hdr;
varying vec2 v_texCoord;
void main() {
  
	vec2 pixel_size = vec2(1.0, 1.0) / u_textureSize;
  
	vec3 center = texture2D(u_image, v_texCoord).rgb;

  /* 5x5 kernel filter */
  vec4 colorSum = texture2D(u_image, v_texCoord + pixel_size * vec2(-2, -2)) * u_kernel[0]
		 + texture2D(u_image, v_texCoord + pixel_size * vec2(-1, -2)) * u_kernel[1]
		 + texture2D(u_image, v_texCoord + pixel_size * vec2(0, -2)) * u_kernel[2]
		 + texture2D(u_image, v_texCoord + pixel_size * vec2(1, -2)) * u_kernel[3]
		 + texture2D(u_image, v_texCoord + pixel_size * vec2(2, -2)) * u_kernel[4]

		 + texture2D(u_image, v_texCoord + pixel_size * vec2(-2, -1)) * u_kernel[5]
		 + texture2D(u_image, v_texCoord + pixel_size * vec2(-1, -1)) * u_kernel[6]
		 + texture2D(u_image, v_texCoord + pixel_size * vec2(0, -1)) * u_kernel[7]
		 + texture2D(u_image, v_texCoord + pixel_size * vec2(1, -1)) * u_kernel[8]
		 + texture2D(u_image, v_texCoord + pixel_size * vec2(2, -1)) * u_kernel[9]

		 + texture2D(u_image, v_texCoord + pixel_size * vec2(-2, 0)) * u_kernel[10]
		 + texture2D(u_image, v_texCoord + pixel_size * vec2(-1, 0)) * u_kernel[11]
		 + texture2D(u_image, v_texCoord + pixel_size * vec2(0, 0)) * u_kernel[12]
		 + texture2D(u_image, v_texCoord + pixel_size * vec2(1, 0)) * u_kernel[13]
		 + texture2D(u_image, v_texCoord + pixel_size * vec2(2, 0)) * u_kernel[14]

		 + texture2D(u_image, v_texCoord + pixel_size * vec2(-2, 1)) * u_kernel[15]
		 + texture2D(u_image, v_texCoord + pixel_size * vec2(-1, 1)) * u_kernel[16]
		 + texture2D(u_image, v_texCoord + pixel_size * vec2(0, 1)) * u_kernel[17]
		 + texture2D(u_image, v_texCoord + pixel_size * vec2(1, 1)) * u_kernel[18]
		 + texture2D(u_image, v_texCoord + pixel_size * vec2(2, 1)) * u_kernel[19]

		 + texture2D(u_image, v_texCoord + pixel_size * vec2(-2, 2)) * u_kernel[20]
		 + texture2D(u_image, v_texCoord + pixel_size * vec2(-1, 2)) * u_kernel[21]
		 + texture2D(u_image, v_texCoord + pixel_size * vec2(0, 2)) * u_kernel[22]
		 + texture2D(u_image, v_texCoord + pixel_size * vec2(1, 2)) * u_kernel[23]
		 + texture2D(u_image, v_texCoord + pixel_size * vec2(2, 2)) * u_kernel[24];

	/* Kernel filter mask */
  vec3 rgb_pix = mix(center, (colorSum.rgb / u_kernelWeight), u_masking);
	
	/**
	 * RGB to saturation/value conversion, in order to maintains hue constant 
	 * sv_pixel = (saturation, value)
	 */
  float _max = max(rgb_pix.r, max(rgb_pix.g, rgb_pix.b));
  float _min = min(rgb_pix.r, min(rgb_pix.g, rgb_pix.b));
  vec2 sv_pixel = vec2(1.0 - _min / _max, _max);

  sv_pixel.y = clamp(texture2D(u_lut, vec2(sv_pixel.y, 0.0)).a, 0.0, 1.0);

	/* Add saturation */
  if (u_saturation != 0.0) {
    sv_pixel.x *= (1.0 + u_saturation);
  }

  sv_pixel.x = clamp(sv_pixel.x, 0.0, 1.0);

	/* Brightness */
  if (u_brightness != 0.0) {
    sv_pixel.y = pow(sv_pixel.y, 1.0 - u_brightness * 0.6);
  }

	/* HDR 'like' filter */
  if (u_hdr != 0.0) {
    sv_pixel.y = mix(sv_pixel.y, clamp(1.0 - pow(1.0 - pow(sv_pixel.y, 0.3), 0.42), 0.0, 1.0), u_hdr);
  }

  sv_pixel = clamp(sv_pixel, 0.0, 1.0);
	/* Return to RGB */
  if (sv_pixel.x > 0.0) {
    float k = -sv_pixel.x / (1.0 - _min / _max);
    rgb_pix = (_max - rgb_pix) * k + _max;
    rgb_pix *= sv_pixel.y / _max;
  } else {
    rgb_pix.r = rgb_pix.g = rgb_pix.b = sv_pixel.y;
  }

	/* Dehaze */
  if (u_dehaze != 0.0) {
    float t = 1.0 / 25.0;
    vec4 center = texture2D(u_image, v_texCoord);
    vec2 pixel_size = vec2(1.0, 1.0) / u_textureSize;
    float dark = 1.0;
    const int radius = 1;
    for (int ii = -radius; ii <= radius; ii++) {
      for (int jj = -radius; jj <= radius; jj++) {
        vec4 pix = texture2D(u_image, v_texCoord + pixel_size * vec2(ii, jj));
        float _min = min(pix.r, min(pix.g, pix.b));
        if (dark > _min) {
          dark = _min;
        }
      }
    }
    float darkPix = min(center.r, min(center.g, center.b));
    float diff = abs(darkPix - dark);
    float mask = pow(diff, 3.0);
    dark = mix(darkPix, dark, mask);
    float mm = max(1.0 - dark, 0.2);
    rgb_pix = mix(rgb_pix, ((rgb_pix - u_atmosferic_light) / mm + u_atmosferic_light), u_dehaze);
  }

	/* Exposure */
  rgb_pix += u_exposure;
  rgb_pix = clamp(rgb_pix, 0.0, 1.0);

	/* Contrast */
  float contrast = u_contrast + 1.0;
  rgb_pix = contrast * (rgb_pix - 0.5) + 0.5;
	
	/* Apply tint filter */
  rgb_pix *= u_temptint[0];
  float mono = dot(rgb_pix, vec3(0.2126, 0.7152, 0.0722));
  rgb_pix += mix(u_temptint[2], u_temptint[1], mono);

	/* Black&White filter */
  if (u_bAndW != 0.0) {
    rgb_pix = mix(rgb_pix, vec3(mono, mono, mono), u_bAndW);
  }

  gl_FragColor = vec4(rgb_pix, 1.0);

}
`
const VERTEX_SHADER = `attribute vec2 a_position;
attribute vec2 a_texCoord;
uniform vec2 u_resolution;
varying vec2 v_texCoord;

uniform float u_rotation;

void main() {

  vec2 dist = a_position / u_resolution;


  /*dist = vec2(
     dist.y * u_rotation.x - dist.x * u_rotation.y, 
     dist.y * u_rotation.y + dist.x * u_rotation.x) + vec2(0.5, -0.5);*/

    float pi4 = 0.02;
    float aspect = 0.5;

  vec4 pos = vec4((dist * 2.0 - 1.0) * vec2(1, -1), 0, 1);

  pos.x = (pos.x) * 0.7071067811865476 - (pos.y) * 0.7071067811865476;
  pos.y = (pos.x) * 0.7071067811865476 + (pos.y) * 0.7071067811865476;
  pos.z = 0.0;
  pos.w = 1.0;
  gl_Position = pos;
  v_texCoord = a_texCoord;
}
`
export { FRAGMENT_SHADER, VERTEX_SHADER }
