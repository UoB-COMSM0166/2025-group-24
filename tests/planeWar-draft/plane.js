console.log("JS has been loaded");
//在 plane.js 的第一行 添加 console.log()， Console 里正确输出，说明 plane.js 加载了
//右键网页 → 检查 → Network（网络）→ JS，也没有 404。


// 简写函数：获取ID对应的DOM
function $(idName) {
  return document.getElementById(idName);
}

// 这个是个封装的函数，目的是获取函数最终值
function getStyle(ele, attr) {
  var res = null;
  if (ele.currentStyle) {//ele.currentStyle 
  // 是IE 早期浏览器（IE8 及更早版本）提供的一个获取元素当前样式的属性。
    res = ele.currentStyle[attr];
  } else {
    // 标准浏览器
    res = window.getComputedStyle(ele, null)[attr];
    //window.getComputedStyle(ele, null)[attr] 是获取元素最终计算后的 CSS 样式的标准方法，适用于所有现代浏览器。
    //	•	获取元素 最终生效的 CSS 样式（包括 style 里写的、外部 CSS 文件中的，以及继承或默认值）。
	  //  •	适用于 现代浏览器（Chrome、Firefox、Edge、Safari）。
  }
  return parseFloat(res);//前边的代码是获取到的结果是带单位的，这一步就是去掉单位
  //方便后面的加减。parseFloat() 是 JavaScript 提供的一个全局函数，
  // 用于将字符串转换成浮点数（即带小数点的数字）。
}

