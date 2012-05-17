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
   var interval=2;
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
       currenty:sy,
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

    myLine.currentx+=myLine.stepx;
    myLine.currenty+=myLine.stepy;
    myLine.steps--;

    myLine.ctx.beginPath();
    myLine.ctx.moveTo(myLine.sourcex,myLine.sourcey);
    myLine.ctx.lineTo(myLine.currentx,myLine.currenty);
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
    ctx.strokeStyle="red";
    drawDynamicLine(ctx,x1,y1,x4,y4,5,drawDynamicLine.bind(ctx,x2,y2,x3,y3,5,handler
    ));
}
function drawO(ctx,centerx,centery,handler){
    ctx.strokeStyle="blue";
    drawDynamicCircle(ctx,centerx,centery,30,30,handler);

}
function drawGameBoard(canvas,handler){
    canvas.width=300;
    canvas.height=300;
    if(!canvas.getContext){
        return;
    }
    var ctx=canvas.getContext('2d');
    ctx.strokeStyle="orange";

    drawDynamicLine(ctx,0,canvas.height/3,canvas.width,canvas.height/3,1,function(){});
    drawDynamicLine(ctx,0,2*canvas.height/3,canvas.width,2*canvas.height/3,1,function(){});
    drawDynamicLine(ctx,canvas.width/3,0,canvas.width/3,canvas.height,1,function(){});
    drawDynamicLine(ctx,2*canvas.width/3,0,2*canvas.width/3,canvas.height,1,handler);

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

var INFINITY=100;
var WIN=+INFINITY;
var LOSE=-INFINITY;
var GAMEPOINT=INFINITY/2;
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
    gameControls:{
        playButton:document.getElementById('playButton'),
        newButton:document.getElementById('newButton'),
        quitButton:document.getElementById('quitButton')

    },
    gameTurn:"playerone",
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
                result= (firstChess==this.playerone.sign ? WIN : LOSE);
                game.isgameover=true;
                return result;
            }
        }

        if(isFull){
            game.isgameover=true;
            return DRAW;
        }
        return GOON;

    },
    playerone:{
        sign:"X",
        role:""

    },
    playertwo:{
        sign:"O",
        role:""
    } ,
    lastWinner:"",
    currentUser:"",
    userone:"",
    usertwo:"",
    isgameover:false
};

//play with computer


