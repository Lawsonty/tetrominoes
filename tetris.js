//Define the types of shapes
var shapes = ['I', 'O', 'T', 'L', 'J', 'S', 'Z']
//Define the colors fo each shape
var colors = {
    I:  "Cyan",
    O:  "Yellow",
    T:  "Magenta",
    L:  "Blue",
    J:  "Orange",
    S:  "Green",
    Z:  "Red"
}

//List shape's relative points
//May need to fix point's y axis and center
var squares(shapes) = {
    I:  [[-1, 0], [0,0],   [1, 0], [2,0]],
    O:  [[0, 0],  [1, 0],  [0, 1], [1, 1]],
    T:  [[-1,0],  [0,0],   [1, 0], [0, 1]],
    L:  [[0, -2], [0, -1], [0, 0], [1, 0]],
    J:  [[0, -2], [0, -1], [0, 0], [-1, 0]],
    S:  [[-1, 0], [0, 0],  [1, 0], [1, 1]],
    Z:  [[-1, 1], [0, 1],  [0, 0], [1, 0]]
}

//Tetramino constructor
function Tetramino(shape){
    this.color = colors[shape];
    this.rotation = 0;
    this.pos = {x: 15, y: 50};
    this.shape = shape;
    this.points = squares[shape];
    this.rotate = function() {
        //Fix if change the y-axis of points in squares var
        rotation = math.matrix{[[0,1],[-1,0]]};
        for(i = 0; i < this.points.length; i++){
            this.points[i] = rotation * this.points[i];
        }
    };
    this.translate = function(x, y) {
        this.pos.x += x;
        this.pos.y += y;
    };
    this.get_points = function(){
        var out = [];
        this.points.forEach( function(p){
            //also change this
            out.push([this.pos.x + p[0], thix.pos.y - p[2]]);
        }
        return out;
    }
}

function Free_Block(x, y){
    this.x = x;
    this.y = y;
}

//Game state
//Tetraminoes is the list of all floating tetraminoes
//free_blocks is the list of points no longer part of floating tetraminoes
var state = {
    tetraminoes = []
    free_blocks = []
}
