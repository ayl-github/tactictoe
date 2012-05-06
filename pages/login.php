<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 12-5-6
 * Time: 上午11:55
 * To change this template use File | Settings | File Templates.
 */
session_start();
$dbusername="ayl";
$dbpassword="tttAYL";
$hostname="localhost";
$database="tactictoe";
$mysqli=new mysqli($hostname,$dbusername,$dbpassword,$database);

$username=$_POST['username'];
$password=$_POST['password'];

$query="select * from user where username='".$username."'and password = '".$password."'" ;
$result=$mysqli->query($query);
if (!$result) {
    echo  "<script>window.location.href='../login.html'</script>";
}
if ($result->num_rows>0) {
    $_SESSION['username']=$username;
    echo  "<script>window.location.href='mainPage.html'</script>";
}
else {
    echo  "<script>window.location.href='../login.html'</script>";
}
$mysqli->close();
?>