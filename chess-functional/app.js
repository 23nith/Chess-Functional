document.body.style.zoom=.75
let highlightColor =  "rgba(66, 245, 72, .5)";
let highlightCheckMove = "rgba(232, 16, 16, 0.5)";
let piecesHeight = "80px"

let winnerMsg = document.querySelector(".winner-msg");
winnerMsg.style.display = "none";
let whiteWin = document.querySelector("#white-win");
whiteWin.style.display = "none";
let blackWin = document.querySelector("#black-win");
blackWin.style.display = "none";
// winnerMsg.style.display = "block";

const threatDirection = {
    0 : "North",
    1 : "South",
    2 : "East",
    3 : "West",
    4 : "NorthEast",
    5 : "NorthWest",
    6 : "SouthEast",
    7 : "SouthWest"
}


class Piece {
    constructor(piece){
        this.piece = piece
    }
    // [north, south, east, west, north-east, north-west, south-east, south-west]

    generatePiece(_fenLetter){
        let pieces = {
            r : {img: "./Chess_Pieces/Rook-Black.gif", name: "black-rook", icon: "fas fa-chess-rook", unicode: "f447", movement: [-8, 8, 1, -1, "", "", "", ""], code: "r", sliding: true},
            n : {img: "./Chess_Pieces/Knight-Black.gif", name: "black-knight", icon: "fas fa-chess-knight", unicode: "f441", movement: ["", "", -6, -10, -15, -17, 17, 15, 10, 6], code: "n", sliding: false},
            b : {img: "./Chess_Pieces/Bishop-Black.gif", name: "black-bishop", icon: "fas fa-chess-bishop", unicode: "f43a", movement: ["", "", "", "", -7, -9, 9, 7], code: "b", sliding: true},
            q : {img: "./Chess_Pieces/Queen-Black.gif", name: "black-queen", icon: "fas fa-chess-queen", unicode: "f445", movement: [-8, 8, 1, -1, -7, -9, 9, 7], code: "q", sliding: true},
            k : {img: "./Chess_Pieces/King-Black.gif", name: "black-king", icon: "fas fa-chess-king", unicode: "f43f", movement: [-8, 8, 1, -1, -7, -9, 9, 7], initialMovement: [-8, 8, 1, -1, -7, -9, 9, 7, 2, -2], code: "k", sliding: false},
            p : {img: "./Chess_Pieces/Pawn-Black.gif", name: "black-pawn", icon: "fas fa-chess-pawn", unicode: "f443", movement: [8, "", "", "", "", "", "", ""], code: "p", sliding: false, madeInitialMove: false, initialMovement: [8, 16]},

            R : {img: "./Chess_Pieces/Rook-White.gif", name: "white-rook", icon: "fas fa-chess-rook", unicode: "f447", movement: [-8, 8, 1, -1, "", "", "", ""], code: "R", sliding: true},
            N : {img: "./Chess_Pieces/Knight-White.gif", name: "white-knight", icon: "fas fa-chess-knight", unicode: "f441", movement: ["", "", -6, -10, -15, -17, 17, 15, 10, 6], code: "N", sliding: false},
            B : {img: "./Chess_Pieces/Bishop-White.gif", name: "white-bishop", icon: "fas fa-chess-bishop", unicode: "f43a", movement: ["", "", "", "", -7, -9, 9, 7], code: "B", sliding: true},
            K : {img: "./Chess_Pieces/King-White.gif", name: "white-king", icon: "fas fa-chess-king", unicode: "f43f", movement: [-8, 8, 1, -1, -7, -9, 9, 7], initialMovement: [-8, 8, 1, -1, -7, -9, 9, 7, 2, -2], code: "K", sliding: false},
            Q : {img: "./Chess_Pieces/Queen-White.gif", name: "white-queen", icon: "fas fa-chess-queen", unicode: "f445", movement: [-8, 8, 1, -1, -7, -9, 9, 7], code: "Q", sliding: true},
            P : {img: "./Chess_Pieces/Pawn-White.gif", name: "white-pawn", icon: "fas fa-chess-pawn", unicode: "f443", movement: ["", -8, "", "", "", "", "", ""], code: "P", sliding: false, initialMovement: [-8, -16]},
        }
        return pieces[_fenLetter];
    }
}


async function drawGrid(col, row, _fen){
    let counter = 0;
    let fenArr = await formatFen(_fen);

    // GENERATE TILES

        for(col = 0; col < 8; col++){
            for(row = 0; row < 8; row++){
                isLightSquare = (col + row) % 2 == 0;
                let gridBox = document.createElement("div");
                gridBox.style.order = counter;
                // gridBox.innerHTML = counter;
                // gridBox.innerHTML = 64 - counter; //-reverse
                // gridBox.innerHTML = `<div style="z-index: 3; position: absolute" >${counter}</div>`;
                gridBox.classList.add("tile");
                gridBox.setAttribute("ondrop", "drop(event)");
                gridBox.setAttribute("ondragover", "dropAllow(event)");
                gridBox.setAttribute("data-tilenumber", `${counter}`);
                gridBox.id = counter;
                // gridBox.style.backgroundColor = isLightSquare ? "#A0785A" : "brown" ;
                gridBox.classList.add(isLightSquare? "lightTiles": "darkTiles");
                document.querySelector(".container").appendChild(gridBox);
                counter+=1;
            }
        }

    // - END



    // PLACE PIECES ON THE BOARD

        let grid = document.querySelectorAll(".container div");
        let piece = new Piece();
        let gridCounter = 0;

        for(i = 0; i < fenArr.length; i++){
            if(parseInt(fenArr[i])){
                gridCounter += (parseInt(fenArr[i]) - 1);
            }else{
                let character = fenArr[i];
                let capital = character == character.toUpperCase();

                // grid[gridCounter].innerHTML = `<i ${capital ? 'draggable="true"' : ""} ${capital ? 'ondragstart="drag(event)"' : ""} class="${piece.generatePiece(fenArr[i]).icon}" id="${piece.generatePiece(fenArr[i]).code}-${i}" ></i>`;
                let theId = (piece.generatePiece(fenArr[i]).code == "k" || piece.generatePiece(fenArr[i]).code == "K")? piece.generatePiece(fenArr[i]).code : `${piece.generatePiece(fenArr[i]).code}-${i}`;

                grid[gridCounter].innerHTML = `<img src=${piece.generatePiece(fenArr[i]).img} style="height: ${piecesHeight}; width: auto" ${capital ? 'draggable="true"' : ""} ${capital ? 'ondragstart="drag(event)"' : ""} class="${piece.generatePiece(fenArr[i]).icon}" id="${theId}" />`;
                // grid[gridCounter].innerHTML = `<i ${capital ? 'draggable="true"' : ""} ${capital ? 'ondragstart="drag(event)"' : ""} class="${piece.generatePiece(fenArr[i]).icon}" id="${theId}" ></i>`;

                if (character == character.toUpperCase()){
                    grid[gridCounter].children[0].classList.add("lightPiece")
                }else{
                    grid[gridCounter].children[0].classList.add("darkPiece")
                }
            }
            gridCounter += 1;
        }

    // - END
}

async function formatFen(_FEN){
    let fen = _FEN;
    let fenArray = fen.split("/");
    let fenArrayModified = await fenArray.map((item)=>{
        return item.split("");
    })
    let fenArray2 = []
    for(item of fenArrayModified){
        for(element of item){
            fenArray2.push(element);
        }
    }
    return fenArray2;
}

let fenArray = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"];
let whiteCapturedHistory = [];
let blackCapturedHistory = [];

async function undo(){
    if((fenArray.length-1)<=0) return;
    document.querySelector(".container").innerHTML = "";
    changeTurn();
    let submittedFen = fenArray[fenArray.length-2];
    // fenArray[fenArray.length-1]
    let drawGridFinished = await drawGrid(8,8, submittedFen);
    fenArray.pop(fenArray.length -1);

    whiteCapturedHistory.pop(whiteCapturedHistory.length -1);
    blackCapturedHistory.pop(whiteCapturedHistory.length -1);
    // console.log(fenArray);

    let piece = new Piece();
    document.querySelector(".black-captured").innerHTML = "";
    document.querySelector(".white-captured").innerHTML = "";
    whiteCapturedHistory.map((item)=>{
        if(item != ""){
            let container = document.createElement("div");
            // container.innerHTML = `<i class="${piece.generatePiece(item).icon}"></i>`
            container.innerHTML = `<img src=${piece.generatePiece(item).img} />`
            document.querySelector(".white-captured").innerHTML += `<div class="tile">${container.innerHTML}</div>`;
        }
    });
    blackCapturedHistory.map((item)=>{
        if(item != ""){
            let container = document.createElement("div");
            // container.innerHTML = `<i class="${piece.generatePiece(item).icon} lightPiece"></i>`
            container.innerHTML = `<img src=${piece.generatePiece(item).img} />`
            document.querySelector(".black-captured").innerHTML += `<div class="tile">${container.innerHTML}</div>`;
        }
    });


    if (turn === WHITE) {
        lightPieces = document.querySelectorAll(".lightPiece");
        darkPieces = document.querySelectorAll(".darkPiece");

        removeDragFeatureDark(darkPieces)
        addDragFeatureLight(lightPieces)


    } else if (turn === BLACK) {
        darkPieces = document.querySelectorAll(".darkPiece");
        lightPieces = document.querySelectorAll(".lightPiece");

        removeDragFeatureLight(lightPieces);
        addDragFeatureDark(darkPieces)

    } else {
        throw new Error(`Invalid Color Value:`, ERROR_TRACE);
    }
}

function getFEN(){
    let counter = 0;
    let fenArr = new Array(8).fill(0).map(() => new Array(8).fill(0));
    for(i = 0; i < 8; i++){
        for(j = 0; j < 8; j++){
            fenArr[i][j] = tiles[counter].children[0] ? tiles[counter].children[0].id[0] : "empty space";
            counter+=1;
        }
    }
    let space = 0;
    let fenFormattedArr = "";
    let row = ""
    for(i = 0; i < 8; i++){
        for(j = 0; j < 8; j++){
            if(fenArr[i][j].length == 1){
                if(space != 0){
                    row+=space;
                    space = 0;
                }
               row+=fenArr[i][j];
            }
            if(fenArr[i][j] == "empty space"){
                space+=1;
            }
            if(j == 7){
                if(space != 0){
                    row+=space;
                    space = 0;
                }
            }

        }
        i == 7 ? fenFormattedArr+=row : fenFormattedArr+=row+"/";
        row="";
    }
    // console.log("fenArray: ", fenArray);
    return fenFormattedArr;
}

function displayFEN(){
    document.querySelector("p").innerHTML = `<span style="user-select: none">Current FEN: </span> ${fenArray[fenArray.length-1]}`;
}

// Initiate default chessboard
drawGrid(8,8, "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");

// FEN feature
function submitFEN(){
    document.querySelector(".container").innerHTML = "";
    let submittedFen = document.querySelector("#fen").value;
    drawGrid(8,8, submittedFen);
}

