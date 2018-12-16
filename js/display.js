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

//var material = new THREE.MeshStandardMaterial();
//material.color="blue";

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



for( i = 0; i < 10; i++){
    cube_at(chonk*i, chonk*i, 0);

}

console.log(i);
for( ; i < 20; i++){
    cube_at(chonk*10, chonk*i, 0);
}



//make and add camera to the scene

var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
camera.position.set(50, 50, 400);
camera_focus = cube.position;
camera_focus.x = 50;
camera_focus.y = 50;

camera.lookAt(cube.position);
scene.add(camera);


//make and add  light source to the scene.



document.body.appendChild( renderer.domElement );




function gen_block(x, y, color){
    //inside this function we scale x and y based on chonk size 

    //currently we ignore color. 

    var g = new THREE.BoxGeometry(chonk,chonk,chonk);
    var m = new THREE.MeshNormalMaterial();
    var tmp = new THREE.Mesh(g, m);
    tmp.position.x = x * chonk;
    tmp.position.y = y * chonk;
    tmp.position.z = 0;
    return tmp;
}

function display(grid){
    scene = new_scene(grid)
    return;
}

const TETRIS_COL = 10;
const TETRIS_ROW = 20;

function new_scene(g){


    var s = new THREE.Scene;
    s.add(camera);

    //add camera, add light object
    
    //have to define i < 20 here. 
    for( i = 0; i < TETRIS_ROW; i++){
        for( j = 0; j < TETRIS_COL; j++){
            current = g[i][j]
            
            if( current[0] ){
                block = gen_block( j, i, current[1]);
                console.log(block);
                s.add(block);
            }

        }
    }


    return s;

}

const matrix = new Array(20).fill(0).map(() => new Array(10).fill([0]));
matrix[0][0] = [1];

function draw_frame() {
    renderer.render(scene, camera);
        
    console.log("Render loop");
    //loop again
    requestAnimationFrame(draw_frame);
}

draw_frame();