// 页面加载后再执行
window.onload = function() {

//第一步，首先获取所有的html中的元素
  // ======（1）获取主要DOM元素 & 基础数据 ======
  var game      = $("game");
  //游戏开始界面
  var gameStart = $("gameStart");
  //进入游戏界面
  var gameEnter = $("gameEnter");
  var myPlane   = $("myPlane");
  var bulletsP  = $("bullets");
  var enemysP   = $("enemys");
  var s = $("score").firstElementChild.firstElementChild;//的作用是获取 <span> 标签，也就是 显示分数的元素。

  //获取需要使用到的元素样式（目的是为了使得鼠标在飞机正中间）
  //整个网页的边距（以鼠标为基准）-整个游戏界面与文档的边距-己方飞机宽高的/2

  // 1.获取游戏界面的宽高（整个网页，以鼠标为基准）
  var gameW = getStyle(game, "width");
  var gameH = getStyle(game, "height");
  // 2.游戏界面的与文档的边距
  var gameML = getStyle(game, "marginLeft");
  var gameMT = getStyle(game, "marginTop");
  // 3. 获取己方飞机的宽高
  var myPlaneW = getStyle(myPlane, "width");
  var myPlaneH = getStyle(myPlane, "height");
  // 4. 子弹的宽高
 var bulletW = 32
  , bulletH = 32;

  // 游戏状态：true表示“进行中”，false表示“暂停/未开始”
  var gameStatus = false

  , a = null //创建子弹的额定时器
  , b = null //创建敌机的定时器
  , c = null//背景图运动的定时器

  , bullets = [] //所有子弹元素的集合
  , enemys= [] //所有敌机元素的集合
  , score = 0//设置一个得分

  , backgroundPY = 0;//背景图y轴的值
  ;


  // ======（2）点击“开始游戏”按钮 → 进入正式界面 ======
  //监听开始游戏按钮点击
  // game里面的第一个子元素就是span
  gameStart.firstElementChild.onclick = function() {
    // 隐藏开始界面
    gameStart.style.display = "none";
    // 显示正式游戏界面
    gameEnter.style.display = "block";
    // （可选）这里就可以开始发射子弹，或等玩家按空格才开始
    // 这里示例：先让子弹就绪
  }

  // ======（3）按空格键，切换开始 / 暂停 ======
  //如果按一下就开始那么需要全局变量
    document.onkeyup = function(evt) {
    var e = evt || window.event;
    var keyVal = e.KeyCode ||e.which;
    
    // 空格键：keyCode === 32
    if (keyVal === 32) {
      // 切换状态：若当前暂停 → 开始；若当前进行中 → 暂停
      gameStatus = !gameStatus;
      if (gameStatus) 
      {


        //初始化游戏得分

        score=0;
        // 游戏“进行中” → 让飞机随鼠标移动
        document.onmousemove = myPlaneMove;//在这里this 是事件监听，是触发onkeyup的事件
        shot();
        appearEnemy();

        //开始游戏之后的背景图的调用
        bgMove();

        //暂停游戏之后的开始游戏
        //子弹的继续运动
        if(bullets.length !=0)reStart(bullets,1); //刚开始的时候可以不执行，因为数组本身就为空
        if(enemys.length !=0)reStart(enemys,2);
        //敌机的继续运动      
        } 
      else 
      {
        // 游戏“暂停” → 取消鼠标移动事件
        document.onmousemove = null;

        //在暂停期间清除创建子弹和敌机的定时器
        myClearInterval(a);
        myClearInterval(b);
        myClearInterval(c);

        //在暂停期间，清除定时器值
        a = null;
        b = null;
        c = null;
      
        //清除所有子弹和所有敌机上的运动定时器
        clear(enemys);
        clear(bullets);
      }
      
    
      }
    }
  

  // ======（4）飞机随鼠标移动 ======
  function myPlaneMove(evt) { 
    var e = evt || window.event;
    // 获取鼠标移动时的位置。
    var mouse_x = e.x || e.pageX;//兼容
    var mouse_y = e.y || e.pageY;

    // 最后计算飞机应在的位置（让鼠标在飞机中心）
    var last_myPlane_left = mouse_x - gameML - myPlaneW / 2;
    var last_myPlane_top  = mouse_y - gameMT - myPlaneH / 2;

    // 这里边最小左边距应该是零
    if (last_myPlane_left < 0) {
      last_myPlane_left = 0;
    } else if (last_myPlane_left > gameW - myPlaneW) {
      last_myPlane_left = gameW - myPlaneW;
    }
    if (last_myPlane_top < 0) {
      last_myPlane_top = 0;
    } else if (last_myPlane_top > gameH - myPlaneH) {
      last_myPlane_top = gameH - myPlaneH;
    }

    // 把上面的结果写入，DOM元素中去。确定飞机跟随鼠标移动
    myPlane.style.left = last_myPlane_left + "px";
    myPlane.style.top  = last_myPlane_top + "px";
  }

 
  // 定时创建子弹

  function shot() {
    if(a) return;//防止暂停的时候，继续创造新的子弹定时器
    // 每 200 毫秒创建一颗子弹
    a = mySetInterval(function() {
      createBullet();
    }, 200);
  }

  // 创建子弹
  function createBullet() {
    // 1. 创建子弹（用Image或div都行）
    var bullet = new Image();
    bullet.src = "image/bullet1.png";
    bullet.className = "b"; // 在CSS可设宽高等
    // 如果未在CSS定义 .b，下面可手动设 bullet.style.width / height
    
    // 2. 因为每次飞机的位置在动，所以每次创建子弹的时候都需要得到飞机的位置
    // 获取飞机当前坐标，用于定位子弹初始位置
    var planeL = getStyle(myPlane, "left");
    var planeT = getStyle(myPlane, "top");
    // 这里假设子弹宽/高 6×14，可自行调整

    // 3. 让子弹居中到飞机顶部
    var bulletL = planeL + (myPlaneW / 2) - (bulletW / 2);
    var bulletT = planeT - bulletH;

    // 4. 写入到dom中
    bullet.style.position = "absolute";
    bullet.style.left = bulletL + "px";
    bullet.style.top  = bulletT + "px";

    // 5. 将子弹加入 bullets 容器
    bulletsP.appendChild(bullet);
    bullets.push(bullet);//把创建的子弹添加到集合当中去

    // 6. 让子弹往上移动
    move(bullet, "top");
  }

  // 让子弹沿某个方向（attr）移动并飞出时删除
  //匀速运动，每次改变子弹的top值
  function move(ele, attr) {
    var speed = -10; // 向上飞
    ele.timer = mySetInterval(function() {
      var moveVal = getStyle(ele, attr);
      //子弹的top值是负的子弹高度时，删除子弹，清除定时器
      if (moveVal <= -bulletH) {
        myClearInterval(ele.timer);

        ele.parentNode.removeChild(ele);
        //1.	ele.parentNode：获取 ele 元素的父节点（它所在的父容器）。
	      //2.	removeChild(ele)：让父节点移除 ele 这个子节点。
	      //3.	最终效果：ele 这个元素从 HTML 结构中被删除，不再出现在页面上。



        bullets.splice(0,1);
        //	•	0：从 索引 0（即数组第一个元素）开始。
      	//•	1：删除 1 个元素（即删除数组的第一个元素）。
      //	•	作用：删除 enemys 数组中的 第一个敌机对象。
      } else {
        ele.style[attr] = (moveVal + speed) + "px";
      }
    }, 10);
  }


  function appearEnemy(){//这个函数的目的是定时生成敌机
    b = mySetInterval(function(){
      //创建敌人
        createEnemy();
        //删除死亡敌人
        delEnemy();
    },500)//制造敌机，每隔1000毫秒就制造即（1秒）
    //mySetInterval（）函数式代码自带的，可以定时重复代码行为
}



//创建敌机数据对象
//这样的写法是js对象的写法，用来存储每一个对象
//对象（Object）特点：键值对存储，适用于：结构化数据（单个用户信息）
//额外的思考：有点像JSON写法（JSON用于方便前后端的数据传输），只不过JSON的写法
//JSON（JavaScript Object Notation，JavaScript 对象表示法） 是一种纯文本格式，它不能包含变量或函数，并且：
	//键名必须用双引号（""）。
	//不能使用 JavaScript 变量，比如 var 不能用。

//这里视频里面是找了三个敌机
var enenmyObj = {
    enemy1: {
        width: 76,
        height: 50,
        score: 100,
        hp: 100
    },
    enemy2: {
        width :151,
        height:100,
        score:500,
        hp: 500
    },
    enemy3: {
        width: 151,
        height: 100,
        score: 1000,
        hp: 800
    }
}

//制造敌机的函数
function createEnemy(){
    //敌机出现概率的数据
    //一共有20个，每一个敌机出现的概率为5%，
    //所以5%乘以各自的数量就可以得出各自的概率
      var percentData = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,3];
      var enemyType = percentData[Math.floor(Math.random()*percentData.length)];
    //percentData[索引]：含义是随机取出数组中一个数
    //Math.floor（）:是向下取整
    //Math.random() ：是随机生成0-1之间的小数
    //percentData.length:是数组长度
    //Math.random*percentData.length:则是生成0-20，之间的一个数，再通过Math.floor向下取整
      var enemyData = enenmyObj["enemy"+enemyType];
      //这里的意思是字符串拼接，enemy1或enemy2


    //创建敌机所在的元素（这里的enemy是创建的元素，所以之后还得添加到html里面，父元素）
      var enemy = new Image(enemyData.width,enemyData.height) 
    //这里的意思是创建一个新的html图片元素，
    //等价于：
    // var enemy = document.createElement("img");这里“img”是指的是html里面的标签
    // enemy.width = enemyData.width;
    // enemy.height = enemyData.height;
    enemy.src = "image/enemy"+enemyType+".png";
    //这是写一个相对路径，告诉系统图片的来源是image/enemy1.png目录
    //只要目录和这个能对得上就能加载图片
    enemy.t = enemyType;
    //这里是把enemyData（咱们自己定的数据）赋值给enemy
    //首先是敌机的得分和血量
    enemy.score = enemyData.score;
    enemy.hp = enemyData.hp;
  //现在css上创一个类名为e的，然后使用JS修改就可以
    enemy.className ="e";

    enemy.dead= false;//标记敌机存活

    //然后是敌机出现位置（随机）
    var enemyL = Math.floor(Math.random()*(gameW-enemyData.width+1))
    //这个gameW是游戏界面的宽度，然后敌机出现的像素范围是在游戏界面减去小飞机本身的宽度这个像素范围之间的
    //又因为又可能有0所以就加了个1
    , enemyT = -enemyData.height;
    //这个飞机一开始是在上面，负像素的位置下降的
    enemy.style.left = enemyL+"px";
    enemy.style.top = enemyT+"px";
    enemysP.appendChild(enemy);
    enemys.push(enemy); //  把创建的每一架子弹和每一架敌机都放入集合当中
    enemyMove(enemy,"top");
   /* 把已经创建的飞机加入到父元素中
    这里我猜可能在html里面有一个例如enemys的div元素，例如<div id="enemys"></div>
    然后有这样一个代码
    var enemysP = document.getElementById("enemys")
    然后紧接着使用appendChild(enenmy)就可以加入了，因为必须放在html的div中才可以显示
    创建的是后来随机的，所以多了手动添加到html中的这一步
    */

    /* ******** 
    在这之后要写一个css文件，来规定定位方式（	CSS 负责“外观样式”（比如大小、颜色、定位方式），JavaScript 负责“行为”）
    比如:
    .e{
     position:absolute;}
     这个目的是可以让敌机动起来，而不是像网页固定按钮一样排版

     */
}