function reset(){
    location.reload();
    // document.querySelector(".container").innerHTML = "";
    // document.querySelector(".turn").innerHTML = `White's turn`
    // drawGrid(8,8, "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
}

function inspectBoard(){
    winnerMsg.style.display = "none";
}

//************************************************************************************** Drag and drop feature **************************************************************************************


let tiles;
let lifted;
let piece;
let landed;
let homeTile = []; //If piece was lifted but still remained to its home tile, this value will be null
let pieceColor;
let lightPieces;
let darkPieces;
let lightTiles;
let darkTiles;
let turn = "lightPiece";


let whiteKingCastlingLimit  = 1;
let blackKingCastlingLimit  = 1;

let isCanCastleRightWhite   = false;
let isCanCastleLeftWhite    = false;

let isCanCastleRightBlack   = false;
let isCanCastleLeftBlack    = false;

let enPassantPiecesWhite = [];
let enPassantPiecesBlack = [];


let currentTilesOnThreat = {

};

let threateningPiece = {

}

let pawnNonCaptureMoves = {
    P: [],
    p: []
}

let currentThreatOnKing = []

let slidingBeyondPieces = {};

let unsafeTiles = [];

let checkedColor = "White";

let cannotBlock = [];

let canCapture = [];

let canCaptureTile = [];

let blockedThreat = [];

let canBlock = [];

const boardTopEdge = [0, 1, 2, 3, 4 , 5, 6, 7];
const boardRightEdge = [7, 15, 23, 31, 39, 47, 55, 63];
const boardBottomEdge = [56, 57, 58, 59, 60, 61, 62, 63];
const boardLeftEdge = [0, 8, 16, 24, 32, 40, 48, 56];
const surroundingTiles = [8, -8, 7, -7, 9, -9, 1, -1];
const boardEdges = [0, 1, 2, 3, 4 , 5, 6, 7, 15, 23, 31, 39, 47, 55, 63, 56, 57, 58, 59, 60, 61, 62, 8, 16, 24, 32, 40, 48];
const pawnStartingPositionWhite = [48, 49, 50, 51, 52, 53, 54, 55];
const pawnStartingPositionBlack = [8, 9, 10, 11, 12, 13, 14, 15];


const whitePromotionField = [0, 1, 2, 3, 4, 5, 6, 7];
const blackPromotionField = [56, 57, 58, 59, 60, 61, 62, 63];

const pawnEnPassantWhite = [32, 33, 34, 35, 36, 37, 38, 39];
const pawnEnPassantBlack = [24, 25, 26, 27, 28, 29, 30, 31];
const topEdge = [0, 4, 5];
const rightEdge = [2, 4, 6, 8];
const bottomEdge = [1, 6, 7];
const leftEdge = [3, 5, 7, 9];

const kingStartingPositionWhite = 60;
const kingStartingPositionBlack = 4;

const leftBlackCastlingTile     = 2;
const rightBlackCastlingTile    = 6;
const leftWhiteCastlingTile     = 58;
const rightWhiteCastlingTile    = 62;
const WHITE                     = `lightPiece`;
const BLACK                     = `darkPiece`;
const ERROR_TRACE               = console.trace();




// for castling
// get rook' id relative to king's initial position
function getRook(sign, _tile_to_add, _homeTile) {
    switch (sign) {
        case "+":
            if(tiles[parseInt(_homeTile) + _tile_to_add]){
                return tiles[parseInt(_homeTile) + _tile_to_add].children[0];
            }
        case "-":
            if(tiles[parseInt(_homeTile) - _tile_to_add]){
                return tiles[parseInt(_homeTile) - _tile_to_add].children[0];
            }
        default:
            throw new Error("Invalid sign");
    }
}





// ************************************************** Functions called by drag drop events **************************************************
let isTurnChange = false;
function changeTurn(){
    turn = turn == "lightPiece" ? "darkPiece": "lightPiece";
    let showTurn = (turn =="lightPiece") ? "White": "Black";
    document.querySelector(".turn").innerHTML = `${showTurn}'s turn`;
}


let kingIsChecked = false;

