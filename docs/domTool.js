window.$ = function(idName) {
    return document.getElementById(idName);
  };
  
  /** 
   * 工具函数：获取元素“最终计算”后的样式数值（去除 px）
   */
  window.getStyle = function(ele, attr) {
    var result;
    if (ele.currentStyle) {
      // 针对老式 IE（IE6~8）
      result = ele.currentStyle[attr];
    } else {
      // 现代浏览器走这里
      result = window.getComputedStyle(ele, null)[attr];
    }
    return parseFloat(result);
  };