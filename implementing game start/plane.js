;window.onload=function(){
    /* Method for getting tag elements */
    function $(idName){
        return document.getElementById(idName);
    }
    /*获取样式使用最终的函数(这一段代码整段我不是很清楚在干什么）*/
    function getStyle(ele, attr){
        var res = null;
        if(ele.currentStyle){
            res = ele.currentStyle[attr];
        }else{
            res = window.getComputedStyle(ele, null)[attr];
        }
        return parseFloat(res);
    }
    /* getting the tag elements which was needed */
    var game = $("game")
        /* game start screen */
        ,gameStart = $("gameStart")
        /* Enter the game interface */
        , gameEnter = $("gameEnter")
        ,myPlane = $("myPlane")
        ,bulletsP = $("bullets")
        ,enemiesP = $("enemies");

        /* 获取需要使用到的元素样式 */
        /*1.获取游戏界面的宽高*/
        var gameW = getStyle(game, "width")
            ,gameH = getStyle(game, "height");
        /*2.游戏界面的左上边距*/
        var gameML = getStyle(game, "marginLeft")
            ,gameMT = getStyle(game, "marginTop");
        /*3. 获取己方飞机的宽高 */
        var myPlaneW = getStyle(myPlane, "width")
            ,myPlaneH = getStyle(myPlane, "width");
        /* 声明需要使用到的全局变量 */
        var gameStatus = false;

    /* game start */
    gameStart.firstElementChild.onclick = function(){
        gameStart.style.display="none";
        gameEnter.style.display="block";
        /*Adds a keyboard event to the current document */
        document.onkeyup = function(){
            this.onmousemove = myPlaneMove;
        }
    }
}

/*  myPlane move */
function myPlaneMove(evt){
    var e = evt || window.event;
    /*获取鼠标移动时的位置*/
    var mouseX = e.x || e.pageX
        ,mouseY = e.y || e.pageY;

    /*计算得到 */
}