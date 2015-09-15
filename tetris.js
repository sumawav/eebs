var canvas = document.getElementById("gl-canvas");
var ctx = canvas.getContext("2d");

var HEIGHT = canvas.height;
var WIDTH = canvas.width;
var BLOCK = HEIGHT/20;
var GRID = [];

// buttons
var rightPressed = false;
var leftPressed = false;
var rightHeld = false;
var leftHeld = false;

// event listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//document.addEventListener("mousemove", mouseMoveHandler, false);

//init GRID
for (var r=0; r<10; ++r) {
    GRID[r] = [];
    for (var c=0; c<20; ++c) {
        GRID[r][c] = { status: 0 };
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
}

// key up handler
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

//draws a block
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

function drawWalls () {
    for (var r = 4; r < 16; r=r+11) {
        for (var c = 0; c < 20; ++c)
            drawBlock(r, c);
    }
}

function drawGrid () {
    for (var r=0; r < 10; ++r) {
        for (var c=0; c < 20; ++c) {
            if ( GRID[r][c].status )
                drawBlock(r+5 , c);
        }
    }
}

function setGrid (r, c) {
    GRID[r][c].status = 1;
}

function Piece (x, y, type) {
    this.x = x,
    this.y = y,
    this.type = type,
    
    this.drop = function() {
        ++this.x;
    },
    
    this.left = function() {
        console.log("x: "+this.x);
        console.log("y: "+this.y);
        --this.x;
    },

    this.right = function() {
        console.log("x: "+this.x);
        console.log("y: "+this.y);
        ++this.x;
    },
    
    this.draw = function() {
        setGrid(this.x, this.y);
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


    requestAnimationFrame(draw);
}


var piece = new Piece(5, 5, 0);
setGrid(3,3);
setGrid(9, 19);
setGrid(8, 19);
setGrid(9, 18);

draw();






