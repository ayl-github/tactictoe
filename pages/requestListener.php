<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 12-5-2
 * Time: 下午10:31
 * To change this template use File | Settings | File Templates.
 */
    $dbusername="ayl";
    $dbpassword="tttAYL";
    $hostname="localhost";
    $database="tactictoe";
    $mysqli=new mysqli($hostname,$dbusername,$dbpassword,$database);
    if(mysqli_connect_errno()){
        echo "Connect failed!";
        exit();
    }
    session_start();
    $username=$_SESSION['username'];

    $query="select * from game where playertwo='".$username."' limit 1";

   if($result=$mysqli->query($query)){
       if($result->num_rows>0){
           $row=$result->fetch_assoc();
           echo "1,".$row['playerone'];
       }
       else{
           echo "0,0";
       }
    }
    else{
        echo "0,0";
    }
$mysqli->close();
?>