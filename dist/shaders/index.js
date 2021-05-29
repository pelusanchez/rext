var FRAGMENT_SHADER = "/** * David Iglesias. All rights reserved */\nprecision mediump float;\nuniform sampler2D u_image;\nuniform vec2 u_textureSize;\nuniform float u_kernel[25];\nuniform float u_kernelWeight;\nuniform sampler2D u_lut;\nuniform float u_saturation;\nuniform float u_brightness;\nuniform float u_exposure;\nuniform float u_contrast;\nuniform float u_dehaze;\nuniform float u_atmosferic_light;\nuniform float u_masking;\nuniform vec3 u_temptint[3]; // RGB temptint, RGB lightFill, RGB darkFill\nuniform float u_bAndW;\nuniform float u_hdr;\nvarying vec2 v_texCoord;\nvoid main() {\n  \n\tvec2 pixel_size = vec2(1.0, 1.0) / u_textureSize;\n  \n\tvec3 center = texture2D(u_image, v_texCoord).rgb;\n\n  /* 5x5 kernel filter */\n  vec4 colorSum = texture2D(u_image, v_texCoord + pixel_size * vec2(-2, -2)) * u_kernel[0]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-1, -2)) * u_kernel[1]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(0, -2)) * u_kernel[2]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(1, -2)) * u_kernel[3]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(2, -2)) * u_kernel[4]\n\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-2, -1)) * u_kernel[5]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-1, -1)) * u_kernel[6]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(0, -1)) * u_kernel[7]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(1, -1)) * u_kernel[8]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(2, -1)) * u_kernel[9]\n\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-2, 0)) * u_kernel[10]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-1, 0)) * u_kernel[11]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(0, 0)) * u_kernel[12]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(1, 0)) * u_kernel[13]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(2, 0)) * u_kernel[14]\n\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-2, 1)) * u_kernel[15]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-1, 1)) * u_kernel[16]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(0, 1)) * u_kernel[17]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(1, 1)) * u_kernel[18]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(2, 1)) * u_kernel[19]\n\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-2, 2)) * u_kernel[20]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(-1, 2)) * u_kernel[21]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(0, 2)) * u_kernel[22]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(1, 2)) * u_kernel[23]\n\t\t + texture2D(u_image, v_texCoord + pixel_size * vec2(2, 2)) * u_kernel[24];\n\n\t/* Kernel filter mask */\n  vec3 rgb_pix = mix(center, (colorSum.rgb / u_kernelWeight), u_masking);\n\t\n\t/**\n\t * RGB to saturation/value conversion, in order to maintains hue constant \n\t * sv_pixel = (saturation, value)\n\t */\n  float _max = max(rgb_pix.r, max(rgb_pix.g, rgb_pix.b));\n  float _min = min(rgb_pix.r, min(rgb_pix.g, rgb_pix.b));\n  vec2 sv_pixel = vec2(1.0 - _min / _max, _max);\n\n  sv_pixel.y = clamp(texture2D(u_lut, vec2(sv_pixel.y, 0.0)).a, 0.0, 1.0);\n\n\t/* Add saturation */\n  if (u_saturation != 0.0) {\n    sv_pixel.x *= (1.0 + u_saturation);\n  }\n\n  sv_pixel.x = clamp(sv_pixel.x, 0.0, 1.0);\n\n\t/* Brightness */\n  if (u_brightness != 0.0) {\n    sv_pixel.y = pow(sv_pixel.y, 1.0 - u_brightness * 0.6);\n  }\n\n\t/* HDR 'like' filter */\n  if (u_hdr != 0.0) {\n    sv_pixel.y = mix(sv_pixel.y, clamp(1.0 - pow(1.0 - pow(sv_pixel.y, 0.3), 0.42), 0.0, 1.0), u_hdr);\n  }\n\n  sv_pixel = clamp(sv_pixel, 0.0, 1.0);\n\t/* Return to RGB */\n  if (sv_pixel.x > 0.0) {\n    float k = -sv_pixel.x / (1.0 - _min / _max);\n    rgb_pix = (_max - rgb_pix) * k + _max;\n    rgb_pix *= sv_pixel.y / _max;\n  } else {\n    rgb_pix.r = rgb_pix.g = rgb_pix.b = sv_pixel.y;\n  }\n\n\t/* Dehaze */\n  if (u_dehaze != 0.0) {\n    float t = 1.0 / 25.0;\n    vec4 center = texture2D(u_image, v_texCoord);\n    vec2 pixel_size = vec2(1.0, 1.0) / u_textureSize;\n    float dark = 1.0;\n    const int radius = 1;\n    for (int ii = -radius; ii <= radius; ii++) {\n      for (int jj = -radius; jj <= radius; jj++) {\n        vec4 pix = texture2D(u_image, v_texCoord + pixel_size * vec2(ii, jj));\n        float _min = min(pix.r, min(pix.g, pix.b));\n        if (dark > _min) {\n          dark = _min;\n        }\n      }\n    }\n    float darkPix = min(center.r, min(center.g, center.b));\n    float diff = abs(darkPix - dark);\n    float mask = pow(diff, 3.0);\n    dark = mix(darkPix, dark, mask);\n    float mm = max(1.0 - dark, 0.2);\n    rgb_pix = mix(rgb_pix, ((rgb_pix - u_atmosferic_light) / mm + u_atmosferic_light), u_dehaze);\n  }\n\n\t/* Exposure */\n  rgb_pix += u_exposure;\n  rgb_pix = clamp(rgb_pix, 0.0, 1.0);\n\n\t/* Contrast */\n  float contrast = u_contrast + 1.0;\n  rgb_pix = contrast * (rgb_pix - 0.5) + 0.5;\n\t\n\t/* Apply tint filter */\n  rgb_pix *= u_temptint[0];\n  float mono = dot(rgb_pix, vec3(0.2126, 0.7152, 0.0722));\n  rgb_pix += mix(u_temptint[2], u_temptint[1], mono);\n\n\t/* Black&White filter */\n  if (u_bAndW != 0.0) {\n    rgb_pix = mix(rgb_pix, vec3(mono, mono, mono), u_bAndW);\n  }\n\n  gl_FragColor = vec4(rgb_pix, 1.0);\n\n}\n";
var VERTEX_SHADER = "attribute vec2 a_position;\nattribute vec2 a_texCoord;\nuniform vec2 u_resolution;\nvarying vec2 v_texCoord;\n\nuniform float u_rotation;\n\nvoid main() {\n\n  vec2 dist = a_position / u_resolution;\n\n\n  /*dist = vec2(\n     dist.y * u_rotation.x - dist.x * u_rotation.y, \n     dist.y * u_rotation.y + dist.x * u_rotation.x) + vec2(0.5, -0.5);*/\n\n    float pi4 = 0.02;\n    float aspect = 0.5;\n\n  vec4 pos = vec4((dist * 2.0 - 1.0) * vec2(1, -1), 0, 1);\n\n  pos.x = (pos.x) * 0.7071067811865476 - (pos.y) * 0.7071067811865476;\n  pos.y = (pos.x) * 0.7071067811865476 + (pos.y) * 0.7071067811865476;\n  pos.z = 0.0;\n  pos.w = 1.0;\n  gl_Position = pos;\n  v_texCoord = a_texCoord;\n}\n";
export { FRAGMENT_SHADER, VERTEX_SHADER };
