document.addEventListener("DOMContentLoaded", function() {
    // window.pointsWaves = new PointsWaves();
})

var PointsWaves = function() {
    
    const SEPARATION = 125, AMOUNTX = 50, AMOUNTY = 50;

    const vertexShader = `
        attribute float scale;
        uniform float radius;
        uniform float mouseX;
        uniform float mouseY;
        uniform float energy;

        void main() {

            float weight = length(position.xz - vec2(0., 0.));
            float distMouse = length( vec2( position.x / 5000. , position.z / 5000. ) - vec2( mouseX, mouseY) );
            float scaleSuper = pow( max(0., (0.3 - distMouse)/0.3), 3.) ;

            vec3 newPosition = position *  (1. - pow(1. - radius/2500., 2.));
            
            newPosition.y += (1. - pow(1.- scaleSuper, 2.)) * 250. * energy;
            
            vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1. );
            
            if ( weight > radius) {
                mvPosition.w = 0.;
            }

            gl_PointSize = scale * ( 150.0 / - mvPosition.z );
            
            gl_PointSize += pow(scaleSuper, 2.) * 50. / 2. * max(0., radius - 2000.) / 1500. * energy;
            
            gl_Position = projectionMatrix * mvPosition;

        }
    `;

    const fragmentShader = `
        uniform vec3 color;
        uniform float alpha;

        void main() {

            if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;

            gl_FragColor = vec4( color, alpha);

        }
    `;

    let container;
    let camera, scene, renderer;
    
    let pAlpha = 0;
    let particles, count = 0;
    let energy = 0;

    let mouseX = 0, mouseY = 0;

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    const initMouseX = -2000
    const destMouseX = 1000
    const initMouseY = 0.5 * 500
    const destMouseY = 500
    let progress = 0

    // this.init = init;
    // this.animate = animate;
    this.click = onPointerClick;
    this.move = resetCount;

    init()
    animate()

    function init() {

        container = document.createElement( 'div' );
        if (document.getElementsByClassName("backdrop")[0] !== undefined) {
            document.getElementsByClassName("backdrop")[0].appendChild( container );
        } else {
            document.body.appendChild( container );
        }

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 1000;
        camera.position.x = initMouseX
        camera.position.y = initMouseY

        scene = new THREE.Scene();

        //

        const numParticles = AMOUNTX * AMOUNTY;

        const positions = new Float32Array( numParticles * 3 );
        const scales = new Float32Array( numParticles );

        let i = 0, j = 0;

        for ( let ix = 0; ix < AMOUNTX; ix ++ ) {

            for ( let iy = 0; iy < AMOUNTY; iy ++ ) {

                positions[ i ] = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 ); // x
                positions[ i + 1 ] = 0; // y
                positions[ i + 2 ] = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 ); // z

                scales[ j ] = 1;

                i += 3;
                j ++;

            }

        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.setAttribute( 'scale', new THREE.BufferAttribute( scales, 1 ) );

        const material = new THREE.ShaderMaterial( {

            uniforms: {
                color: { value: new THREE.Color( 0xbfbfbf ) },
                alpha: { value: 0},
                radius: { value: 0.},
                mouseX: { value: 0.5},
                mouseY: { value: 0.5},
                energy: { value: 0},
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader

        } );

        //

        particles = new THREE.Points( geometry, material );
        scene.add( particles );

        //

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );

        container.style.touchAction = 'none';
        // container.addEventListener( 'pointermove', onPointerMove );
        // container.addEventListener( 'pointerdown', onPointerClick );
        document.addEventListener( 'pointermove', onPointerMove );
        document.addEventListener( 'pointerdown', onPointerClick );

        //

        window.addEventListener( 'resize', onWindowResize );

    }

    function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    //

    function onPointerMove( event ) {

        if ( event.isPrimary === false ) return;

        mouseX = (event.clientX - windowHalfX) / (windowHalfX * 2);
        mouseY = (event.clientY - windowHalfY) / (windowHalfY * 2);

        energy = Math.min(60, energy + 5);
    }

    function onPointerClick( event ) {
        energy = 120;
    }

    function resetCount() {
        count = 0;
    }

    //

    function animate() {

        requestAnimationFrame( animate );

        render();

    }
    function render() {

        particles.material.uniforms.alpha.value = Math.min(1, count/12);
        particles.material.uniforms.radius.value = Math.min(count * 200, 2500);
        particles.material.uniforms.energy.value += (energy/60 - particles.material.uniforms.energy.value) * 0.05;

        particles.material.uniforms.mouseX.value += (0.52532198881 * mouseX + 0.52532198881 * mouseY - particles.material.uniforms.mouseX.value) * 0.05;
        particles.material.uniforms.mouseY.value += (0.85090352453 * mouseY - 0.85090352453 * mouseX - particles.material.uniforms.mouseY.value) * 0.05;

        const scrollMax = document.body.clientHeight - window.innerHeight;
        const scrollY = scrollMax != 0 ? window.scrollY/scrollMax : 0;
        
        progress = Math.min(count/12, 1);
        camera.position.x += (( initMouseX * ( 1 - progress) + destMouseX * progress ) + mouseX * 0.5 * 1000 - camera.position.x ) * 0.05;
        camera.position.y += (( initMouseY * ( 1 - progress) + destMouseY * progress ) - mouseY * 0.5 * 500 - (scrollY - 1) * 2 * 250 - camera.position.y ) * .05;

        camera.lookAt( scene.position );

        const positions = particles.geometry.attributes.position.array;
        const scales = particles.geometry.attributes.scale.array;

        let i = 0, j = 0;

        for ( let ix = 0; ix < AMOUNTX; ix ++ ) {

            for ( let iy = 0; iy < AMOUNTY; iy ++ ) {

                positions[ i + 1 ] = ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) +
                                ( Math.sin( ( iy + count ) * 0.5 ) * 50 );

                scales[ j ] = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 20 +
                                ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 20;

                i += 3;
                j ++;

            }

        }

        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.scale.needsUpdate = true;

        renderer.render( scene, camera );

        count += 0.1;
        energy = Math.max(0, energy-1); 

    }
}