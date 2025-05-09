// Global $ function as shorthand for document.getElementById
window.$ = function(idName) {
  return document.getElementById(idName);
};

/** 
* Utility function: Get computed style value of an element (removing 'px' units)
* @param {HTMLElement} ele - The DOM element to inspect
* @param {string} attr - The style property to get
* @return {number} The numeric value of the style property
*/
window.getStyle = function(ele, attr) {
  var result;
  if (ele.currentStyle) {
      // For legacy IE (IE6-8)
      result = ele.currentStyle[attr];
  } else {
      // Modern browsers path
      result = window.getComputedStyle(ele, null)[attr];
  }
  return parseFloat(result);
};