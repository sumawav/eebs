//SOUMA 
//tetris.js
//an implementation of tetris in javascript


var canvas = document.getElementById("gl-canvas");
var ctx = canvas.getContext("2d");

var HEIGHT = canvas.height;
var WIDTH = canvas.width;
var BLOCK = HEIGHT/20;
var GRID = [];

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
        console.log("RIGHT");
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
        console.log("LEFT");
    }
    else if(e.keyCode == 38) {
        upPressed = true;
        console.log("UP");
    }
    else if(e.keyCode == 40) {
        downPressed = true;
        console.log("DOWN");
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
    GRID[r][c].status = true;
}

// clears a block in GRID
function clearGrid (r, c) {
    GRID[r][c].status = false;
}

// returns status of block in GRID
function getGrid (r, c) {
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
    console.log("moveDown");
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

// single piece object
function Piece (x, y, type) {
    this.x = x,
    this.y = y,
    this.type = type,
    
    this.drop = function() {  
        if (this.checkDown()) {
            clearGrid(this.x, this.y);
            ++this.y;
        } else {
            pieceLock = true;
        
        }
    },
    
    this.left = function() {
        if (this.checkLeft()) {
            clearGrid(this.x, this.y);
            --this.x;
        }
    },

    this.right = function() {
        if (this.checkRight()) {
            clearGrid(this.x, this.y);
            ++this.x;
        }
    },
    
    this.up = function() {
        clearGrid(this.x, this.y);
        --this.y;
    },
    
    this.draw = function() {
        setGrid(this.x, this.y);
    },
    
    this.checkDown = function() {
        if (this.y === 19)
            return false;
        if ( getGrid(this.x, this.y+1) )
            return false;
        return true;
    },
    
    this.checkRight = function() {
        if (this.x === 9)
            return false;
        if ( getGrid(this.x+1, this.y) )
            return false;
        return true;
    },
    
    this.checkLeft = function() {
        if (this.x === 0)
            return false;
        if ( getGrid(this.x-1, this.y) )
            return false;
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
    //    if (!downHeld) {
            piece.drop();
            downHeld = true;
      //  }
    } else {
        downHeld = false;
    }
    
    if (pieceLock) {
        
        var toClear = [];
        toClear = checkGridLines();
        //console.log(toClear);
        for (var i = 0; i < toClear.length; ++i) {
            clearLine(toClear[i]);
            moveDown(toClear[i]);
        }
    
    
        pieceLock = false;
        piece.x = Math.floor(Math.random()*10);
        piece.y = 0;
        piece.draw();
    
    }


    requestAnimationFrame(draw);
}


var piece = new Piece(9, 5, 0);

for (var i=0; i < 9; ++i) {
    setGrid(i, 19);
}
for (var i=0; i < 9; ++i) {
    setGrid(i, 18);
}

draw();






