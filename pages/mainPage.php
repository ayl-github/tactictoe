<?php
    session_start();
    $_SESSION['username']="aaa";
    $username=$_SESSION['username'];
    $dbusername="ayl";
    $password="tttAYL";
    $hostname="localhost";
    $database="tactictoe";
    $mysqli=new mysqli($hostname,$dbusername,$password,$database);
    if(mysqli_connect_errno()){
        echo "Connect failed!";
        exit();
    }
?>

<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<title>Main Page</title>
<link rel="stylesheet" href="../styles/mainPageStyle.css" type="text/css" >
</head>

<body>

<section id="page">
  <section id="left">
  
    <section id="room">
      <section id="gameTitle">
          <p>Tac-Tic-Toe</p>
      </section>
      <section id="gameBoard">
        <canvas id="myCanvas" ></canvas>
      </section>
      
      <section id="gameControlBoard">

      </section>   
    </section>
    
    <section id="information">
    </section>
    
  </section>
  
  
  <section id="right">
    <section id="close">
    </section>
    <section id="computer">
     <button id="withComputer">PlayWithPC</button>
    </section>
    <section id="player">
       <?php

        $query="select * from online  ";
        echo "<table id='onlineuser'> <tr><th>online user</th></tr>";
        if( $result=$mysqli->query($query)){
            while($row=$result->fetch_assoc()){
                if($row["username"]!=$username){
                    echo"<tr><td>".$row["username"]."</td></tr>";
                }
            }
        }
        echo "</table>" ;
        $mysqli->close();
        //echo "<script>alert('php');</script>";
        ?>
    </section>
  </section>
  
  
</section>

<script src="../javascripts/withComputer.js" type="text/javascript"></script>
<script src="../javascripts/withPlayer.js" type="text/javascript"></script>
</body>
</html>
