/*
Display JS 
Erich's place


*/

var cnv = document.getElementById("tetro_window");

var width = cnv.width;
var height = cnv.height;


//Init renderer as canvas

var renderer = new THREE.WebGLRenderer( { canvas: tetro_window} );
renderer.setSize(width, height);

//Init scene

var scene = new THREE.Scene;


var geom = new THREE.BoxGeometry(10,10,10);
var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
var material = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh( geom, material );
scene.add( cube );


var camera = new THREE.PerspectiveCamera(5, width / height, 0.1, 10000);
camera.position.set(0, 350, 400);
scene.add(camera);

camera.lookAt(cube.position);

document.body.appendChild( renderer.domElement );


var rot = Math.PI/180

function draw_frame() {
    renderer.render(scene, camera);
        
    cube.rotation.x += 1 * (rot)
    cube.rotation.z += .5 * rot

    //loop again
    requestAnimationFrame(draw_frame);
}

draw_frame();



