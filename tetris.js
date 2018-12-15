//Bounds for play area
const X_BOUND = 30
const Y_BOUND = 50

//Define the types of shapes
const shapes = ['I', 'O', 'T', 'L', 'J', 'S', 'Z']

//Define the colors fo each shape
const colors = {
    I:  "Cyan",
    O:  "Yellow",
    T:  "Magenta",
    L:  "Blue",
    J:  "Orange",
    S:  "Green",
    Z:  "Red"
}

//List shape's relative points
const squares = {
    I:  [[-1, 0],  [0,0],   [1, 0],  [2,0]],
    O:  [[0, 0],   [1, 0],  [0, -1], [1, -1]],
    T:  [[-1,0],   [0,0],   [1, 0],  [0, -1]],
    L:  [[0, 2],   [0, 1],  [0, 0],  [1, 0]],
    J:  [[0, 2],   [0, 1],  [0, 0],  [-1, 0]],
    S:  [[-1, 0],  [0, 0],  [1, 0],  [1, -1]],
    Z:  [[-1, -1], [0, -1], [0, 0],  [1, 0]]
}




//Tetramino constructor
class Tetramino{
    constructor(shape) {
        this.color = colors[shape];
        this.rotation = 0;
        this.pos = {x: 15, y: 50};
        this.shape = shape;
        this.points = squares[shape];
    }
    rotate() {
        var rotation = math.matrix([[0,-1],[1,0]]);
        for(i = 0; i < this.points.length; i++){
            this.points[i] = math.multiply(rotation, this.points[i]);
        }
    };
    //Translates tetramino by x and y, checking for a collision first.
    //0 == collision, 1 == side collision, 2 == bottom collision
    translate(x, y) {
        var collision = 0
        this.points.forEach(
            (p) => {
                var new_x = this.pos.x + x + p[0]
                var new_y = this.pos.y + y + p[1]
                if(new_x > X_BOUND || new_x < 0 || state.free_blocks[new_y][new_x][0] == 1){
                    collision = 1;
                    return;
                }
                if(new_y < 0 || state.free_blocks[new_y][new_x][0] == 1)
                    collision = 2;
            }
        );
        if(collision == 0){
            this.pos.x += x;
            this.pos.y += y;
        }
        return collision
    };
    //Return a list of points representing each of the tetraminoes
    //squares
    get_points(){
        var out = [];
        this.points.forEach( (p) => {
            out.push([this.pos.x + p[0], thix.pos.y + p[2]]);
        })
        return out;
    }
}

class Free_Block{
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color
    }
}


//Game state
//Tetraminoes is the list of all floating tetraminoes
//free_blocks is the list of points no longer part of floating tetraminoes
var state = {
    tetraminoes: null,
    next: [new Tetramino(shapes[math.floor(math.random() * 7)])],
    free_blocks: [],
    ticks:  0,
    tick: function(){
        if(state.tetraminoes == null) {
            var s = shapes[math.floor(math.random() * 7)]
            state.tetraminoes = state.next[state.next.length - 1]
            state.next[state.next.length - 1] = new Tetramino(s)
        } else {
            var coll = state.tetraminoes.translate(0, -1)
            if(coll == 2){
                state.tetraminoes.get_points().forEach( p => {
                    state.free_blocks[p[1]][p[0]] = [1, state.tetraminoes.color]
                })
                state.tetraminoes = null
            }
        }
        state.ticks += 1
        return
    },
    get_points: () => {
        out = []
        for(var i = 0; i < Y_BOUND; i++){
            for(var k = 0; k < X_BOUND; k++){
                if(state.free_blocks[i][k][0] == 1){
                    out.push(Free_Block(k, i, state.free_blocks[i][k][1]))
                }
            }
        }
        if(state.tetraminoes != null){
            state.tetraminoes.get_points.forEach(
                (p) => {
                    out.push(Free_Block(p[0], p[1], state.tetraminoes.color))
                }
            )
        }
        return out
    }
}
for(var i = 0; i < Y_BOUND; i++){
    state.free_blocks.push([])
    for(var k = 0; k < X_BOUND; k++){
        state.free_blocks[i].push([0]);
    }
}