function highlightTiles(_homeTile, movement, sliding, piece, forChecking){

    let checking = forChecking;
    // check if piece is near edge
    let exemption = []
    let exemptedTiles = [];
    let pieceMovement = movement;
    // check color piece
    let lightPiece = piece == piece.toUpperCase();

    // let topEdge = [0, 4, 5];
    // let rightEdge = [2, 4, 6, 8];
    // let bottomEdge = [1, 6, 7];
    // let leftEdge = [3, 5, 7, 9];
    let descending = [0,3,5,4];
    
    
    // highlight legal moves
    if(!sliding){
        // Knight, King, Pawn

        if(!checking){
            for(i = 0; i < 64; i++){
                tiles[i].setAttribute("ondragover", "removeDrop(event)");
            }
        }

        if(checking && _homeTile == "60"){
            // console.log("test");
        }

        // Pawn pieces variouss behavior
        if(piece == "P" || piece == "p"){
            let pieceClass = new Piece();

            
            // check piece color
            if(piece == "P"){
                // initial behavior
                if(pawnStartingPositionWhite.includes(parseInt(_homeTile))){
                    if(!checking){
                        pieceMovement = pieceClass.generatePiece(piece).initialMovement;
                    }
                }
                // capture behavior
                let captureTile1 = parseInt(_homeTile) - 7;
                let captureTile2 = parseInt(_homeTile) - 9;
                if(tiles[captureTile1].children[0]){
                    pieceMovement[6] = -7;
                }
                if(tiles[captureTile2].children[0]){
                    pieceMovement[7] = -9;
                }

                // En Passant
                if(enPassantPiecesBlack.includes(captureTile1)){
                    pieceMovement.push(-7)
                }
                if(enPassantPiecesBlack.includes(captureTile2)){
                    pieceMovement.push(-9)
                }




                // for checking
                if(checking){
                    // let indexOfToRemove = pieceMovement.indexOf(-8);
                    // pieceMovement.splice(indexOfToRemove, 1);
                    // pieceMovement.push("", "", "", "", -9, -7);
                    // if(boardRightEdge.includes(parseInt(_homeTile))){
                    //     let indexOfToRemove = pieceMovement.indexOf(-7);
                    //     pieceMovement.splice(indexOfToRemove, 1);
                    // }
                    // if(boardLeftEdge.includes(parseInt(_homeTile))){
                    //     let indexOfToRemove = pieceMovement.indexOf(-9);
                    //     pieceMovement.splice(indexOfToRemove, 1);
                    // }
                }
            }else{
                // initial behavior
                if(pawnStartingPositionBlack.includes(parseInt(_homeTile))){
                    if(!checking){
                        pieceMovement = pieceClass.generatePiece(piece).initialMovement;
                    }
                }
                // capture behavior
                let captureTile1 = parseInt(_homeTile) + 7;
                let captureTile2 = parseInt(_homeTile) + 9;
                if(tiles[captureTile1].children[0]){
                    pieceMovement[4] = 7;
                }
                if(tiles[captureTile2].children[0]){
                    pieceMovement[5] = 9;
                }

                // En Passant
                if(enPassantPiecesWhite.includes(captureTile1)){
                    pieceMovement.push(7)
                }
                if(enPassantPiecesWhite.includes(captureTile2)){
                    pieceMovement.push(9)
                }

                // for checking
                if(checking){
                    // let indexOfToRemove = pieceMovement.indexOf(8);
                    // pieceMovement.splice(indexOfToRemove, 1);
                    // pieceMovement.push("", "", "", "", "", "", 7, 9);
                    // if(boardRightEdge.includes(parseInt(_homeTile))){
                    //     let indexOfToRemove = pieceMovement.indexOf(9);
                    //     pieceMovement.splice(indexOfToRemove, 1);
                    // }
                    // if(boardLeftEdge.includes(parseInt(_homeTile))){
                    //     let indexOfToRemove = pieceMovement.indexOf(7);
                    //     pieceMovement.splice(indexOfToRemove, 1);
                    // }
                }
            }
        }

        // King Castling

        // king test for castle test
        // 4k3/8/8/8/8/8/8/4K3

        // king and rook for castle test
        // r3k2r/8/8/8/8/8/8/R3K2R


        // King's highlight for castling
        if (piece === "K" || piece === "k") {

            if (piece === "K") {
                // White's king
                const pieceClass = new Piece();

                const tiles = document.querySelectorAll(".container div");
                // Use initialMovement
                if(kingStartingPositionWhite === parseInt(_homeTile)){

                    // is left and right tile aviable for highlighting on white
                    if (((whiteKingCastlingLimit === 1) && (tiles[parseInt(_homeTile) + 1].children[0] !== undefined))
                        && ((whiteKingCastlingLimit === 1) && (tiles[parseInt(_homeTile) - 1].children[0] !== undefined))) {
                        let tempInitialMovement = pieceClass.generatePiece(piece).initialMovement;
                        tempInitialMovement.pop();
                        tempInitialMovement.pop();
                        pieceMovement = tempInitialMovement;
                    }
                    // is right tile available for highlighting on white
                    else if ((whiteKingCastlingLimit === 1) && (tiles[parseInt(_homeTile) - 1].children[0] !== undefined)) {
                        let tempInitialMovement = pieceClass.generatePiece(piece).initialMovement;
                        tempInitialMovement.pop();
                        tempInitialMovement.pop();
                        tempInitialMovement.push(2);
                        pieceMovement = tempInitialMovement;
                    }
                    // is left tile available for highlighting on white
                    else if (((whiteKingCastlingLimit === 1) && (tiles[parseInt(_homeTile) + 1].children[0] !== undefined))
                        && ((whiteKingCastlingLimit === 1) && (tiles[parseInt(_homeTile) - 3].children[0] === undefined))) {
                        let tempInitialMovement = pieceClass.generatePiece(piece).initialMovement;
                        tempInitialMovement.pop();
                        tempInitialMovement.pop();
                        tempInitialMovement.push(-2);
                        pieceMovement = tempInitialMovement;
                    }

                    // default highlight white king is free bo blockers
                    else if((whiteKingCastlingLimit === 1) && (tiles[parseInt(_homeTile) - 3].children[0] === undefined)) {
                        pieceMovement = pieceClass.generatePiece(piece).initialMovement;

                    }
                }
            }
            else {
                // Black's king
                const pieceClass = new Piece();

                const tiles = document.querySelectorAll(".container div");
                // Use initialMovement
                if(kingStartingPositionBlack === parseInt(_homeTile)){

                    // is left and right tile aviable for highlighting for black
                    if (((blackKingCastlingLimit === 1) && (tiles[parseInt(_homeTile) + 1].children[0] !== undefined))
                        && ((blackKingCastlingLimit === 1) && (tiles[parseInt(_homeTile) - 1].children[0] !== undefined))) {
                        let tempInitialMovement = pieceClass.generatePiece(piece).initialMovement;
                        tempInitialMovement.pop();
                        tempInitialMovement.pop();
                        pieceMovement = tempInitialMovement;
                    }

                    // is left tile available for highlighting for black
                    else if ((blackKingCastlingLimit === 1) && (tiles[parseInt(_homeTile) - 1].children[0] !== undefined)) {
                        let tempInitialMovement = pieceClass.generatePiece(piece).initialMovement;
                        tempInitialMovement.pop();
                        tempInitialMovement.pop();
                        tempInitialMovement.push(2);
                        pieceMovement = tempInitialMovement;
                    }
                    // is left tile available for highlighting on black
                    else if (((blackKingCastlingLimit === 1) && (tiles[parseInt(_homeTile) + 1].children[0] !== undefined))
                        && ((blackKingCastlingLimit === 1) && (tiles[parseInt(_homeTile) - 3].children[0] === undefined))) {
                        let tempInitialMovement = pieceClass.generatePiece(piece).initialMovement;
                        tempInitialMovement.pop();
                        tempInitialMovement.pop();
                        tempInitialMovement.push(-2);
                        pieceMovement = tempInitialMovement;
                    }

                    // default highlight black king is free bo blockers
                    else if((blackKingCastlingLimit === 1) && (tiles[parseInt(_homeTile) - 3].children[0] === undefined)) {
                        pieceMovement = pieceClass.generatePiece(piece).initialMovement;

                    }
                }
            }
        }

        //if k/K/n/N piece is on edge of board
        if(boardEdges.includes(parseInt(_homeTile))){
            if(boardTopEdge.includes(parseInt(_homeTile))){
                exemption.push(...topEdge);
            }
            if(boardRightEdge.includes(parseInt(_homeTile))){
                if(piece === "P" || piece === "p"){

                    let capture1 = (pieceMovement.indexOf(9) != -1) ? pieceMovement.indexOf(9): false;
                    let capture2 = (pieceMovement.indexOf(-7) != -1) ? pieceMovement.indexOf(-7): false;
                    let removeCapture = capture1 || capture2;
                    exemption.push(removeCapture);

                }else{
                    exemption.push(...rightEdge);
                }
            }
            if(boardBottomEdge.includes(parseInt(_homeTile))){
                exemption.push(...bottomEdge);
            }
            if(boardLeftEdge.includes(parseInt(_homeTile))){
                if(piece === "P" || piece === "p"){
                    let capture1 = (pieceMovement.indexOf(-9) != -1) ? pieceMovement.indexOf(-9): false;
                    let capture2 = (pieceMovement.indexOf(7) != -1) ? pieceMovement.indexOf(7): false;
                    let removeCapture = capture1 || capture2;
                    exemption.push(removeCapture);
                }else{
                    exemption.push(...leftEdge);
                }
            }
        }

        // if n/N is near edge
        if(piece == "n" || piece == "N"){
            if(boardTopEdge.includes(parseInt(_homeTile)-8)){
                exemption.push(...topEdge);
            }
            if(boardRightEdge.includes(parseInt(_homeTile)+1)){
                exemption.push(2, 8);
            }
            if(boardBottomEdge.includes(parseInt(_homeTile)+8)){
                exemption.push(...bottomEdge);
            }
            if(boardLeftEdge.includes(parseInt(_homeTile)-1)){
                exemption.push(3, 9);
            }
        }

        for(j = 0; j < pieceMovement.length; j++){
            if(checking && piece == "K"){
                // console.log('test')
            }

            if(exemption.includes(j)){
                continue;
            }
            let validMove = parseInt(_homeTile)+pieceMovement[j];

            if(validMove < 0){
                continue;
            }

            if(pieceMovement[j] == ""){
                continue;
            }

            if(validMove < 64){
                if(tiles[validMove].children[0]){

                    if(lightPiece){
                        if(tiles[validMove].children[0].classList.contains("darkPiece")){
                            // "enemy piece"
                            // if ememy piece is in front of pawn
                            if(piece == "P" && pieceMovement[j] == -8){
                                continue;
                            }
                            if(!checking){
                                // tiles[validMove].children[0].setAttribute("ondragover", "removeDrop(event)");
                            }
                            // continue;
                        }
                        if(tiles[validMove].children[0].classList.contains("lightPiece")){
                            // "friendly piece";
                            if(checking){
                                if(tiles[validMove].children[0].id[0] != "K"){
                                    // tiles[validMove].style.backgroundColor = "#f57842"; //*(a)
                                    // tiles[validMove].style.backgroundColor = "rgb(224, 155, 17, .5)"; //*(a)
                                    let thisString = `${piece}-${_homeTile}`
                                    if(currentTilesOnThreat[thisString] == undefined){
                                        currentTilesOnThreat[thisString] = [];
                                    }
                                    currentTilesOnThreat[thisString].push(validMove);
                                }
                            }
                            continue;
                        }

                    }else{
                        if(tiles[validMove].children[0].classList.contains("lightPiece")){
                            // "enemy piece"
                            if(piece == "p" && pieceMovement[j] == 8){
                                continue;
                            }
                            if(!checking){
                                // tiles[validMove].children[0].setAttribute("ondragover", "removeDrop(event)");
                            }
                        }
                        if(tiles[validMove].children[0].classList.contains("darkPiece")){
                            // "friendly piece"
                            if(checking){
                                if(tiles[validMove].children[0].id[0] != "k"){
                                    // tiles[validMove].style.backgroundColor = "#f57842"; //*(a)
                                    // tiles[validMove].style.backgroundColor = "rgb(224, 155, 17, .5)"; //*(a)
                                    let thisString = `${piece}-${_homeTile}`
                                    if(currentTilesOnThreat[thisString] == undefined){
                                        currentTilesOnThreat[thisString] = [];
                                    }
                                    currentTilesOnThreat[thisString].push(validMove);
                                }
                            }
                            continue;
                        }

                    }
                }
                if(!checking){
                    if((piece == "k" || piece == "K" ) && (unsafeTiles.length != 0) && (unsafeTiles.includes(validMove)) ){
                        tiles[validMove].setAttribute("ondragover", "removeDrop(event)");
                        tiles[validMove].style.backgroundColor = highlightCheckMove;

                    }else{
                        tiles[validMove].setAttribute("ondragover", "dropAllow(event)");
                        // tiles[validMove].style.backgroundColor = "#F91F15";
                        tiles[validMove].style.backgroundColor = highlightColor;

                    }
                    if(piece == "K"){
                        for(object in threateningPiece){
                            if(threateningPiece[object].includes(parseInt(validMove)) && (object[0] != object[0].toUpperCase())){
                                tiles[validMove].setAttribute("ondragover", "removeDrop(event)");
                                tiles[validMove].style.backgroundColor = highlightCheckMove;
                                break;
                            }
                        }
                        let threatDirection;
                        for(object in threateningPiece){
                            if(threateningPiece[object].includes(parseInt(_homeTile))){
                                threatDirection = object;
                            }
                        }
                        for(object in slidingBeyondPieces){
                            if(slidingBeyondPieces[object].includes(parseInt(validMove)) && (object == threatDirection)){
                                tiles[validMove].setAttribute("ondragover", "removeDrop(event)");
                                tiles[validMove].style.backgroundColor = highlightCheckMove;
                                break;
                            }
                        }

                    }else if(piece == "k"){
                        for(object in threateningPiece){
                            if(threateningPiece[object].includes(parseInt(validMove)) && (object[0] == object[0].toUpperCase())){
                                tiles[validMove].setAttribute("ondragover", "removeDrop(event)");
                                tiles[validMove].style.backgroundColor = highlightCheckMove;
                                break;
                            }
                        }
                        let threatDirection;
                        for(object in threateningPiece){
                            if(threateningPiece[object].includes(parseInt(_homeTile))){
                                threatDirection = object;
                            }
                        }
                        for(object in slidingBeyondPieces){
                            if(slidingBeyondPieces[object].includes(parseInt(validMove)) && (object == threatDirection)){
                                tiles[validMove].setAttribute("ondragover", "removeDrop(event)");
                                tiles[validMove].style.backgroundColor = highlightCheckMove;
                                break;
                            }
                        }
                    }
                    
                }
                if(checking){
                    // tiles[validMove].style.backgroundColor = "#f57842"; //**(b)
                    if(exemption.includes[j]){

                    }else{

                        if((piece == "p" || piece == "P") && (j == 0 || j == 1)){
                            if(piece == "P"){
                                // lightpiece
                                // tiles[validMove].style.backgroundColor = "rgba(31, 17, 224, .5)"; //**(b)
                                if(pawnNonCaptureMoves[piece] == undefined){
                                    pawnNonCaptureMoves[piece] = [];
                                }
                                pawnNonCaptureMoves[piece].push(validMove);

                                let capturemoves = [-7, -9];
                                if(boardRightEdge.includes(parseInt(_homeTile))){
                                    let indexOfToRemove = capturemoves.indexOf(-7);
                                    capturemoves.splice(indexOfToRemove, 1);
                                }
                                if(boardLeftEdge.includes(parseInt(_homeTile))){
                                    let indexOfToRemove = capturemoves.indexOf(-9);
                                    capturemoves.splice(indexOfToRemove, 1);
                                }
                                let thisString = `${piece}-${_homeTile}`
                                if(currentTilesOnThreat[thisString] == undefined){
                                    currentTilesOnThreat[thisString] = [];
                                }
                                for(item of capturemoves){
                                    let theTile = parseInt(_homeTile)+item
                                    // tiles[theTile].style.backgroundColor = "rgb(224, 155, 17, .5)"
                                    let thisString = `${piece}-${_homeTile}`
                                    currentTilesOnThreat[thisString].push(theTile)
                                }
                            }else{
                                // darkpiece
                                // tiles[validMove].style.backgroundColor = "rgba(31, 17, 224, .5)"; //**(b)
                                if(pawnNonCaptureMoves[piece] == undefined){
                                    pawnNonCaptureMoves[piece] = [];
                                }
                                pawnNonCaptureMoves[piece].push(validMove);

                                let capturemoves = [7, 9];
                                if(boardRightEdge.includes(parseInt(_homeTile))){
                                    let indexOfToRemove = capturemoves.indexOf(9);
                                    capturemoves.splice(indexOfToRemove, 1);
                                }
                                if(boardLeftEdge.includes(parseInt(_homeTile))){
                                    let indexOfToRemove = capturemoves.indexOf(7);
                                    capturemoves.splice(indexOfToRemove, 1);
                                }
                                let thisString = `${piece}-${_homeTile}`
                                if(currentTilesOnThreat[thisString] == undefined){
                                    currentTilesOnThreat[thisString] = [];
                                }
                                for(item of capturemoves){
                                    let theTile = parseInt(_homeTile)+item
                                    // tiles[theTile].style.backgroundColor = "rgb(224, 155, 17, .5)"
                                    currentTilesOnThreat[thisString].push(theTile)

                                    
                                }
                            }
                            continue;
                        }
                        // tiles[validMove].style.backgroundColor = "rgb(224, 155, 17, .5)"; //**(b)
                        let thisString = `${piece}-${_homeTile}`
                        if(currentTilesOnThreat[thisString] == undefined){
                            currentTilesOnThreat[thisString] = [];
                        }
                        currentTilesOnThreat[thisString].push(validMove);
                        
                        let myString = `${piece}-${_homeTile}`
                    }
                    
                    
                }
            }
        }



    }else{
        for(j = 0; j < pieceMovement.length; j++){
            let seeThru = false;
            let direction = pieceMovement[j];
            if(direction == ""){
                continue;
            }else{
                let desc = descending.includes(j);

                loop1:
                for(desc? tile = 63: tile = 0;  desc? tile >= 0: tile < 64;  desc? tile-- : tile++){
                    let currentTile = tiles[tile];

                    if(!exemptedTiles.includes(currentTile.id) && !checking){
                        currentTile.setAttribute("ondragover", "removeDrop(event)")
                    }
                    for(n = 0; n < 64; n++){
                        tileNumber = parseInt(currentTile.id);
                        directionLine = (direction * n) + parseInt(_homeTile);

                        if(tileNumber == 0 && directionLine == 0){
                            // console.log("zero");
                        }

                        if(tileNumber == directionLine){
                            // if(tileNumber == homeTile[0]) continue;
                            if(currentTile.children[0]){
                                // console.log("has piece");

                                if(lightPiece){
                                    if(currentTile.children[0].classList.contains("darkPiece")){

                                        // console.log("enemy piece");

                                        if(!checking && tileNumber != parseInt(_homeTile)){
                                            // currentTile.children[0].setAttribute("ondragover", "removeDrop(event)");

                                        // continue;
                                            currentTile.setAttribute("ondragover", "dropAllow(event)");
                                            currentTile.style.backgroundColor = highlightColor;
                                        }
                                        if(checking && tileNumber != parseInt(_homeTile)){
                                            // currentTile.style.backgroundColor = "#48f542";
                                            // currentTile.style.backgroundColor = "rgb(108, 229, 16, .5)";
                                            if(seeThru){
                                                let mystring = `${piece}-${_homeTile}-${threatDirection[j]}`
                                                if(slidingBeyondPieces[mystring] == undefined){
                                                    slidingBeyondPieces[mystring] = []; 
                                                }
                                                slidingBeyondPieces[mystring].push(tile); 
                                            }else{
                                                let mystring = `${piece}-${_homeTile}-${threatDirection[j]}`
                                                let thisString = `${piece}-${_homeTile}`
                                                if(currentTilesOnThreat[thisString] == undefined){
                                                    currentTilesOnThreat[thisString] = [];
                                                }
                                                if(threateningPiece[mystring] == undefined){
                                                    threateningPiece[mystring] = []; 
                                                }
                                                currentTilesOnThreat[thisString].push(tile);
                                                threateningPiece[mystring].push(tile); 
                                            }
                                            
                                        }
                                        exemptedTiles.push(currentTile.id);
                                        if(!checking){
                                            break loop1;
                                        }else{
                                            seeThru = true;
                                        }
                                    }
                                    if(currentTile.children[0].classList.contains("lightPiece")){
                                        // console.log("friendly piece");
                                        if(checking && tileNumber != parseInt(_homeTile)){
                                            if(currentTile.children[0].id[0] != "K"){
                                                // currentTile.style.backgroundColor = "#48f542"; //*(a)
                                                // currentTile.style.backgroundColor = "rgb(108, 229, 16, .5)"; //*(a)
                                                let thisString = `${piece}-${_homeTile}`
                                                if(currentTilesOnThreat[thisString] == undefined){
                                                    currentTilesOnThreat[thisString] = [];
                                                }
                                                // if(threateningPiece[mystring] == undefined){
                                                //     threateningPiece[mystring] = []; 
                                                // }
                                                currentTilesOnThreat[thisString].push(tile);
                                                // threateningPiece[mystring].push(tile);
                                            }
                                        }

                                        if(tileNumber != parseInt(_homeTile)){
                                            break loop1;
                                        }
                                        // continue;
                                    }

                                }else{ 
                                    if(currentTile.children[0].classList.contains("lightPiece")){


                                        if(!checking && tileNumber != parseInt(_homeTile)){
                                            // currentTile.children[0].setAttribute("ondragover", "removeDrop(event)");
                                            // console.log("enemy piece");
                                            currentTile.setAttribute("ondragover", "dropAllow(event)");
                                            currentTile.style.backgroundColor = highlightColor;
                                        }
                                        if(checking && tileNumber != parseInt(_homeTile)){
                                            // currentTile.style.backgroundColor = "#48f542";
                                            // currentTile.style.backgroundColor = "rgb(108, 229, 16, .5)";
                                            if(seeThru){
                                                let mystring = `${piece}-${_homeTile}-${threatDirection[j]}`
                                                if(slidingBeyondPieces[mystring] == undefined){
                                                    slidingBeyondPieces[mystring] = []; 
                                                }
                                                slidingBeyondPieces[mystring].push(tile); 
                                            }else{
                                                let mystring = `${piece}-${_homeTile}-${threatDirection[j]}`
                                                let thisString = `${piece}-${_homeTile}`
                                                if(currentTilesOnThreat[thisString] == undefined){
                                                    currentTilesOnThreat[thisString] = [];
                                                }
                                                if(threateningPiece[mystring] == undefined){
                                                    threateningPiece[mystring] = []; 
                                                }
                                                currentTilesOnThreat[thisString].push(tile);
                                                threateningPiece[mystring].push(tile);
                                            }
                                            
                                        }

                                        exemptedTiles.push(currentTile.id);
                                        if(!checking){
                                            break loop1;
                                        }else{
                                            seeThru = true;
                                        }
                                        // continue;
                                    }
                                    if(currentTile.children[0].classList.contains("darkPiece")){
                                        // console.log("friendly piece");
                                        if(checking && tileNumber != parseInt(_homeTile)){
                                            if(currentTile.children[0].id[0] != "k"){
                                                // currentTile.style.backgroundColor = "#48f542"; //*(a)
                                                // currentTile.style.backgroundColor = "rgb(108, 229, 16, .5)"; //*(a)
                                                let mystring = `${piece}-${threatDirection[j]}`
                                                let thisString = `${piece}-${_homeTile}`
                                                if(currentTilesOnThreat[thisString] == undefined){
                                                    currentTilesOnThreat[thisString] = [];
                                                }
                                                // if(threateningPiece[mystring] == undefined){
                                                //     threateningPiece[mystring] = []; 
                                                // }
                                                currentTilesOnThreat[thisString].push(tile);
                                                // threateningPiece[mystring].push(tile);
                                            }
                                        }
                                        if(tileNumber != parseInt(_homeTile)){
                                            break loop1;
                                        }
                                        // continue;
                                    }

                                }
                            }
                            if(!checking && tileNumber != parseInt(_homeTile)){
                                currentTile.setAttribute("ondragover", "dropAllow(event)");
                                currentTile.style.backgroundColor = highlightColor;
                            }
                            if(checking && tileNumber != parseInt(_homeTile)){
                                // currentTile.style.backgroundColor = "#48f542"; //*(b)
                                // currentTile.style.backgroundColor = "rgb(108, 229, 16, .5)"; //*(b)
                                if(seeThru){
                                    let mystring = `${piece}-${_homeTile}-${threatDirection[j]}`
                                    if(slidingBeyondPieces[mystring] == undefined){
                                        slidingBeyondPieces[mystring] = []; 
                                    }
                                    slidingBeyondPieces[mystring].push(tile); 
                                }else{
                                    let mystring = `${piece}-${_homeTile}-${threatDirection[j]}`
                                    let thisString = `${piece}-${_homeTile}`
                                    if(currentTilesOnThreat[thisString] == undefined){
                                        currentTilesOnThreat[thisString] = [];
                                    }
                                    if(threateningPiece[mystring] == undefined){
                                        threateningPiece[mystring] = []; 
                                    }
                                    currentTilesOnThreat[thisString].push(tile);
                                    threateningPiece[mystring].push(tile);
                                }
                                

                            }
                            exemptedTiles.push(currentTile.id);

                            if(topEdge.includes(j)){
                                if(boardTopEdge.includes(tileNumber)){
                                    break loop1;
                                }
                            }

                            if(rightEdge.includes(j)){
                                if(boardRightEdge.includes(tileNumber)){
                                    break loop1;
                                }
                            }

                            if(bottomEdge.includes(j)){
                                if(boardBottomEdge.includes(tileNumber)){
                                    break loop1;
                                }
                            }

                            if(leftEdge.includes(j)){
                                if(boardLeftEdge.includes(tileNumber)){
                                    break loop1;
                                }
                            }
                        }
                    }
                }
            }
        }
    }


}

