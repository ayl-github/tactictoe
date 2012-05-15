<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 12-5-6
 * Time: 下午6:42
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

$query="select * from game where playerone='".$username."'"."or playertwo='".$username."'";
$result=$mysqli->query($query);
if($result->num_rows>0){
    $gameboard='E,E,E,E,E,E,E,E,E';
    $query="update game set gameboard='".$gameboard."' where playerone= '".$username."' or playertwo='".$username."'";
    $result=$mysqli->query($query);
    if($result){
        echo "1";
    }
    else{
        echo "0";
    }
}
else{
    echo "0";
}

$mysqli->close();

?>