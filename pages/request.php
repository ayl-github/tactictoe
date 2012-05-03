<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 12-5-2
 * Time: 下午8:18
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
    $playerone=$_SESSION['username'];
    $playertwo=$_POST['playertwo'];
    $isready='0';
    $gameboard='EEEEEEEEE';


    $query="select status from online where username='".$playerone."'";
    if($result=$mysqli->query($query)){
        if($result->num_rows>0){
            $status=$result->fetch_assoc();
            if($status["status"]=="1"){
                echo "0";
            }
        }
        else{
            echo "0";
        }


    }


    $query="select status from online where username='".$playertwo."'";
    if($result=$mysqli->query($query)){
        if($result->num_rows>0){
            $status=$result->fetch_assoc();
            if($status["status"]=="1"){
                echo "0";
            }
            else{
                $prequery="update online set status='1' where username=?";
                $stmt=$mysqli->prepare($prequery);
                $stmt->bind_param("s",$playertwo);
                $stmt->execute();

                $prequery="update online set status='1' where username=?";
                $stmt=$mysqli->prepare($prequery);
                $stmt->bind_param("s",$playerone);
                $stmt->execute();



                $prequery="insert into game(playerone,playertwo,isready,gameboard) values(?,?,?,?)";
                $stmt=$mysqli->prepare($prequery);
                $stmt->bind_param("ssss",$playerone,$playertwo,$isready,$gameboard);
                $stmt->execute();

                sleep(5);

                $query="select isready from game where playerone='".$playerone."'and playertwo='".$playertwo."'";
                $result=$mysqli->query($query);
                $isready=$result->fetch_assoc();
                if($isready["isready"]=="1"){
                    echo "1";
                }
                else{
                    $prequery="update online set status='0' where username=?";
                    $stmt=$mysqli->prepare($prequery);
                    $stmt->bind_param("s",$playertwo);
                    $stmt->execute();

                    $prequery="update online set status='0' where username=?";
                    $stmt=$mysqli->prepare($prequery);
                    $stmt->bind_param("s",$playerone);
                    $stmt->execute();

                    $prequery="delete from game where playerone=? and playertwo=?";
                    $stmt=$mysqli->prepare($prequery);
                    $stmt->bind_param("ss",$playerone,$playertwo);
                    $stmt->execute();
                    echo "0";
                }
            }
        }
        else{
            echo "0";
        }
    }
    else{
        echo "0";
    }


?>