//SOUMA 
//tetris.js
//an implementation of tetris in javascript

// CANVAS
var canvas = document.getElementById("gl-canvas");
var ctx = canvas.getContext("2d");

// CONSTANTS
var HEIGHT = canvas.height;
var WIDTH = canvas.width;
var BLOCK = HEIGHT/20;
var GRID = [];

// GLOBALS
var pieceLock = false;

// buttons
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var rightHeld = false;
var leftHeld = false;
var upHeld = false;
var downHeld = false;
var rotRightPressed = false;
var rotLeftPressed = false;
var rotRightHeld = false;
var rotLeftHeld = false;

// event listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//document.addEventListener("mousemove", mouseMoveHandler, false);

//init GRID
for (var r=0; r<10; ++r) {
    GRID[r] = [];
    for (var c=0; c<20; ++c) {
        GRID[r][c] = { status: false, color: "blue" };
    } 
}

// key down handler
function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
        //console.log("RIGHT");
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
        //console.log("LEFT");
    }
    else if(e.keyCode == 38) {
        upPressed = true;
        //console.log("UP");
    }
    else if(e.keyCode == 40) {
        downPressed = true;
        //console.log("DOWN");
    }  
    else if(e.keyCode == 90) {
        rotLeftPressed = true;
        //console.log("z");
    } 
    else if(e.keyCode == 88) {
        rotRightPressed = true;
        //console.log("x");
    }       
}

// key up handler
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
    else if(e.keyCode == 38) {
        upPressed = false;
    }
    else if(e.keyCode == 40) {
        downPressed = false;
    } 
    else if(e.keyCode == 90) {
        rotLeftPressed = false;
    } 
    else if(e.keyCode == 88) {
        rotRightPressed = false;
    }    
}

// draws a block
function drawBlock (r, c, color) {
    var x = r * BLOCK;
    var y = c * BLOCK;

    ctx.beginPath();
    ctx.rect(x, y, BLOCK, BLOCK);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.rect(x, y, BLOCK, BLOCK);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();    

}

// draws walls for playing field
function drawWalls () {
    for (var r = 4; r < 16; r=r+11) {
        for (var c = 0; c < 20; ++c)
            drawBlock(r, c, "gray");
    }
}

// draws all block in GRID
function drawGrid () {
    for (var r=0; r < 10; ++r) {
        for (var c=0; c < 20; ++c) {
            if ( GRID[r][c].status )
                drawBlock(r+5 , c, GRID[r][c].color);
        }
    }
}

// sets a block in GRID
function setGrid (r, c, color) {   
    if ( (r < 0) || (r > 9) || (c < 0) || (c > 19) ){
        console.log("WRITING OUT OF BOUNDS");
        console.log("r: "+r);
        console.log("c: "+c);        
    } else {
        GRID[r][c].status = true;
        GRID[r][c].color = color;
    }
}

// clears a block in GRID
function clearBlock (r, c) {
    GRID[r][c].status = false;
}

// returns status of block in GRID
function getGrid (r, c) {
    if ( (r < 0) || (r > 9) || (c > 19) || (c < 0) )
        return true;
    else
        return GRID[r][c].status;
}

// returns y indices of filled lines
function checkGridLines () {
    var out = [];
    var notFilled = false;
    for (var c=0; c < 20; ++c) {
        notFilled = false;
        for (var r=0; r < 10; ++r) {
            if ( !(GRID[r][c].status) )
                notFilled = true;
        }
        if (!notFilled)
            out.push(c);
    }
    
    return out;

}

// clears a line from GRID
function clearLine(y) {
    for (var r=0; r < 10; ++r) {
        GRID[r][y].status = false;
    }

}

// moves all pieces down after line clears
function moveDown(y) {
    --y;
    for (var c=y; c>=0; --c) {
        for (var r=0; r < 10; ++r) {
            if (GRID[r][c].status) {
                GRID[r][c].status = false;
                GRID[r][c+1].status = true;
            }
        }
    } 

}

