var gl;

var program;
var alpha;
    
var time = 0;

var doc;
var requestId;
var navBarHeight;

export function resetAlpha() {
    alpha = 1.0;
}

function render() {
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

    //  resize canvas if needed
    var width = gl.canvas.clientWidth / 4.0;
    var height = gl.canvas.clientHeight / 4.0;
    if (gl.canvas.width != width || gl.canvas.height != height) {
        gl.canvas.width = width;
        gl.canvas.height = height;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.useProgram(program);
        gl.uniform2f(gl.getUniformLocation(program, "resolution"), width, height);
    }

    time++;
    if (alpha > 0) {
        alpha -= 0.025;
    }
    
    gl.useProgram(program);
    var timeLoc = gl.getUniformLocation(program, "time");
    var alphaLoc = gl.getUniformLocation(program, "alpha");

    gl.uniform1i(timeLoc, time);
    gl.uniform1f(alphaLoc, alpha);
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    requestId = window.requestAnimationFrame(render, canvas);
}

function handleContextLost(event) {
    initGL(doc);
    event.preventDefault();
    cancelRequestAnimationFrame(requestId);
}

function createShaderProgram(vertexSource, fragmentSource) {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(vertexShader));
        throw new Error('Failed to compile vertex shader');
    }
    
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(fragmentShader));
        throw new Error('Failed to compile fragment shader');
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        throw new Error('Failed to link program');
    }
    
    return program;
}

export function initGL(document) {
    doc = document;
    
    // initialize
    const canvas = document.getElementById('canvas');
    gl = canvas.getContext('webgl2');
    canvas.addEventListener("webglcontextlost", handleContextLost, false);

    // compile shaders and link program
    const vertexSource = `#version 300 es
        void main() {
            const vec2 positions[4] = vec2[](
                vec2(-1, -1),
                vec2(+1, -1),
                vec2(-1, +1),
                vec2(+1, +1)
            );
            gl_Position = vec4(positions[gl_VertexID], 0.0, 1.0);
        }
    `;

    const fragmentSource = `#version 300 es
        precision highp float;

        const float e = 2.7182818284590452353602874713527;

        out vec4 color;

        uniform int time;
        uniform float alpha;
        uniform vec2 resolution;

        vec4 noise(vec2 texCoord) {
            float G = e + (float(time % 120) * 0.1);
            vec2 r = (G * sin(G * texCoord.xy));
            return vec4(fract(r.x * r.y * (1.0 + texCoord.x)));
        }
        
        void main() {
            color = noise(vec2(float(gl_FragCoord.x), float(gl_FragCoord.y)));
            
            color *= alpha;
            color.a = alpha;
        }
    `;

    program = createShaderProgram(vertexSource, fragmentSource);
    alpha = 1.0;
    
    //  pre-multiplied alpha blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    
    // create VAO and draw
    const fullscreenQuadVAO = gl.createVertexArray();
    gl.bindVertexArray(fullscreenQuadVAO);

    render();
    
    canvas.style.backgroundColor = "transparent";
}
