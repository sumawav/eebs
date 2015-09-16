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
        GRID[r][c] = { status: false };
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
function drawBlock (r, c) {
    var x = r * BLOCK;
    var y = c * BLOCK;

    ctx.beginPath();
    ctx.rect(x, y, BLOCK, BLOCK);
    ctx.fillStyle = "blue";
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
            drawBlock(r, c);
    }
}

// draws all block in GRID
function drawGrid () {
    for (var r=0; r < 10; ++r) {
        for (var c=0; c < 20; ++c) {
            if ( GRID[r][c].status )
                drawBlock(r+5 , c);
        }
    }
}

// sets a block in GRID
function setGrid (r, c) {   
    if ( (r < 0) || (r > 9) || (c < 0) || (c > 19) ){
        console.log("WRITING OUT OF BOUNDS");
        console.log("r: "+r);
        console.log("c: "+c);        
    } else {
        GRID[r][c].status = true;
    }
}

// clears a block in GRID
function clearBlock (r, c) {
    GRID[r][c].status = false;
}

// returns status of block in GRID
function getGrid (r, c) {
    if ( (r < 0) || (r > 9) || (c > 19) )
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
}

// returns bounds of piece by type and orientation
function getBounds (type, orientation) {
    var bounds = {};
    var xBound = [];
    var yBound = [];
    var bottomBound = [];
    var leftBound = [];
    var rightBound = []; 
    
    // L piece         
    if (type === 0) {
        switch (orientation) {
            case 0:
                xBound = [0, 1, 2]; 
                yBound = [3, 2, 2];
                bottomBound = [xBound, yBound];
                xBound = [-1, -1];
                yBound = [1, 2];
                leftBound = [xBound, yBound];
                xBound = [1, 3];
                yBound = [2, 1];
                rightBound = [xBound, yBound]; 
                break; 
            case 1:
                xBound = [0, 1];
                yBound = [1, 3];
                bottomBound = [xBound, yBound];    
                xBound = [-1, 0, 0];
                yBound = [0, 1, 2];
                leftBound = [xBound, yBound]; 
                xBound = [2, 2, 2];
                yBound = [0, 1, 2];
                rightBound = [xBound, yBound];      
                break;  
            case 2:
                xBound = [0, 1, 2];
                yBound = [3, 3, 3];
                bottomBound = [xBound, yBound];    
                xBound = [1, -1];
                yBound = [1, 2];
                leftBound = [xBound, yBound]; 
                xBound = [3, 3];
                yBound = [1, 2];
                rightBound = [xBound, yBound];      
                break; 
            case 3:
                xBound = [1, 2];
                yBound = [3, 3];
                bottomBound = [xBound, yBound];    
                xBound = [0, 0, 0];
                yBound = [0, 1, 2];
                leftBound = [xBound, yBound]; 
                xBound = [2, 2, 3];
                yBound = [0, 1, 2];
                rightBound = [xBound, yBound];      
                break;                                                                  
            default:
        }
    }  
    bounds.bottomBound = bottomBound;
    bounds.leftBound = leftBound;
    bounds.rightBound = rightBound;        
    return bounds;
    

}