// returns grid of piece by type and orientation
function getPieceGrid (type, orientation) {
    var grid;
    // L piece
    if (type === 0){
        switch (orientation) {
            case 0:
                grid = [[0, 1, 1],  // OOO
                        [0, 1, 0],  // XXX
                        [0, 1, 0]]; // XOO
                break;
            case 1:
                grid = [[1, 0, 0],  // XXO
                        [1, 1, 1],  // OXO
                        [0, 0, 0]]; // OXO
                break;
            case 2:
                grid = [[0, 0, 1],  // OOO
                        [0, 0, 1],  // OOX
                        [0, 1, 1]]; // XXX
                break;
            case 3:
                grid = [[0, 0, 0],  // OXO
                        [1, 1, 1],  // OXO
                        [0, 0, 1]]; // OXX
                break;
            default:                                             
        }
        return grid;
    }
    // I piece
    if (type === 1){
        switch (orientation) {
            case 0:
                grid = [[0, 1, 0, 0],   // OOOO
                        [0, 1, 0, 0],   // XXXX
                        [0, 1, 0, 0],   // OOOO
                        [0, 1, 0, 0]];  // OOOO
                break;            
            case 1:
                grid = [[0, 0, 0, 0],   // OOXO
                        [0, 0, 0, 0],   // OOXO
                        [1, 1, 1, 1],   // OOXO
                        [0, 0, 0, 0]];  // OOXO
                break;   
            default:     
        }
        return grid;
    
    }
    // J piece
    if (type === 2){
        switch (orientation) {
            case 0:
                grid = [[0, 1, 0],  // OOO
                        [0, 1, 0],  // XXX
                        [0, 1, 1]]; // OOX
                break;
            case 1:
                grid = [[0, 0, 1],  // OXO
                        [1, 1, 1],  // OXO
                        [0, 0, 0]]; // XXO
                break;
            case 2:
                grid = [[0, 1, 1],  // OOO
                        [0, 0, 1],  // XOO
                        [0, 0, 1]]; // XXX
                break;
            case 3:
                grid = [[0, 0, 0],  // OXX
                        [1, 1, 1],  // OXO
                        [1, 0, 0]]; // OXO
                break;
            default:                                             
        }
        return grid;
    }  
    // T piece
    if (type === 3){
        switch (orientation) {
            case 0:
                grid = [[0, 1, 0],  // OOO
                        [0, 1, 1],  // XXX
                        [0, 1, 0]]; // OXO
                break;
            case 1:
                grid = [[0, 1, 0],  // OXO
                        [1, 1, 1],  // XXO
                        [0, 0, 0]]; // OXO
                break;
            case 2:
                grid = [[0, 0, 1],  // OOO
                        [0, 1, 1],  // OXO
                        [0, 0, 1]]; // XXX
                break;
            case 3:
                grid = [[0, 0, 0],  // OXO
                        [1, 1, 1],  // OXX
                        [0, 1, 0]]; // OXO
                break;
            default:                                             
        }
        return grid;
    }   
    // Square piece
    if (type === 4){
        grid = [[0, 0, 0, 0],  // OOOO
                [0, 1, 1, 0],  // OXXO
                [0, 1, 1, 0],  // OXXO
                [0, 0, 0, 0]]; // OOOO 
        return grid;
    }  
    // S piece
    if (type === 5){
        switch (orientation) {
            case 0:
                grid = [[0, 0, 1],  // OOO
                        [0, 1, 1],  // OXX
                        [0, 1, 0]]; // XXO
                break;
            case 1:
                grid = [[1, 1, 0],  // XOO
                        [0, 1, 1],  // XXO
                        [0, 0, 0]]; // OXO
                break;
            default:                                             
        }
        return grid;
    }      
    // Z piece
    if (type === 6){
        switch (orientation) {
            case 0:
                grid = [[0, 1, 0],  // OOO
                        [0, 1, 1],  // XXO
                        [0, 0, 1]]; // OXX
                break;
            case 1:
                grid = [[0, 0, 0],  // OOX
                        [0, 1, 1],  // OXX
                        [1, 1, 0]]; // OXO
                break;
            default:                                             
        }
        return grid;
    }       
}

// returns the number of orientations for a given type
function getOrientationNum(type) {
    switch(type) {
        case 0:
            return 4;
        case 1:
            return 2;
        case 2:
            return 4;  
        case 3:
            return 4;  
        case 4:
            return 1;
        case 5:
            return 2;
        case 6:
            return 2;                        
        default:
            return 0;
    }
}

