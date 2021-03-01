/**
 * David Iglesias. All rights reserved
 */
precision mediump float;

// our texture
uniform sampler2D u_image;
uniform vec2 u_textureSize;
uniform float u_kernel[25];
uniform float u_kernelWeight;

uniform sampler2D u_lut; 

uniform float u_saturation;
uniform float u_vibrance;
uniform float u_brightness;
uniform float u_exposure;
uniform float u_contrast;

uniform float u_dehaze;
uniform float u_atmosferic_light;
uniform float u_masking;
uniform vec3 u_temptint[3]; // RGB temptint, RGB lightFill, RGB darkFill
uniform float u_bAndW;

uniform float u_hdr;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;


// Get light match
float getLightMatch(float val) {
	float _r = texture2D(u_lut, vec2(val, 0.0)).a;
	return clamp(_r, 0.0, 1.0);
}

/**
 *	getTransmission
 *  Compute transmission map
 */
float getTransmission() {
	float t = 1.0 / 25.0;
	vec4 center = texture2D(u_image, v_texCoord);

	vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
	float dark = 1.0;
	const int radius = 1;
	for (int ii = -radius; ii <= radius; ii++ ) {
		for(int jj = -radius; jj <= radius; jj++) {
			vec4 pix = texture2D(u_image, v_texCoord + onePixel * vec2( ii,  jj));
			float _min = min(pix.r, min(pix.g, pix.b));
			if (dark > _min) { dark = _min; }
		}
	}

	float darkPix = min(center.r, min(center.g, center.b));
	float diff = abs(darkPix - dark);
	float mask = pow(diff, 3.0);
	dark = mix(darkPix, dark, mask);

	return 1.0 - dark;
}

float getLuma(vec3 rgb_pix) {
	/* RGB to luminosity. Each channel has different weights */
	return dot(rgb_pix, vec3(0.2126, 0.7152, 0.0722));
}



float getV(vec3 pix) {
	return max(pix.r, max(pix.g, pix.b));
}

// Returns min and max value
vec2 localContrast() {
	vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
	float _min = 1.0;
	float _max = 0.0;
	for (int i = -2; i <= 2; i++) {
		for(int j = -2; j <= 2; j++) {
			_max = max(getV(texture2D(u_image, v_texCoord + onePixel * vec2( i,  j)).rgb), _max);
			_min = min(getV(texture2D(u_image, v_texCoord + onePixel * vec2( i,  j)).rgb), _min);
		}
	}
	return vec2(_min, _max);
}

float getHDR(float val) {

	// Contrast stretch 
	float midVal = 1.0 - pow(1.0 - pow(val, 0.3), 0.42);
	return clamp(midVal, 0.0, 1.0);
}


