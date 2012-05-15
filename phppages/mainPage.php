

<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Main Page</title>
<link rel="stylesheet" href="../styles/mainPageStyle.css" type="text/css" >
</head>

<body>

<section id="page">
  <section id="left">
  
    <section id="room">
      <section id="gameTitle">
          <p>Tic-Tac-Toe</p>
      </section>
      <section id="gameBoard">
        <canvas id="myCanvas" ></canvas>
      </section>
      
      <section id="gameControlBoard">

          <button id="playButton">Play</button>
          <button id="newButton">New</button>
          <button id="quitButton">Quit</button>

      </section>   
    </section>
    
    <section id="information">
    </section>
    
  </section>
  
  
  <section id="right">

    <section id="currentUser">
        <?php
        session_start();
        $username=$_SESSION["username"];
        echo "<p id='username'>".$username."</p>"
        ?>
    </section>

    <section id="close">
    </section>

    <section id="computer">
     <button id="withComputer">WithComputer</button>
    </section>

    <section id="player">
        <button id="withPlayer">WithPlayer</button>
    </section>

    <section id="userList">
    </section>

  </section>
  
  
</section>

<script src="../javascripts/game.js" type="text/javascript"></script>

</body>
</html>
