//SOUMA 
//tetris.js
//an implementation of tetris in javascript

// CANVAS
var canvas = document.getElementById("gl-canvas");
var ctx = canvas.getContext("2d");

// CONSTANTS
var HEIGHT = canvas.height; console.log("HEIGHT: "+HEIGHT);
var WIDTH = canvas.width; console.log("WIDTH: "+WIDTH);
var BLOCK = HEIGHT/20;
var GRID = [];
var STATE = {RUN:0,
             CLEAR_ANIMATION:1,
             CLEAR:2,
             PAUSE:3,
             PIECELOCK:4,
             GAMEOVER:5,
             INIT:6};

// GLOBALS
var pieceLock = false;
var altitude = 20;
var gravityOff = false;
var elapsed = 0;
var flashOn = false;
var clearAnim = false;
var toClear = [];
var currentState = STATE.RUN;
var score = 0;
var level = 0;
var linesCleared = 0;
var totalLines = 0;
var nextPiece = 0;
var lag = 0;

// BUTTONS
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
var spacePressed = false;
var spaceHeld = false;

//sound effects
var shiftLAudio;
var shiftRAudio;
var moveAudio;
var pieceLockAudio;
var clearLineAudio;
var moveDownAudio;

// event listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//document.addEventListener("mousemove", mouseMoveHandler, false);

//init GRID
function initGrid() {
    for (var r=0; r<10; ++r) {
        GRID[r] = [];
        for (var c=0; c<20; ++c) {
            GRID[r][c] = { status: false, 
                           color: "blue",
                           trans: 1 };
        } 
    }
}

// initializes sound effects
function initAudio() {
    shiftLAudio = new sFO("audio/shift2.wav", 3);
    shiftRAudio = new sFO("audio/shift3.wav", 3);
    moveAudio = new sFO("audio/move2.wav", 3);    
    pieceLockAudio = new sFO("audio/pieceLock4.wav", 2);
    clearLineAudio = new sFO("audio/clearLine2.wav", 1);
    moveDownAudio = new sFO("audio/moveDown2.wav", 1);
    levelUpAudio = new sFO("audio/levelUp3.wav", 1);
}

// sound effect object
// creates n objects for each sound and cycles
// through them for playback
function sFO(fileName, n) {
    this.carousel = [];
    this.turn = 0;
    for (var i=0; i < n; ++i) {
        this.carousel[i] = new Audio(fileName);
    }
    
    this.play = function() {
        this.turn = ++this.turn % this.carousel.length;
        this.carousel[this.turn].play();
    };

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
        //sfx(0);
        //console.log("z");
    } 
    else if(e.keyCode == 88) {
        rotRightPressed = true;
        //console.log("x");
    }  
    else if(e.keyCode == 32) {
        spacePressed = true;
        console.log("spacebar");
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
    else if(e.keyCode == 32) {
        spacePressed = false;
    }      
}

// draws a block
function drawBlock (r, c, color, transparency) {
    var x = r * BLOCK;
    var y = c * BLOCK;
    
    // set transparency
    ctx.globalAlpha = transparency || 1; // 1 if undefined
    
    // draw square
    ctx.beginPath();
    ctx.rect(x, y, BLOCK, BLOCK);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
    
    // draw outline
    ctx.beginPath();
    ctx.rect(x, y, BLOCK, BLOCK);
    ctx.strokeStyle = "gray";
    ctx.stroke();
    ctx.closePath();   
     
}

// draw background wall of playing field
function drawWalls () {
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.rect( (WIDTH/4), 0, (WIDTH/2), HEIGHT);
    ctx.fillStyle = "gray";
    ctx.fill();
    ctx.closePath();    
}

// draws next piece
function drawNextPiece() {
    pieceGrid = [];
    pieceGrid = getPieceGrid(nextPiece, 0); 
    pieceColor = getBlockColor(nextPiece);
    ctx.font="20px Arial";
    ctx.fillStyle="#FF0000";
    ctx.fillText("NEXT", WIDTH-80, 20);     
    
    for (var r=0; r < pieceGrid.length; ++r) {
        for (var c=0; c < pieceGrid.length; ++c) {
            if (this.pieceGrid[r][c]) {
                drawBlock(16+r, c, pieceColor);   
            }         
        }
    }
}

