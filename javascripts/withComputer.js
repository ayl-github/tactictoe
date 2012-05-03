
function getElementPos(element){
    var actualLeft = element.offsetLeft;
    var actualTop = element.offsetTop;
    var current = element.offsetParent;

    while (current !==null){
        actualLeft += current.offsetLeft;
        actualTop += current. offsetTop;
        current = current.offsetParent;
    }

    return {
        x:actualLeft,
        y:actualTop
    }
}
function getElementRelPos(container,event){
    var pos=getElementPos(container);
    var left=pos.x;
    var top=pos.y;
    var mouseX = event.clientX - left + window.pageXOffset;
    var mouseY = event.clientY - top + window.pageYOffset;
    return {
        x: mouseX,
        y: mouseY
    };
}

function drawDynamicLine(ctx,sx,sy,dx,dy,timeInterval,handler){

   var stepx,stepy,steps,x,y;
   var interval=1;
   var sign=1;
   if(sx==dx&&sy==dy){return;}
   if(sx==dx){
       stepx= 0;
       sign=dy>sy?1:-1;
       stepy=interval*sign;
       steps=Math.abs((dy-sy)/stepy);
   }
   else if(sy==dy){
       stepy=0;
       sign=dx>sx?1:-1;
       stepx=interval*sign;
       steps=Math.abs((dx-sx)/stepx);
   }
   else{
     stepx=(dx-sx)/Math.abs(dx-sx)*interval;
     stepy=((dy-sy)/(dx-sx))*stepx;
     steps=Math.abs((dx-sx)/stepx);
   }
   var myLine={
       ctx:ctx,
       currentx:sx,
       cureenty:sy,
       sourcex:sx,
       sourcey:sy,
       stepx:stepx,
       stepy:stepy,
       steps:steps,
       timeInterval:timeInterval,
       handler:handler
   };
    drawLineByFrame(myLine);
}
function drawLineByFrame(myLine){
    //myLine.ctx.clearRect(0,0,myLine.ctx.width,myLine.ctx.height);
    myLine.currentx+=myLine.stepx;
    myLine.cureenty+=myLine.stepy;
    myLine.steps--;

    myLine.ctx.beginPath();
    myLine.ctx.moveTo(myLine.sourcex,myLine.sourcey);
    myLine.ctx.lineTo(myLine.currentx,myLine.cureenty);
    myLine.ctx.stroke();
    if(myLine.steps==0){
        myLine.handler();
    }
    else{
       setTimeout(function(){drawLineByFrame(myLine)}
           ,myLine.timeInterval);
    }
}

function drawDynamicCircle(ctx,centerx,centery,radius,timeInterval,handler){

    var steps=30;
    var stepAngle=2*Math.PI/steps;
    var myCircle={
        ctx:ctx,
        centerx:centerx,
        centery:centery,
        currentAngle:0,
        stepAngel:stepAngle,
        steps:steps,
        radius:radius,
        timeInterval:timeInterval,
        handler:handler
    };
   drawCircleByFrame(myCircle);
}
function drawCircleByFrame(myCircle){
    var ctx=myCircle.ctx;
    //ctx.clearRect(0,0,ctx.width,ctx.height);
    myCircle.currentAngle+=myCircle.stepAngel;
    myCircle.steps--;
    ctx.beginPath();
    ctx.arc(myCircle.centerx,myCircle.centery,myCircle.radius,0,myCircle.currentAngle,false);
    ctx.stroke();
    if(myCircle.steps==0){
        myCircle.handler();
    }
    else{
        setTimeout(function(){
          drawCircleByFrame(myCircle);
       },myCircle.timeInterval)

    }


}

