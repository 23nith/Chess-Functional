
import Piece    from '../../controller/Piece';
import Element  from '../../../libs/js/element';

export default class Pawn extends Piece {

    constructor() {

        super();

        const { gen } = Element;

        this.setShadow(`open`);
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }

}

customElements.define(`random-pawn`, Pawn);

