//Bounds for play area
const X_BOUND = 10
const Y_BOUND = 20
const MAX_SAND = 10
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
    O:  [[-0.5, 0.5],   [0.5, 0.5],  [0.5, -0.5], [-0.5, -0.5]],
    T:  [[-1,0],   [0, 0],  [1, 0],  [0, -1]],
    L:  [[0, 1],   [0, 0],  [0, -1],  [1, -1]],
    J:  [[0, 1],   [0, 0],  [0, -1],  [-1, -1]],
    S:  [[1, -1],  [0, -1],  [0, 0],  [-1, 0]],
    Z:  [[-1, -1], [0, -1], [0, 0],  [1, 0]]
}

const sq_pos = {
    I: {x: 5, y: 18},
    O: {x: 4.5, y: 18.5},
    T: {x: 5, y: 18},
    L: {x: 5, y: 18},
    J: {x: 5, y: 18},
    S: {x: 5, y: 18},
    Z: {x: 5, y: 18}
}


//Tetramino constructor
class Tetramino{
    constructor(shape) {
        this.color = colors[shape];
        this.rotation = 0;
        this.pos = {x: sq_pos[shape].x, y: sq_pos[shape].y};
        this.shape = shape;
        this.points = squares[shape].slice();
    }
    rotate() {
        var rotation = math.matrix([[0,1],[-1,0]]);
        for(var i = 0; i < this.points.length; i++){
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
class State {
    constructor() {
        this.tetraminoes = null;
        this.next = [];
        this.free_blocks = [];
        this.history = [];
        this.ticks = 0;
        this.score = 0;
        this.sand  = 0;
        this.reset()
    };
    //Advanced state one step.
    //Moves current tetramino down one step, or drops a new tetramino
    tick() {
        //Checks to see if block can be lowered
        var can_lower = () => {
            var collision = true;
            //Check each point on current tetramino and see if there is a block/floor immediately beneath it.
            this.tetraminoes.get_points().forEach( (p) => {
                var new_x = p[0]
                var new_y = p[1] - 1 
                if(new_y < 0 || this.free_blocks[new_y][new_x][0] == 1){
                    collision = false;
                }
            })
            return collision;
        }
        //If there is no current tetramino, update it.
        if(this.tetraminoes == null) {
            var s = shapes[math.floor(math.random() * 7)]
            this.tetraminoes = this.next.pop()
            if(this.next.length == 0){
                this.next.push(new Tetramino(s))
            }
            this.add_tetramino()
        } else {
            this.remove_tetramino()
            var coll = !can_lower()
            //If there is a collision, then stop the tetramino and move it to the free blocks.
            //Set current tetramino to null
            if(coll){
                this.add_tetramino()
                var out = this.tetraminoes.get_points().some( (x) => x[1] >= Y_BOUND - 2)
                this.tetraminoes = null
                this.sand++
                return !out
            } else {
                //No collision, so move tetramino down.
                this.tetraminoes.translate(0, -1)
                this.add_tetramino()
            }
        }
        //Update number of ticks. Used for determining speed, and possibly rewind feature.
        this.ticks += 1
        var copy = new Tetramino(this.tetraminoes.shape);
        copy.pos = {x: this.tetraminoes.pos.x, y: this.tetraminoes.pos.y}
        copy.points = this.tetraminoes.points.slice()
        this.history.push( [this.free_blocks.map( (x) => x.slice()), copy])
        if(this.history.length > MAX_SAND){
            this.history.shift()
        }
        return true
    };
    //Checks if points are already filled
    collision(points) {
        var coll = false
        points.forEach( (p) => {
            if (p[0] < 0 || p[0] >= X_BOUND || p[1] < 0 || 
                this.free_blocks[p[1]][p[0]][0] == 1){
                coll = true
            }
        })
        return coll

    };
    //Rotate current tetramino
    rotate_tetramino() {
        this.remove_tetramino()
        this.tetraminoes.rotate()
        //If there is a collision, then rotate tetramino back.
        if(this.collision(this.tetraminoes.get_points())){
            this.tetraminoes.rotate()
            this.tetraminoes.rotate()
            this.tetraminoes.rotate()
        }
        this.add_tetramino()
    };
    //Horizonally shift the current tetramino by x
    shift_tetramino(x, y1){
        this.remove_tetramino()
        var points = this.tetraminoes.get_points()
        points = points.map( (y) => [y[0] + x, y[1] + y1] )
        //If there is not a collision, then translate the tetramino
        if(!this.collision(points)){
           this.tetraminoes.translate(x, y1)
        }
        this.add_tetramino()
    };
    //Adds tetramino to state grid
    add_tetramino() {
        this.tetraminoes.get_points().forEach( p => {
            this.free_blocks[p[1]][p[0]] = [1, this.tetraminoes.color]
        })
    };
    //Clears out full rows and returns a list of rows that were cleared
    clear_rows(){
        //dont move current tetramino
        this.remove_tetramino()
        //Remove row x and shift everything down
        var clear = (x) => {
            for(var i = x; i < Y_BOUND - 1; i++){
                this.free_blocks[i].forEach( (x, j) => {
                    this.free_blocks[i][j] = this.free_blocks[i + 1][j]
                    this.free_blocks[i+1][j] = [0, null]
                })
            }
        }
        for(var i = 0; i < Y_BOUND; i++){
            //If row is full, then clear it.
            if(this.free_blocks[i].every( (val) => val[0] == 1 )){
                clear(i)
                this.score++
                i--
            }
        }
        this.add_tetramino()
    };
    //Remove tetramino from state grid
    remove_tetramino() {
        this.tetraminoes.get_points().forEach( p => {
            this.free_blocks[p[1]][p[0]] = [0, null]
        })
    };
    //Resets states variables.
    reset() {
        this.tetraminoes = null
        this.next = [new Tetramino(shapes[math.floor(math.random() * 7)])]
        this.free_blocks = []
        this.ticks = 0
        this.score = 0
        for(var i = 0; i < Y_BOUND; i++){
            this.free_blocks.push([])
            for(var k = 0; k < X_BOUND; k++){
                this.free_blocks[i].push([0, null]);
            }
        }
        this.history = []
    };
    //Return a list of points of all blocks in the game.
    get_points(){
        out = []
        //Grab all free block points
        for(var i = 0; i < Y_BOUND; i++){
            for(var k = 0; k < X_BOUND; k++){
                if(this.free_blocks[i][k][0] == 1){
                    out.push(new Free_Block(k, i, this.free_blocks[i][k][1]))
                }
            }
        }
        return out
    }
    //revert state back 1 tick
    rewind(){
        if(this.sand > 0){
            var hist = this.history.pop()
            this.free_blocks = hist[0]
            if(hist[1] == null){
                this.next.push(this.tetraminoes)
            }
            this.tetraminoes = hist[1]
            this.sand--
        }
    }
}
var state = new State()
