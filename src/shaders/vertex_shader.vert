attribute vec2 a_position;
attribute vec2 a_texCoord;
uniform vec2 u_resolution;
varying vec2 v_texCoord;
uniform vec2 u_rotation;
uniform vec2 u_rotation_center;
uniform vec2 u_scale;
uniform vec2 u_translate; 

void main() {

  vec2 scaled = a_position * vec2(u_scale);
  vec2 pos_r_t = scaled - u_rotation_center;
  vec2 pos_rotated = vec2(
    pos_r_t.x * u_rotation.y + pos_r_t.y * u_rotation.x,
    pos_r_t.y * u_rotation.y - pos_r_t.x * u_rotation.x);
  
  vec2 dist = (pos_rotated + u_rotation_center) / u_resolution;

  vec2 pos = vec2((dist + u_translate) * 2.0 - 1.0) * vec2(1, -1);
  gl_Position = vec4(pos, 0, 1);
  v_texCoord = a_texCoord;
}
