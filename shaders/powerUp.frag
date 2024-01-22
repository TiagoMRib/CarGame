varying vec2 vUv;

uniform sampler2D uSampler2;

void main() {
	vec4 color2 = texture2D(uSampler2, vUv);
	gl_FragColor = color2;//mix(color1, color2, blendScale);
}