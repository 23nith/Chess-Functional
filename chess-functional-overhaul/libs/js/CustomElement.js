
export default class CustomElement extends HTMLElement {

    #shadow = null;
    constructor() {
        super();
    }

    setShadow(set) {
        this.#shadow = this.attachShadow({mode: `${set}`});
    }

    getShadow() {
        return this.#shadow;
    }

    onShadow(element) {
        this.#shadow.appendChild(element);
    }

    onBody(customEl) {
        document.body.appendChild(customEl);
    }

    append(customEl) {
        this.appendChild(customEl);
    }

    appendTo(parentEl, children) {
        parentEl.appendChild(children);
    }
}