// gets correct color for piece type
function getBlockColor (type) {
    switch(type) {
        case 0:
            return "orange";
        case 1:
            return "red";
        case 2:
            return "blue";  
        case 3:
            return "blue";  
        case 4:
            return "yellow";
        case 5:
            return "violet";
        case 6:
            return "green";                        
        default:
            return 0;
    }
}


// single piece object
function Piece (x, y, type, orientation) {
    this.x = x,
    this.y = y,
    this.type = type,
    this.orientation = orientation,
    this.oriNum = 0,
    this.pieceGrid = [],
    this.pieceGridLen = 0,
    this.color,

    // init
    this.pieceGrid = getPieceGrid(this.type, this.orientation);
    this.pieceGridLen = this.pieceGrid[0].length;
    this.oriNum = getOrientationNum(this.type);
    this.color = getBlockColor(this.type);

    // spawn new piece
    this.spawn = function () {
        this.x = 3;
        this.y = -1
        this.type = Math.floor(Math.random()*7);
        this.orientation = 0;
        this.pieceGrid = getPieceGrid(this.type, this.orientation); 
        this.pieceGridLen = this.pieceGrid[0].length;        
        this.oriNum = getOrientationNum(this.type);    
        this.color = getBlockColor(this.type);           
    }
    
    this.refreshPiece = function () {
        this.pieceGrid = getPieceGrid(this.type, this.orientation);
        this.pieceGridLen = this.pieceGrid[0].length;        
    }
    
    this.draw = function() {
        for (var r=0; r < this.pieceGridLen; ++r) {
            for (var c=0; c < this.pieceGridLen; ++c) {
                if (this.pieceGrid[r][c]) {
                    setGrid(this.x+r, this.y+c, this.color);   
                }         
            }
        }
    },
    
    this.clearGrid = function() {
        for (var r=0; r < this.pieceGridLen; ++r) {
            for (var c=0; c < this.pieceGridLen; ++c) {
                if (this.pieceGrid[r][c]) {
                    clearBlock(this.x+r, this.y+c);   
                }         
            }
        }        
    },
    
    this.drop = function() {  
        if (this.checkDown()) {
            this.clearGrid();
            ++this.y;
        } else {
            pieceLock = true;
        }
    },
    
    this.left = function() {
        if (this.checkLeft()) {
            this.clearGrid(this.x, this.y);
            --this.x;
        }
    },

    this.right = function() {
        if (this.checkRight()) {
            this.clearGrid(this.x, this.y);
            ++this.x;
        }
    },
    
    this.up = function() {
        this.clearGrid(this.x, this.y);
        --this.y;
    },
        
    this.checkDown = function() {
        for (var r=0; r < this.pieceGridLen; ++r) {
        for (var c=0; c < this.pieceGridLen; ++c) {
            if (this.pieceGrid[r][c]) {
                if ( (this.y + c) === 19 ) {
                    console.log("collision");
                    return false;
                } else if (c < this.pieceGridLen-1) {
                    if ( !(this.pieceGrid[r][c+1]) &&
                          (getGrid(this.x+r, this.y+c+1)) ) 
                    {
                        console.log("collision");
                        return false;                           
                    }
                } else if (c === this.pieceGridLen-1) {
                    if (getGrid(this.x+r, this.y+c+1)) {
                        console.log("collision");
                        return false;
                    }
                
                }
            }
        }}
        return true;    
    },     
        
    this.checkRight = function() {
        for (var r=0; r < this.pieceGridLen; ++r) {
        for (var c=0; c < this.pieceGridLen; ++c) {
            if (this.pieceGrid[r][c]) {
                if ( (this.x + r) === 9 ) {
                    console.log("collisionA");
                    return false;
                } else if (r < this.pieceGridLen-1) {
                    if ( !(this.pieceGrid[r+1][c]) &&
                          (getGrid(this.x+r+1, this.y+c)) ) 
                    {
                        console.log("collisionB");
                        return false;                           
                    }
                } else if (r === this.pieceGridLen-1) {
                    if (getGrid(this.x+r+1, this.y+c)) {
                        console.log("collisionC");
                        return false;
                    }
                
                }
            }
        }}
        return true;    
    },     
        
    this.checkLeft = function() {
        for (var r=0; r < this.pieceGridLen; ++r) {
        for (var c=0; c < this.pieceGridLen; ++c) {
            if (this.pieceGrid[r][c]) {
                if ( (this.x + r) === 0 ) {
                    console.log("collision");
                    return false;
                } else if (r > 0) {
                    if ( !(this.pieceGrid[r-1][c]) &&
                          (getGrid(this.x+r-1, this.y+c)) ) 
                    {
                        console.log("collision");
                        return false;                           
                    }
                } else if (r === 0) {
                    if (getGrid(this.x+r-1, this.y+c)) {
                        console.log("collision");
                        return false;
                    }
                
                }
            }
        }}
        return true;    
    },    
    
    this.rotateCW = function() {
        if ( this.checkRotation(false) ) {
            this.orientation = ++this.orientation % this.oriNum;    //cycles through 0..oriNum
            console.log("rotate Right");
            this.clearGrid();
            this.refreshPiece();
        }        
    },    

    this.rotateCCW = function() {
        if ( this.checkRotation(true) ) {
            --this.orientation;
            if (this.orientation < 0) this.orientation = this.oriNum-1;
            console.log("rotate Left");
            this.clearGrid();
            this.refreshPiece();   
        }     
    },
    
    this.checkRotation = function(direction) {
        var ori = this.orientation;
        console.log(ori);
        console.log(this.oriNum);
        var nextGrid = [];         
        if (direction === false) {  
            ori = ++ori % this.oriNum;    //cycles through 0..this.oriNum
        }
        if (direction === true) {
            --ori;       
            if (ori < 0) ori = this.oriNum-1;
        }
        console.log(ori);
        nextGrid = getPieceGrid(this.type, ori);


        
        for (var r=0; r < this.pieceGridLen; ++r) {
            for (var c=0; c < this.pieceGridLen; ++c) {
                if ( (nextGrid[r][c]) && 
                     (!this.pieceGrid[r][c]) && 
                     (getGrid(this.x+r, this.y+c)) ) 
                {
                    console.log("collision");
                    return false;                
                }                    
            }
        }
        return true;
    }   
    
}

