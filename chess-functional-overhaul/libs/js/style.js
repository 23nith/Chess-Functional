
export function style(classNameParam, style, pseudo = ``) {
    const className = classNameParam;
    const styleElement = document.createElement(`style`);
    styleElement.textContent = `.${className} { ${style} } ${pseudo}`;
    document.head.appendChild(styleElement);
    return className;
}


export function part(customElementName, partNameParam, style, pseudo = ``) {
    const partName = partNameParam;
    const styleElement = document.createElement(`style`);
    styleElement.textContent = `${customElementName}::part(${partNameParam}) { ${style} } ${pseudo}`;
    document.head.appendChild(styleElement);
    return partName;
}