var withComputerButton=document.getElementById("withComputer");
var withComputer=function(){

    var withoutComputer=function(){
        if(game.isgameover){
            document.getElementById('withComputer').innerHTML="WithComputer";
            game.gameBoard=new Array("E","E","E","E","E","E","E","E","E");
            var canvas=document.getElementById("myCanvas");
            canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
            game.gameControls.playButton.style.display="none";
            game.gameControls.newButton.style.display="none";
            game.gameControls.quitButton.style.display="none";

            withComputerButton.removeEventListener('click',withoutComputer,false);
            withComputerButton.addEventListener('click',withComputer,false);
            withPlayerButton.addEventListener('click',withPlayer,false);
        }
        else{
            alert("The game is not over, please go on!");
        }


    }

    var quitComputerGame=function (){
        if(confirm("Are you sure quit the game now ?")){
            game.gameBoard=new Array("E","E","E","E","E","E","E","E","E");
            var canvas=document.getElementById("myCanvas");
            canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
            game.gameControls.playButton.style.display="none";
            game.gameControls.newButton.style.display="inline-block";
            game.gameControls.quitButton.style.display="inline-block";

            drawGameBoard(canvas,function(){
                game.gameControls.newButton.style.display="inline-block";
                game.gameControls.quitButton.style.display="inline-block";
                game.gameControls.newButton.addEventListener('click',computerControl,false);
                game.gameControls.quitButton.addEventListener('click',quitComputerGame,false);
                game.isgameover=true;

            });
        }
    }

    var newComputerGame=function (){
        var canvas=document.getElementById("myCanvas");
        var ctx=canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        game.gameControls.playButton.style.display="none";
        game.gameControls.newButton.style.display="none";
        game.gameControls.quitButton.style.display="none";
        game.gameBoard=new Array("E","E","E","E","E","E","E","E","E");

        drawGameBoard(canvas,function(){
            if(game.lastWinner=="player"){
                game.playerone.role="computer";
                game.playertwo.role="player";
            }
            else{
                game.playerone.role="player";
                game.playertwo.role="computer";
            }

            game.gameControls.newButton.style.display="inline-block";
            game.gameControls.quitButton.style.display="inline-block";
            game.gameControls.newButton.addEventListener('click',computerControl,false);
            game.gameControls.quitButton.addEventListener('click',quitComputerGame,false);

        });


    }

    document.getElementById('withComputer').innerHTML="WithoutComputer";
    withPlayerButton.removeEventListener('click',withPlayer,false);
    withComputerButton.removeEventListener('click',withComputer,false);
    withComputerButton.addEventListener('click',withoutComputer,false);

    game.playerone.role="player";
    game.playertwo.role="computer";


    var computerControl=function(){

        game.gameControls.playButton.style.display="none";
        game.gameControls.newButton.style.display="none";
        //game.gameControls.quitButton.style.display="none";

        var canvas=document.getElementById("myCanvas");
        var playerHandler=function(event){
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
            if(game.gameTurn=="playerone"){
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
                ctx.strokeStyle="red";
                drawX(ctx,x1,y1,x2,y2,x3,y3,x4,y4,function(){
                    game.gameBoard[row*3+column]=game.playerone.sign;
                    if(game.gameState()==GOON){
                        game.gameTurn="playertwo";
                        target.addListener("computer",computerHandler);
                        target.fire("computer");
                    }
                    else if(game.gameState()==WIN){
                        alert(game.playerone.role+" wins the game!");
                        game.lastWinner=game.playerone.role;
                        newComputerGame();
                    }
                    else if(game.gameState()==LOSE){
                        alert(game.playerone.role+" loses the game!");
                        game.lastWinner=game.playertwo.role;
                        newComputerGame();
                    }
                    else{
                        alert("Tie!");
                        game.lastWinner=game.playertwo.role;
                        newComputerGame();
                    }
                    ctx.strokeStyle="blue";
                });


            }
            else{
                var centerx=canvas.width/6+canvas.width/3*column;
                var centery=canvas.height/6+canvas.height/3*row;

                drawO(ctx,centerx,centery,function(){
                    game.gameBoard[row*3+column]=game.playertwo.sign;
                    if(game.gameState()==GOON){
                        game.gameTurn="playerone";
                        target.addListener("computer",computerHandler);
                        target.fire("computer");
                    }
                    else if(game.gameState()==WIN){
                        alert(game.playerone.role+" wins the game!") ;
                        game.lastWinner=game.playerone.role;
                        newComputerGame();
                    }
                    else if(game.gameState()==LOSE){
                        alert(game.playerone.role+" loses the game!");
                        game.lastWinner=game.playertwo.role;
                        newComputerGame();
                    }
                    else{
                        alert("Tie!");
                        game.lastWinner=game.playertwo.role;
                        newComputerGame();
                    }
                    ctx.strokeStyle="red";

                });
            }
        };


        var computerHandler=function(){
            target.removeListener("computer",computerHandler);

            var canvas=document.getElementById("myCanvas");
            var bestMove;
            if(game.playerone.role=="computer") {
                bestMove=chooseBestMove(game.gameBoard,2,game.playerone.sign);
            }
            else{
                bestMove=chooseBestMove(game.gameBoard,2,game.playertwo.sign);
            }


            var row=0,column=0;
            var centerx,centery;
            column=bestMove%3;
            row=(bestMove-column)/3;

            var ctx=canvas.getContext("2d");
            if(game.gameTurn=="playerone"){
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
                    game.gameBoard[row*3+column]=game.playerone.sign;
                    if(game.gameState()==GOON){
                        game.gameTurn="playertwo";
                        var canvas=document.getElementById("myCanvas");
                        canvas.addEventListener("click",playerHandler,false);
                    }
                    else if(game.gameState()==WIN){
                        alert(game.playerone.role+" wins the game!");
                        game.lastWinner=game.playerone.role;
                        newComputerGame();
                    }
                    else if(game.gameState()==LOSE){
                        alert(game.playerone.role+" loses the game!");
                        game.lastWinner=game.playertwo.role;
                        newComputerGame();
                    }
                    else{
                        alert("Tie!");
                        game.lastWinner=game.playertwo.role;
                        newComputerGame();
                    }

                });

            }
            else{
                centerx=canvas.width/6+column*canvas.width/3;
                centery=canvas.height/6+row*canvas.height/3;

                drawO(ctx,centerx,centery,function(){
                    game.gameBoard[bestMove]=game.playertwo.sign;
                    game.gameTurn="playerone";
                    if(game.gameState()==GOON){
                        var canvas=document.getElementById("myCanvas");
                        canvas.addEventListener("click",playerHandler,false);
                    }
                    else if(game.gameState()==WIN){
                        alert(game.playerone.role+" wins the game!");
                        game.lastWinner=game.playerone.role;
                        newComputerGame();
                    }
                    else if(game.gameState()==LOSE){
                        alert(game.playerone.role+" loses the game!");
                        game.lastWinner=game.playertwo.role;
                        newComputerGame();
                    }
                    else{
                        alert("Tie!");
                        game.lastWinner=game.playertwo.role;
                        newComputerGame();
                    }

                });

            }
        };



        if(game.gameState()==GOON){
            if(game.playerone.role=="player"){
                canvas.addEventListener("click",playerHandler,false);
            }
            else{
                target.addListener("computer",computerHandler);
                target.fire("computer");
            }
        }
        else if(game.gameState()==WIN){
            alert(game.playerone.role+" wins the game!");
            game.lastWinner=game.playerone.role;
            newComputerGame();
        }
        else if(game.gameState()==LOSE){
            alert(game.playerone.role+" loses the game!");
            game.lastWinner=game.playertwo.role;
            newComputerGame();
        }
        else{
            alert("Tie!");
            game.lastWinner=game.playertwo.role;
            newComputerGame();
        }
    }

    var canvas=document.getElementById("myCanvas");
    drawGameBoard(canvas,function(){
        game.gameControls.playButton.style.display="inline-block";
        game.gameControls.quitButton.style.display="inline-block";
        game.gameControls.playButton.addEventListener("click",computerControl,false);
        game.gameControls.quitButton.addEventListener('click',quitComputerGame,false);

    });



};
withComputerButton.addEventListener("click",withComputer,false);


