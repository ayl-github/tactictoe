<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 12-5-11
 * Time: 下午9:33
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
$query="delete from game  where playerone= '".$username."' or playertwo='".$username."'";
$result=$mysqli->query($query);
if(!$result){
    echo "0";
}
else{
    $query="update online set status='0' where username='".$username."'";
    $result=$mysqli->query($query);

    if($result){
        $username=$_POST['otherUserName'];
        $query="update online set status='0' where username='".$username."'";
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
}

$mysqli->close();
?>