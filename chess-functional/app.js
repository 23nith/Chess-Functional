

// logging for threats

const doLogThrt = true;

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
            r : {name: "black-rook", icon: "fas fa-chess-rook", unicode: "f447", movement: [-8, 8, 1, -1, "", "", "", ""], code: "r", sliding: true},
            n : {name: "black-knight", icon: "fas fa-chess-knight", unicode: "f441", movement: ["", "", -6, -10, -15, -17, 17, 15, 10, 6], code: "n", sliding: false},
            b : {name: "black-bishop", icon: "fas fa-chess-bishop", unicode: "f43a", movement: ["", "", "", "", -7, -9, 9, 7], code: "b", sliding: true},
            q : {name: "black-queen", icon: "fas fa-chess-queen", unicode: "f445", movement: [-8, 8, 1, -1, -7, -9, 9, 7], code: "q", sliding: true},
            k: {name: "black-king", icon: "fas fa-chess-king", unicode: "f43f", movement: [-8, 8, 1, -1, -7, -9, 9, 7], initialMovement: [-8, 8, 1, -1, -7, -9, 9, 7, 2, -2], code: "k", sliding: false},
            p: {name: "black-pawn", icon: "fas fa-chess-pawn", unicode: "f443", movement: [8], code: "p", sliding: false, madeInitialMove: false, initialMovement: [8, 16], cptrMvmnt: [7, 9]},

            R : {name: "white-rook", icon: "fas fa-chess-rook", unicode: "f447", movement: [-8, 8, 1, -1, "", "", "", ""], code: "R", sliding: true},
            N : {name: "white-knight", icon: "fas fa-chess-knight", unicode: "f441", movement: ["", "", -6, -10, -15, -17, 17, 15, 10, 6], code: "N", sliding: false},
            B : {name: "white-bishop", icon: "fas fa-chess-bishop", unicode: "f43a", movement: ["", "", "", "", -7, -9, 9, 7], code: "B", sliding: true},
            K : {name: "white-king", icon: "fas fa-chess-king", unicode: "f43f", movement: [-8, 8, 1, -1, -7, -9, 9, 7], initialMovement: [-8, 8, 1, -1, -7, -9, 9, 7, 2, -2], code: "K", sliding: false},
            Q : {name: "white-queen", icon: "fas fa-chess-queen", unicode: "f445", movement: [-8, 8, 1, -1, -7, -9, 9, 7], code: "Q", sliding: true},
            P : {name: "white-pawn", icon: "fas fa-chess-pawn", unicode: "f443", movement: [-8], code: "P", sliding: false, initialMovement: [-8, -16], cptrMvmnt: [-7, -9]},
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

                // grid[gridCounter].innerHTML = `<i ${capital ? 'draggable="true"' : ""} ${capital ? 'ondragstart="drag(event)"' : ""} class="${piece.generatePiece(fenArr[i]).icon}" id="${piece.generatePiece(fenArr[i]).code}-${i}" ></i>`;
                let theId = (piece.generatePiece(fenArr[i]).code == "k" || piece.generatePiece(fenArr[i]).code == "K")? piece.generatePiece(fenArr[i]).code : `${piece.generatePiece(fenArr[i]).code}-${i}`;
                grid[gridCounter].innerHTML = `<i ${capital ? 'draggable="true"' : ""} ${capital ? 'ondragstart="drag(event)"' : ""} class="${piece.generatePiece(fenArr[i]).icon}" id="${theId}" ></i>`;
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
    let submittedFen = fenArray[fenArray.length-2];
    // fenArray[fenArray.length-1]
    let drawGridFinished = await drawGrid(8,8, submittedFen);
    fenArray.pop(fenArray.length -1);

    whiteCapturedHistory.pop(whiteCapturedHistory.length -1);
    blackCapturedHistory.pop(whiteCapturedHistory.length -1);
    changeTurn();

    let piece = new Piece();
    document.querySelector(".black-captured").innerHTML = "";
    document.querySelector(".white-captured").innerHTML = "";
    whiteCapturedHistory.map((item)=>{
        if(item != ""){
            let container = document.createElement("div");
            container.innerHTML = `<i class="${piece.generatePiece(item).icon}"></i>`
            document.querySelector(".white-captured").innerHTML += `<div class="tile">${container.innerHTML}</div>`;
        }
    });
    blackCapturedHistory.map((item)=>{
        if(item != ""){
            let container = document.createElement("div");
            container.innerHTML = `<i class="${piece.generatePiece(item).icon} lightPiece"></i>`
            document.querySelector(".black-captured").innerHTML += `<div class="tile">${container.innerHTML}</div>`;
        }
    });
    //
    let checkBoardDisplay = await document.querySelectorAll(".container div");



    if(checkBoardDisplay){
        if(turn == "White"){
            lightPieces = document.querySelectorAll(".lightPiece");
            darkPieces = document.querySelectorAll(".darkPiece");
            removeDragFeatureDark(darkPieces)

            addDragFeatureLight(lightPieces)


        }else{
            darkPieces = document.querySelectorAll(".darkPiece");
            lightPieces = document.querySelectorAll(".lightPiece");
            removeDragFeatureLight(lightPieces);

            addDragFeatureDark(darkPieces)


        }
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


let whiteKingCastlingLimit  = 1;
let blackKingCastlingLimit  = 1;
let isCanCastleLeftWhite    = false;
let isCanCastleRightBlack   = false;
let isCanCastleLeftBlack    = false;
let allPsblMvBlck           = {}
let allPsblMvWht            = {}
let whtKngAllPsbleMvmnt     = {}
let blckKngAllPsbleMvmnt    = {}
let whtKngHomTile           = -1;
let blckKngHomTile          = -1;
let whtKngHomTileOnCheck    = -1;
let blckKngHomTileOnCheck   = -1;


let enPassantPiecesWhite = [];
let enPassantPiecesBlack = [];


let currentTilesOnThreat = {

};

let threateningPiece = {

}

let pawnNonCaptureMoves = {

}


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


const brdRghtEdg = {
    7: 7,
    15: 15,
    23: 23,
    31: 31,
    39: 39,
    47: 47,
    55: 55,
    63: 63
};

const brdLftEdg = {
    0: 0,
    8: 8,
    16: 16,
    24: 24,
    32: 32,
    40: 40,
    48: 48,
    56: 56,
};


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

// Utils
function isPawn(pc) {
    return pc.toLowerCase() === `p`;
}

function isOnRghtEdg(homeTile) {
    return brdRghtEdg[homeTile];
}

function isOnLftEdg() {
    return brdLftEdg[homeTile];
}

function isBlckPwn(pc) {
    return pc === `p`;
}

function isWhtPwn(pc) {
    return pc === `P`;
}

function isBlckKng(pc) {
    return pc === `k`;
}

function isWhtKng(pc) {
    return pc === `K`;
}

// Checking
// Fetch moves of all opponents piece on board

// @param   string  - color
// @param   boolean - do remove color for highlight?
// @retur   object  - all pieces on board and it's homeTile
function getEvryEnmyInfOnBrdOf(pClr, rmvdHghlghtThrt) {

    const cllNmbr     = 64;
    const pcsOnBrdInf = [];

    for (let i = 0; i < cllNmbr; i++) {

        const BrdChldArr = Array
            .from(document
                .querySelectorAll(`.container div`));

        const pcEl = BrdChldArr[i].children[0];

        // Skip if no piece found
        if (!pcEl) continue;

        const code     = pcEl.id[0];
        const blckCode = code.toLowerCase();
        const whtCode  = code.toUpperCase();

        // Filter opponent
        if (!rmvdHghlghtThrt) {
            if ((pClr === `BLACK`) && (code === blckCode)) continue;
            if ((pClr === `WHITE`) && (code === whtCode))  continue;
        }

        const cellEl = BrdChldArr[i];

        pcsOnBrdInf
            .push(code, cellEl.getAttribute(`data-tilenumber`));
    }

    return pcsOnBrdInf;
}


// @param function  - current pcs on board
// @param string    - color
// @param boolean   - do remove color for highlight?
function getAllPsblMvmntOf(getPcsOnBrdInf, turn, rmvdHghlghtThrt) {

    function getPwnCptrMvmnt(tile, pc) {
        const PieceObject = new Piece();

        // Storing pawn capture movement close to edge
        if      (isOnLftEdg (tile) && isWhtPwn (pc)) return [-7];
        else if (isOnRghtEdg(tile) && isWhtPwn (pc)) return [-9];
        else if (isOnLftEdg (tile) && isBlckPwn(pc)) return [9];
        else if (isOnRghtEdg(tile) && isBlckPwn(pc)) return [7];

        // default pawn capture movement
        else return PieceObject.generatePiece(pc).cptrMvmnt
    }

    const clr          = turn.toUpperCase();
    const pcsOnBrdInf  = getPcsOnBrdInf(clr, rmvdHghlghtThrt);
    const PieceObject  = new Piece();

    let homeTile = null;
    let isSldng  = null;
    let mvmnt    = null;
    let pc       = null;

    for (let i = 0; i < pcsOnBrdInf.length; i += 2) {
        homeTile = pcsOnBrdInf[i + 1];
        pc       = pcsOnBrdInf[i];
        isSldng  = PieceObject.generatePiece(pc).sliding;

        if (isPawn(pc)) mvmnt = getPwnCptrMvmnt(homeTile, pc);
        else            mvmnt = PieceObject.generatePiece(pc).movement;

        if (isBlckKng(pc)) blckKngHomTile = homeTile;
        if (isWhtKng(pc))  whtKngHomTile  = homeTile;

        highlightTiles(
            homeTile,
            mvmnt,
            isSldng,
            pc,
            undefined,
            true,
            rmvdHghlghtThrt
        );
    }
}

// @param  object - all possible movement of white/black
// @param  object - all possible moment of white/black
// @return object - isCheck and tile on threat
function isChckTlsOnThrt(allPssbleMvmntOf, pssbleKngMvmntOf, clr) {

    const tlsOnThrt = [];
    function chckChck(allPssbleMvmntOf, pssbleKngMvmntOf) {
        for (let kngTile in pssbleKngMvmntOf) {
            if (allPssbleMvmntOf[parseInt(kngTile)]) {
                tlsOnThrt.push(parseInt(kngTile));
            }
        }
    }

    switch (clr.toUpperCase()) {
        case `BLACK`:
            chckChck(allPssbleMvmntOf, pssbleKngMvmntOf);
            return tlsOnThrt;
        case `WHITE`:
            chckChck(allPssbleMvmntOf, pssbleKngMvmntOf);
            return tlsOnThrt;
        default:
            throw new Error(`Invalid color`);
    }
}

// @param object - board current info
// @param object - current check info on board
function logCrrntBrdInf(crrntBrdInf, crrntChckTlsOnThrtInf, isKngChckdInf) {
    const {
        allPsblMvWht,
        allPsblMvBlck,
        blckKngAllPsbleMvmnt,
        whtKngAllPsbleMvmnt,

    } = crrntBrdInf;

    const {
        isBlckChckTlsOnThrtInf,
        isWhtChckTlsOnThrtInf,
    } = crrntChckTlsOnThrtInf;


    const {
        isBlckKngChckd,
        isWhtKngChckd,
    } = isKngChckdInf;

    console.log(`Black all pos moves`,  allPsblMvBlck);
    console.log(`White all pos moves`,  allPsblMvWht);

    console.log(`Black king all tiles`, blckKngAllPsbleMvmnt);
    console.log(`White king all tiles`, whtKngAllPsbleMvmnt);

    console.log(`-----------Black king check info-------------`);
    console.log(`is Black king checked: \t\t ${isBlckKngChckd}`)
    console.log(`Black king possible move on threat \t ${isBlckChckTlsOnThrtInf}`);

    console.log(`-----------White king check info-------------`);
    console.log(`is White king checked: \t\t ${isWhtKngChckd}`)
    console.log(`White king possible move on threat \t ${isWhtChckTlsOnThrtInf}`);


    console.log(`--------------------------------------------`)
    console.log(`\n\n\n\n\n\n`)
}


// ************************************************** Functions called by drag drop events **************************************************

function changeTurn(){
    turn = turn == "White" ? "Black": "White";
    document.querySelector(".turn").innerHTML = `${turn}'s turn`;
}



function highlightTiles(
    _homeTile,
    movement,
    sliding,
    piece,
    forChecking,
    isThreat,
    rmvdHghlghtThrt
) {

    let homeTileTmp = _homeTile;
    let checking = forChecking;
    // check if piece is near edge
    let exemption = []
    let exemptedTiles = [];
    let pieceMovement = movement;
    let pawnCaptureMovement = false;
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

        // Pawn pieces variouss behavior
        if(piece == "P" || piece == "p"){
            let pieceClass = new Piece();



            // check piece color
            if(piece == "P"){
                // initial behavior
                if(pawnStartingPositionWhite.includes(parseInt(_homeTile))){

                    if (!isThreat) {
                        if (!checking) {
                            pieceMovement = pieceClass.generatePiece(piece).initialMovement;
                        }
                    }
                }
                // capture behavior
                let captureTile1 = parseInt(_homeTile) - 7;
                let captureTile2 = parseInt(_homeTile) - 9;
                if(tiles[captureTile1].children[0]){
                    pieceMovement.push(-7)
                    pawnCaptureMovement = true;
                }
                if(tiles[captureTile2].children[0]){
                    pieceMovement.push(-9)
                    pawnCaptureMovement = true;
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
                    let indexOfToRemove = pieceMovement.indexOf(-8);
                    pieceMovement.splice(indexOfToRemove, 1);
                    pieceMovement.push(-7, -9);
                    if(boardRightEdge.includes(parseInt(_homeTile))){
                        let indexOfToRemove = pieceMovement.indexOf(-7);
                        pieceMovement.splice(indexOfToRemove, 1);
                    }
                    if(boardLeftEdge.includes(parseInt(_homeTile))){
                        let indexOfToRemove = pieceMovement.indexOf(-9);
                        pieceMovement.splice(indexOfToRemove, 1);
                    }
                }
            }else{
                // initial behavior
                if(pawnStartingPositionBlack.includes(parseInt(_homeTile))){
                    if (!isThreat) {
                        if (!checking) {
                            pieceMovement = pieceClass.generatePiece(piece).initialMovement;
                        }
                    }
                }
                // capture behavior
                let captureTile1 = parseInt(_homeTile) + 7;
                let captureTile2 = parseInt(_homeTile) + 9;
                if(tiles[captureTile1].children[0]){
                    pieceMovement.push(7)
                    pawnCaptureMovement = true;
                }
                if(tiles[captureTile2].children[0]){
                    pieceMovement.push(9)
                    pawnCaptureMovement = true;
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
                    let indexOfToRemove = pieceMovement.indexOf(8);
                    pieceMovement.splice(indexOfToRemove, 1);
                    pieceMovement.push(7, 9);
                    if(boardRightEdge.includes(parseInt(_homeTile))){
                        let indexOfToRemove = pieceMovement.indexOf(9);
                        pieceMovement.splice(indexOfToRemove, 1);
                    }
                    if(boardLeftEdge.includes(parseInt(_homeTile))){
                        let indexOfToRemove = pieceMovement.indexOf(7);
                        pieceMovement.splice(indexOfToRemove, 1);
                    }
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
                    if(piece == "p"){
                        let capture1 = (pieceMovement.indexOf(9) != -1) ? pieceMovement.indexOf(9): false;
                        let capture2 = (pieceMovement.indexOf(-7) != -1) ? pieceMovement.indexOf(-7): false;
                        let removeCapture = capture1 || capture2;
                        exemption.push(removeCapture);
                    }
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
                            // if ememy piece is in front of pawn
                            if(piece == "P" && pieceMovement[j] == -8){
                                continue;
                            }
                            if (!isThreat) {
                                if (!checking) {
                                    tiles[validMove].children[0].setAttribute("ondragover", "removeDrop(event)");
                                }
                            }
                            // continue;
                        }
                        if(tiles[validMove].children[0].classList.contains("lightPiece")){
                            if(checking){
                                if(tiles[validMove].children[0].id[0] != "K"){
                                    // tiles[validMove].style.backgroundColor = "#f57842"; //*(a)
                                    if(currentTilesOnThreat[piece] == undefined){
                                        currentTilesOnThreat[piece] = [];
                                    }
                                    currentTilesOnThreat[piece].push(validMove);
                                }
                            }
                            continue;
                        }

                    }else{
                        if(tiles[validMove].children[0].classList.contains("lightPiece")){
                            if(piece == "p" && pieceMovement[j] == 8){
                                continue;
                            }
                            if (!isThreat) {
                                if (!checking) {
                                    tiles[validMove].children[0].setAttribute("ondragover", "removeDrop(event)");
                                }
                            }
                        }
                        if(tiles[validMove].children[0].classList.contains("darkPiece")){
                            if(checking){
                                if(tiles[validMove].children[0].id[0] != "k"){
                                    // tiles[validMove].style.backgroundColor = "#f57842"; //*(a)
                                    if(currentTilesOnThreat[piece] == undefined){
                                        currentTilesOnThreat[piece] = [];
                                    }
                                    currentTilesOnThreat[piece].push(validMove);
                                }
                            }
                            continue;
                        }

                    }
                }

                if(!checking){

                    const BlckPc = {
                         k: `k`,
                         q: `q`,
                         b: `b`,
                         n: `n`,
                         r: `r`,
                         p: `p`,
                    }

                     const WhtPc = {
                         K: `K`,
                         Q: `Q`,
                         B: `B`,
                         N: `N`,
                         R: `R`,
                         P: `P`,
                    }


                    tiles[validMove].setAttribute("ondragover", "dropAllow(event)");
                    if (!rmvdHghlghtThrt) {
                        if (WhtPc[piece]) {
                            tiles[validMove].style.backgroundColor = "#ffffffbb";
                        } else if (BlckPc[piece]) {
                            tiles[validMove].style.backgroundColor = "#444444bb";
                        }
                    }

                }
                if(checking){
                    // tiles[validMove].style.backgroundColor = "#f57842"; //**(b)
                    if(currentTilesOnThreat[piece] == undefined){
                        currentTilesOnThreat[piece] = [];
                    }
                    currentTilesOnThreat[piece].push(validMove);

                    let capturemoves = [7, -7, 9, -9]
                    let lightcapturemoves = [-7, -9]

                    if((piece == "p" || piece == "P") && (pieceMovement[j] != 16) && (pieceMovement[j] != -16)){
                        // validMove = parseInt(_homeTile)+pieceMovement[j]
                        if(capturemoves.includes(pieceMovement[j])){
                            if(lightPiece){
                                pieceMovement.push(-8)

                            }else{
                                pieceMovement.push(8)
                            }
                        // }else{
                        //     tiles[validMove].style.backgroundColor = "blue"; //**(b)
                            if(pawnNonCaptureMoves[piece] == undefined){
                                pawnNonCaptureMoves[piece] = [];
                            }
                            pawnNonCaptureMoves[piece].push(validMove);
                        }
                    }
                }
            }
            const BlckPc = {
                k: `k`,
                q: `q`,
                b: `b`,
                n: `n`,
                r: `r`,
                p: `p`,
            }

            const WhtPc = {
                K: `K`,
                Q: `Q`,
                B: `B`,
                N: `N`,
                R: `R`,
                P: `P`,
            }

            function toInt(numStr) {
                return parseInt(numStr);
            }

            if (rmvdHghlghtThrt) {
                if (piece === `k`) {
                    blckKngAllPsbleMvmnt[validMove]             = validMove;
                    blckKngAllPsbleMvmnt[parseInt(homeTileTmp)] = toInt(homeTileTmp);
                }

                if (!(allPsblMvBlck[validMove]) && BlckPc[piece]) {
                    allPsblMvBlck[validMove] = validMove;
                    delete allPsblMvBlck[parseInt((homeTileTmp))];

                }

                if (piece === `K`) {
                    whtKngAllPsbleMvmnt[validMove]             = validMove;
                    whtKngAllPsbleMvmnt[parseInt(homeTileTmp)] = toInt(homeTileTmp);
                }

                if (!(allPsblMvWht[validMove])
                    && WhtPc[piece]
                    && validMove < 64) {

                    allPsblMvWht[validMove] = validMove;
                    delete allPsblMvWht[parseInt((homeTileTmp))];
                }
            }

        }

    }else{

        for (j = 0; j < pieceMovement.length; j++) {
            let direction = pieceMovement[j];
            if (direction == "") {
                continue;
            } else {
                let desc = descending.includes(j);

                loop1:
                for (desc ? tile = 63 : tile = 0; desc ? tile >= 0 : tile < 64; desc ? tile-- : tile++) {
                    let currentTile = tiles[tile];

                    if (isThreat) {
                        if (!exemptedTiles.includes(currentTile.id) && !checking) {
                            currentTile.setAttribute("ondragover", "removeDrop(event)")
                        }
                    }
                    for (n = 0; n < 64; n++) {
                        tileNumber = parseInt(currentTile.id);
                        directionLine = (direction * n) + parseInt(_homeTile);

                        if (tileNumber == 0 && directionLine == 0) {

                        }

                        if (tileNumber == directionLine) {
                            // if(tileNumber == homeTile[0]) continue;
                            if (currentTile.children[0]) {
                                 const BlckPc = {
                                    k: `k`,
                                    q: `q`,
                                    b: `b`,
                                    n: `n`,
                                    r: `r`,
                                    p: `p`,
                                 }

                                 const WhtPc = {
                                    K: `K`,
                                    Q: `Q`,
                                    B: `B`,
                                    N: `N`,
                                    R: `R`,
                                    P: `P`,
                                 }

                                 function toInt(numStr) {
                                    return parseInt(numStr);
                                 }

                                 if (rmvdHghlghtThrt) {
                                     if ((directionLine === parseInt(blckKngHomTile)) && (WhtPc[piece] === piece)) {
                                         blckKngHomTileOnCheck = directionLine;
                                     }

                                     if ((directionLine === parseInt(whtKngHomTile)) && (BlckPc[piece] === piece)) {
                                         whtKngHomTileOnCheck = directionLine;
                                     }
                                }

                                if (lightPiece) {
                                    if (currentTile.children[0].classList.contains("darkPiece")) {
                                        if (!checking && tileNumber != homeTile[0]) {
                                            if (!isThreat) {
                                                currentTile.children[0].setAttribute("ondragover", "removeDrop(event)");
                                                currentTile.setAttribute("ondragover", "dropAllow(event)");
                                            }
                                            currentTile.style.backgroundColor = "#F91F15";
                                        }
                                        if (checking && tileNumber != homeTile[0]) {
                                            // currentTile.style.backgroundColor = "#48f542";
                                            let mystring = `${piece}-${threatDirection[j]}`
                                            if (currentTilesOnThreat[piece] == undefined) {
                                                currentTilesOnThreat[piece] = [];
                                            }
                                            if (threateningPiece[mystring] == undefined) {
                                                threateningPiece[mystring] = [];
                                            }
                                            currentTilesOnThreat[piece].push(tile);
                                            threateningPiece[mystring].push(tile);
                                        }
                                        exemptedTiles.push(currentTile.id);
                                        break loop1;
                                    }
                                    if (currentTile.children[0].classList.contains("lightPiece")) {
                                        if (checking && tileNumber != homeTile[0]) {
                                            if (currentTile.children[0].id[0] != "K") {
                                                // currentTile.style.backgroundColor = "#48f542"; //*(a)
                                                if (currentTilesOnThreat[piece] == undefined) {
                                                    currentTilesOnThreat[piece] = [];
                                                }
                                                // if(threateningPiece[mystring] == undefined){
                                                //     threateningPiece[mystring] = [];
                                                // }
                                                currentTilesOnThreat[piece].push(tile);
                                                // threateningPiece[mystring].push(tile);
                                            }
                                        }

                                        if (tileNumber != parseInt(_homeTile)) {
                                            break loop1;
                                        }
                                        // continue;
                                    }

                                } else { //friendly piece
                                    if (currentTile.children[0].classList.contains("lightPiece")) {

                                        if (!checking && tileNumber != homeTile[0]) {
                                            if (!isThreat) {
                                                currentTile.children[0].setAttribute("ondragover", "removeDrop(event)");
                                            }
                                            currentTile.setAttribute("ondragover", "dropAllow(event)");
                                            currentTile.style.backgroundColor = "blue";
                                        }
                                        if (checking && tileNumber != homeTile[0]) {
                                            // currentTile.style.backgroundColor = "#48f542";
                                            let mystring = `${piece}-${threatDirection[j]}`
                                            if (currentTilesOnThreat[piece] == undefined) {
                                                currentTilesOnThreat[piece] = [];
                                            }
                                            currentTilesOnThreat[piece].push(tile);
                                        }

                                        exemptedTiles.push(currentTile.id);
                                        break loop1;
                                        // continue;
                                    }
                                    if (currentTile.children[0].classList.contains("darkPiece")) {
                                        if (checking && tileNumber != homeTile[0]) {
                                            if (currentTile.children[0].id[0] != "k") {
                                                // currentTile.style.backgroundColor = "#48f542"; //*(a)
                                                let mystring = `${piece}-${threatDirection[j]}`
                                                if (currentTilesOnThreat[piece] == undefined) {
                                                    currentTilesOnThreat[piece] = [];
                                                }
                                                currentTilesOnThreat[piece].push(tile);
                                            }
                                        }
                                        if (tileNumber != parseInt(_homeTile)) {
                                            break loop1;
                                        }
                                        // continue;
                                    }

                                }
                            }


                            if (!checking && tileNumber != homeTile[0]) {
                                if (!isThreat) {
                                    currentTile.setAttribute("ondragover", "dropAllow(event)");
                                }
                                if (!(tileNumber === parseInt(homeTileTmp))) {

                                    const BlckPc = {
                                        k: `k`,
                                        q: `q`,
                                        b: `b`,
                                        n: `n`,
                                        r: `r`,
                                        p: `p`,
                                    }

                                    const WhtPc = {
                                        K: `K`,
                                        Q: `Q`,
                                        B: `B`,
                                        N: `N`,
                                        R: `R`,
                                        P: `P`,
                                    }
                                    // ditoColor
                                    if (!rmvdHghlghtThrt) {
                                        if (WhtPc[piece]) {
                                            currentTile.style.backgroundColor = "#ffffffbb";
                                        } else if (BlckPc[piece]) {
                                            currentTile.style.backgroundColor = "#444444bb";
                                        }
                                    }
                                }
                            }
                            const BlckPc = {
                               k: `k`,
                               q: `q`,
                               b: `b`,
                               n: `n`,
                               r: `r`,
                               p: `p`,
                            }

                            const WhtPc = {
                               K: `K`,
                               Q: `Q`,
                               B: `B`,
                               N: `N`,
                               R: `R`,
                               P: `P`,
                            }

                            function toInt(numStr) {
                               return parseInt(numStr);
                            }

                            if (rmvdHghlghtThrt) {
                               if (piece === `k`) {
                                   blckKngAllPsbleMvmnt[directionLine]         = directionLine;
                                   blckKngAllPsbleMvmnt[parseInt(homeTileTmp)] = toInt(homeTileTmp);
                                }

                                if (!(allPsblMvBlck[directionLine]) && BlckPc[piece]) {
                                    allPsblMvBlck[directionLine] = directionLine;
                                    delete allPsblMvBlck[parseInt((homeTileTmp))];
                                }

                                if (piece === `K`) {
                                    whtKngAllPsbleMvmnt[directionLine]         = directionLine;
                                    whtKngAllPsbleMvmnt[parseInt(homeTileTmp)] = toInt(homeTileTmp);
                                }


                                if (!(allPsblMvWht[directionLine])
                                    && WhtPc[piece]) {
                                    allPsblMvWht[directionLine] = directionLine;
                                    delete allPsblMvWht[parseInt((homeTileTmp))];
                                }
                            }


                            if (checking && tileNumber != homeTile[0]) {
                                // currentTile.style.backgroundColor = "#48f542"; //*(b)
                                let mystring = `${piece}-${threatDirection[j]}`
                                if (currentTilesOnThreat[piece] == undefined) {
                                    currentTilesOnThreat[piece] = [];
                                }
                                if (threateningPiece[mystring] == undefined) {
                                    threateningPiece[mystring] = [];
                                }
                                currentTilesOnThreat[piece].push(tile);
                                threateningPiece[mystring].push(tile);
                            }
                            exemptedTiles.push(currentTile.id);

                            if (topEdge.includes(j)) {
                                if (boardTopEdge.includes(tileNumber)) {
                                    break loop1;
                                }
                            }

                            if (rightEdge.includes(j)) {
                                if (boardRightEdge.includes(tileNumber)) {
                                    break loop1;
                                }
                            }

                            if (bottomEdge.includes(j)) {
                                if (boardBottomEdge.includes(tileNumber)) {
                                    break loop1;
                                }
                            }

                            if (leftEdge.includes(j)) {
                                if (boardLeftEdge.includes(tileNumber)) {
                                    break loop1;
                                }
                            }
                            if (!(allPsblMvBlck[j]) && (turn === `White`)) {
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

    // Can King castles ?
    if (piece === "K" || piece === "k") {
        if (piece === "K") {
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


    tiles = document.querySelectorAll(".container div");
    lightTiles = document.querySelectorAll(".lightTiles");
    darkTiles = document.querySelectorAll(".darkTiles");

    lifted = e.target.parentElement.getAttribute("data-tilenumber");
    if(lifted){
        homeTile.push(lifted);
        let pieceClass = new Piece();
        let movement = pieceClass.generatePiece(piece).movement;
        let sliding = pieceClass.generatePiece(piece).sliding;
        highlightTiles(homeTile[0], movement, sliding, piece);
    }
}

function drag(e) {
    e.dataTransfer.setData("text", e.target.id);

    if(homeTile[0] != undefined){
        returnDrop();
        returnTileColors();
        homeTile[0] = e.target.parentElement.id;
    }


    piece = e.target.id[0]
    if(e.target.classList.contains("lightPiece")){
        pieceColor = "White";
    }else{
        pieceColor = "Black";
    }

}

let dropValue = undefined;


async function drop(e) {
    e.preventDefault();
    let data = e.dataTransfer.getData("text");
    e.target.appendChild(document.getElementById(data));
    landed = e.target;

    if (piece === "P" || piece === "p") {
        // Whites' pawn
        if (piece === "P") {

            const pawnPiece = new Piece();
            let targetPawn = e.target.children[0];

            // White promotion check
            if (whitePromotionField.includes(parseInt(e.target.id))) {

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
            //
            const pawnPiece = new Piece();
            let targetPawn = e.target.children[0];

            // Black promotion check
            if (blackPromotionField.includes(parseInt(e.target.id))) {

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
                        targetPawn.className = `${promotionPieceIcon} blackPiece`
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


    // Capture pieces

    if(e.target.children[1]){
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
    }
    else{
        whiteCapturedHistory.push("");
        blackCapturedHistory.push("");
    }

    if(homeTile){
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


    // Detect pawn pieces vulnerable to En Passant
    landed = e.target.id;

    let container1 = document.createElement("div");

    if(piece == "P"){
        // record pawn pieces vulnerable to En Passant
        if(pawnEnPassantWhite.includes(parseInt(landed))){
            enPassantPiecesWhite.push(parseInt(homeTile[0])-8);
        }
        // capture by en passant
        if(enPassantPiecesBlack.includes(parseInt(landed))){
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
        }
    }

    if(piece == "p"){
        // record pawn pieces vulnerable to En Passant
        if(pawnEnPassantBlack.includes(parseInt(landed))){
            enPassantPiecesBlack.push(parseInt(homeTile[0])+8);
        }
        // capture by en passant
        if(enPassantPiecesWhite.includes(parseInt(landed))){
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
        }
    }


    homeTile = [];
    fenArray.push(getFEN());
    displayFEN()
    dropValue = e.target;

    // Checking feature

    // Clear all possbile moves info
    allPsblMvBlck        = {};
    allPsblMvWht         = {};
    blckKngAllPsbleMvmnt = {};
    whtKngAllPsbleMvmnt  = {};

    // Clear kings hometile
    whtKngHomTile           = -1;
    blckKngHomTile          = -1;
    whtKngHomTileOnCheck    = -1;
    blckKngHomTileOnCheck   = -1;

    const clr         = turn;
    const crrntBrdInf = {
        allPsblMvWht,
        allPsblMvBlck,
        blckKngAllPsbleMvmnt,
        whtKngAllPsbleMvmnt,
    };

    // Black info
    if (clr === `Black`) {

        // Get all possible movement of pieces on board
        // Excluding capture tile except when checking a king
        getAllPsblMvmntOf(getEvryEnmyInfOnBrdOf, clr, true);

        // Check tiles on threat
        const crrntChckTlsOnThrtInf = {
            isBlckChckTlsOnThrtInf: isChckTlsOnThrt(
                allPsblMvWht,
                blckKngAllPsbleMvmnt,
                clr
            ),
            isWhtChckTlsOnThrtInf:  isChckTlsOnThrt(
                allPsblMvBlck,
                whtKngAllPsbleMvmnt,
                clr
            ),
        }

        // Check if king is checked
        const isKngChckdInf = {
            isWhtKngChckd:  isKngChckd(
                whtKngHomTile,
                whtKngHomTileOnCheck
            ),
            isBlckKngChckd: isKngChckd(
                blckKngHomTile,
                blckKngHomTileOnCheck
            ),
        };

        // Check if checked can be block

        // Check if checker can be capture

        // Check if checker has support

        if (doLogThrt) {
            // Highlight all possible moves on Black
            getAllPsblMvmntOf(getEvryEnmyInfOnBrdOf, clr, false);

            // Show board current info and on checking attempt
            logCrrntBrdInf(
                crrntBrdInf,
                crrntChckTlsOnThrtInf,
                isKngChckdInf,
            );
        }
    }

    // White turn
    else {
        // Get all possible movement of pieces on board
        // Excluding capture tile except when checking a king
        getAllPsblMvmntOf(getEvryEnmyInfOnBrdOf, clr, true);

        // Check tiles on threat
        const crrntChckTlsOnThrtInf = {
            isBlckChckTlsOnThrtInf: isChckTlsOnThrt(
                allPsblMvWht,
                blckKngAllPsbleMvmnt,
                clr
            ),
            isWhtChckTlsOnThrtInf:  isChckTlsOnThrt(
                allPsblMvBlck,
                whtKngAllPsbleMvmnt,
                clr
            ),
        }

        // Check if king is checked
        const isKngChckdInf = {
            isWhtKngChckd:  isKngChckd(
                whtKngHomTile,
                whtKngHomTileOnCheck
            ),
            isBlckKngChckd: isKngChckd(
                blckKngHomTile,
                blckKngHomTileOnCheck
            ),
        };

        // Check if checked can be block

        // Check if checker can be capture

        // Check if checker has support

        if (doLogThrt) {

            // Highlight all possible moves on White
            getAllPsblMvmntOf(getEvryEnmyInfOnBrdOf, clr, false);

            // Show board current info and on checking attempt
            logCrrntBrdInf(
                crrntBrdInf,
                crrntChckTlsOnThrtInf,
                isKngChckdInf,
            );
        }
    }
}

function isKngChckd(crrntKngHomTl, kngHomTlOnChck) {
    return parseInt(crrntKngHomTl) === kngHomTlOnChck;
}