function playerControl() {
    // controls
    
    // keyboard right
    if (rightPressed) {
        if (!rightHeld) {
            piece.right();
            rightHeld = true;
        }
    } else {
        rightHeld = false;
    }
    // keyboard left
    if (leftPressed) {
        if (!leftHeld) {
            piece.left();
            leftHeld = true;
        }
    } else {
        leftHeld = false;
    } 
    // keyboard up (up)
    /*if (upPressed) {
        if (!upHeld) {
            piece.up();
            upHeld = true;
        }
    } else {
        upHeld = false;
    }*/
    // keyboard down
    if (downPressed) {
        if (!downHeld) {
            piece.drop();
            downHeld = true;
        }
    } else {
        downHeld = false;
    }
    // keyboard up (fast drop)
    if (upPressed) {
            piece.drop();
            upHeld = true;
    } else {
        upHeld = false;
    } 
    // Z key   
    if (rotLeftPressed) {
        if (!rotLeftHeld) {
            piece.rotateCCW();
            rotLeftHeld = true;
        }
    } else {
        rotLeftHeld = false;
    }
    // X key
    if (rotRightPressed) {
        if (!rotRightHeld) {
            piece.rotateCW();
            rotRightHeld = true;
        }
    } else {
        rotRightHeld = false;
    }    


}

function handlePieceLock() {
    var toClear = [];
    toClear = checkGridLines();
    for (var i = 0; i < toClear.length; ++i) {
        clearLine(toClear[i]);
        moveDown(toClear[i]);
    }
    pieceLock = false;
    piece.spawn();
}

function gameLoop () {
    var d = new Date();
    var current = d.getTime();
    var elapsed = current - previous;
    lag += elapsed;
    previous = current;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWalls();
    piece.draw();
    drawGrid();
    
    playerControl(); 
    if (lag > 1000){
        piece.drop();
        lag = 0;
    }
    
    
    // pieceLock
    if (pieceLock) {
        handlePieceLock();
    }


    requestAnimationFrame(gameLoop);
}


var piece = new Piece(0, -1, 6, 0);

//setGrid(5, 10);

for (var i=1; i < 10; ++i) {
    setGrid(i, 19, "orange");
}

var d = new Date();
var previous = d.getTime();
var lag = 0;
gameLoop();






