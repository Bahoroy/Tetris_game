let canvas = document.querySelector("#tetris");
let scoreboards = document.querySelector("h2");
let model = canvas.getContext("2d");
model.scale(30,25);

const SHAPES = [
    [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]
    ],
    [
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ],
    [
        [0,1,0],
        [0,1,0],
        [0,1,1]
    ],
    [
        [1,1,1],
        [0,1,0],
        [0,0,0]
    ],
    [
        [0,1,0],
        [0,1,0],
        [1,1,0]
    ],
    [
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],
    [
        [1,1],
        [1,1]
    ],
    [
        [0,1,0]
    ]
]

const COLORS = [
    "black",
    "white",
    "#FF00FF",
    "#228B22",
    "whita",
    "#800080",
    "#FF4500",
    "yellow",
    "#800080",
]

const row = 20;
const GOALS = 10;

let grid = generateGrid();
let fallingPieceObj = null;
let score = 0;

setInterval(newGameState,500);
function newGameState(){
    checkGrid();
    if(!fallingPieceObj){
        fallingPieceObj = randomPieceObject();
        renderPiece();
    }
    moveDown();
}

function checkGrid(){
    let count = 0;
    for(let i=0;i<grid.length;i++){
        let filed = true;
        for(let j=0;j<grid[0].length;j++){
            if(grid[i][j] == 0){
                filed = false
            }
        }
        if(filed){
            count++;
            grid.splice(i,1);
            grid.unshift([0,0,0,0,0,0,0,0,0,0]);
        }
    }
    if(count == 1){
        score+=10;
    }else if(count == 2){
        score+=30;
    }else if(count == 3){
        score+=50;
    }else if(count>3){
        score+=100
    }
    scoreboards.innerHTML = "Score: " + score;
}

function generateGrid(){
    let grid = [];
    for(let i=0;i<row;i++){
        grid.push([]);
        for(let j=0;j<GOALS;j++){
            grid[i].push(0)
        }
    }
    return grid;
}

function randomPieceObject(){
    let ran = Math.floor(Math.random()*7);
    let piece = SHAPES[ran];
    let colorIndex = ran+1;
    let x = 4;
    let y = 0;
    return {piece,colorIndex,x,y}
}

function renderPiece(){
    let piece = fallingPieceObj.piece;
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            if(piece[i][j] == 1){
            model.fillStyle = COLORS[fallingPieceObj.colorIndex];
            model.fillRect(fallingPieceObj.x+j,fallingPieceObj.y+i,1,1);
        }
        }
    }
}

function moveDown(){
    if(!collision(fallingPieceObj.x,fallingPieceObj.y+1))
        fallingPieceObj.y+=1;
    else{
        let piece = fallingPieceObj.piece
        for(let i=0;i<piece.length;i++){
            for(let j=0;j<piece[i].length;j++){
                if(piece[i][j] == 1){
                    let p = fallingPieceObj.x+j;
                    let q = fallingPieceObj.y+i;
                    grid[q][p] = fallingPieceObj.colorIndex;
                }
            }
        }
        if(fallingPieceObj.y == 0){
            alert("Gamer Over");
            grid = generateGrid();
            score = 0;
        }
        fallingPieceObj = null;
    }
    renderGame();
}

function moveLeft(){
    if(!collision(fallingPieceObj.x-1,fallingPieceObj.y))
        fallingPieceObj.x-=1;
    renderGame();
}

function moveRight(){
    if(!collision(fallingPieceObj.x+1,fallingPieceObj.y))
        fallingPieceObj.x+=1;
    renderGame();
}

function rotate(){
    let rotatedPiece = [];
    let piece = fallingPieceObj.piece;
    for(let i=0;i<piece.length;i++){
        rotatedPiece.push([]);
        for(let j=0;j<piece[i].length;j++){
            rotatedPiece[i].push(0);
        }
    }
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            rotatedPiece[i][j] = piece[j][i]
        }
    }

    for(let i=0;i<rotatedPiece.length;i++){
        rotatedPiece[i] = rotatedPiece[i].reverse();
    }
    if(!collision(fallingPieceObj.x,fallingPieceObj.y,rotatedPiece))
        fallingPieceObj.piece = rotatedPiece
    renderGame()
}

function collision(x,y,rotatedPiece){
    let piece = rotatedPiece || fallingPieceObj.piece
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            if(piece[i][j] == 1){
            let p = x+j;
            let q = y+i;
            if(p>=0 && p<GOALS && q>=0 && q<row){
                if(grid[q][p]>0){
                    return true;
                }
            }else{
                return true;
            }}
        }
    }
    return false;
}

function renderGame(){
    for(let i=0;i<grid.length;i++){
        for(let j=0;j<grid[i].length;j++){
            model.fillStyle = COLORS[grid[i][j]];
            model.fillRect(j,i,1,1)
        }
    }
    renderPiece();
}

document.addEventListener("keydown",function(e){
    let key = e.key;
    if(key == "ArrowDown"){
        moveDown();
    }else if(key == "ArrowLeft"){
        moveLeft();
    }else if(key == "ArrowRight"){
        moveRight();
    }else if(key == "ArrowUp"){
        rotate();
    }
})


// console.log("hello world");