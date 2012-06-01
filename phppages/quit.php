<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 12-5-31
 * Time: 下午10:00
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
$query="delete from online where username='".$username."'";
$result=$mysqli->query($query);
if($result){
    echo '1';
}
else{
    echo '0';
}
$mysqli->close();

?>