function removeDrop(e){
    e.stopPropagation();
}

function returnDrop(){
    for(i = 0; i < 64; i++){
        tiles[i].setAttribute("ondragover", "dropAllow(event)");
        if(tiles[i].children[0]){
            tiles[i].children[0].setAttribute("ondragover", "dropAllow(event)");
        }
    }
}

function returnTileColors(){
    for(i = 0; i < 32; i++){
        // lightTiles[i].style.backgroundColor = "#A0785A";
        // darkTiles[i].style.backgroundColor = "brown";
        lightTiles[i].style.backgroundColor = "rgba(0,0,0,0)";
        darkTiles[i].style.backgroundColor = "rgba(0,0,0,0)";
    }
}

function removeDragFeatureLight(someNodeList){
    let length = someNodeList.length;
    for(i = 0; i < length; i++){
        lightPieces[i].removeAttribute("ondragstart");
        lightPieces[i].removeAttribute("draggable");
        lightPieces[i].setAttribute("ondragover", "removeDrop(e)");
    }
}

function removeDragFeatureDark(someNodeList){
    let length = someNodeList.length;
    for(i = 0; i < length; i++){
        darkPieces[i].removeAttribute("ondragstart");
        darkPieces[i].removeAttribute("draggable");
        darkPieces[i].setAttribute("ondragover", "removeDrop(e)");
    }
}

function addDragFeatureDark(someNodeList){
    let length = someNodeList.length;
    for(i = 0; i < length; i++){
        darkPieces[i].setAttribute("draggable", "true");
        darkPieces[i].setAttribute("ondragstart", "drag(event)");
        darkPieces[i].setAttribute("ondragover", "dropAllow(event)");
    }
}

function addDragFeatureLight(someNodeList){
    let length = someNodeList.length;
    for(i = 0; i < length; i++){
        lightPieces[i].setAttribute("draggable", "true");
        lightPieces[i].setAttribute("ondragstart", "drag(event)");
        lightPieces[i].setAttribute("ondragover", "dropAllow(event)");
    }
}

//************************************************************************************** Drag and drop events **************************************************************************************

let movable;

