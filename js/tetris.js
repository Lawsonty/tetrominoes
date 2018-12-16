//Bounds for play area
const X_BOUND = 10
const Y_BOUND = 21
//Define the types of shapes
const shapes = ['I', 'O', 'T', 'L', 'J', 'S', 'Z']

//Define the colors fo each shape
const colors = {
    I:  "#00FFFF",
    O:  "#FFFF00",
    T:  "#FF00FF",
    L:  "#0000FF",
    J:  "#FFA500",
    S:  "#008000",
    Z:  "#FF0000"
}

//List shape's relative points
const squares = {
    I:  [[-1, 0],  [0, 0],  [1, 0],  [2, 0]],
    O:  [[0, 0],   [1, 0],  [0, -1], [1, -1]],
    T:  [[-1,0],   [0, 0],  [1, 0],  [0, -1]],
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
        this.pos = {x: 5, y: 18};
        this.shape = shape;
        this.points = squares[shape].slice();
    }
    rotate() {
        var rotation = math.matrix([[0,-1],[1,0]]);
        for(i = 0; i < this.points.length; i++){
            this.points[i] = math.multiply(rotation, this.points[i])._data;
        }
    };
    //Translates tetramino by x and y, checking for a collision first.
    //0 == collision, 1 == side collision, 2 == bottom collision
    translate(x, y) {
        this.pos.x += x;
        this.pos.y += y;
    };
    //Return a list of points representing each of the tetraminoes
    //squares
    get_points(){
        var out = [];
        this.points.forEach( (p) => {
            out.push([this.pos.x + p[0], this.pos.y + p[1]]);
        })
        return out;
    }
}

//Class for storing the coords and color of a free block.
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
    //Advanced state one step.
    //Moves current tetramino down one step, or drops a new tetramino
    tick: function(){
        //Checks to see if block can be lowered
        var can_lower = () => {
            collision = true;
            //Check each point on current tetramino and see if there is a block/floor immediately beneath it.
            state.tetraminoes.get_points().forEach( (p) => {
                var new_x = p[0]
                var new_y = p[1] - 1 
                console.log(p)
                if(new_y < 0 || state.free_blocks[new_y][new_x][0] == 1){
                    collision = false;
                }
            })
            return collision;
        }
        //If there is no current tetramino, update it.
        if(state.tetraminoes == null) {
            var s = shapes[math.floor(math.random() * 7)]
            state.tetraminoes = state.next[state.next.length - 1]
            state.next[state.next.length - 1] = new Tetramino(s)
            state.add_tetramino()
        } else {
            state.remove_tetramino()
            var coll = !can_lower()
            //If there is a collision, then stop the tetramino and move it to the free blocks.
            //Set current tetramino to null
            if(coll){
                state.add_tetramino()
                state.tetraminoes = null
            } else {
                //No collision, so move tetramino down.
                state.tetraminoes.translate(0, -1)
                state.add_tetramino()
            }
        }
        //Update number of ticks. Used for determining speed, and possibly rewind feature.
        state.ticks += 1
        return
    },
    //Checks if points are already filled
    collision: (points) => {
        var coll = false
        points.forEach( (p) => {
            if (p[0] < 0 || p[0] >= X_BOUND || p[1] < 0 || 
                state.free_blocks[p[1]][p[0]] == 1){
                coll = true
            }
        })
        return coll

    },
    //Rotate current tetramino
    rotate_tetramino: () => {
        state.remove_tetramino()
        state.tetraminoes.rotate()
        //If there is a collision, then rotate tetramino back.
        if(state.collision(state.tetraminoes.get_points())){
            state.tetraminoes.rotate()
            state.tetraminoes.rotate()
            state.tetraminoes.rotate()
        }
        state.add_tetramino()
    },
    //Horizonally shift the current tetramino by x
    shiftx_tetramino: (x) => {
        state.remove_tetramino()
        var points = state.tetraminoes.get_points()
        points = points.map( (y) => [y[0] + x, y[1]] )
        //If there is not a collision, then translate the tetramino
        if(!state.collision(points)){
           state.tetraminoes.translate(x, 0)
        }
        state.add_tetramino()
    },
    //Adds tetramino to state grid
    add_tetramino: () => {
        state.tetraminoes.get_points().forEach( p => {
            state.free_blocks[p[1]][p[0]] = [1, state.tetraminoes.color]
        })
    },
    //Clears out full rows and returns a list of rows that were cleared
    clear_rows: () => {
        var out = []
        var offset = 0
        for(var i = 0; i < (Y_BOUND - 1 - offset); i++){
            do {
                if(state.free_blocks[i].every( (val) => val[0] == 1)) {
                    state.free_blocks[i] = state.free_blocks[i].map( (x) => [0, null])
                    out.push(i)
                    offset += 1
                }
                for(var k = 0; k < X_BOUND; k++){
                    state.free_blocks[i][k] = state.free_blocks[i+1 + offset][k] 
                    state.free_blocks[i+1 + offset][k] = [0, null]
                }
            }
            while(state.free_blocks[i].every( (val) => val[0] ==1));
        }
        return out
    },
    //Remove tetramino from state grid
    remove_tetramino: () => {
        state.tetraminoes.get_points().forEach( p => {
            state.free_blocks[p[1]][p[0]] = [0, null]
        })
    },
    //Return a list of points of all blocks in the game.
    get_points: () => {
        out = []
        //Grab all free block points
        for(var i = 0; i < Y_BOUND; i++){
            for(var k = 0; k < X_BOUND; k++){
                if(state.free_blocks[i][k][0] == 1){
                    out.push(new Free_Block(k, i, state.free_blocks[i][k][1]))
                }
            }
        }
        return out
    }
}
//Initialize state
for(var i = 0; i < Y_BOUND; i++){
    state.free_blocks.push([])
    for(var k = 0; k < X_BOUND; k++){
        state.free_blocks[i].push([0, null]);
    }
}