//开始写飞机的运动，要传进来两个属性，一个是飞机ele，一个是它本身的属性
function enemyMove(ele, attr) {
  var speed = null;
if (ele.t == 1) {
    speed = 5;
} else if (ele.t == 2) {
    speed = 3;
} else if (ele.t == 3) {
    speed = 1.5;
} 
  ele.timer = mySetInterval(function() {
      var moveVal = getStyle(ele, attr);
      if (moveVal >= gameH) {
          myClearInterval(ele.timer);
          enemysP.removeChild(ele);
          enemys.splice(0,1);//把超出屏幕外的飞机删除，这里这个写法就是默认删除数组里面第一个
      } else {
          ele.style[attr] = moveVal + speed + "px";

          //每一颗子弹碰撞时检测和每一架敌机的碰撞
          danger(ele);


          //敌机运动时，检测碰撞
          gameOver()
      }
  }, 10);

}


//为清除所有敌机和所有子弹上的运动定时器封装函数
//每创建一个飞机或者子弹都会被放入数组中，一旦暂停，就根据数组中的飞机或子弹取删除对应的飞机或子弹的运动定时器
function clear(childs){
  for(var i = 0; i<childs.length; i++){
    myClearInterval(childs[i].timer);

}
}

//暂停游戏之后的开始游戏
//还得传个类型进来，确定到底是子弹的运动，还是敌机的运动
function reStart(childs, type){
  for(var i=0; i<childs.length; i++){
      type == 1 ? move(childs[i], "top") : enemyMove(childs[i], "top");
      //这样写可以让一个函数实现子弹和飞机同时restart，要不就得分别写敌机和子弹的函数
      
  }
}


