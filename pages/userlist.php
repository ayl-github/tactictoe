<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 12-5-2
 * Time: 上午11:32
 * To change this template use File | Settings | File Templates.
 */
    $dbusername="ayl";
    $password="tttAYL";
    $hostname="localhost";
    $database="tactictoe";
    $mysqli=new mysqli($hostname,$dbusername,$password,$database);
    if(mysqli_connect_errno()){
        echo "Connect failed!";
        exit();
    }
    session_start();
    $username=$_SESSION["username"];

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
?>