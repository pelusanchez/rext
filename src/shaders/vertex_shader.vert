attribute vec2 a_position;
attribute vec2 a_texCoord;
uniform vec2 u_resolution;
varying vec2 v_texCoord;
uniform vec2 u_rotation;
uniform vec2 u_scale;
uniform vec2 u_translate; 

void main() {

  vec2 scaled = a_position * u_scale;
  vec2 center = u_resolution / 2.0;
  vec2 pos_rotated = vec2(
    (scaled.x - center.x) * u_rotation.y + (scaled.y - center.y) * u_rotation.x,
    (scaled.y - center.y) * u_rotation.y - (scaled.x - center.x) * u_rotation.x);
  
  vec2 dist = (pos_rotated + center) / u_resolution;
  dist.x = dist.x + u_translate.x;
  dist.y = dist.y + u_translate.y;

  vec4 pos = vec4((dist * 2.0 - 1.0) * vec2(1, -1), 0, 1);

  gl_Position = pos;
  v_texCoord = a_texCoord;
}