// draws score
function drawScore () {
    var x = 10;
    var y = 25;
    ctx.font="20px Arial";
    ctx.fillStyle="#FF0000";
    ctx.fillText("SCORE", x, y); 
    ctx.fillText(score, x, y+20);
    
    ctx.font="20px Arial";
    ctx.fillStyle="#FF0000";
    ctx.fillText("LEVEL", x, y+40); 
    ctx.fillText(level, x, y+60);
    
    ctx.font="20px Arial";
    ctx.fillStyle="#FF0000";
    ctx.fillText("LINES", x, y+80); 
    ctx.fillText(totalLines, x, y+100);
}

// draws level
function drawLevel () {

}

// draws all block in GRID
function drawGrid () {
    for (var r=0; r < 10; ++r) {
        for (var c=0; c < 20; ++c) {
            if ( GRID[r][c].status )
                drawBlock(r+5 , c, GRID[r][c].color, GRID[r][c].trans);
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
        GRID[r][y].trans = 1;
    }
}

// fades a line
function fadeLine(y, fade) {
    var lines = [];
    lines = y;
    for (var r=0; r < 10; ++r) {
        for (var c=0; c < lines.length; ++c) {
            GRID[r][lines[c]].trans -= fade;
        }
    }
    //console.log("trans: "+GRID[0][lines[0]].trans);
    if (GRID[0][lines[0]].trans < 0)
        return true;
    else
        return false;
    
}

// moves all pieces down after line clears
function moveDown(y) {
    --y;
    for (var c=y; c>=0; --c) {
        for (var r=0; r < 10; ++r) {
            if (GRID[r][c].status) {
                GRID[r][c].status = false;
                GRID[r][c+1].status = true;
                GRID[r][c+1].color = GRID[r][c].color;
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
            return "purple";
        case 6:
            return "green";                        
        default:
            return 0;
    }
}

// single piece object
function Piece (x, y, type, orientation) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.orientation = orientation;
    this.oriNum = 0;
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
        this.type = nextPiece;
        nextPiece = Math.floor(Math.random()*7);
        this.orientation = 0;
        this.pieceGrid = getPieceGrid(this.type, this.orientation); 
        this.pieceGridLen = this.pieceGrid[0].length;        
        this.oriNum = getOrientationNum(this.type);    
        this.color = getBlockColor(this.type);           
    };
    
    this.refreshPiece = function () {
        this.pieceGrid = getPieceGrid(this.type, this.orientation);
        this.pieceGridLen = this.pieceGrid[0].length;        
    };
    
    this.draw = function() {
        for (var r=0; r < this.pieceGridLen; ++r) {
            for (var c=0; c < this.pieceGridLen; ++c) {
                if (this.pieceGrid[r][c]) {
                    setGrid(this.x+r, this.y+c, this.color);   
                }         
            }
        }
    };
    
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
            currentState = STATE.PIECELOCK;
            pieceLockAudio.play();
        }
    },
    
    this.left = function() {
        if (this.checkLeft()) {
            moveAudio.play();
            this.clearGrid(this.x, this.y);
            --this.x;
        }
    },

    this.right = function() {
        if (this.checkRight()) {
            moveAudio.play();
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
                // hitting the bottom of the playfied
                if ( (this.y + c) === 19 ) {
                    console.log("collisionA");
                    return false;
                    
                } else if (c < this.pieceGridLen-1) {
                    if ( !(this.pieceGrid[r][c+1]) &&
                          (getGrid(this.x+r, this.y+c+1)) ) 
                    {
                        console.log("collisionB");
                        return false;                           
                    }
                } else if (c === this.pieceGridLen-1) {
                    if (getGrid(this.x+r, this.y+c+1)) {
                        console.log("collisionC");
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
                        //I Stand With Ahmed 
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
            shiftLAudio.play();
            this.orientation = ++this.orientation % this.oriNum;    //cycles through 0..oriNum
            console.log("rotate Right");
            this.clearGrid();
            this.refreshPiece();
        }        
    },    

    this.rotateCCW = function() {
        if ( this.checkRotation(true) ) {
            shiftRAudio.play();
            --this.orientation;
            if (this.orientation < 0) this.orientation = this.oriNum-1;
            console.log("rotate Left");
            this.clearGrid();
            this.refreshPiece();   
        }     
    },
    
    this.checkRotation = function(direction) {
        var ori = this.orientation;
        var nextGrid = [];         
        if (direction === false) {  
            ori = ++ori % this.oriNum;    //cycles through 0..this.oriNum
        }
        if (direction === true) {
            --ori;       
            if (ori < 0) ori = this.oriNum-1;
        }
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
        //sfx(0);
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
            //sfx(0);
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
    // spacebar
    if (spacePressed) {
        if (!spaceHeld) {
            if (!gravityOff)
                gravityOff = true;
            else
                gravityOff = false;
            spaceHeld = true;
        }
    } else {
        spaceHeld = false;
    }

}

function checkSpaceBar () {
    // spacebar
    if (spacePressed) {
        if (!spaceHeld) { 
            currentState = STATE.INIT;       
            spaceHeld = true;
        }
    } else {
        spaceHeld = false;
    }
}

function scoring(lines) {
    switch(lines) {
        case 1:
            ++score;
            break;
        case 2:
            score += 3;
            break;
        case 3:
            score += 5;
            break;
        case 4:
            score += 7;
            break;
        default:
            break;
    
    }

}

function handlePieceLock() {
    toClear = [];
    toClear = checkGridLines(); 
    scoring(toClear.length); 
    linesCleared += toClear.length;
    totalLines += toClear.length;
    console.log("lines : "+lines);
    console.log("level: "+level);
    if (linesCleared > 10) {
        linesCleared = linesCleared % 10;
        if (level < 9) {++level;levelUpAudio.play();}
    }
    for (var i = 0; i < toClear.length; ++i) {
        clearLine(toClear[i]);
        moveDown(toClear[i]);
    }
    console.log("altitude: "+altitude);
    piece.spawn(); 
}

function altimeter () {
    var alt = 20;
    for (var r=0; r < 10; ++r) {
        for (var c=0; c < 19; ++c) {
            if ( GRID[r][c].status && (c < alt) ) {
                 alt = c;
            }   
        }
    }
    altitude = alt;
    //console.log("altitude: "+altitude);
}

function drawGameOver () {
    for (var r=0; r < 10; ++r){
        for (var c=0; c < 20; ++c) {
            setGrid(r, c, getBlockColor(nextPiece) );
        }
    }
    drawGrid();  
    console.log("press space");
    ctx.globalAlpha = 1;    
    ctx.font="20px Arial";
    ctx.fillStyle="#FF0000";
    ctx.fillText("PRESS", 10, 145); 
    ctx.fillText("SPACEBAR", 10, 165);     
    

}

function gameLoop () {
    var d = new Date();
    var current = d.getTime();
    elapsed = current - previous;
    lag += elapsed;
    previous = current;
    
    // STATE.INIT
    if (currentState == STATE.INIT) {
        score = 0;
        lines = 0;
        level = 0;
        linesCleared = 0;
        totalLines = 0;
        nextPiece = Math.floor(Math.random()*7);        
        initGrid();
        altimeter();
        currentState = STATE.RUN;    
    }

    // STATE.RUN
    if (currentState == STATE.RUN) {
        var thresh = 1000 - (level*100);
        if ((lag > thresh) && !gravityOff){
            piece.drop();
            lag = 0;
        } else {
            playerControl();
        }
        piece.draw();
    }

    // STATE.PIECELOCK      
    if (currentState == STATE.PIECELOCK) {                            
        toClear = [];
        toClear = checkGridLines();
        altimeter();
        if (altitude === 0){
            piece.clearGrid();
            currentState =  STATE.GAMEOVER;
        } else if (toClear.length) {
            console.log("lines to clear: "+toClear.length);
            clearLineAudio.play();
            currentState = STATE.CLEAR_ANIMATION;
        } else { 
            currentState = STATE.CLEAR;
        }
    } 

    // STATE.CLEAR_ANIMATION
    if (currentState == STATE.CLEAR_ANIMATION){
        // fade animation
        if (fadeLine(toClear, 0.04) ) {
            currentState = STATE.CLEAR;
            moveDownAudio.play();
        }
    }

    // STATE.CLEAR
    if (currentState == STATE.CLEAR) {
        handlePieceLock();
        currentState = STATE.RUN;
    }

   
    
    // draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWalls();
    drawScore(); 
    drawLevel();
    drawNextPiece();
    drawGrid();  
    
    // STATE.GAMEOVER
    if (currentState == STATE.GAMEOVER) {
        drawGameOver();
        checkSpaceBar();
    }     
     
    requestAnimationFrame(gameLoop);
}


var piece = new Piece(3, -1, Math.floor(Math.random()*7), 0);
var d = new Date();
var previous = d.getTime();
initAudio();
currentState = STATE.INIT;
gameLoop();







