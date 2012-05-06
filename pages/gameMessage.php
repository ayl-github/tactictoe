<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 12-5-4
 * Time: 上午11:46
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

$query="select gameboard from game where playerone='".$username."' or playertwo='".$username."'";
if($result=$mysqli->query($query)){
    $gameboard=$result->fetch_assoc();
    echo $gameboard['gameboard'];
}
$mysqli->close();
?>