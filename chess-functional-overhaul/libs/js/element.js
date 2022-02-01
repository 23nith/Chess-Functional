
const Element = {
    gen(element) {
        return document.createElement(element);
    },
    get(selector) {
        return document.querySelector(selector);
    },
    getAll(selector) {
        return document.querySelectorAll(selector);
    },
    getById(id) {
        return document.getElementById(id);
    },
    getByName(name) {
        return document.getElementsByName(name);
    },
    getByClassName(className, i = 0) {
        return document.getElementsByClassName(className)[i];
    },
    getAllByClassname(className) {
        return document.getElementsByClassName(className);
    },
    getByTag(tag, i = 0) {
        return document.getElementsByTagName(tag)[i];
    },
    getAllByTag(tag) {
        return document.getElementsByTagName(tag);
    },
    setId(element, id) {
        element.id = id;
    },
    addClass(element, className) {
        if (element.classList) element.classList.add(className);
        else element.className += ` ${className}`;
    },
    addStyle(element, className) {
        if (element.classList) element.classList.add(className);
        else element.className += ` ${className}`;
    },
    delClass(element, className) {
        if (element.classList) element.className.remove(className);
    },
    hasClass(element, className) {
        return element.classList.contains(className);
    },
    addId(element, id) {
        if (element.id) throw new Error(`Element has an Id`);
        element.id = id;
    },
    appendTo(element, parentElementSelector) {
        const ParentElement = document.querySelectorAll(parentElementSelector);
        ParentElement[ParentElement.length - 1].append(element);
    }
};

const ElementMod = {
    genMod(element, parentElement, selectorType, selector) {
        const Element = document.createElement(element);

        if (parentElement === undefined) {
            throw new Error(`parentElement is undefined`);
        }

        parentElement.append(Element);

        if (!selectorType || !selector) {
            return Element;
        }

        const selectorTypeUpper = selectorType.toUpperCase();

        switch (selectorTypeUpper) {
        case `ID`:
            Element.id = `${selector}`;
            break;
        case `CLASS`:
            Element.classList.add(selector);
            break;
        default:
            throw new Error(`id and class only`);
        }

        return Element;
    },
    getAll(selector) {
        let prevCallCount = 0;
        return function () {
            const Elements = document.querySelectorAll(selector);
            const arrElement = [];
            for (let i = prevCallCount; i < Elements.length; i++) {
                arrElement.push(Elements[i]);
            }
            prevCallCount = Elements.length;
            return arrElement;
        };
    },
};



export default Element;