//开始游戏之后的背景图的运动
function bgMove() {
  c = mySetInterval(function() {  //s 每 10 毫秒执行一次
      backgroundPY += 3;  // 让背景 Y 方向的偏移量增加（向下滚动）
      if (backgroundPY >= gameH) { 
          backgroundPY = 0;  // 当滚动到游戏界面底部时，重置到顶部
      }

      gameEnter.style.backgroundPositionY = backgroundPY + "px"; // 更新背景位置
  }, 10);
}


//检测子弹和敌机的碰撞
function danger(enemy) {
  for (var i = 0; i < bullets.length; i++) {
      // 得到子弹的左上边距
      var bulletL = getStyle(bullets[i], "left"),
          bulletT = getStyle(bullets[i], "top");

      // 得到敌机的左上边距
      var enemyL = getStyle(enemy, "left"),
          enemyT = getStyle(enemy, "top");

      // 得到敌机的宽高
      var enemyW = getStyle(enemy, "width"),
          enemyH = getStyle(enemy, "height");

      var condition = bulletL + bulletW >=enemyL&&bulletL<=enemyL+enemyW && bulletT<=enemyT+enemyH&&bulletT+bulletH>=enemyT;
      if (condition) {
        // 子弹和敌机的碰撞：删除子弹
        // 1、先清除碰撞子弹的定时器
        myClearInterval(bullets[i].timer);
        
        // 2、从dom父元素中删除元素
        bulletsP.removeChild(bullets[i]);
        
        // 3、从集合中删除子弹，这里删除的目的是，
        // 3.1
        // 防止之后子弹还存在与数组当中，如果 bullets 数组中仍然包含已经消失的子弹，
        // 重新开始后，程序可能会让这些“已删除”的子弹再次移动，造成视觉错误或逻辑错
        // 3.2
        // 防止子弹仍然存在于数组中
        //bullets 数组用于存储所有活跃的子弹，每次创建子弹时，都会被 push() 进数组。
        //如果不 splice() 删除已经撞击的子弹，那么即使它被从 DOM 中移除，它仍然留在 bullets 数组中。
        //这样当游戏继续时，这些已经不存在的子弹仍然会被 danger() 检测，从而引发 逻辑错误。
        bullets.splice(i, 1);

        //4.子弹和敌机发生碰撞后敌机减少，血量为零时，删除敌机
        enemy.hp -=100;
        if (enemy.hp == 0) {
          // 删除敌机的定时器，防止它继续移动
          myClearInterval(enemy.timer);
          
          //替换爆炸图片
          enemy.src = "image/bz.gif";

          //这块是因为gif图一直循环，没法解决，找gpt修改的，但感觉和后面视频里面的代码功能重复了
        //这块是个问题，gif不能一直循环
          mySetTimeout(function()
         {
            if (enemy.parentNode) {  // 避免已经被删除时报错
                enemysP.removeChild(enemy);
                enemys.splice(enemys.indexOf(enemy), 1); // 从数组中删除
            }
          }, 500); // GIF 动画时长


          //标记死亡敌机
          enemy.dead =true;

          //计算得分
          score+=enemy.score;
          s.innerHTML =score;

        
        }

       } 
  }

}
// 延时删除集合和文档中的死亡敌机，创建敌机时调用,创建定时器->制造敌机->删除死亡敌机
function delEnemy()
{
  for(var i=enemys.length - 1;i>=0;i--)
  {
    if(enemys[i].dead)
    {
      (function(index){
        //从文档中删除敌机元素
        enemysP.removeChild(enemys[index]);
        //从集合中删除敌机元素
        enemys.splice(index,1);//1 表示 删除 1 个元素（即 只删除当前索引对应的敌机）。
      })(i)
    }
  }
}



