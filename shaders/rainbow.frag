varying vec4 vCoords;
varying vec4 vNormal;

void main() {
	gl_FragColor.rgb = abs(vCoords.xyz)/2.0;
	gl_FragColor.a = 1.0;
}