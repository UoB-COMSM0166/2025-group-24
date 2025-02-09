// jest.setup.js
window.getComputedStyle = (element) => ({
    getPropertyValue: (prop) => {
        const computedStyles = {
            left: element.style.left || "0px",
            top: element.style.top || "0px",
            width: element.style.width || "0px",
            height: element.style.height || "0px",
            marginLeft: element.style.marginLeft || "0px",
            marginTop: element.style.marginTop || "0px",
        };
        return computedStyles[prop] || "0px";
    }
});
