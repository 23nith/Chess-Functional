class Piece {
    constructor(piece){
        this.piece = piece
    }
    // [north, south, east, west, north-east, north-west, south-east, south-west]

    generatePiece(_fenLetter){
        let pieces = {
            r : {name: "black-rook", icon: "fas fa-chess-rook", unicode: "f447", movement: [-8, 8, 1, -1, "", "", "", ""], code: "r", sliding: true},
            n : {name: "black-knight", icon: "fas fa-chess-knight", unicode: "f441", movement: ["", "", -6, -10, -15, -17, 17, 15, 10, 6], code: "n", sliding: false},
            b : {name: "black-bishop", icon: "fas fa-chess-bishop", unicode: "f43a", movement: ["", "", "", "", -7, -9, 9, 7], code: "b", sliding: true},
            q : {name: "black-queen", icon: "fas fa-chess-queen", unicode: "f445", movement: [-8, 8, 1, -1, -7, -9, 9, 7], code: "q", sliding: true},
            k : {name: "black-king", icon: "fas fa-chess-king", unicode: "f43f", movement: [-8, 8, 1, -1, -7, -9, 9, 7], initialMovement: [-8, 8, 1, -1, -7, -9, 9, 7, 2, -2], code: "k", sliding: false},
            p : {name: "black-pawn", icon: "fas fa-chess-pawn", unicode: "f443", movement: [8], code: "p", sliding: false, madeInitialMove: false, initialMovement: [8, 16]},

            R : {name: "white-rook", icon: "fas fa-chess-rook", unicode: "f447", movement: [-8, 8, 1, -1, "", "", "", ""], code: "R", sliding: true},
            N : {name: "white-knight", icon: "fas fa-chess-knight", unicode: "f441", movement: ["", "", -6, -10, -15, -17, 17, 15, 10, 6], code: "N", sliding: false},
            B : {name: "white-bishop", icon: "fas fa-chess-bishop", unicode: "f43a", movement: ["", "", "", "", -7, -9, 9, 7], code: "B", sliding: true},
            Q : {name: "white-queen", icon: "fas fa-chess-queen", unicode: "f445", movement: [-8, 8, 1, -1, -7, -9, 9, 7], code: "Q", sliding: true},
            K : {name: "white-king", icon: "fas fa-chess-king", unicode: "f43f", movement: [-8, 8, 1, -1, -7, -9, 9, 7], initialMovement: [-8, 8, 1, -1, -7, -9, 9, 7, 2, -2], code: "K", sliding: false},
            P : {name: "white-pawn", icon: "fas fa-chess-pawn", unicode: "f443", movement: [-8], code: "P", sliding: false, initialMovement: [-8, -16]},
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
                gridBox.classList.add("tile");
                gridBox.setAttribute("ondrop", "drop(event)");
                gridBox.setAttribute("ondragover", "dropAllow(event)");
                gridBox.setAttribute("data-tilenumber", `${counter}`);
                gridBox.id = counter;
                gridBox.style.backgroundColor = isLightSquare ? "#A0785A" : "brown" ;
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

                grid[gridCounter].innerHTML = `<i ${capital ? 'draggable="true"' : ""} ${capital ? 'ondragstart="drag(event)"' : ""} class="${piece.generatePiece(fenArr[i]).icon}" id="${piece.generatePiece(fenArr[i]).code}-${i}"></i>`;
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

async function undo(){
    if((fenArray.length-1)<=0) return;
    document.querySelector(".container").innerHTML = "";
    let submittedFen = fenArray[fenArray.length-2];
    // fenArray[fenArray.length-1]
    drawGrid(8,8, submittedFen);
    fenArray.pop(fenArray.length -1);
    console.log(fenArray);
    changeTurn();
    // let checkBoardDisplay = await document.querySelector(".container").children[63];

    // console.log("test");

    // if(await checkBoardDisplay){
    //     if(turn == "White"){
    //         lightPieces = document.querySelectorAll(".lightPiece");
    //         removeDragFeatureLight(lightPieces);

    //         darkPieces = document.querySelectorAll(".darkPiece");
    //         addDragFeatureDark(darkPieces)


    //     }else{
    //         darkPieces = document.querySelectorAll(".darkPiece");
    //         removeDragFeatureDark(darkPieces)

    //         lightPieces = document.querySelectorAll(".lightPiece");
    //         addDragFeatureLight(lightPieces)

    //     }
    // }
}

function getFEN(){
    console.log("triggered");
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
    console.log("fenArray: ", fenArray);
    return fenFormattedArr;
}

function displayFEN(){
    document.querySelector("p").innerHTML = `Current FEN: <br>${fenArray[fenArray.length-1]}`;
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
let turn = "White";
const boardTopEdge = [0, 1, 2, 3, 4 , 5, 6, 7];
const boardRightEdge = [7, 15, 23, 31, 39, 47, 55, 63];
const boardBottomEdge = [56, 57, 58, 59, 60, 61, 62, 63];
const boardLeftEdge = [0, 8, 16, 24, 32, 40, 48, 56];
const surroundingTiles = [8, -8, 7, -7, 9, -9, 1, -1];
const boardEdges = [0, 1, 2, 3, 4 , 5, 6, 7, 15, 23, 31, 39, 47, 55, 63, 56, 57, 58, 59, 60, 61, 62, 8, 16, 24, 32, 40, 48];
const pawnStartingPositionWhite = [48, 49, 50, 51, 52, 53, 54, 55];
const pawnStartingPositionBlack = [8, 9, 10, 11, 12, 13, 14, 15];
const kingStartingPositionWhite = 60;
const kingStartingPositionBlack = 4;

// ************************************************** Functions called by drag drop events **************************************************

function changeTurn(){
    turn = turn == "White" ? "Black": "White";
    document.querySelector(".turn").innerHTML = `${turn}'s turn`;
}

function highlightTiles(_homeTile, movement, sliding, piece){



    // check if piece is near edge
    let exemption = []
    let exemptedTiles = [];
    let pieceMovement = movement;
    let pawnCaptureMovement = false;
    // check color piece
    let lightPiece = piece == piece.toUpperCase();

    let topEdge = [0, 4, 5];
    let rightEdge = [2, 4, 6, 8];
    let bottomEdge = [1, 6, 7];
    let leftEdge = [3, 5, 7, 9];
    let descending = [0,3,5,4];

    // highlight legal moves
    if(!sliding){
        // Knight, King, Pawn

        for(i = 0; i < 64; i++){
            tiles[i].setAttribute("ondragover", "removeDrop(event)");
        }

        // Pawn pieces variouss behavior
        if(piece == "P" || piece == "p"){
            let pieceClass = new Piece();

            // check piece color
            if(piece == "P"){
                // initial behavior
                if(pawnStartingPositionWhite.includes(parseInt(_homeTile))){
                    pieceMovement = pieceClass.generatePiece(piece).initialMovement;
                }
                // capture behavior
                let captureTile1 = parseInt(_homeTile) - 7;
                let captureTile2 = parseInt(_homeTile) - 9;
                if(tiles[captureTile1].children[0]){
                    pieceMovement.push(-7)
                    pawnCaptureMovement = true;
                }else if(tiles[captureTile2].children[0]){
                    pieceMovement.push(-9)
                    pawnCaptureMovement = true;
                }

            }else{
                // initial behavior
                if(pawnStartingPositionBlack.includes(parseInt(_homeTile))){
                    pieceMovement = pieceClass.generatePiece(piece).initialMovement;
                }
                // capture behavior
                let captureTile1 = parseInt(_homeTile) + 7;
                let captureTile2 = parseInt(_homeTile) + 9;
                if(tiles[captureTile1].children[0]){
                    pieceMovement.push(7)
                    pawnCaptureMovement = true;
                }else if(tiles[captureTile2].children[0]){
                    pieceMovement.push(9)
                    pawnCaptureMovement = true;
                }

            }
        }

        // King Castling

        // king test for castle test
        // 4k3/8/8/8/8/8/8/4K3

        // king and rook for castle test
        // r3k2r/8/8/8/8/8/8/R3K2R

        if (piece === "K" || piece === "k") {
            const pieceClass = new Piece();

            if (piece === "K") {

                console.log("White king")

                // Use initialMovement
                if(kingStartingPositionWhite === parseInt(_homeTile)){

                    console.log(true, `in starting position White`);
                    console.log("Setting piece movement into initialMovement");
                    pieceMovement = pieceClass.generatePiece(piece).initialMovement;

                }

                // catle behavior

                console.log("White rook right", tiles[parseInt(_homeTile) + 3].children[0].id);
                console.log("White rook left", tiles[parseInt(_homeTile) - 4].children[0].id);


            }
            else {
                console.log("Black king")
                // Use initialMovement
                if(kingStartingPositionBlack === parseInt(_homeTile)){

                    console.log(true, `in starting position black`);
                    console.log("Setting piece movement into initialMovement");
                    pieceMovement = pieceClass.generatePiece(piece).initialMovement;
                    console.log(pieceMovement);


                }
                // catle behavior

                // console.log("White rook right", tiles[parseInt(_homeTile) + 3].children[0].id);
                // console.log("White rook left", tiles[parseInt(_homeTile) + 3].children[0].id);
            }
        }

        //if k/K/n/N piece is on edge of board
        if(boardEdges.includes(parseInt(_homeTile))){
            if(boardTopEdge.includes(parseInt(_homeTile))){
                exemption.push(...topEdge);
            }
            if(boardRightEdge.includes(parseInt(_homeTile))){
                exemption.push(...rightEdge);
            }
            if(boardBottomEdge.includes(parseInt(_homeTile))){
                exemption.push(...bottomEdge);
            }
            if(boardLeftEdge.includes(parseInt(_homeTile))){
                exemption.push(...leftEdge);
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
                    console.log("child");

                    if(lightPiece){
                        if(tiles[validMove].children[0].classList.contains("darkPiece")){
                            console.log("enemy piece");
                            // if ememy piece is in front of pawn
                            if(piece == "P" && pieceMovement[j] == -8){
                                continue;
                            }

                            tiles[validMove].children[0].setAttribute("ondragover", "removeDrop(event)");
                            // continue;
                        }
                        if(tiles[validMove].children[0].classList.contains("lightPiece")){
                            console.log("friendly piece");
                            continue;
                        }

                    }else{
                        if(tiles[validMove].children[0].classList.contains("lightPiece")){
                            console.log("enemy piece");
                            if(piece == "p" && pieceMovement[j] == 8){
                                continue;
                            }
                            tiles[validMove].children[0].setAttribute("ondragover", "removeDrop(event)");
                        }
                        if(tiles[validMove].children[0].classList.contains("darkPiece")){
                            console.log("friendly piece");
                            continue;
                        }

                    }
                }
                tiles[validMove].setAttribute("ondragover", "dropAllow(event)");
                tiles[validMove].style.backgroundColor = "#F91F15";
            }
        }



    }else{

        for(j = 0; j < pieceMovement.length; j++){
            let direction = pieceMovement[j];
            if(direction == ""){
                continue;
            }else{
                let desc = descending.includes(j);

                loop1:
                for(desc? tile = 63: tile = 0;  desc? tile >= 0: tile < 64;  desc? tile-- : tile++){
                    let currentTile = tiles[tile];

                    if(!exemptedTiles.includes(currentTile.id)){
                        currentTile.setAttribute("ondragover", "removeDrop(event)")
                    }
                    for(n = 0; n < 64; n++){
                        tileNumber = parseInt(currentTile.id);
                        directionLine = (direction * n) + parseInt(_homeTile);

                        if(tileNumber == 0 && directionLine == 0){
                            console.log("zero");
                        }

                        if(tileNumber == directionLine){

                            if(currentTile.children[0]){
                                console.log("has piece");

                                if(lightPiece){
                                    if(currentTile.children[0].classList.contains("darkPiece")){
                                        console.log("enemy piece");
                                        currentTile.children[0].setAttribute("ondragover", "removeDrop(event)");
                                        // continue;
                                        currentTile.setAttribute("ondragover", "dropAllow(event)");
                                        exemptedTiles.push(currentTile.id);
                                        currentTile.style.backgroundColor = "#F91F15";
                                        break loop1;
                                    }
                                    if(currentTile.children[0].classList.contains("lightPiece")){
                                        console.log("friendly piece");
                                        if(tileNumber != parseInt(_homeTile)){
                                            break loop1;
                                        }
                                        // continue;
                                    }

                                }else{
                                    if(currentTile.children[0].classList.contains("lightPiece")){
                                        currentTile.children[0].setAttribute("ondragover", "removeDrop(event)");
                                        console.log("enemy piece");
                                        currentTile.setAttribute("ondragover", "dropAllow(event)");
                                        exemptedTiles.push(currentTile.id);
                                        currentTile.style.backgroundColor = "#F91F15";
                                        break loop1;
                                        // continue;
                                    }
                                    if(currentTile.children[0].classList.contains("darkPiece")){
                                        console.log("friendly piece");
                                        if(tileNumber != parseInt(_homeTile)){
                                            break loop1;
                                        }
                                        // continue;
                                    }

                                }
                            }

                            currentTile.setAttribute("ondragover", "dropAllow(event)");
                            exemptedTiles.push(currentTile.id);
                            currentTile.style.backgroundColor = "#F91F15";

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
    }
}

function returnTileColors(){
    for(i = 0; i < 32; i++){
        lightTiles[i].style.backgroundColor = "#A0785A";
        darkTiles[i].style.backgroundColor = "brown";
    }
}

function removeDragFeatureLight(someNodeList){
    let length = someNodeList.length;
    for(i = 0; i < length; i++){
        lightPieces[i].removeAttribute("ondragstart");
        lightPieces[i].removeAttribute("draggable");
    }
}

function removeDragFeatureDark(someNodeList){
    let length = someNodeList.length;
    for(i = 0; i < length; i++){
        darkPieces[i].removeAttribute("ondragstart");
        darkPieces[i].removeAttribute("draggable");
    }
}

function addDragFeatureDark(someNodeList){
    let length = someNodeList.length;
    for(i = 0; i < length; i++){
        darkPieces[i].setAttribute("draggable", "true");
        darkPieces[i].setAttribute("ondragstart", "drag(event)");
    }
}

function addDragFeatureLight(someNodeList){
    let length = someNodeList.length;
    for(i = 0; i < length; i++){
        lightPieces[i].setAttribute("draggable", "true");
        lightPieces[i].setAttribute("ondragstart", "drag(event)");
    }
}

//************************************************************************************** Drag and drop events **************************************************************************************

async function dropAllow(e) {
    e.preventDefault();
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
        console.log("homeTile: ", homeTile[0])
        let pieceClass = new Piece();
        let movement = pieceClass.generatePiece(piece).movement;
        let sliding = pieceClass.generatePiece(piece).sliding;
        highlightTiles(homeTile[0], movement, sliding, piece);

    }

}

function drag(e) {
    e.dataTransfer.setData("text", e.target.id);

    piece = e.target.id[0]
    if(e.target.classList.contains("lightPiece")){
        pieceColor = "White";
    }else{
        pieceColor = "Black";
    }

    // console.log("drag", e.target); //information on the piece moved
}

async function drop(e) {
    e.preventDefault();
    let data = e.dataTransfer.getData("text");
    e.target.appendChild(document.getElementById(data));


    if(e.target.children[1]){
        console.log("capture");
        let container = document.createElement("div");
        if(e.target.children[0].classList.contains("lightPiece")){
            container.appendChild(e.target.children[0]);
            document.querySelector(".black-captured").innerHTML += `<div class="tile">${container.innerHTML}</div>`;
        }else{
            container.appendChild(e.target.children[0]);
            document.querySelector(".white-captured").innerHTML += `<div class="tile">${container.innerHTML}</div>`;
        }
        // e.target.children[0].remove();
    }


    if(homeTile){
        console.log(`${pieceColor} ${piece} moved`);

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

    landed = e.target;

    homeTile = [];
    // console.log("tiles: ", tiles);
    // console.log("piece: ", piece);
    // console.log("landed: ", landed);
    // console.log("homeTile: ", homeTile);
    // console.log("pieceColor: ", pieceColor);
    // getFEN();
    fenArray.push(getFEN());
    displayFEN()
    // console.log("drop", e.target); //Information on the tile where the piece landed
}
