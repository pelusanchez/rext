attribute vec2 a_position;
attribute vec2 a_texCoord;
uniform vec2 u_resolution;
varying vec2 v_texCoord;
void main() {
   vec2 dist = a_position / u_resolution;
   gl_Position = vec4( (dist * 2.0 - 1.0) * vec2(1, -1), 0, 1);
   v_texCoord = a_texCoord;
}
