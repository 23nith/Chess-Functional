
export default function style(classNameParam, style, pseudo = ``) {
    const className = classNameParam;
    const styleElement = document.createElement(`style`);
    styleElement.textContent = `.${className} { ${style} } ${pseudo}`;
    document.head.appendChild(styleElement);
    return className;
}

