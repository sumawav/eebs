var canvas = document.getElementById("gl-canvas");
var ctx = canvas.getContext("2d");

var HEIGHT = canvas.height;
var WIDTH = canvas.width;
var BLOCK = HEIGHT/20;
var GRID = [];

//init GRID
for (var r=0; r<10; ++r) {
    GRID[r] = [];
    for (var c=0; c<20; ++c) {
        GRID[r][c] = { status: 0 };
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

function Piece () {
    this.x = 0,
    this.y = 0,
    
    this.drop = function() {
        ++x;
    },
    
    this.left = function() {
        --y;
    },

    this.right = function() {
        ++y;
    }
}


drawWalls();

setGrid(3,3);
setGrid(9, 19);
setGrid(8, 19);
setGrid(9, 18);



drawGrid();




