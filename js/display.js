/*
Display JS 
Erich's place
*/


/*Render testing object*/

const matrix = new Array(21).fill(0).map(() => new Array(11).fill([0]));
matrix[0][0] = [1, "#00FFFF"];
matrix[1][0] = [1, "#FFFF00"];
matrix[2][0] = [1, "#FF00FF"];
matrix[3][0] = [1, "#0000FF"];
matrix[4][0] = [1, "#FFA500"];
matrix[2][1] = [1, "#008000"];
matrix[4][1] = [1, "#FF0000"];

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



function gen_block(x, y, color, wireframe){
    //inside this function we scale x and y based on chunk_size size 
    //currently we ignore color. 
    var g = new THREE.BoxGeometry(chunk_size,chunk_size,chunk_size);

    if(!color){ console.log(color);color = 0xaaaaaa;}
    else{
        console.log(color);
    }

    if(wireframe){

        var m = new THREE.MeshStandardMaterial( {color: 0x000000, wireframe: wireframe} );
    }
    else{
        var m = new THREE.MeshStandardMaterial( );
        m.color = new THREE.Color( color );
    }
    //var g = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    //either apply the color or put a normal object if undef.
    /*
    if (color) {

        var m = new THREE.MeshStandardMaterial();
        m.color = new THREE.Color( color );

        var uniforms = {
            time:{ type: "f", value:0},
            color: {type: "i", value: color}
        };

        
        /*var m = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: document.getElementById('t_vert_shader').innerHTML,
            fragmentShader: document.getElementById('t_frag_shader').innerHTML,
        });*/
    //}
    //else{ var m = new THREE.MeshNormalMaterial(); }
    

    var tmp = new THREE.Mesh(g, m);
    g.dispose();
    m.dispose();
    tmp.position.x = (x + .5) * chunk_size; //offset of the centers so that bottom left corner is in (0,0)
    tmp.position.y = (y + .5) * chunk_size;
    tmp.position.z = 0;

    return tmp;
}


class Display{
    constructor(canvas) {
        //attempt to grab what we can find
        if( !canvas ){
            canvas = "tetro_window"
        }
        
        this.renderer = new THREE.WebGLRenderer( {canvas: document.getElementById(canvas)} );
        //this.renderer.canvas=canvas
        this.renderer.setSize(width, height);

        /*INIT SCENE WITH MATRIX*/
        this.scene = this.new_scene(matrix);

        /*ADD CAMERA OBJECT*/
        //Camera( left plane, right plane, top plane, bottom plane, nearest object to view, farthest distance to view)
        //SEE: https://en.wikipedia.org/wiki/Viewing_frustum or Three.js docs.
        this.camera = new THREE.OrthographicCamera( width/-2, width/2, height/2, height/-2, 1, 1000);

        //because this is ortho camera z does not matter. 500 is just a placeholder
        //and would be an okay value for perspective
        this.camera.position.set( chunk_size*(TETRIS_COL/2) , chunk_size*(TETRIS_ROW/2), 500);

        var camera_focus = new THREE.Vector3(chunk_size*5, chunk_size*10, 0);
        this.camera.lookAt(camera_focus);
        this.scene.add(this.camera);


        /*ADD AMBIENT LIGHT OBJECT*/

        this.light = new THREE.PointLight( 0xffffff, 10.0, 600);
        this.light.position.set( chunk_size*(TETRIS_COL/2), chunk_size*(TETRIS_ROW/2), 300);
        this.scene.add(this.light);


        this.draw_frame();
    };





    clearThree(obj){
        while(obj.children.length > 0){ 
            clearThree(obj.children[0]);
            obj.remove(obj.children[0]);
        } 
        if(obj.geometry) obj.geometry.dispose();
        if(obj.material) obj.material.dispose();
        if(obj.texture) obj.texture.dispose();
    };  



    new_scene(g){
        var s = new THREE.Scene;
        if( this.camera ){
            s.add(this.camera);
        }
        if( this.light ){
            s.add(this.light);
        }
        
        //have to define i < 20 here. 
        for( var i = 0; i < TETRIS_ROW; i++){
            for( var j = 0; j < TETRIS_COL; j++){
                var current = g[i][j];
                
                if( current[0] ){
                    var block = gen_block( j, i, current[1], false);
                    s.add(block);
                    block = gen_block( j, i, current[1], true);
                    s.add(block);
                }
            }
        }
        return s;
    };

    draw_frame() {
        this.renderer.render(this.scene, this.camera);
        console.log("Render loop");
        //loop again
        requestAnimationFrame(this.draw_frame.bind(this));
    };

    display(grid){
        var tmp = this.scene;
        this.scene = this.new_scene(grid);
        clearThree(tmp);
        return;
    };

}


