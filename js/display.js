/*
Display JS 
Erich's place


*/

var cnv = document.getElementById("tetro_window");


const matrix = new Array(21).fill(0).map(() => new Array(11).fill([0]));
matrix[0][0] = [1, "Cyan"];
matrix[1][0] = [1, "Yellow"];
matrix[2][0] = [1, "Orange"];
matrix[3][0] = [1, "Red"];
matrix[4][0] = [1, "Blue"];
matrix[2][1] = [1, "Cyan"];
matrix[4][1] = [1, "Blue"];



matrix[0][3] = [1];
matrix[1][3] = [1];
matrix[2][3] = [1];
matrix[0][4] = [1];
matrix[0][5] = [1];
matrix[1][5] = [1];
matrix[2][5] = [1];


matrix[0][7] = [1];
matrix[1][7] = [1];
matrix[2][7] = [1];
matrix[3][7] = [1];
matrix[4][7] = [1];

matrix[2][8] = [1];
matrix[3][9] = [1];
matrix[1][9] = [1];
matrix[0][10] = [1];
matrix[4][10] = [1];

//display(matrix)


//Constants
const width = 400;
const height = 800;
const TETRIS_COL = 10;
const TETRIS_ROW = 20;
const chunk_size = 40;

const color_to_hex = {
    "Cyan":     0x00ffff,
    "Yellow":   0xffff00,
    "Magenta":  0xff00ff,
    "Blue":     0x0000ff,
    "Orange":   0xffa500,
    "Green":    0x00ff00,
    "Red":      0xff0000,
}

//globals
var camera, light, scene;
var renderer;


function gen_block(x, y, color){
    //inside this function we scale x and y based on chunk_size size 

    //currently we ignore color. 

    var g = new THREE.BoxGeometry(chunk_size,chunk_size,chunk_size);
    //either apply the color or put a normal object if undef.
    if (color) {
        var m = new THREE.MeshStandardMaterial();
        m.color = new THREE.Color( color_to_hex[color] );

    }
    else{
        var m = new THREE.MeshNormalMaterial();
    }
    var tmp = new THREE.Mesh(g, m);
    tmp.position.x = (x + .5) * chunk_size; //offset of the centers so that bottom left corner is in (0,0)
    tmp.position.y = (y + .5) * chunk_size;
    tmp.position.z = 0;
    return tmp;
}

function display(grid){
    scene = new_scene(grid)
    return;
}


function new_scene(g){


    var s = new THREE.Scene;
    //s.add(camera);
    s.add(light);
    //add camera, add light object
    
    //have to define i < 20 here. 
    for( i = 0; i < TETRIS_ROW; i++){
        for( j = 0; j < TETRIS_COL; j++){
            current = g[i][j]
            
            if( current[0] ){
                block = gen_block( j, i, current[1]);
                //console.log(block);
                s.add(block);
            }

        }
    }


    return s;

}


function init(){
    renderer = new THREE.WebGLRenderer( {canvas: tetro_window} );
    renderer.setSize(width, height);

    scene = new_scene(matrix);


    //place holder to point the camera at. Fix this later.
    var tmpg = new THREE.BoxGeometry(chunk_size, chunk_size, chunk_size);
    var tmpm = new THREE.MeshNormalMaterial();
    var cube = new THREE.Mesh( tmpg,tmpm);
    scene.add( cube );


    light = new THREE.AmbientLight( 0xffffff, 2.0 );

    //new THREE.Vector3(0, 0, -1)
    //Camera( left plane, right plane, top plane, bottom plane, nearest object to view, farthest distance to view)
    //SEE: https://en.wikipedia.org/wiki/Viewing_frustum or Three.js docs.
    camera = new THREE.OrthographicCamera( width/-2, width/2, height/2, height/-2, 1, 1000);

    //because this is ortho camera z does not matter. 500 is just a placeholder
    //and would be an okay value for perspective
    camera.position.set( chunk_size*(TETRIS_COL/2) , chunk_size*(TETRIS_ROW/2), 500);
    camera_focus = cube.position;
    camera_focus.x = chunk_size * 5;
    camera_focus.y = chunk_size*10;

    camera.lookAt(cube.position);
    scene.add(camera);


    scene.add(light);

    document.body.appendChild( renderer.domElement);
}


function draw_frame() {
    renderer.render(scene, camera);
        
    console.log("Render loop");
    //loop again
    requestAnimationFrame(draw_frame);
}
init();
draw_frame();



