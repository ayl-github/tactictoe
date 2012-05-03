/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 12-5-2
 * Time: 上午10:55
 * To change this template use File | Settings | File Templates.
 */

    var rowHandler=function(event){
        var username=event.target.innerHTML;
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4){
                if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                    if(xhr.responseText=="1"){
                        //alert("request succeeded!");
                        var canvas=document.getElementById("myCanvas");
                        drawGameBoard(canvas);
                    }
                    else{
                        alert("request failed");
                    }

                }
                else{
                    alert("request failed");
                }
            }
        };
        xhr.open("post","../pages/request.php",true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var poststr="playertwo="+event.target.innerHTML;
        xhr.send(poststr);

    };
    var tb=document.getElementById('onlineuser');
    var row;
    for(row=1;row<tb.rows.length;row++){

        tb.rows[row].cells[0].addEventListener("dblclick",rowHandler,false);
    }


    var onlineuserListener=function(){
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4){
                if((xhr.status>=200&&xhr.status<300)||xhr.status==304){

                    document.getElementById("player").innerHTML=xhr.responseText;
                    tb=document.getElementById('onlineuser');
                    for(row=1;row<tb.rows.length;row++){
                        tb.rows[row].cells[0].addEventListener("dblclick",rowHandler,false);
                    }
                    setTimeout(onlineuserListener,5000);
                }
                else{

                }
            }
        };
        xhr.open("post","../pages/userList.php",true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.send(null);
    };
    setTimeout(onlineuserListener,5000);

    var requestListener=function(){
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4){
                if((xhr.status>=200&&xhr.status<300)||xhr.status==304){

                    var result=xhr.responseText.split(",");
                    if(result[0]=="1"){
                        if(confirm("Do you accept Player:"+result[1]+" request ?")){
                            var xhr1=new XMLHttpRequest();
                            xhr1.onreadystatechange=function(){
                                if(xhr1.readyState==4){
                                    if((xhr1.status>=200&&xhr1.status<300)||xhr1.status==304){
                                        if(xhr1.responseText="1"){

                                        }

                                    }
                                    else{

                                    }
                                }
                            };
                            xhr1.open("post","../pages/accept.php",true);
                            xhr1.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                            var poststr="playerone="+result[1];
                            xhr1.send(poststr);
                        }
                        else{
                            setTimeout(requestListener,1000);
                        }
                    }
                    else{
                        setTimeout(requestListener,1000);
                    }
                }
                else{

                }
            }
        };
        xhr.open("post","../pages/requestListener.php",true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.send(null);

    };

  setTimeout(requestListener,1000);