function drawX(ctx,x1,y1,x2,y2,x3,y3,x4,y4,handler){

    drawDynamicLine(ctx,x1,y1,x4,y4,20,drawDynamicLine.bind(ctx,x2,y2,x3,y3,20,handler
    ));
}
function drawO(ctx,centerx,centery,handler){
    drawDynamicCircle(ctx,centerx,centery,30,40,handler);

}
function drawGameBoard(canvas){
    canvas.width=300;
    canvas.height=300;
    if(!canvas.getContext){
        return;
    }
    var ctx=canvas.getContext('2d');
    ctx.strokeStyle="orange";

    drawDynamicLine(ctx,0,canvas.height/3,canvas.width,canvas.height/3,3,function(){});
    drawDynamicLine(ctx,0,2*canvas.height/3,canvas.width,2*canvas.height/3,3,function(){});
    drawDynamicLine(ctx,canvas.width/3,0,canvas.width/3,canvas.height,3,function(){});
    drawDynamicLine(ctx,2*canvas.width/3,0,2*canvas.width/3,canvas.height,3,function(){
         document.getElementById("playButton").style.display="";
    });

}

function EventTarget(){
    this._listeners = {};
}
EventTarget.prototype = {

    constructor: EventTarget,

    addListener: function(type, listener){
        if (typeof this._listeners[type] == "undefined"){
            this._listeners[type] = [];
        }

        this._listeners[type].push(listener);
    },

    fire: function(event){
        if (typeof event == "string"){
            event = { type: event };
        }
        if (!event.target){
            event.target = this;
        }

        if (!event.type){  //falsy
            throw new Error("Event object missing 'type' property.");
        }

        if (this._listeners[event.type] instanceof Array){
            var listeners = this._listeners[event.type];
            for (var i=0, len=listeners.length; i < len; i++){
                listeners[i].call(this, event);
            }
        }
    },

    removeListener: function(type, listener){
        if (this._listeners[type] instanceof Array){
            var listeners = this._listeners[type];
            for (var i=0, len=listeners.length; i < len; i++){
                if (listeners[i] === listener){
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }
}
Function.prototype.bind= function()
{
    var   __method   =   this;
    var   arg   =   arguments;
    return   function()   {
        __method.apply(window,   arg);
    }
}



var INFINITY=80;
var WIN=+INFINITY;
var LOSE=-INFINITY;
var GAMEPOINT=INFINITY/4;
var GOON=1;
var DRAW=0;
function stateEvaluate(gameBoard){
    var WIN_STATUS=Array(
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    );


    var result=GOON;
    var isFull=true;
    var firstChess;
    var secondChess;
    var thirdChess;
    var pos;

    for( pos=0;pos<9;pos++){
        if(gameBoard[pos]=='E') {
            isFull=false;
            break;
        }
    }

    for(pos=0;pos<8; pos++){
        firstChess=gameBoard[WIN_STATUS[pos][0]];
        secondChess=gameBoard[WIN_STATUS[pos][1]];
        thirdChess=gameBoard[WIN_STATUS[pos][2]];
        if(firstChess==secondChess&&firstChess==thirdChess&&firstChess!="E"){
            result= firstChess=="X" ? WIN : LOSE;
            return result;
        }
    }
    if(isFull){
        return DRAW;
    }
    else{
        for(pos=0;pos<8; pos++){
             firstChess=gameBoard[WIN_STATUS[pos][0]];
             secondChess=gameBoard[WIN_STATUS[pos][1]];
             thirdChess=gameBoard[WIN_STATUS[pos][2]];
            if(firstChess==secondChess&&firstChess!="E"&&thirdChess=="E"){
                result=(firstChess=="X"?GAMEPOINT:-GAMEPOINT);
                return result;
            }
            if(firstChess==thirdChess&&firstChess!="E"&&secondChess=="E"){
                result=(firstChess=="X"?GAMEPOINT:-GAMEPOINT);
                return result;
            }
            if(secondChess==thirdChess&&secondChess!="E"&&firstChess=="E"){
                result=(secondChess=="X"?GAMEPOINT:-GAMEPOINT);
                return result;
            }
        }
    }
    return result;
}

function  max(gameBoard,depth,alpha,beta){
    var evaluatedValue=stateEvaluate(gameBoard);
    var isGameOver=(evaluatedValue==WIN||evaluatedValue ==LOSE||evaluatedValue==DRAW);
    if(alpha>=beta||isGameOver||depth==0){
        return evaluatedValue;
    }

    var bestValue=-INFINITY;
    for(var pos=0;pos<9;pos++){
        if(gameBoard[pos]=='E'){
            gameBoard[pos]='X';
            bestValue=Math.max(bestValue,min(gameBoard,depth-1,Math.max(bestValue,alpha),beta));
            gameBoard[pos]='E';
        }
    }
    return bestValue;
}

function  min(gameBoard,depth,alpha,beta){
    var evaluatedValue=stateEvaluate(gameBoard);
    var isGameOver=(evaluatedValue==WIN||evaluatedValue ==LOSE||evaluatedValue==DRAW);
    if(alpha>=beta||isGameOver||depth==0){
        return evaluatedValue;
    }

    var bestValue=+INFINITY;
    for(var pos=0;pos<9;pos++){
        if(gameBoard[pos]=='E'){
            gameBoard[pos]='O';
            bestValue=Math.min(bestValue,max(gameBoard,depth-1,alpha,Math.min(bestValue,beta)));
            gameBoard[pos]='E';
        }
    }
    return bestValue;
}

function randomSelect(lowerValue,upperValue){
    var choices=upperValue-lowerValue+1;
    return Math.floor(Math.random()*choices+lowerValue);
}

function chooseBestMove(gameBoard,depth,turn){
    var bestMoves=new Array(9);
    var index=0;
    var bestValue;
    if(turn=="X"){
        bestValue=-INFINITY;
        for(var pos=0;pos<9;pos++){
            if(gameBoard[pos]=='E'){
                gameBoard[pos]='X';
                var value=min(gameBoard,depth,-INFINITY,+INFINITY);
                if(value>bestValue){
                    bestValue=value;
                    index=0;
                    bestMoves[index]=pos;
                }
                else{
                    if(value==bestValue){
                        index++;
                        bestMoves[index]=pos;
                    }
                }
                gameBoard[pos]='E';
            }
        }
        if(index>1){
            index=randomSelect(0,index);
        }
        return bestMoves[index];
    }
    else{
        bestValue=INFINITY;
        for(var pos=0;pos<9;pos++){
            if(gameBoard[pos]=='E'){
                gameBoard[pos]='O';
                var value=max(gameBoard,depth,-INFINITY,+INFINITY);
                if(value<bestValue){
                    bestValue=value;
                    index=0;
                    bestMoves[index]=pos;
                }
                else{
                    if(value==bestValue){
                        index++;
                        bestMoves[index]=pos;
                    }
                }
                gameBoard[pos]='E';
            }
        }
        if(index>1){
            index=randomSelect(0,index);
        }
        return bestMoves[index];

    }

}



var target=new EventTarget();
var game={
    gameBoard:new Array("E","E","E","E","E","E","E","E","E"),
    gameTurn:"player",
    gameState:function(){
        var result;
        var WIN_STATUS=new Array(
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        );
        var pos;
        var isFull=true;
        for( pos=0;pos<9;pos++){
            if(this.gameBoard[pos]=="E") {
                isFull=false;
                break;
            }
        }
        for(pos=0;pos<8; pos++){
            var firstChess=this.gameBoard[WIN_STATUS[pos][0]];
            var secondChess=this.gameBoard[WIN_STATUS[pos][1]];
            var thirdChess=this.gameBoard[WIN_STATUS[pos][2]];
            if(firstChess==secondChess&&firstChess==thirdChess&&firstChess!='E'){
                result= (firstChess==this.player.sign ? WIN : LOSE);
                return result;
            }
        }

        if(isFull){
            return DRAW;
        }
        return GOON;

    },
    player:{
        sign:"X"

    },
    computer:{
        sign:"O"
    }
};


var withComputerButton=document.getElementById("withComputer");
var playNow=function(){

    var gameControlBoard=document.getElementById("gameControlBoard");
    var playButton=document.createElement("button");
    playButton.setAttribute("id","playButton");
    var playButtonText=document.createTextNode(" Play ");
    playButton.appendChild(playButtonText);
    gameControlBoard.appendChild(playButton);
    playButton.style.display="none";

    var canvas=document.getElementById("myCanvas");
    drawGameBoard(canvas);


    var gameControl=function(){
        var playerHandler=function(event){
            if(game.gameTurn=="player"){
            var canvas=document.getElementById("myCanvas");
            canvas.removeEventListener("click",playerHandler,false);

               var pos=getElementRelPos(canvas,event);
               var row=0;
               var column=0;

               if(pos.x<canvas.width/3){
                   column=0;
               }
               else if(pos.x>canvas.width/3&&pos.x<2*canvas.width/3){
                   column=1;
               }
               else if(pos.x>2*canvas.width/3){
                   column=2;
               }
               if(pos.y<canvas.height/3){
                   row=0;
               }
               else if(pos.y>canvas.height/3&&pos.y<2*canvas.height/3){
                  row=1;
               }
               else if(pos.y>2*canvas.height/3){
                 row=2;
               }


               var ctx=canvas.getContext("2d");
               ctx.strokeStyle="red";
               if(game.player.sign=="X"){
                  var padding=15;
                  var size=60;
                  var x0,y0,x1,y1,x2,y2,x3,y3,x4,y4;
                  x0=canvas.width/3*column;
                  y0=canvas.height/3*row;
                  x1=x0+padding;
                  y1=y0+padding;
                  x2=x1+size;
                  y2=y1;
                  x3=x1;
                  y3=y1+size;
                  x4=x1+size;
                  y4=y1+size;
                drawX(ctx,x1,y1,x2,y2,x3,y3,x4,y4,function(){
                    game.gameBoard[row*3+column]=game.player.sign;
                    if(game.gameState()==GOON){
                        game.gameTurn="computer";
                        target.addListener("computer",computerHandler);
                        target.fire("computer");
                    }
                    else if(game.gameState()==WIN){
                        alert("Player wins the game!")
                    }
                    else if(game.gameState()==LOSE){
                        alert("Player loses the game!")
                    }
                    else{
                        alert("Tie!")
                    }
                });
              }
              else{
                var centery=canvas.height/6+canvas.height/3*row;
                var centerx=canvas.width/6+canvas.width/3*column;
                drawO(ctx,centerx,centery,function(){
                    game.gameBoard[row*3+column]=game.player.sign;
                    if(game.gameState()==GOON){
                        game.gameTurn="computer";
                        target.addListener("computer",computerHandler);
                        target.fire("computer");
                    }
                    else if(game.gameState()==WIN){
                        alert("Player wins the game!")
                    }
                    else if(game.gameState()==LOSE){
                        alert("Player loses the game!")
                    }
                    else{
                        alert("Tie!")
                    }


                });

              }
            }
        };


        var computerHandler=function(){
            if(game.gameTurn=="computer"){

              target.removeListener("computer",computerHandler);

              var canvas=document.getElementById("myCanvas");
              var ctx=canvas.getContext("2d");
              var bestMove=chooseBestMove(game.gameBoard,3,"O");

              var row,column;
              var centerx,centery;
              column=bestMove%3;
              row=(bestMove-column)/3;

              centerx=canvas.width/6+column*canvas.width/3;
              centery=canvas.height/6+row*canvas.height/3;


              drawO(ctx,centerx,centery,function(){
                  game.gameTurn="player";
                  game.gameBoard[bestMove]=game.computer.sign;
                  if(game.gameState()==GOON){
                      var canvas=document.getElementById("myCanvas");
                      canvas.addEventListener("click",playerHandler,false);
                  }
                  else if(game.gameState()==WIN){
                      alert("Player wins the game!")
                  }
                  else if(game.gameState()==LOSE){
                      alert("Player loses the game!")
                  }
                  else{
                      alert("Tie!")
                  }

              });
            }
        };



        if(game.gameState()==GOON){
            if(game.gameTurn=="player"){
                canvas.addEventListener("click",playerHandler,false);
            }
            else{
               target.addListener("computer",computerHandler);
               target.fire("computer");
            }
        }
        else if(game.gameState()==WIN){
            alert("Player wins the game!")
        }
        else if(game.gameState()==LOSE){
            alert("Player loses the game!")
        }
        else{
            alert("Tie!")
        }
    };


    playButton.addEventListener("click",gameControl,false);
};
withComputerButton.addEventListener("click",playNow,false);