// single piece object
function Piece (x, y, type, orientation) {
    this.x = x,
    this.y = y,
    this.type = type,
    this.orientation = orientation,
    this.pieceGrid = [],
    this.xBound = [],
    this.yBound = [],
    this.bounds,
    
    this.initPiece = function () {
        this.pieceGrid = getPieceGrid(this.type, this.orientation);
        var bounds = [];
        this.bounds = getBounds(this.type, this.orientation);    
    },
    
    this.refreshPiece = function () {
        this.pieceGrid = getPieceGrid(this.type, this.orientation);
        var bounds = [];
        this.bounds = getBounds(this.type, this.orientation);
        //console.log(this.pieceGrid);
    }
    
    this.draw = function() {
        for (var r=0; r < 3; ++r) {
            for (var c=0; c < 3; ++c) {
                if (this.pieceGrid[r][c]) {
                    setGrid(this.x+r, this.y+c);   
                }         
            }
        }
    },
    
    this.clearGrid = function() {
        for (var r=0; r < 3; ++r) {
            for (var c=0; c < 3; ++c) {
                if (this.pieceGrid[r][c]) {
                    clearBlock(this.x+r, this.y+c);   
                }         
            }
        }        
    }
    
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
        for (var r=0; r < 3; ++r) {
        for (var c=0; c < 3; ++c) {
            if (this.pieceGrid[r][c]) {
                if ( (this.y + c) === 19 ) {
                    console.log("collision");
                    return false;
                } else if (c < 2) {
                    if ( !(this.pieceGrid[r][c+1]) &&
                          (getGrid(this.x+r, this.y+c+1)) ) 
                    {
                        console.log("collision");
                        return false;                           
                    }
                } else if (c === 2) {
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
        for (var r=0; r < 3; ++r) {
        for (var c=0; c < 3; ++c) {
            if (this.pieceGrid[r][c]) {
                if ( (this.x + r) === 9 ) {
                    console.log("collisionA");
                    return false;
                } else if (r < 2) {
                    if ( !(this.pieceGrid[r+1][c]) &&
                          (getGrid(this.x+r+1, this.y+c)) ) 
                    {
                        console.log("collisionB");
                        return false;                           
                    }
                } else if (r === 2) {
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
        for (var r=0; r < 3; ++r) {
        for (var c=0; c < 3; ++c) {
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
            this.orientation = ++this.orientation % 4;    //cycles through 0..3
            console.log("rotate Right");
            this.clearGrid();
            this.refreshPiece();
        }        
    },    

    this.rotateCCW = function() {
        if ( this.checkRotation(true) ) {
            --this.orientation;
            if (this.orientation < 0) this.orientation = 3;
            console.log("rotate Left");
            this.clearGrid();
            this.refreshPiece();   
        }     
    },
    
    this.checkRotation = function(direction) {
        var ori = this.orientation;
        var nextGrid = [];         
        if (direction === false) {  
            ori = ++ori % 4;    //cycles through 0..3
        }
        if (direction === true) {
            --ori;       
            if (ori < 0) ori = 3;    //cycles through 0..3
        }
        nextGrid = getPieceGrid(this.type, ori);
        for (var r=0; r < 3; ++r) {
            for (var c=0; c < 3; ++c) {
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

function draw () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWalls();
    piece.draw();
    drawGrid();

    //move piece
    if (rightPressed) {
        if (!rightHeld) {
            piece.right();
            rightHeld = true;
        }
    } else {
        rightHeld = false;
    }
    if (leftPressed) {
        if (!leftHeld) {
            piece.left();
            leftHeld = true;
        }
    } else {
        leftHeld = false;
    } 
    if (upPressed) {
        if (!upHeld) {
            piece.up();
            upHeld = true;
        }
    } else {
        upHeld = false;
    }
    if (downPressed) {
        //if (!downHeld) {
            piece.drop();
            downHeld = true;
        //}
    } else {
        downHeld = false;
    }
    if (rotLeftPressed) {
        if (!rotLeftHeld) {
            piece.rotateCCW();
            rotLeftHeld = true;
        }
    } else {
        rotLeftHeld = false;
    }
    if (rotRightPressed) {
        if (!rotRightHeld) {
            piece.rotateCW();
            rotRightHeld = true;
        }
    } else {
        rotRightHeld = false;
    }    
    
    if (pieceLock) {
        
        var toClear = [];
        toClear = checkGridLines();
        for (var i = 0; i < toClear.length; ++i) {
            clearLine(toClear[i]);
            moveDown(toClear[i]);
        }
    
    
        pieceLock = false;
        piece.x = Math.floor(Math.random()*8);
        piece.y = -1;
        piece.orientation = 0;
        piece.refreshPiece();
    
    }


    requestAnimationFrame(draw);
}


var piece = new Piece(0, 0, 0, 0);
piece.initPiece();

setGrid(5, 5);

for (var i=1; i < 10; ++i) {
    setGrid(i, 19);
}

var test = -5;
test = test % 4;
console.log(test);

draw();






