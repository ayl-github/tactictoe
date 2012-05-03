<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 12-5-3
 * Time: 下午6:34
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
$playerone=$_POST['playerone'];
$playertwo=$_SESSION['username'];

$query="update game set isready='1' where playerone='".$playerone."'"."and playertwo='".$playertwo."'";
$result=$mysqli->query($query);
if($result){
    echo "1";
}
else{
    echo "0";
}

?>