async function dropAllow(e) {
    e.preventDefault();


    if(cannotBlock.includes(`${piece}-${homeTile[0]}`)){
        e.target.removeAttribute("ondragstart")
        e.target.removeAttribute("draggable");
        e.target.setAttribute("ondragover", "removeDrop(e)");
    }

    

    // Can King castles ?
    if (piece === "K" || piece === "k") {
        if (piece === "K") {
            console.log(e.target.id);
            // White king
            // Is tile available for castling
            if (parseInt(e.target.id) === rightWhiteCastlingTile) {
                isCanCastleRightWhite = true;
            } else {
                isCanCastleRightWhite = false;
            }

            if (parseInt(e.target.id) === leftWhiteCastlingTile) {
                isCanCastleLeftWhite = true;
            } else {
                isCanCastleLeftWhite = false;
            }


        } else {
            // Black king

            // Is tile available for castling
            if (parseInt(e.target.id) === leftBlackCastlingTile) {
                isCanCastleLeftBlack = true;
            } else {
                isCanCastleLeftBlack = false;
            }

            if (parseInt(e.target.id) === rightBlackCastlingTile) {
                isCanCastleRightBlack = true;
            } else {
                isCanCastleRightBlack = false;
            }
        }
    }


    if(!e.target.classList.contains(turn)){
        if(!movable){
            console.log("triggered")
            let turnInfo = document.querySelector(".turn");
            turnInfo.classList.add("turn-emphasize");
            function removeEmph(){
                turnInfo.classList.remove("turn-emphasize");
            }
            setTimeout(removeEmph, 300);
        }
        return;
    }



    tiles = document.querySelectorAll(".container div");
    // console.log(tiles);
    lightTiles = document.querySelectorAll(".lightTiles");
    darkTiles = document.querySelectorAll(".darkTiles");

    // console.log("dropAllow", e.target); //Information on the piece lifted
    // console.log("parent: ", e.target.parentElement.getAttribute("data-tilenumber")); //Information on the home tile of the piece being lifted
    // homeTile = e.target.parentElement.getAttribute("data-tilenumber") ? e.target.parentElement.getAttribute("data-tilenumber") : homeTile;

    


    lifted = e.target.parentElement.getAttribute("data-tilenumber");
    if(lifted){
        homeTile.push(lifted);
        // console.log("homeTile: ", homeTile[0])
        let pieceClass = new Piece();
        let movement = pieceClass.generatePiece(piece).movement;
        let sliding = pieceClass.generatePiece(piece).sliding;
        if(!(cannotBlock.includes(`${piece}-${homeTile[0]}`))){
            highlightTiles(homeTile[0], movement, sliding, piece);
        }else{
            e.target.removeAttribute("ondragstart")
            e.target.removeAttribute("draggable");
            e.target.setAttribute("ondragover", "removeDrop(e)");
        }
        movable = true;
    }
    // console.log("lifted: ", lifted);
    // console.log("homeTile: ", homeTile);

}

function drag(e) {
    e.dataTransfer.setData("text", e.target.id);



    console.log(e.target);

    if(homeTile[0] != undefined){
        returnDrop();
        returnTileColors();
        homeTile[0] = e.target.parentElement.id;
    }

    // console.log("e.target.parentElement.id: ", e.target.parentElement.id);

    piece = e.target.id[0]
    if(e.target.classList.contains("lightPiece")){
        pieceColor = "White";
    }else{
        pieceColor = "Black";
    }

    // console.log("drag", e.target); //information on the piece moved
}

let dropValue = undefined;


