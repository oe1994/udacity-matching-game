/*
 * 创建一个包含所有卡片的数组
 */
var cardArray = [
    "diamond",
    "paper-plane-o",
    "cube",
    "anchor",
    "bolt",
    "leaf",
    "bicycle",
    "bomb"
  ];
  cardArray = cardArray.concat(cardArray);

  /**
 * 胜利标志 
 */
var alertLose = false;

var winFlag = false;

var score = 3;

var minute = 5;

var seconds = 00;
/**
 * 标识卡片的翻开状态 1.已翻开 0.未翻开
 */
var cardOpenArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 

const deck = document.querySelector("ul.deck");
 /**
  * 记录上一次翻开的卡片下标 在进行一次卡片配对后，重置为-1
  */
var lastClick = -1;
/**
 * 记录当前玩家操作的总次数
 */
var moveNum = 0;

var timer = window.setInterval(timerCallback, 1000);

document.querySelector("div.restart").addEventListener("click", function() {
    restart();
});

init(cardArray);


/*
 * 显示页面上的卡片
 *   - 使用下面提供的 "shuffle" 方法对数组中的卡片进行洗牌
 *   - 循环遍历每张卡片，创建其 HTML
 *   - 将每张卡的 HTML 添加到页面
 *   如何用js在html上添加dom元素
 *   如何用js在html上添加css样式
 */
/**
 * 初始化函数
 * 初始化每一张卡片的css样式，点击事件回调函数
 * @param {} array 
 */
function init(array) {
    winFlag = false;
    shuffle(array);
    const deck = document.querySelector("ul.deck");
    for (var i = 0; i < array.length; i++) {
        var newLi = document.createElement("li");
        newLi.classList.add("card");
        newLi.index = i;
        var newI = document.createElement("i");
        newI.classList.add("fa");
        newI.classList.add("fa-" + array[i]);
        newLi.appendChild(newI);
        deck.appendChild(newLi);
    }
    var selected = deck.firstChild;
    while (selected != null) {
        selected.addEventListener("click",function (e) {
            if (cardOpenArray[e.target.index] == 1) {
                return;
            }
            moveNum++;
            document.querySelector("span.moves").textContent = moveNum;
            markOpen(e.target);  
            e.target.classList.add("open");
            e.target.classList.add("show");
            if (!checkLegalPeer(e.target)) {
                setTimeout(() => {
                    ilegalPeerAction(e.target);    
                }, 500);
                
            } else {
                checkWin();
            }
            console.log(cardOpenArray);  
        });
        selected = selected.nextSibling;
    }
}

function restart() {
    alert("准备好了吗？游戏即将重新开始");
        for (var i = 0; i<3; i++) {
            document.querySelector("ul.stars").children[i].children[0].classList.add("fa-star","fa");
        }
        window.clearInterval(timer);
        minute = 5;
        seconds = 00;
        alertLose = false;
        moveNum = 0;
        lastClick = -1;
        cardOpenArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
        document.querySelector("span.moves").textContent = 0;
        document.querySelector("ul.deck").innerHTML="";
        init(cardArray);
        timer = window.setInterval(timerCallback, 1000);
}

function timerCallback() {
    if (minute == 0 && seconds == 0 && !alertLose) {
        alertLose = true;
        alert("时间到！你输了，要再来一局吗");
        return;
    }
    if(!winFlag) {
        if (seconds!=0) {
            seconds -= 1;
        } else {
            seconds = 59;
            minute -= 1;      
        }
        document.querySelector("span.timer").innerHTML = minute + ":" + seconds;
        if (minute>=4) {
            score = 3;
        } else if (minute>=2) {
            score = 2;
            document.querySelector("ul.stars").children[2].children[0].classList.remove("fa-star","fa");
        } else if (minute>=1) {
            score = 1;
            document.querySelector("ul.stars").children[1].children[0].classList.classList.remove("fa-star","fa");
        } else {
            score = 0;
            document.querySelector("ul.stars").children[0].children[0].classList.remove("fa-star","fa");
        }
    }
}

// 洗牌函数来自于 http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * 设置一张卡片的事件监听器。 如果该卡片被点击：
 *  - 显示卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 将卡片添加到状态为 “open” 的 *数组* 中（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 如果数组中已有另一张卡，请检查两张卡片是否匹配
 *    + 如果卡片匹配，将卡片锁定为 "open" 状态（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果卡片不匹配，请将卡片从数组中移除并隐藏卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 增加移动计数器并将其显示在页面上（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果所有卡都匹配，则显示带有最终分数的消息（将这个功能放在你从这个函数中调用的另一个函数中）
 */
/**
 * 将一张卡片在cardOpenArray数组中的值改为1，表示该卡片已被翻开
 * @param {*} selected 当前选择的卡片下标
 */
function markOpen(selected) {
    cardOpenArray[selected.index] = 1;
}
/**
 * 检查最近两次点击的卡片是否配对
 * @param {*} selected 
 */
function checkLegalPeer(selected) {
    if (lastClick != -1) {
        if (cardArray[lastClick] === cardArray[selected.index]) {
            lastClick = -1;
            return true;
        } else {
            return false;
        }
    }
    lastClick = selected.index;
    return true;
}
/**
 * 对未配对的卡片进行状态复原
 * @param {*} selected 
 */
function ilegalPeerAction(selected) {
    cardOpenArray[selected.index] = 0;
    cardOpenArray[lastClick] = 0;
    var index = selected.index; 
    var liList = document.querySelector("ul.deck").children;
    liList[selected.index].classList.remove("open","show");
    liList[lastClick].classList.remove("open","show");
    lastClick = -1;
}
/**
 * 检查是否达到胜利条件
 */
function checkWin() {
    setTimeout(() => {
        for (let i =0; i< cardOpenArray.length; i++) {
            if (cardOpenArray[i] == 0) {
                return false;
            }
        }
        winFlag = true;
        alertLose = false;
        alert('你赢了!花费时长:'+ (4-minute) + "分钟,"+(60-seconds)+"秒，得分"+score+"颗星星!");
        restart();
    },1000);
}
