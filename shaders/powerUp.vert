varying vec2 vUv;
varying vec3 vNormal;

uniform float normScale;
uniform float normalizationFactor;
uniform float displacement;
uniform float timeFactor;

void main() {
    vNormal = normal;
    vUv = uv;

    // Add a sinusoidal scaling along the Y-axis based on time
    float scaleFactor = 1.0 + sin(timeFactor) * 0.25; // Adjust the amplitude (0.3 in this case)
    
    vec4 modelViewPosition = modelViewMatrix * vec4(position * scaleFactor + normal * normalizationFactor * (displacement + normScale), 1.0);

    // Apply scaling to the model view position
    //modelViewPosition.y *= scaleFactor;




    gl_Position = projectionMatrix * modelViewPosition;
}
