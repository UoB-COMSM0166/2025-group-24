window.$ = function(idName) {
    return document.getElementById(idName);
  };
  
// domTool.js 修改后的版本（测试环境使用）：
window.getStyle = function(ele, attr) {
  // 如果 inline style 存在该属性，则直接返回解析后的数值
  if (ele.style && ele.style[attr]) {
    return parseFloat(ele.style[attr]);
  }
  // 如果没有设置，则返回固定默认值
  if (attr === "left" || attr === "top") return 0;
  if (attr === "width" || attr === "height") return 50;
  return 0;
};
window.$ = function(idName) {
  return document.getElementById(idName);
};

window.$ = $;
window.getStyle = getStyle;