//play with player

var withPlayerButton=document.getElementById("withPlayer");
var withPlayer=function(){
    game.isgameover=true;
    function changeGameBoard(newGameBoard){
        var changedPos=-1;
        for(var i=0;i<game.gameBoard.length;i++){
            if(game.gameBoard[i]!=newGameBoard[i]){
                changedPos=i;
                break;
            }
        }
        return changedPos;
    }

    var withoutPlayer=function(){
        if(game.isgameover){
            quitPlayerGame();
            clearTimeout(onlineuserID);
            document.getElementById("userList").innerHTML="";
            document.getElementById('withPlayer').innerHTML="WithComputer";

            withPlayerButton.removeEventListener('click',withoutPlayer,false);
            withComputerButton.addEventListener('click',withComputer,false);
            withPlayerButton.addEventListener('click',withPlayer,false);

        }
        else{
            alert("The game is not over, please go on!");
        }
    }

    var quitPlayerGame=function (){
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4){
                if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                    game.gameBoard=new Array("E","E","E","E","E","E","E","E","E");
                    var canvas=document.getElementById("myCanvas");
                    canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
                    game.gameControls.playButton.style.display="none";
                    game.gameControls.newButton.style.display="none";
                    game.gameControls.quitButton.style.display="none";
                    game.isgameover=true;
                    requestListener();


                }
                else{
                    xhr.open("post","../phppages/quitGame.php",true);
                    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    var username=document.getElementById('username');
                    xhr.send(username.toString());
                }
            }
        };
        xhr.open("post","../phppages/quitGame.php",true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var username=document.getElementById('username');
        xhr.send(username.toString());
    }

    var quitPlayerGame1=function (){
        if(confirm("Are you sure quit the game now?")){
            var xhr=new XMLHttpRequest();
            xhr.onreadystatechange=function(){
                if(xhr.readyState==4){
                    if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                        game.gameBoard=new Array("E","E","E","E","E","E","E","E","E");
                        var canvas=document.getElementById("myCanvas");
                        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
                        game.gameControls.playButton.style.display="none";
                        game.gameControls.newButton.style.display="none";
                        game.gameControls.quitButton.style.display="none";
                        game.isgameover=true;
                        requestListener();


                    }
                    else{
                        xhr.open("post","../phppages/quitGame.php",true);
                        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                        var username=document.getElementById('username');
                        xhr.send(username.toString());
                    }
                }
            };
            xhr.open("post","../phppages/quitGame.php",true);
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            var username=document.getElementById('username');
            xhr.send(username.toString());
        }

    }

    var newPlayerGame=function (){

        var canvas=document.getElementById("myCanvas");
        var ctx=canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        game.gameControls.playButton.style.display="none";
        game.gameControls.newButton.style.display="none";
        game.gameControls.quitButton.style.display="none";
        game.gameBoard=new Array("E","E","E","E","E","E","E","E","E");


        drawGameBoard(canvas,function(){
            //game.gameControls.playButton.style.display="inline-block";
            game.gameControls.newButton.style.display="inline-block";
            game.gameControls.quitButton.style.display="inline-block";

            var xhr=new XMLHttpRequest();
            xhr.onreadystatechange=function(){
                if(xhr.readyState==4){
                    if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                        if(xhr.responseText=="1"){

                            if(game.currentUser=="inviter"){

                                if(game.lastWinner==game.userone){
                                    game.playerone.role=game.usertwo;
                                    game.playertwo.role=game.userone;
                                    game.currentUser=="invitee";
                                }
                                else{
                                    game.playerone.role=game.userone;
                                    game.playertwo.role=game.usertwo;
                                    game.currentUser=="inviter";
                                }
                            }
                            else{

                                if(game.lastWinner==game.userone){
                                    game.playerone.role=game.usertwo;
                                    game.playertwo.role=game.userone;
                                    game.currentUser=="inviter";
                                }
                                else{
                                    game.playerone.role=game.userone;
                                    game.playertwo.role=game.usertwo;
                                    game.currentUser=="invitee";
                                }

                            }

                            game.gameControls.newButton.addEventListener('click',inviteeControl,false);
                            game.gameControls.quitButton.addEventListener('click',quitPlayerGame1,false);
                        }
                        else{
                            alert(document.getElementById('username')+"has quit game!");
                            game.gameControls.playButton.style.display="none";
                            game.gameControls.newButton.style.display="none";
                            game.gameControls.quitButton.style.display="none";
                            canvas.clearRect(0,0,canvas.width,canvas.height);

                        }

                    }
                    else{
                        xhr.open("post","../phppages/gameOverSet.php",true);
                        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                        xhr.send(null);
                    }
                }
            };
            xhr.open("post","../phppages/gameOverSet.php",true);
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xhr.send(null);
        });



    }

    document.getElementById('withPlayer').innerHTML="WithoutComputer";
    withComputerButton.removeEventListener('click',withComputer,false);
    withPlayerButton.removeEventListener('click',withPlayer,false);
    withPlayerButton.addEventListener('click',withoutPlayer,false);

    var inviterControl=function(){
        game.isgameover=false;
        game.gameControls.playButton.style.display="none";
        game.gameControls.newButton.style.display="none";
        game.gameControls.quitButton.style.display="inline-block";
        game.gameControls.quitButton.addEventListener('click',quitPlayerGame1,false);

        var secondHandler=function(){
            var canvas=document.getElementById("myCanvas");
            canvas.removeEventListener('click',secondHandler,false);
            var xhr=new XMLHttpRequest();
            xhr.onreadystatechange=function(){
                if(xhr.readyState==4){
                    if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                        if(xhr.responseText=="0") {
                            var username=document.getElementById("username");
                            if(username.innerHTML==game.userone){
                                alert(game.usertwo+" has quit the game!");
                            }
                            else{
                                alert(game.userone+" has quit the game!");
                            }
                            quitPlayerGame();
                        }
                        else{
                            var newgameborad=xhr.responseText.split(',');

                            var canvas=document.getElementById("myCanvas");
                            var ctx=canvas.getContext("2d");

                            var changedPos=changeGameBoard(newgameborad);
                            if(changedPos!=-1){

                                var row=0;
                                var column=0;
                                column=changedPos%3;
                                row=(changedPos-column)/3;


                                var centerx=canvas.width/6+column*canvas.width/3;
                                var centery=canvas.height/6+row*canvas.height/3;

                                ctx.strokeStyle="blue";
                                drawO(ctx,centerx,centery,function(){

                                    game.gameBoard[row*3+column]=game.playertwo.sign;

                                    if(game.gameState()==GOON){

                                        var playeroneDraw=function(event){
                                            var canvas=document.getElementById("myCanvas");
                                            canvas.removeEventListener("click",playeroneDraw,false);

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

                                            ctx.strokeStyle="red";
                                            drawX(ctx,x1,y1,x2,y2,x3,y3,x4,y4,function(){
                                                game.gameBoard[row*3+column]=game.playerone.sign;
                                                var xhr=new XMLHttpRequest();
                                                xhr.onreadystatechange=function(){
                                                    if(xhr.readyState==4){
                                                        if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                                                            if(xhr.responseText=="1"){
                                                                if(game.gameState()==GOON){
                                                                    setTimeout(secondHandler,1000);
                                                                }
                                                                else if(game.gameState()==WIN){
                                                                    alert(game.playerone.role+" wins the game!");
                                                                    game.lastWinner=game.playerone.role;

                                                                    newPlayerGame();
                                                                }
                                                                else if(game.gameState()==LOSE){
                                                                    alert(game.playerone.role+" loses the game!");
                                                                    game.lastWinner=game.playertwo.role;

                                                                    newPlayerGame();
                                                                }
                                                                else{
                                                                    alert("Tie!")
                                                                    game.lastWinner=game.playertwo.role;

                                                                    newPlayerGame();
                                                                }

                                                            }
                                                            else{
                                                                setTimeout(secondHandler,1000);
                                                            }

                                                        }
                                                        else{
                                                            xhr.open("post","../phppages/changeGameBoard.php",true);
                                                            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                                                            var poststr="gameBoard="+game.gameBoard.toString();
                                                            xhr.send(poststr);
                                                        }
                                                    }
                                                };
                                                xhr.open("post","../phppages/changeGameBoard.php",true);
                                                xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                                                var poststr="gameBoard="+game.gameBoard.toString();
                                                xhr.send(poststr);


                                            });



                                        };
                                        canvas.addEventListener('click',playeroneDraw,false)

                                    }
                                    else if(game.gameState()==WIN){
                                        alert(game.playerone.role+" wins the game!");
                                        game.lastWinner=game.playerone.role;

                                        newPlayerGame();
                                    }
                                    else if(game.gameState()==LOSE){
                                        alert(game.playerone.role+" loses the game!");
                                        game.lastWinner=game.playertwo.role;

                                        newPlayerGame();
                                    }
                                    else{
                                        alert("Tie!")
                                        game.lastWinner=game.playertwo.role;

                                        newPlayerGame();
                                    }


                                });


                            }
                            else{
                                setTimeout(secondHandler,1000);
                            }
                        }


                    }
                    else{
                        setTimeout(secondHandler,1000);
                    }
                }
            };
            xhr.open("post","../phppages/gameMessage.php",true);
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xhr.send(null);
        };

        var firstHandler=function(event){
            var canvas=document.getElementById("myCanvas");
            canvas.removeEventListener("click",firstHandler,false);
            var ctx=canvas.getContext("2d");

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

            ctx.strokeStyle="red";
            drawX(ctx,x1,y1,x2,y2,x3,y3,x4,y4,function(){

                game.gameBoard[row*3+column]=game.playerone.sign;
                var xhr=new XMLHttpRequest();
                xhr.onreadystatechange=function(){
                    if(xhr.readyState==4){
                        if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                            if(xhr.responseText=="1"){
                                setTimeout(secondHandler,1000);

                            }
                            else{
                                //setTimeout(secondHandler,1000);
                            }

                        }
                        else{
                            xhr.open("post","../phppages/changeGameBoard.php",true);
                            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                            var poststr="gameBoard="+game.gameBoard.toString();
                            xhr.send(poststr);
                        }
                    }
                };
                xhr.open("post","../phppages/changeGameBoard.php",true);
                xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                var poststr="gameBoard="+game.gameBoard.toString();
                xhr.send(poststr);
            });




        };
        var canvas=document.getElementById("myCanvas");

        canvas.addEventListener('click',firstHandler,false);
    }

    var inviteeControl= function(){
        game.isgameover=false;
        game.gameControls.playButton.style.display="none";
        game.gameControls.newButton.style.display="none";
        game.gameControls.quitButton.style.display="inline-block";
        game.gameControls.quitButton.addEventListener('click',quitPlayerGame,false);

        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4){
                if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                    if(xhr.responseText=="0") {
                        var username=document.getElementById("username");

                        if(username.innerHTML==game.userone){
                            alert(game.usertwo+" has quit the game!");
                        }
                        else{
                            alert(game.userone+" has quit the game!");
                        }
                        quitPlayerGame();

                    }
                    else{
                        var newgameborad=xhr.responseText.split(',');


                        var canvas=document.getElementById("myCanvas");
                        var ctx=canvas.getContext("2d");

                        var changedPos=changeGameBoard(newgameborad);
                        if(changedPos!=-1){
                            var row=0;
                            var column=0;
                            column=changedPos%3;
                            row=(changedPos-column)/3;

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

                            ctx.strokeStyle="red";
                            drawX(ctx,x1,y1,x2,y2,x3,y3,x4,y4,function(){

                                game.gameBoard[row*3+column]=game.playerone.sign;

                                if(game.gameState()==GOON){
                                    var playertwoDraw=function(event){
                                        var canvas=document.getElementById("myCanvas");
                                        canvas.removeEventListener("click",playertwoDraw,false);

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

                                        ctx.strokeStyle="blue";
                                        var centerx=canvas.width/6+column*canvas.width/3;
                                        var centery=canvas.height/6+row*canvas.height/3;


                                        drawO(ctx,centerx,centery,function(){

                                            game.gameBoard[row*3+column]=game.playertwo.sign;

                                            var xhr=new XMLHttpRequest();
                                            xhr.onreadystatechange=function(){
                                                if(xhr.readyState==4){
                                                    if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                                                        if(xhr.responseText=="1"){
                                                            if(game.gameState()==GOON){
                                                                setTimeout(inviteeControl,1000);
                                                            }
                                                            else if(game.gameState()==WIN){
                                                                alert(game.playerone.role+" wins the game!");

                                                                game.lastWinner=game.playerone.role;
                                                                newPlayerGame();


                                                            }
                                                            else if(game.gameState()==LOSE){
                                                                alert(game.playerone.role+" loses the game!");
                                                                game.lastWinner=game.playertwo.role;
                                                                newPlayerGame();
                                                            }
                                                            else{
                                                                game.lastWinner=game.playertwo.role;
                                                                alert("Tie!")
                                                                newPlayerGame();
                                                            }
                                                        }
                                                        else{
                                                            setTimeout(inviteeControl,1000);
                                                        }

                                                    }
                                                    else{
                                                        xhr.open("post","../phppages/changeGameBoard.php",true);
                                                        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                                                        var poststr="gameBoard="+game.gameBoard.toString();
                                                        xhr.send(poststr);
                                                    }
                                                }
                                            };
                                            xhr.open("post","../phppages/changeGameBoard.php",true);
                                            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                                            var poststr="gameBoard="+game.gameBoard.toString();
                                            xhr.send(poststr);

                                        });


                                    };
                                    canvas.addEventListener('click',playertwoDraw,false)

                                }
                                else if(game.gameState()==WIN){
                                    alert(game.playerone.role+" wins the game!");
                                    game.lastWinner=game.playerone.role;

                                    newPlayerGame();
                                }
                                else if(game.gameState()==LOSE){
                                    alert(game.playerone.role+" loses the game!");
                                    game.lastWinner=game.playertwo.role;
                                    newPlayerGame();
                                }
                                else{
                                    alert("Tie!");
                                    game.lastWinner=game.playertwo.role;
                                    newPlayerGame();
                                }
                            });


                        }
                        else{
                            setTimeout(inviteeControl,1000);
                        }
                    }


                }
                else{
                    xhr.open("post","../phppages/gameMessage.php",true);
                    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    xhr.send(null);
                }
            }
        };
        xhr.open("post","../phppages/gameMessage.php",true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.send(null);
    }


    var rowHandler=function(event){
        var inviterName=document.getElementById("username").innerHTML;
        var inviteeName=event.target.innerHTML;
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4){
                if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                    if(xhr.responseText=="1"){
                        game.userone=inviterName;
                        game.usertwo=inviteeName;
                        game.playerone.role=inviterName;
                        game.playertwo.role=inviteeName;
                        game.currentUser="inviter";

                        var canvas=document.getElementById("myCanvas");
                        drawGameBoard(canvas,function(){
                            game.gameControls.playButton.style.display="inline-block";
                            game.gameControls.playButton.addEventListener('click',inviterControl,false);
                        });
                    }
                    else{
                        alert("request falied! Try again,please!");
                        var tb=document.getElementById('onlineUser');
                        for(var row=1;row<tb.rows.length;row++){
                            tb.rows[row].cells[0].addEventListener("dblclick",rowHandler,false);
                        }
                    }

                }
                else{

                }
            }
        };
        xhr.open("post","../phppages/request.php",true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var poststr="playertwo="+event.target.innerHTML;
        xhr.send(poststr);

    };

    var onlineuserID;
    var onlineuserListener=function(){
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4){
                if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                  onlineuserID=setTimeout(onlineuserListener,4000);

                    document.getElementById("userList").innerHTML=xhr.responseText;
                    var tb=document.getElementById('onlineUser');
                    for(var row=1;row<tb.rows.length;row++){
                        tb.rows[row].cells[0].addEventListener("dblclick",rowHandler,false);
                    }

                }
                else{
                    xhr.open("post","../phppages/onlineUser.php",true);
                    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    xhr.send(null);
                }
            }
        };
        xhr.open("post","../phppages/onlineUser.php",true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.send(null);
    };
    onlineuserListener();


    var requestListener=function(){
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4){
                if((xhr.status>=200&&xhr.status<300)||xhr.status==304){

                    var result=xhr.responseText.split(",");
                    if(result[0]=="1"){
                        if(confirm("Do you accept Player:"+result[1]+" request ?")){
                            var inviterName=result[1];
                            var inviteeName=document.getElementById("username").innerHTML;
                            var xhr1=new XMLHttpRequest();
                            xhr1.onreadystatechange=function(){
                                if(xhr1.readyState==4){
                                    if((xhr1.status>=200&&xhr1.status<300)||xhr1.status==304){
                                        if(xhr1.responseText=="1"){
                                            clearInterval(requestListenerID) ;
                                            game.userone=inviterName;
                                            game.usertwo=inviteeName;
                                            game.playerone.role=inviterName;
                                            game.playertwo.role=inviteeName;
                                            game.currentUser="invitee";

                                            var canvas=document.getElementById("myCanvas");
                                            drawGameBoard(canvas,function(){
                                                game.gameControls.playButton.style.display="inline-block";
                                                game.gameControls.playButton.addEventListener('click',inviteeControl,false);
                                            });
                                        }
                                        else{
                                           alert("The inviter is not here!");
                                           //setTimeout(requestListener,2000);
                                        }

                                    }
                                    else{
                                        xhr1.open("post","../phppages/accept.php",true);
                                        xhr1.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                                        var poststr="playerone="+result[1];
                                        xhr1.send(poststr);
                                    }
                                }
                            };
                            xhr1.open("post","../phppages/accept.php",true);
                            xhr1.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                            var poststr="playerone="+result[1];
                            xhr1.send(poststr);

                        }
                        else{
                            //setTimeout(requestListener,2000);
                        }
                    }
                    else{
                        //setTimeout(requestListener,2000);
                    }
                }
                else{
                    xhr.open("post","../phppages/requestListener.php",true);
                    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    xhr.send(null);
                }
            }
        };
        xhr.open("post","../phppages/requestListener.php",true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.send(null);

    };
    var requestListenerID=setInterval(requestListener,1000);
};
withPlayerButton.addEventListener("click",withPlayer,false);



















