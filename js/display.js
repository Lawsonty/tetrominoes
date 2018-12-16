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

var chonk = 10;
var rot = Math.PI/180


var geom = new THREE.BoxGeometry(chonk,chonk,chonk);
var geom_long = new THREE.BoxGeometry(chonk*10,chonk/10,chonk);
var material = new THREE.MeshNormalMaterial();
var material_long = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh( geom, material );
//scene.add( cube );


function cube_at( x, y, z) {
    var tmp = new THREE.Mesh(geom, material);
    tmp.position.x = x;
    tmp.position.y = y;
    tmp.position.z = z;

    scene.add( tmp);

}

function bar_at (x, y, z, rotate){
    var tmp = new THREE.Mesh(geom_long, material);
    tmp.position.x = x;
    tmp.position.y = y;
    tmp.position.z = z;
    if (rotate){
        tmp.rotation.z += 90 * rot;
    }
    scene.add( tmp);
}
/*
cube_at(0, 0, -10);
cube_at(chonk, chonk, 0);
cube_at(-(chonk), -(chonk), 0);
*/
for( i = 0; i < 10; i++){
    cube_at(chonk*i, chonk*i, 0);

}

console.log(i);
for( ; i < 20; i++){
    cube_at(chonk*10, chonk*i, 0);
}

//bar_at(chonk/2+3, chonk/2+3, 0, true);


var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
camera.position.set(0, 0, 400);
scene.add(camera);


camera_focus = cube.position;
camera_focus.x = 50;
camera_focus.y = 50;

camera.lookAt(cube.position);
console.log(cube.position);
document.body.appendChild( renderer.domElement );




function draw_null() {
    //nop for now
    return;
}

function draw_filled(block, loc) {
    


    return;
}


function draw_frame() {
    renderer.render(scene, camera);
        
    cube.rotation.x += 1 * (rot)
    cube.rotation.z += .5 * rot

    //loop again
    requestAnimationFrame(draw_frame);
}

draw_frame();



