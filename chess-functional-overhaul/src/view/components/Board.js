
import CustomElement            from '../../../libs/js/CustomElement';
import Element                  from '../../../libs/js/element';
import Pawn                     from './Pawn';

import { ShadowStyleChesBoard } from '../../res/js/styleShadow';

export default class ChessBoard extends CustomElement {

    static get observedAttributes() {
        return [`fen`];
    }

    #fen          = null;
    #BoardHistory = null;

    constructor(fen) {
        super();

        // future ref, for Board image
        this.generateTemplate();

        const { getById } = Element;
        const tmp         = getById(`chess-board-tmp`).content;

        this.setShadow(`open`);
        this.getShadow().appendChild(tmp.cloneNode(true));

        this.#fen = this.getAttribute(`fen`) || fen;
        this.setAttribute(`fen`, fen);
        this.setAttribute(`chess-board-dim`, ``);


        //  [
        //      [
        //          []
        //      ]
        //  ]
        //
        //  vs
        //
        //  [
        //      [ ]
        //  ]



        this.onBody(this);

    }

    setBoard(fen) {

    }

    getPrevBoard() {

    }

    getNextBoard() {

    }

    connectedCallback() {

    }

    attributeChangedCallback() {
        this.#fen = this.getAttribute(`fen`);
    }

    generateTemplate() {
        const { gen }                   = Element;
        const ChessBoardTemp            = gen(`template`);
        const ChessBoardNotif           = gen(`slot`);
        const ChessBoardContainerSlot   = gen(`slot`);
        const StyleChessBoard           = gen(`style`);
        StyleChessBoard.textContent     = ShadowStyleChesBoard;

        ChessBoardTemp
            .setAttribute(`id`, `chess-board-tmp`);
        ChessBoardContainerSlot
            .setAttribute(`name`, `chess-board-slot`);

        for (let i = 0; i < 64; i++) {
            const cell = gen(`div`);

            this.appendTo(ChessBoardContainerSlot, cell);
        }

        ChessBoardTemp.content.appendChild(StyleChessBoard);
        ChessBoardTemp.content.appendChild(ChessBoardNotif);
        ChessBoardTemp.content.appendChild(ChessBoardContainerSlot);

        this.onBody(ChessBoardTemp);
    }
}

customElements.define(`chess-board`, ChessBoard);

