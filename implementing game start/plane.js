;window.onload=function(){
    /* Method for getting tag elements */
    function $(idName){
        return document.getElementById(idName);
    }

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


        var gameW = getStyle(game, "width")
            ,gameH = getStyle(game, "height");

        var gameML = getStyle(game, "marginLeft")
            ,gameMT = getStyle(game, "marginTop");

        var myPlaneW = getStyle(myPlane, "width")
            ,myPlaneH = getStyle(myPlane, "width");

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

    var mouseX = e.x || e.pageX
        ,mouseY = e.y || e.pageY;
}