//飞机碰撞，游戏结束（敌机运动的函数内调用,可写在 danger(ele) 下 game Over（））
function gameOver(){
  for(var i=0;i<enemys.length;i++)
  {
    if(enemys[i].dead)
    {
      //游戏界面内存活的敌机
      //获取敌机的左上边距
      var enemyL = getStyle(enemys[i],"left")
      var enemyT = getStyle(enemys[i],"top")
      //获取敌机的宽高
      var enemyW = getStyle(enemys[i],"width")
      var enemyH = getStyle(enemys[i],"height")
      //获取己方飞机的左上边距
      var myPlaneL = getStyle(myPlane,"left")
      var myPlaneT = getStyle(myPlane,"top")
      //判断碰撞条件
      var condition = myPlaneL + myPlaneW >=enemyL && myPlaneL <= enemyL + enemyW && myPlaneT <=enemyT + enemyH && myPlaneT + myPlaneH >= enemyT ;
      if (condition)
      {
        //己方飞机与敌机碰撞
        //清除定时器：创建子弹的定时器，创建飞机的定时器，游戏背景图的定时器
        myClearInterval(a);
        myClearInterval(b);
        myClearInterval(c);
        a = null;
        b = null;
        c = null;
        //删除子弹和敌机元素
        remove(bullets);
        remove(enemys);
        //集合清空
        bullets = [];
        enemys = [];
        //清除己方飞机的移动事件
        document.onmousemove = null;
        
        //弹出得分
        alert("Score:  " +score);
        
        //回到开始界面
        gameStart.style.display = "block";
        gameEnter.style.display = "none";
        //己方飞机位置返回始位
        myPlane.style.left = "122px"; // 计算得到的界面中点-1/2己方飞机宽度
        myPlane.style.bottom = "0px";
      }
    }
  }
}
//删除元素
function remove(childs)
{
  for(var i = childs.length - 1;i>=0;i--)//遍历 childs 数组，从 最后一个元素（索引 length-1）开始向前遍历，防止删除时索引错乱
  {
    myClearInterval(childs[i].timer);
    childs[i].parentNode.removeChild(childs[i]);//作用：从 父元素 中删除当前 childs[i]，彻底从页面移除
  }
}
} // ← 这个是 `window.onload` 结束的大括号

// 下面这部分是 Jest 需要的模块导出，必须放在 window.onload 之外
if (typeof module !== "undefined" && module.exports) {
    module.exports = { $, getStyle };
}