vec4 image_process(vec4 PIXEL_COLOR) {

	/*
		Color (Hue) preservation: 
			Instead of converting color to a 'hue independent' color space, use
	  	the maximun value of the rgb channels and the factor.
			sv_pixel = [(saturation), ('lightness')]
	*/	
 	float _max = max(PIXEL_COLOR.r, max(PIXEL_COLOR.g, PIXEL_COLOR.b));
 	float _min = min(PIXEL_COLOR.r, min(PIXEL_COLOR.g, PIXEL_COLOR.b));
 	vec2 sv_pixel = vec2(1 - _min / _max, _max);

	sv_pixel.y = getLightMatch(sv_pixel.y);

	if (u_vibrance != 1.0) { /* Apply vibrance */
		sv_pixel.x = pow(sv_pixel.x, u_vibrance);
	}

	if (u_saturation != 0.0) { /* Apply saturation */
		sv_pixel.x += u_saturation;
	}

	/* Value constraints [0, 1]: Prevents saturation */
	sv_pixel.x = clamp(sv_pixel.x, 0.0, 1.0);

	sv_pixel.y = pow(sv_pixel.y, 1.0 - u_brightness * 0.6);

	/* High Dynamic Range 'effect' */
	if (u_hdr != 0.0) {
		sv_pixel.y = mix(sv_pixel.y, getHDR(sv_pixel.y), u_hdr);
	}

	float contrast = u_contrast + 1.0;
	sv_pixel.y = contrast * (sv_pixel.y - 0.5) + 0.5;
	sv_pixel.x = clamp(sv_pixel.x, 0.0, 1.0);
	sv_pixel.y = clamp(sv_pixel.y, 0.0, 1.0);
	
	// Transform sv to rgb
	vec3 rgb_pix = PIXEL_COLOR;
	if (sv_pixel.x > 0) {
		// Update saturation
		rgb_pix = (_max - rgb_pix) * k + _max;
		// Update value
		rgb_pix *= sv_pixel.y / _max;
	} else {
		rgb_pix.r = rgb_pix.g = rgb_pix.b = sv_pixel.v;
	}

	/* Now we dont need constant hue. Usiing rgb space */

	if (u_dehaze != 0.0) { /* Dehaze small algorightm */
		float transmision = getTransmission();
		float mm = max(transmision, 0.2);
		rgb_pix = mix(rgb_pix, ((rgb_pix - u_atmosferic_light) / mm + u_atmosferic_light), u_dehaze); 
	}

	rgb_pix += u_exposure; /* Exposure as simply add a value to the channels */

	rgb_pix = clamp(rgb_pix, 0.0, 1.0);	

	// Temptint operations (TINT AND TEMPERATURE)
	rgb_pix *= u_temptint[0];

	// Lightfill operations
	float mono = getLuma(rgb_pix);
	rgb_pix += mix(u_temptint[2], u_temptint[1], mono);
	
	// Black and White
	if (u_bAndW != 0.0) {
		rgb_pix = mix(rgb_pix, mono, u_bAndW);
	}

	return vec4(rgb_pix, 1.0);
}

void main() {
  vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
  vec4 center = texture2D(u_image, v_texCoord);

  // 
  // 5x5 kernel 
  vec4 colorSum =
  	texture2D(u_image, v_texCoord + onePixel * vec2(-2, -2)) * u_kernel[0] +
    texture2D(u_image, v_texCoord + onePixel * vec2( -1, -2)) * u_kernel[1] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 0, -2)) * u_kernel[2] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 1, -2)) * u_kernel[3] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 2, -2)) * u_kernel[4] +

    texture2D(u_image, v_texCoord + onePixel * vec2( -2, -1)) * u_kernel[5] +
    texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)) * u_kernel[6] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 0, -1)) * u_kernel[7] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 1, -1)) * u_kernel[8] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 2, -1)) * u_kernel[9] +

    texture2D(u_image, v_texCoord + onePixel * vec2( -2, 0)) * u_kernel[10] +
    texture2D(u_image, v_texCoord + onePixel * vec2(-1,  0)) * u_kernel[11] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 0,  0)) * u_kernel[12] + // Center
    texture2D(u_image, v_texCoord + onePixel * vec2( 1,  0)) * u_kernel[13] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 2, 0)) * u_kernel[14] +

    texture2D(u_image, v_texCoord + onePixel * vec2(-2,  1)) * u_kernel[15] +
    texture2D(u_image, v_texCoord + onePixel * vec2(-1,  1)) * u_kernel[16] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 0,  1)) * u_kernel[17] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 1,  1)) * u_kernel[18] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 2,  1)) * u_kernel[19] +

    texture2D(u_image, v_texCoord + onePixel * vec2(-2,  2)) * u_kernel[20] +
    texture2D(u_image, v_texCoord + onePixel * vec2(-1,  2)) * u_kernel[21] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 0,  2)) * u_kernel[22] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 1,  2)) * u_kernel[23] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 2,  2)) * u_kernel[24];




  vec4 masking = mix(center, vec4((colorSum / u_kernelWeight).rgb, 1), u_masking);

  gl_FragColor = image_process(masking);
}