async function drop(e) {
    e.preventDefault();
    movable = false;
    let data = e.dataTransfer.getData("text");
    // disable changing turn when piece is returned to its home tile
    if(!(e.target == document.getElementById(data))){
        e.target.appendChild(document.getElementById(data));
    }else{
        return;
    }
    landed = e.target;

    if (piece === "P" || piece === "p") {
        // Whites' pawn
        if (piece === "P") {
            // look into capture piece when promoting
            const capturedPieceInfo = document.getElementById(e.target.id);
            const capturedPiece     = capturedPieceInfo.parentElement.id;

            const pawnPiece = new Piece();
            let targetPawn = e.target.children[0];


            // White promotion check
            if ((whitePromotionField.includes(parseInt(e.target.id)))
                || whitePromotionField.includes(parseInt(capturedPiece))) {

                const promotionChoices = {
                    Q: "Q",
                    R: "R",
                    B: "B",
                    N: "N",
                }

                const promotionUiChoices = document.querySelector(".promotion-choices-white")

                // Show ui for promotion
                promotionUiChoices.style.display = "block";

                // Fetch buttons on white promotion
                const queenPromotionBtn  = document.querySelector(".promotion-white-queen");
                const rookPromotionBtn   = document.querySelector(".promotion-white-rook");
                const bishopPromotionBtn = document.querySelector(".promotion-white-bishop");
                const knightPromotionBtn = document.querySelector(".promotion-white-knight");

                // Promote to white queen
                queenPromotionBtn.addEventListener("click", () => {
                    if (!(targetPawn.hasAttribute(`isPromoted`))) {
                        let promotionPieceIcon = pawnPiece.generatePiece(promotionChoices.Q).icon;
                        targetPawn.className = `${promotionPieceIcon} lightPiece`
                        targetPawn.setAttribute("src", pawnPiece.generatePiece(promotionChoices.Q).img);
                        targetPawn.id = `${pawnPiece.generatePiece(promotionChoices.Q).code}-${targetPawn.parentElement.id}`
                        piece = pawnPiece.generatePiece(promotionChoices.Q).code;
                        promotionUiChoices.style.display = "none"
                        targetPawn.setAttribute(`isPromoted`, true);
                    }
                })

                // Promote to white rook
                rookPromotionBtn.addEventListener("click", () => {
                    if (!(targetPawn.hasAttribute(`isPromoted`))) {
                        let promotionPieceIcon = pawnPiece.generatePiece(promotionChoices.R).icon;
                        targetPawn.className = `${promotionPieceIcon} lightPiece`
                        targetPawn.setAttribute("src", pawnPiece.generatePiece(promotionChoices.R).img);
                        targetPawn.id = `${pawnPiece.generatePiece(promotionChoices.R).code}-${targetPawn.parentElement.id}`
                        piece = pawnPiece.generatePiece(promotionChoices.R).code;
                        promotionUiChoices.style.display = "none"
                        targetPawn.setAttribute(`isPromoted`, true);
                    }
                })

                // Promote to white bishop
                bishopPromotionBtn.addEventListener("click", () => {
                    if (!(targetPawn.hasAttribute(`isPromoted`))) {
                        let promotionPieceIcon = pawnPiece.generatePiece(promotionChoices.B).icon;
                        targetPawn.className = `${promotionPieceIcon} lightPiece`
                        targetPawn.setAttribute("src", pawnPiece.generatePiece(promotionChoices.B).img);
                        targetPawn.id = `${pawnPiece.generatePiece(promotionChoices.B).code}-${targetPawn.parentElement.id}`
                        piece = pawnPiece.generatePiece(promotionChoices.B).code;
                        promotionUiChoices.style.display = "none"
                        targetPawn.setAttribute(`isPromoted`, true);
                    }
                })

                // Promote to white knight
                knightPromotionBtn.addEventListener("click", () => {
                    if (!(targetPawn.hasAttribute(`isPromoted`))) {
                        let promotionPieceIcon = pawnPiece.generatePiece(promotionChoices.N).icon;
                        targetPawn.className = `${promotionPieceIcon} lightPiece`
                        targetPawn.setAttribute("src", pawnPiece.generatePiece(promotionChoices.N).img);
                        targetPawn.id = `${pawnPiece.generatePiece(promotionChoices.N).code}-${targetPawn.parentElement.id}`
                        piece = pawnPiece.generatePiece(promotionChoices.N).code;
                        promotionUiChoices.style.display = "none"
                        targetPawn.setAttribute(`isPromoted`, true);
                    }
                })
            }
        }
        else {
            // Blacks' pawn
            // look into capture piece when promoting

            const capturedPieceInfo = document.getElementById(e.target.id);
            const capturedPiece     = capturedPieceInfo.parentElement.id;

            const pawnPiece = new Piece();
            let targetPawn = e.target.children[0];

            // Black promotion check
            if ((blackPromotionField.includes(parseInt(e.target.id)))
                || blackPromotionField.includes(parseInt(capturedPiece))) {

                const promotionChoices = {
                    q: "q",
                    r: "r",
                    b: "b",
                    n: "n",
                }

                const promotionUiChoices = document.querySelector(".promotion-choices-black")

                // Show ui for black promotion
                promotionUiChoices.style.display = "block";

                // Fetch buttons for  black promotion
                const queenPromotionBtn  = document.querySelector(".promotion-black-queen");
                const rookPromotionBtn   = document.querySelector(".promotion-black-rook");
                const bishopPromotionBtn = document.querySelector(".promotion-black-bishop");
                const knightPromotionBtn = document.querySelector(".promotion-black-knight");


                // Promote to black queen
                queenPromotionBtn.addEventListener("click", () => {
                    if (!(targetPawn.hasAttribute(`isPromoted`))) {
                        let promotionPieceIcon = pawnPiece.generatePiece(promotionChoices.q).icon;
                        targetPawn.className = `${promotionPieceIcon} blackPiece`;
                        targetPawn.setAttribute("src", pawnPiece.generatePiece(promotionChoices.q).img);
                        targetPawn.id = `${pawnPiece.generatePiece(promotionChoices.q).code}-${targetPawn.parentElement.id}`
                        piece = pawnPiece.generatePiece(promotionChoices.q).code;
                        promotionUiChoices.style.display = "none"
                        targetPawn.setAttribute(`isPromoted`, true);
                    }
                })

                // Promote to black rook
                rookPromotionBtn.addEventListener("click", () => {
                    if (!(targetPawn.hasAttribute(`isPromoted`))) {
                        let promotionPieceIcon = pawnPiece.generatePiece(promotionChoices.r).icon;
                        targetPawn.className = `${promotionPieceIcon} blackPiece`
                        targetPawn.setAttribute("src", pawnPiece.generatePiece(promotionChoices.r).img);
                        targetPawn.id = `${pawnPiece.generatePiece(promotionChoices.r).code}-${targetPawn.parentElement.id}`
                        promotionUiChoices.style.display = "none"
                        piece = pawnPiece.generatePiece(promotionChoices.r).code;
                    }
                    targetPawn.setAttribute(`isPromoted`, true);
                })

                // Promote to black bishop
                bishopPromotionBtn.addEventListener("click", () => {
                    if (!(targetPawn.hasAttribute(`isPromoted`))) {
                        let promotionPieceIcon = pawnPiece.generatePiece(promotionChoices.b).icon;
                        targetPawn.className = `${promotionPieceIcon} blackPiece`
                        targetPawn.setAttribute("src", pawnPiece.generatePiece(promotionChoices.b).img);
                        targetPawn.id = `${pawnPiece.generatePiece(promotionChoices.b).code}-${targetPawn.parentElement.id}`
                        piece = pawnPiece.generatePiece(promotionChoices.b).code;
                        promotionUiChoices.style.display = "none"
                        targetPawn.setAttribute(`isPromoted`, true);
                    }
                })

                // Promote to black knight
                knightPromotionBtn.addEventListener("click", () => {
                    if (!(targetPawn.hasAttribute(`isPromoted`))) {
                        let promotionPieceIcon = pawnPiece.generatePiece(promotionChoices.n).icon;
                        targetPawn.className = `${promotionPieceIcon} blackPiece`
                        targetPawn.setAttribute("src", pawnPiece.generatePiece(promotionChoices.n).img);
                        targetPawn.id = `${pawnPiece.generatePiece(promotionChoices.n).code}-${targetPawn.parentElement.id}`
                        promotionUiChoices.style.display = "none"
                        piece = pawnPiece.generatePiece(promotionChoices.n).code;
                        targetPawn.setAttribute(`isPromoted`, true);
                    }
                })
            }
        }
    }


    // Remove castling features if rook is move

    if (piece === "R" || piece === "r") {

        // White's rook
        if (piece === "R") whiteKingCastlingLimit--;
        // Black's rook
        else if (piece === "r") blackKingCastlingLimit--;
    }



    // King's castling
    if (piece === "K" || piece === "k") {

        // White's castling
        if (piece === "K") {

            const rightRook = getRook("+", 3, homeTile[0]);
            const leftRook  = getRook("-", 4, homeTile[0]);

            if (whiteKingCastlingLimit === 1) {

                if (isCanCastleRightWhite) {
                    e.target.parentElement.children[(parseInt(homeTile[0]) + 1)].appendChild(rightRook);

                    // remove castling ability
                    whiteKingCastlingLimit--;
                }
                else if (isCanCastleLeftWhite) {
                    e.target.parentElement.children[(parseInt(homeTile[0]) - 1)].appendChild(leftRook);

                    // remove castling ability
                    whiteKingCastlingLimit--;
                }
            }

            // remove castling ability
            whiteKingCastlingLimit--;

        }
        else {
            // Black's castling
            const rightRook = getRook("+", 3, homeTile[0]);
            const leftRook  = getRook("-", 4, homeTile[0]);

            if (blackKingCastlingLimit === 1) {
                if (isCanCastleRightBlack) {
                    e.target.parentElement.children[(parseInt(homeTile[0]) + 1)].appendChild(rightRook);

                    // remove castling ability
                    blackKingCastlingLimit--;
                }
                else if (isCanCastleLeftBlack) {
                    e.target.parentElement.children[(parseInt(homeTile[0]) - 1)].appendChild(leftRook);

                    // remove castling ability
                    blackKingCastlingLimit--;
                }
            }

            // remove castling ability
            blackKingCastlingLimit--;
        }
    }






    if(homeTile){
        // console.log(`${pieceColor} ${piece} moved`);

        if(pieceColor == "White"){
            lightPieces = document.querySelectorAll(".lightPiece");
            removeDragFeatureLight(lightPieces);

            darkPieces = document.querySelectorAll(".darkPiece");
            addDragFeatureDark(darkPieces)


        }else{
            darkPieces = document.querySelectorAll(".darkPiece");
            removeDragFeatureDark(darkPieces)

            lightPieces = document.querySelectorAll(".lightPiece");
            addDragFeatureLight(lightPieces)

        }
        changeTurn()
        returnTileColors()
        returnDrop();

    }


    // reset recorded en passant vulnerabilities

//     landed = e.target;

    // Detect pawn pieces vulnerable to En Passant
    landed = e.target.id;

    let container1 = document.createElement("div");

    if(piece == "P"){
        // record pawn pieces vulnerable to En Passant
        if(pawnEnPassantWhite.includes(parseInt(landed))){
            // console.log("piece: ", piece);
            enPassantPiecesWhite.push(parseInt(homeTile[0])-8);
        }
        // capture by en passant
        if(enPassantPiecesBlack.includes(parseInt(landed))){
            // console.log("tile of capture: ", tiles[parseInt(landed)+8]);
            if(tiles[parseInt(landed)+8].children[0].id[0] == "p"){
                container1.appendChild(tiles[parseInt(landed)+8].children[0]);
                document.querySelector(".white-captured").innerHTML += `<div class="tile">${container1.innerHTML}</div>`;
            }
            let indexOfTileCapture = enPassantPiecesBlack.indexOf(parseInt(landed));
            enPassantPiecesBlack.splice(indexOfTileCapture, 1);
        }
        // remove en passant
        if(pawnEnPassantBlack.includes(parseInt(landed))){
            let indexOfTileCapture = enPassantPiecesWhite.indexOf(parseInt(landed)+16);
            enPassantPiecesWhite.splice(indexOfTileCapture, 1);
            enPassantPiecesWhite = []
            enPassantPiecesBlack = []
        }
    }

    if(piece == "p"){
        // record pawn pieces vulnerable to En Passant
        if(pawnEnPassantBlack.includes(parseInt(landed))){
            // console.log("piece: ", piece);
            enPassantPiecesBlack.push(parseInt(homeTile[0])+8);
        }
        // capture by en passant
        if(enPassantPiecesWhite.includes(parseInt(landed))){
            // console.log("tile of capture: ", tiles[parseInt(landed)-8]);
            if(tiles[parseInt(landed)-8].children[0].id[0] == "P"){
                container1.appendChild(tiles[parseInt(landed)-8].children[0]);
                document.querySelector(".black-captured").innerHTML += `<div class="tile">${container1.innerHTML}</div>`;
            }
            let indexOfTileCapture = enPassantPiecesWhite.indexOf(parseInt(landed));
            enPassantPiecesWhite.splice(indexOfTileCapture, 1);
        }
        // remove en passant
        if(pawnEnPassantWhite.includes(parseInt(landed))){
            let indexOfTileCapture = enPassantPiecesBlack.indexOf(parseInt(landed)-16);
            enPassantPiecesBlack.splice(indexOfTileCapture, 1);
            enPassantPiecesWhite = []
            enPassantPiecesBlack = []
        }
    }

    //

    homeTile = [];
    // console.log("tiles: ", tiles);
    // console.log("piece: ", piece);
    // console.log("landed: ", landed);
    // console.log("homeTile: ", homeTile);
    // console.log("pieceColor: ", pieceColor);
    // console.log("lifted at end: ", lifted);
    // getFEN();
    // fenArray.push(getFEN());

    displayFEN()
    // console.log("drop", e.target); //Information on the tile where the piece landed


    
    // for(item in currentTilesOnThreat){
    //     console.log("item:", item);
    //     if(item == item.toUpperCase()){
    //         console.log("capital:", item);
    //     }
    // }

    dropValue = e.target;
    // console.log("dropValue: ", dropValue);


        let thisTileID;
        // Capture pieces
         if(!e.target.children[0].parentElement.classList.contains("tile")){
            let thereIsWinner = false;
            let thisTile = e.target.children[0].parentElement.parentElement;
            if(e.target.children[0].parentElement.id[0] == "k"){
                console.log("White wins");
                whiteWin.style.display = "block";
                thereIsWinner = true;
            }else if(e.target.children[0].parentElement.id[0] == "K"){
                console.log("Black wins");
                blackWin.style.display = "block";
                thereIsWinner = true;
            }
            thisTileID = thisTile.id;
            thisTile.appendChild(e.target.children[0]);
            thisTile = document.getElementById(`${thisTileID}`);
            if(thisTile.children[1]){
                console.log("test");
                let container = document.createElement("div");
                if(thisTile.children[0].classList.contains("lightPiece")){
                    blackCapturedHistory.push(thisTile.children[0].id[0]);
                    container.appendChild(thisTile.children[0]);
                    document.querySelector(".black-captured").innerHTML += `<div class="tile">${container.innerHTML}</div>`;
                    whiteCapturedHistory.push("");
                }else{
                    whiteCapturedHistory.push(thisTile.children[0].id[0]);
                    container.appendChild(thisTile.children[0]);
                    document.querySelector(".white-captured").innerHTML += `<div class="tile">${container.innerHTML}</div>`;
                    blackCapturedHistory.push("");
                }
            }

            if(thereIsWinner){
                winnerMsg.style.display = "flex";
            }

        }else{
            if(e.target.children[1]){
                let thereIsWinner = false;
                console.log("capture");
                if(e.target.children[0].id[0] == "k"){
                    console.log("White wins");
                    whiteWin.style.display = "block";
                    thereIsWinner = true;
                }else if(e.target.children[0].id[0] == "K"){
                    console.log("Black wins");
                    blackWin.style.display = "block";
                    thereIsWinner = true;
                }
                let container = document.createElement("div");
                if(e.target.children[0].classList.contains("lightPiece")){
                    blackCapturedHistory.push(e.target.children[0].id[0]);
                    container.appendChild(e.target.children[0]);
                    document.querySelector(".black-captured").innerHTML += `<div class="tile">${container.innerHTML}</div>`;
                    whiteCapturedHistory.push("");
                }else{
                    whiteCapturedHistory.push(e.target.children[0].id[0]);
                    container.appendChild(e.target.children[0]);
                    document.querySelector(".white-captured").innerHTML += `<div class="tile">${container.innerHTML}</div>`;
                    blackCapturedHistory.push("");
                }
                // e.target.children[0].remove();
                if(thereIsWinner){
                    winnerMsg.style.display = "flex";
                }
            }
            else{
                whiteCapturedHistory.push("");
                blackCapturedHistory.push("");
            }
        }


    fenArray.push(getFEN());







        
    // Implement check feature
    // reset value of currentTilesOnThreat
        currentTilesOnThreat = {};
        threateningPiece = {};
        currentThreatOnKing = [];
        // pawnNonCaptureMoves = {}
        pawnNonCaptureMoves = {
            P: [],
            p: []
        }
        slidingBeyondPieces = {};
    // fill up currentTilesOnThreat
        for(x = 0; x < 64; x++){
            if(tiles[x].children[0]){
                let currentPieceToEvaluate = tiles[x].children[0].id[0];
                let pieceObj = new Piece();
                let currentPiece = pieceObj.generatePiece(currentPieceToEvaluate);
                highlightTiles(tiles[x].id, currentPiece.movement, currentPiece.sliding, currentPiece.code, true);
                // console.log("stop")
            }
        }
    // console.log("currentTilesOnThreat: ", currentTilesOnThreat);
    let checked = false;

    function checkIfCheckmate(){
        
        
        let darkKing = document.querySelector("#k");
        let tileOfKingBlack = darkKing.parentElement.id;
            // iterate thru currentTilesOnThreat
        for(item in currentTilesOnThreat){
            // compare against possible capture of lightpieces
            if(item == item.toUpperCase()){
                if(currentTilesOnThreat[item].includes(parseInt(tileOfKingBlack))){
                    // console.log("check");
                    let checkInfo = document.querySelector(".checkInfo")
                    checkInfo.innerHTML = `Black king is checked`;
                    
                    darkPieces = document.querySelectorAll(".darkPiece");
                    removeDragFeatureDark(darkPieces)

                    document.getElementById(`${tileOfKingBlack}`).children[0].setAttribute("draggable", "true");
                    document.getElementById(`${tileOfKingBlack}`).children[0].setAttribute("ondragstart", "drag(event)");
                    document.getElementById(`${tileOfKingBlack}`).children[0].setAttribute("ondragover", "dropAllow(event)");

                    
                    for(i = 0; i < darkPieces.length; i++){
                        darkPieces[i].setAttribute("ondragover", "removeDrop(e)");
                    }

                    for(i = 0; i < lightPieces.length; i++){
                        lightPieces[i].setAttribute("ondragover", "removeDrop(e)");
                    }

                    
                    checked = true;
                    checkedColor = "Black";
                }
            }
        }


        let lightKing = document.querySelector("#K");
        let tileOfKingWhite = lightKing.parentElement.id;
        // iterate thru currentTilesOnThreat
        for(item in currentTilesOnThreat){
            // compare against possible capture of darkpieces
            if(item != item.toUpperCase()){
                if(currentTilesOnThreat[item].includes(parseInt(tileOfKingWhite))){
                    // console.log("check");
                    let checkInfo = document.querySelector(".checkInfo")
                    checkInfo.innerHTML = `White king is checked`;
                    checked = true;
                    checkedColor = "White";
                    break;
                }
            }
        }
        
        
        
        // if piece is lightpiece
        // if(piece == piece.toUpperCase()){
        if(checkedColor == "Black"){
            // lightpiece
            // console.log("lightpiece moved");
            // get tile of darkpiece king
            
    
            if(checked == true){
                
            
                // check if king is at one of the board edges
                let movements = [-8, 8, 1, -1, -7, -9, 9, 7]
                let exemption = [];
                if(boardEdges.includes(parseInt(tileOfKingBlack))){
                    if(boardTopEdge.includes(parseInt(tileOfKingBlack))){
                        exemption.push(...topEdge);
                    }
                    if(boardRightEdge.includes(parseInt(tileOfKingBlack))){
                        exemption.push(...rightEdge);
                    }
                    if(boardBottomEdge.includes(parseInt(tileOfKingBlack))){
                        exemption.push(...bottomEdge);
                    }
                    if(boardLeftEdge.includes(parseInt(tileOfKingBlack))){
                        exemption.push(...leftEdge);
                    }
                }
                
                // get the actual tile numbers of kings next movement relative to its hometile
                let kingNextMovements = movements.map((item)=>{
                    // console.log("movement item: ", item);
                    // console.log("new item: ", parseInt(tileOfKingBlack) + item);
                    let tileNumber = parseInt(tileOfKingBlack) + item;
                    if((tileNumber >= 0) && (tileNumber < 64)){
                        return parseInt(tileOfKingBlack) + item;
                    }else{
                        return
                    }
                });
    
                // check if all king's possible next move will be a potential capture by opponent
                let safeTiles = []
                
                function allMovesCheck(nextMove, index){
                    if(!exemption.includes(index) && tiles[nextMove].children[0] == undefined){ //*(b) //if tile has no piece
                        for(item in currentTilesOnThreat){
                            if(item[0] == item[0].toUpperCase()){
                                if(currentTilesOnThreat[item].includes(nextMove)){
                                    unsafeTiles.push(nextMove);
                                    return true;
                                }
                            }
                        }
                        safeTiles.push(nextMove);
                    }else if(!exemption.includes(index) && tiles[nextMove].children[0].classList.contains("lightPiece")){ // if tile has ally piece
                        for(item in currentTilesOnThreat){
                            if(item[0] == item[0].toUpperCase()){
                                if(currentTilesOnThreat[item].includes(nextMove)){
                                    unsafeTiles.push(nextMove);
                                    return true;
                                }
                            }
                        }
                        safeTiles.push(nextMove);
                    }else{
                        return true; // if tile has foe piece it will not be part of the evaluation thus will always return true (not safe)
                    }
                };
    
                // count the number of threats to the king
                let threatsOnKing = 0;
                for(item in currentTilesOnThreat){
                    if(item[0] == item[0].toUpperCase()){
                        if(currentTilesOnThreat[item].includes(parseInt(tileOfKingBlack))){
                            threatsOnKing += 1;
                            currentThreatOnKing.push(item);
                        }
                    }
                }
                
                // check if there is a sliding piece that has only one piece between it and the king
                // let cannotBlock = [];
    
                direction1 = ["South", "East", "SouthEast", "SouthWest"] //not more than
                // direction2 = ["North", "West", "NorthWest", "NorthEast"] //not less than
                
                for(item in slidingBeyondPieces){
                    loop2:
                    if(item[0] == item[0].toUpperCase()){
                        slidingBeyondPieces[item] = [...new Set(slidingBeyondPieces[item])]
                        if(slidingBeyondPieces[item].includes(parseInt(tileOfKingBlack))){
                            let thisString = item.split("-");
                            let myString = `${thisString[0]}-${thisString[1]}`
                            for(object of currentThreatOnKing){
                                if(object == myString){
                                    break loop2;
                                }
                            }
                            let kingAlliesBetweenThisPiece = [];
                            
                            for(element of slidingBeyondPieces[item]){
                                // if(element == parseInt(tileOfKingBlack)) break;
                                if(direction1.includes(thisString[2])){
                                    if(element < parseInt(tileOfKingBlack)){
                                        let thisTile = document.getElementById(`${element}`);
                                        let child = thisTile.children[0];
                                        if(child != undefined && child.classList.contains('darkPiece')){
                                            kingAlliesBetweenThisPiece.push(`${child.id[0]}-${thisTile.id}`);
                                        }
                                    }
                                }else{
                                    if(element > parseInt(tileOfKingBlack)){
                                        let thisTile = document.getElementById(`${element}`);
                                        let child = thisTile.children[0];
                                        if(child != undefined && child.classList.contains('darkPiece')){
                                            kingAlliesBetweenThisPiece.push(`${child.id[0]}-${thisTile.id}`);
                                        }
                                    }
                                }
                            }
                            if(kingAlliesBetweenThisPiece.length == 1){
                                cannotBlock.push(kingAlliesBetweenThisPiece[0]);
                            }else{
                                console.log("test");
                            }
                        }
                    }
                }
    
                // check if sliding moves directed at king can be blocked
                // let blockedThreat = [];
                for(item in threateningPiece){
                    // loop1:
                    if(item[0] == item[0].toUpperCase()){
                        if(threateningPiece[item].includes(parseInt(tileOfKingBlack))){
                            for(value of threateningPiece[item]){
                                // loop1:
                                for(object in currentTilesOnThreat){
                                    let objectString = object.split("-");
                                    if(object[0] != object[0].toUpperCase()){
                                        if(object[0] == "p"){
                                            if(pawnNonCaptureMoves["p"].includes(value)){
                                                // blockedThreat += 1;
                                                blockedThreat.push(item);
                                                canBlock.push(`${parseInt(value)-8}`);
                                                // blockedThreat = [...new Set(blockedThreat)];
                                                for(element of cannotBlock){
                                                    if(element == object){
                                                        // blockedThreat -= 1;
                                                        // blockedThreat = [...new Set(blockedThreat)];
                                                        let itemIndex = blockedThreat.indexOf(item);
                                                        blockedThreat.splice(itemIndex, 1);
                                                    }
                                                }
                                                // break loop1;
                                            }
                                            
                                        }else{
                                            if(currentTilesOnThreat[object].includes(value) && object[0] != "k"){
                                                // blockedThreat += 1;
                                                blockedThreat.push(item);
                                                canBlock.push(objectString[1]);
                                                // blockedThreat = [...new Set(blockedThreat)];
                                                for(element of cannotBlock){
                                                    if(element == object){
                                                        // blockedThreat -= 1;
                                                        // blockedThreat = [...new Set(blockedThreat)];
                                                        let itemIndex = blockedThreat.indexOf(item);
                                                        blockedThreat.splice(itemIndex, 1);
                                                    }
                                                }
                                                // break loop1;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
    
                let canBeCaptured = [];
                
    
                // check if all threats can be captured by the defender
                // loop1:
                for(item of currentThreatOnKing){
                    console.log(item);
                    let arr = item.split("-");
                    let newArr = arr.filter((item)=>{
                        return !Number.isNaN(parseInt(item));
                    })
                    console.log(newArr);
                    for(object in currentTilesOnThreat){
                        if(object[0] != object[0].toUpperCase()){
                            // if(currentTilesOnThreat[object].includes(parseInt(newArr)) && (object[0] != "k")){
                            if(currentTilesOnThreat[object].includes(parseInt(newArr))){
                                // canBeCaptured += 1;
                                canBeCaptured.push(item);
                                canCapture.push(object);
                                let objectString = object.split("-");
                                canCaptureTile.push(objectString[1]);
                                // canBeCaptured = [...new Set(canBeCaptured)];
                                if(object[0] == "k"){
                                    for(thing in currentTilesOnThreat){
                                        if(thing[0] == thing[0].toUpperCase()){
                                            if(currentTilesOnThreat[thing].includes(parseInt(newArr))){ //check if king will be counter captured if it captured this piece
                                                // canBeCaptured -= 1;
                                                // canBeCaptured = [...new Set(canBeCaptured)];
                                                let itemIndex = canBeCaptured.indexOf(item);
                                                canBeCaptured.splice(itemIndex, 1);
                                                // break loop1;
                                            }
                                        }
                                    }
                                }
                                
                                for(element of cannotBlock){
                                    if(element == object){
                                        // canBeCaptured = [...new Set(canBeCaptured)];
                                        let itemIndex = canBeCaptured.indexOf(item);
                                        canBeCaptured.splice(itemIndex, 1);
                                    }
                                }
                            }
                        }
                    }
                }
    
                // for(element of cannotBlock){
                //     if(element == object){
                //         // canBeCaptured = [...new Set(canBeCaptured)];
                //         let itemIndex = canBeCaptured.indexOf(item);
                //         canBeCaptured.splice(itemIndex, 1);
                //     }
                // }
                kingNextMovements.forEach(allMovesCheck);
                breakme:
                if(kingNextMovements.every(allMovesCheck)){ //check if all movements are threat (true == under threat; false == safe) (considered checkmate if every movement is true)
                    console.log("test")
    
                    unsafeTiles = [...new Set(unsafeTiles)];
                    console.log(unsafeTiles);
    
                    blockedThreat = [...new Set(blockedThreat)];
                    canBeCaptured = [...new Set(canBeCaptured)];
    
                    if(threatsOnKing == blockedThreat.length) break breakme;
                    if(threatsOnKing == canBeCaptured.length) break breakme;
                    let checkInfo = document.querySelector(".checkInfo")
                    checkInfo.innerHTML = `Black king has been checkmated`;
                    checked = true;
                    winnerMsg.style.display = "flex";
                    whiteWin.style.display = "block";
                   
                }else{
                    // kingNextMovements.forEach(allMovesCheck);
                    noDuplicateSafeTiles = [...new Set(safeTiles)];
                    for([index, tile] of noDuplicateSafeTiles.entries()){
                        for(item in slidingBeyondPieces){
                            if(item[0] == item[0].toUpperCase()){
                                if(slidingBeyondPieces[item].includes(parseInt(tileOfKingBlack)) && slidingBeyondPieces[item].includes(tile)){
                                    noDuplicateSafeTiles.splice(index, 1);
                                }
                            }
                        }
                    }
    
                    blockedThreat = [...new Set(blockedThreat)];
                    canBeCaptured = [...new Set(canBeCaptured)];
    
                    if(noDuplicateSafeTiles.length == 0){
                        if(threatsOnKing == blockedThreat.length) break breakme;
                        if(threatsOnKing == canBeCaptured.length) break breakme;
                        let checkInfo = document.querySelector(".checkInfo")
                        checkInfo.innerHTML = `Black king has been checkmated`;
                        checked = true;
                        winnerMsg.style.display = "flex";
                        whiteWin.style.display = "block";
                    }
                    
                }
    
                for(i = 0; i < darkPieces.length; i++){
                    let tile = darkPieces[i].parentElement.id;
                    // darkPieces[i].setAttribute("ondragover", "removeDrop(e)");
                    
                    if(canCaptureTile.includes(tile) || canBlock.includes(tile)){
                        darkPieces[i].setAttribute("draggable", "true");
                        darkPieces[i].setAttribute("ondragstart", "drag(event)");
                        darkPieces[i].setAttribute("ondragover", "dropAllow(event)");
                    }
                }
            }
        }else{
            // let checked = false;
            // darkpiece
            // console.log("darkpiece moved");
            // get tile of darkpiece king


            if(checked == true){
    
                // check if king is at one of the board edges
                let movements = [-8, 8, 1, -1, -7, -9, 9, 7]
                let exemption = [];
                if(boardEdges.includes(parseInt(tileOfKingWhite))){
                    if(boardTopEdge.includes(parseInt(tileOfKingWhite))){
                        exemption.push(...topEdge);
                    }
                    if(boardRightEdge.includes(parseInt(tileOfKingWhite))){
                        exemption.push(...rightEdge);
                    }
                    if(boardBottomEdge.includes(parseInt(tileOfKingWhite))){
                        exemption.push(...bottomEdge);
                    }
                    if(boardLeftEdge.includes(parseInt(tileOfKingWhite))){
                        exemption.push(...leftEdge);
                    }
                }
                
                // get the actual tile numbers of kings next movement relative to its hometile
                let kingNextMovements = movements.map((item)=>{
                    // console.log("movement item: ", item);
                    // console.log("new item: ", parseInt(tileOfKingWhite) + item);
                    let tileNumber = parseInt(tileOfKingWhite) + item;
                    if((tileNumber >= 0) && (tileNumber < 64)){
                        return parseInt(tileOfKingWhite) + item;
                    }else{
                        return
                    }
                });
    
                // check if all king's possible next move will be a potential capture by opponent
                let safeTiles = [];
                function allMovesCheck(nextMove, index){
                    if(!exemption.includes(index) && tiles[nextMove].children[0] == undefined){ //*(b) //if tile has no piece
                        for(item in currentTilesOnThreat){
                            if(item[0] != item[0].toUpperCase()){
                                if(currentTilesOnThreat[item].includes(nextMove)){
                                    unsafeTiles.push(nextMove);
                                    return true;
                                }
                            }
                        }
                        safeTiles.push(nextMove);
                    }else if(!exemption.includes(index) && tiles[nextMove].children[0].classList.contains("darkPiece")){ // if tile has ally piece
                        for(item in currentTilesOnThreat){
                            if(item[0] != item[0].toUpperCase()){
                                if(currentTilesOnThreat[item].includes(nextMove)){
                                    unsafeTiles.push(nextMove);
                                    return true;
                                }
                            }
                        }
                        safeTiles.push(nextMove);
                    }else{
                        return true; // if tile has foe piece it will not be part of the evaluation thus will always return true (not safe)
                    }
                };
            
    
                let threatsOnKing = 0;
                for(item in currentTilesOnThreat){
                    if(item[0] != item[0].toUpperCase()){
                        if(currentTilesOnThreat[item].includes(parseInt(tileOfKingWhite))){
                            threatsOnKing += 1;
                            currentThreatOnKing.push(item);
                        }
                    }
                }
    
                // check if there is a sliding piece that has only one piece between it and the king
                // let cannotBlock = [];
    
                direction1 = ["South", "East", "SouthEast", "SouthWest"] //not more than
                // direction2 = ["North", "West", "NorthWest", "NorthEast"] //not less than
    
                for(item in slidingBeyondPieces){
                    loop2:
                    if(item[0] != item[0].toUpperCase()){
                        if(slidingBeyondPieces[item].includes(parseInt(tileOfKingWhite))){
                            let thisString = item.split("-");
                            let myString = `${thisString[0]}-${thisString[1]}`
                            for(object of currentThreatOnKing){
                                if(object == myString){
                                    break loop2;
                                }
                            }
                            let kingAlliesBetweenThisPiece = [];
    
                            for(element of slidingBeyondPieces[item]){
                                // if(element == parseInt(tileOfKingWhite)) break;
                                if(direction1.includes(thisString[2])){
                                    if(element < parseInt(tileOfKingWhite)){
                                        let thisTile = document.getElementById(`${element}`);
                                        let child = thisTile.children[0];
                                        if(child != undefined && child.classList.contains('lightPiece')){
                                            kingAlliesBetweenThisPiece.push(`${child.id[0]}-${thisTile.id}`);
                                        }
                                    }
                                }else{
                                    if(element > parseInt(tileOfKingBlack)){
                                        let thisTile = document.getElementById(`${element}`);
                                        let child = thisTile.children[0];
                                        if(child != undefined && child.classList.contains('lightPiece')){
                                            kingAlliesBetweenThisPiece.push(`${child.id[0]}-${thisTile.id}`);
                                        }
                                    }
                                }
                            }
                            if(kingAlliesBetweenThisPiece.length == 1){
                                cannotBlock.push(kingAlliesBetweenThisPiece[0]);
                            }
                        }
                    }
                }
    
    
                // check if sliding moves directed at king can be blocked

                let blockedThreat = [];
                function getcannotblock(){
                    for(item in threateningPiece){
                        // loop1:
                        if(item[0] != item[0].toUpperCase()){
                            if(threateningPiece[item].includes(parseInt(tileOfKingBlack))){
                                for(value of threateningPiece[item]){
                                    for(object in currentTilesOnThreat){
                                        if(object[0] == object[0].toUpperCase()){
                                            if(object[0] == "P"){
                                                if(pawnNonCaptureMoves["P"].includes(value)){
                                                    // blockedThreat += 1;
                                                    blockedThreat.push(item);
                                                    // blockedThreat = [...new Set(blockedThreat)];
                                                    for(element of cannotBlock){
                                                        if(element == object){
                                                            // blockedThreat -= 1;
                                                            // blockedThreat = [...new Set(blockedThreat)];
                                                            let itemIndex = blockedThreat.indexOf(item);
                                                            blockedThreat.splice(itemIndex, 1);
                                                        }
                                                    }
                                                    // break loop1;
                                                }
                                                
                                            }else{
                                                if(currentTilesOnThreat[object].includes(value) && object[0] != "K"){
                                                    // blockedThreat += 1;
                                                    blockedThreat.push(item);
                                                    // blockedThreat = [...new Set(blockedThreat)];
                                                    for(element of cannotBlock){
                                                        if(element == object){
                                                            // blockedThreat -= 1;
                                                            // blockedThreat = [...new Set(blockedThreat)];
                                                            let itemIndex = blockedThreat.indexOf(item);
                                                            blockedThreat.splice(itemIndex, 1);
                                                        }
                                                    }
                                                    // break loop1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                getcannotblock();
    
                let canBeCaptured = [];
                
    
                // check if all threats can be captured by the defender
                // loop1:
                for(item of currentThreatOnKing){
                    console.log(item);
                    let arr = item.split("-");
                    let newArr = arr.filter((item)=>{
                        return !Number.isNaN(parseInt(item));
                    })
                    console.log(newArr);
                    for(object in currentTilesOnThreat){
                        if(object[0] == object[0].toUpperCase()){
                            // if(currentTilesOnThreat[object].includes(parseInt(newArr)) && (object[0] != "K")){
                            if(currentTilesOnThreat[object].includes(parseInt(newArr))){
                                // canBeCaptured += 1;
                                canBeCaptured.push(item);
                                canCapture.push(object);
                                // canBeCaptured = [...new Set(canBeCaptured)];
                                if(object[0] == "K"){
                                    for(thing in currentTilesOnThreat){
                                        if(thing[0] != thing[0].toUpperCase()){
                                            if(currentTilesOnThreat[thing].includes(parseInt(newArr))){ //check if king will be counter captured if it captured this piece
                                                // canBeCaptured -= 1;
                                                // canBeCaptured = [...new Set(canBeCaptured)];
                                                let itemIndex = canBeCaptured.indexOf(item);
                                                canBeCaptured.splice(itemIndex, 1);
                                                // break loop1;
                                            }
                                        }
                                    }
                                }
                                for(element of cannotBlock){
                                    if(element == object){
                                        // canBeCaptured = [...new Set(canBeCaptured)];
                                        let itemIndex = canBeCaptured.indexOf(item);
                                        canBeCaptured.splice(itemIndex, 1);
                                    }
                                }
                            }
                        }
                    }
                }
    
                // for(element of cannotBlock){
                //     if(element == object){
                //         // canBeCaptured = [...new Set(canBeCaptured)];
                //         let itemIndex = canBeCaptured.indexOf(item);
                //         canBeCaptured.splice(itemIndex, 1);
                //     }
                // }
    
                if(kingNextMovements.every(allMovesCheck)){ //check if all movements are threat (true == under threat; false == safe) (considered checkmate if every movement is true)
                    console.log("test")
                    // count the number of threats to the king
    
                    blockedThreat = [...new Set(blockedThreat)];
                    canBeCaptured = [...new Set(canBeCaptured)];
    
                    if(threatsOnKing == blockedThreat.length) return;
                    if(threatsOnKing == canBeCaptured.length) return;
                    let checkInfo = document.querySelector(".checkInfo")
                    checkInfo.innerHTML = `White king has been checkmated`;
                    checked = true;
                    winnerMsg.style.display = "flex";
                    blackWin.style.display = "block";
    
                }else{
                    kingNextMovements.forEach(allMovesCheck);
                    noDuplicateSafeTiles = [...new Set(safeTiles)];
                    for([index, tile] of noDuplicateSafeTiles.entries()){
                        for(item in slidingBeyondPieces){
                            if(item[0] != item[0].toUpperCase()){
                                if(slidingBeyondPieces[item].includes(parseInt(tileOfKingBlack)) && slidingBeyondPieces[item].includes(tile)){
                                    noDuplicateSafeTiles.splice(index, 1);
                                }
                            }
                        }
                    }
    
                    blockedThreat = [...new Set(blockedThreat)];
                    canBeCaptured = [...new Set(canBeCaptured)];
    
                    if(noDuplicateSafeTiles.length == 0){
                        if(threatsOnKing == blockedThreat.length) return;
                        if(threatsOnKing == canBeCaptured.length) return;
                        let checkInfo = document.querySelector(".checkInfo")
                        checkInfo.innerHTML = `White king has been checkmated`;
                        checked = true;
                        winnerMsg.style.display = "flex";
                        blackWin.style.display = "block";
                    }
                }
    
                ;
            }
        }
    }

    checkIfCheckmate();


    if(!checked){
            document.querySelector(".checkInfo").innerHTML = "";
            unsafeTiles = [];
            canCapture = [];
            canCaptureTile = [];
            canBlock = [];
            console.log("!checked");
    }
}
