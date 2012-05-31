<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Main Page</title>
    <link rel="stylesheet" href="../styles/mainPageStyle.css" type="text/css" >
    <link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
</head>

<body>
<section id="page">
    <section id="left">

        <section id="room">

            <section id="gameTitle">
                <p >Tic-Tac-Toe</p>
            </section>

            <section id="gameBoard">
                <canvas id="myCanvas" ></canvas>
            </section>

            <section id="gameControlBoard">
                <a id="newButton" class="controller" href="#">New</a>
                <a id="quitButton" class="controller" href="#">Quit</a>
            </section>

        </section>

    </section>


    <section id="right">

        <section id="currentUser">
            <?php
            session_start();
            $username=$_SESSION["username"];
            echo "<span id='username'> user name:".$username."</span>"
            ?>
        </section>

        <section id="close">
            <a id="closeButton" class="rightController" href="#">Close</a>
        </section>

        <section id="computer">
            <a id="withComputer" class="rightController second_button" href="#">V.S. Com</a>
        </section>

        <section id="player">
            <a id="withPlayer" class="rightController third_button" href="#">V.S. Hum</a>
        </section>

        <section id="userList">
        </section>

    </section>

    <section>

        <script src="../javascripts/game.js" type="text/javascript"></script>

</body>
</html>