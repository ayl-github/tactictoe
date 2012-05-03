/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 12-4-7
 * Time: 下午3:24
 * To change this template use File | Settings | File Templates.
 */
var INFINITY=80;
var WIN=+INFINITY;
var LOSE=-INFINITY;
var GAMEPOINT=INFINITY/8;
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

    for(var pos=0;pos<9;pos++){
       if(gameBoard[pos]!='E') {
           isFull=false;
           break;
       }
    }
    for(var pos=0;pos<8; pos++){
        var firstChess=gameBoard[WIN_STATUS[pos][0]];
        var secondChess=gameBoard[WIN_STATUS[pos][1]];
        var thirdChess=gameBoard[WIN_STATUS[pos][2]];
        if(firstChess==secondChess&&firstChess==thirdChess&&firstChess!='E'){
            result= firstChess=='X' ? WIN : LOSE;
            return result;
        }
        if(firstChess==secondChess&&firstChess!='E'&&thirdChess=='E'){
            result+=(firstChess=='X'?GAMEPOINT:-GAMEPOINT);
        }
        if(firstChess==thirdChess&&firstChess!='E'&&secondChess=='E'){
            result+=(firstChess=='X'?GAMEPOINT:-GAMEPOINT);
        }
        if(secondChess==thirdChess&&secondChess!='E'&&firstChess=='E'){
            result+=(secondChess=='X'?GAMEPOINT:-GAMEPOINT);
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

    var bestValue=INFINITY;
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
    return Math.floor(Math.random()*choices+1);
}

function minimax(gameBoard,depth,turn){
    var bestMoves=new Array(9);
    var index=0;
    var bestValue=-INFINITY;
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
