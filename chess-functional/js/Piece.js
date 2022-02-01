class Piece {
    constructor(name, icon, unicode, movement, code, sliding, lightpiece){
        this.name = name;
        this.icon = icon;
        this.unicode = unicode;
        this.movement = movement;
        this.code = code;
        this.sliding = sliding;
        this.lightpiece = lightpiece;
    }
    name(){
        return this.name;
    }
    icon(){
        return this.icon;
    }
    unicode(){
        return this.unicode;
    }
    movement(){
        return this.movement;
    }
    code(){
        return this.code;
    }
    sliding(){
        return this.sliding;
    }
    element(i){
        return `<i ${this.lightpiece ? 'draggable="true"' : ""} ${this.lightpiece ? 'ondragstart="drag(event)"' : ""} class="${this.icon}" id="${this.code}-${i}"></i>`;
    }
}

class Pawn extends Piece {
    constructor(name, icon, unicode, movement, code, sliding, lightpiece, initialMovement){
        super(name, icon, unicode, movement, code, sliding, lightpiece);
        this.initialMovement = initialMovement;
    }
}

export const BlackPawn = new Pawn("black-pawn", "fas fa-chess-pawn", "f443", [8], "p", false, false, [8, 16])
export const BlackRook = new Piece("black-rook", "fas fa-chess-rook", "f447", [-8, 8, 1, -1, "", "", "", ""], "r", true, false)
export const BlackKnight = new Piece("black-knight", "fas fa-chess-knight", "f441", ["", "", -6, -10, -15, -17, 17, 15, 10, 6], "n", false, false)
export const BlackQueen = new Piece("black-queen", "fas fa-chess-queen", "f445", [-8, 8, 1, -1, -7, -9, 9, 7], "q", true, false)
export const BlackKing = new Pawn("black-king", "fas fa-chess-king", "f43f", [-8, 8, 1, -1, -7, -9, 9, 7], "k", false, false, [-8, 8, 1, -1, -7, -9, 9, 7, 2, -2])
export const BlackBishop = new Piece("black-bishop", "fas fa-chess-bishop", "f43a", ["", "", "", "", -7, -9, 9, 7], "b", true, false)

export const WhitePawn = new Pawn("white-pawn", "fas fa-chess-pawn", "f443", [-8], "P", false, true, [-8, -16])
export const WhiteRook = new Piece("white-rook","fas fa-chess-rook", "f447", [-8, 8, 1, -1, "", "", "", ""],"R", true, true)
export const WhiteKnight = new Piece("white-knight","fas fa-chess-knight", "f441", ["", "", -6, -10, -15, -17, 17, 15, 10, 6],"N", false, true)
export const WhiteQueen = new Piece("white-queen","fas fa-chess-queen", "f445", [-8, 8, 1, -1, -7, -9, 9, 7],"Q", true, true)
export const WhiteKing = new Pawn("white-king","fas fa-chess-king","f43f", [-8, 8, 1, -1, -7, -9, 9, 7], "K", false, true, [-8, 8, 1, -1, -7, -9, 9, 7, 2, -2])
export const WhiteBishop = new Piece("white-bishop","fas fa-chess-bishop","f43a", ["", "", "", "", -7, -9, 9, 7], "B", true, true)


