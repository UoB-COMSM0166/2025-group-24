window.$ = function(idName) {
    return document.getElementById(idName);
  };
  
  /** 
   * 工具函数：获取元素“最终计算”后的样式数值（去除 px）
   */
  window.getStyle = function (ele, attr) {
    if (!ele) return 0; // 兼容 Cypress 测试时的 DOM 访问问题
    var result;
    if (ele.currentStyle) {
      result = ele.currentStyle[attr];
    } else {
      result = window.getComputedStyle(ele, null)[attr];
    }
    return result ? parseFloat(result) || 0 : 0;
  };
  