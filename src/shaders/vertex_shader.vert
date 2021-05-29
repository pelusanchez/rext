attribute vec2 a_position;
attribute vec2 a_texCoord;
uniform vec2 u_resolution;
varying vec2 v_texCoord;

uniform float u_rotation;

void main() {

  vec2 dist = a_position / u_resolution;

/*
float aspect = width / height;

mat4 aspect_mat = mat4(
    vec4(1.0/aspect, 0.0, 0.0, 0.0), 
    vec4(0.0,        1.0, 0.0, 0.0), 
    vec4(0.0,        0.0, 1.0, 0.0), 
    vec4(0.0,        0.0, 0.0, 1.0)); 

mat4 model_mat = mat4(
    vec4(scale.x*cos(rotateZ),  scale.x*-sin(rotateZ),  0.0,            0.0), 
    vec4(scale.y*sin(rotateZ),  scale.y*cos(rotateZ),   0.0,            0.0), 
    vec4(0.0,                   0.0,                    scale.z,        0.0), 
    vec4(translation.x,         translation.y,          translation.z,  1.0));

mat4 worldPosTrans = aspect_mat * model_mat;*/
  /*dist = vec2(
     dist.y * u_rotation.x - dist.x * u_rotation.y, 
     dist.y * u_rotation.y + dist.x * u_rotation.x) + vec2(0.5, -0.5);*/

  vec4 pos = vec4((dist * 2.0 - 1.0) * vec2(1, -1), 0, 1);

  if (pos.x < 0.5 && pos.y < 0.5) {
    pos.x = 0.1;
    pos.y = 0.2;
  }
  gl_Position = pos;
  v_texCoord = a_texCoord;
}
