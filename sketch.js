var PLAY = 1;
var END = 0;
var gameState = PLAY;

var backGround, backGround2, backGroundImg1, backGroundImg2, backGroundImg3, backGroundImg4, randBg;
var pumpkin_boy, pumpkin_boy_running, pumpkin_boy_jumping, pumpkin_boy_collided, pumpkin_boy_dead;
var invisibleGround;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;

var score;
var gameOverImg,restartImg;

function preload(){
  pumpkin_boy_running = loadAnimation("Run (1).png","Run (2).png","Run (3).png","Run (4).png","Run (5).png","Run (6).png","Run (7).png","Run (8).png");
  pumpkin_boy_jumping = loadAnimation("Jump (1).png","Jump (2).png","Jump (3).png","Jump (4).png","Jump (5).png","Jump (6).png","Jump (7).png","Jump (8).png","Jump (9).png","Jump (10).png");
  pumpkin_boy_dead = loadAnimation("Dead (10).png");
  pumpkin_boy_collided = loadAnimation("Dead (1).png","Dead (2).png","Dead (3).png","Dead (4).png","Dead (5).png","Dead (6).png","Dead (7).png","Dead (8).png","Dead (9).png","Dead (10).png");
  
  backGroundImg1 = loadAnimation("1_game_background.png");
  backGroundImg2 = loadAnimation("2_game_background.png");
  backGroundImg3 = loadAnimation("3_game_background.png");
  backGroundImg4 = loadAnimation("4_game_background.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  
  restartImg = loadImage("restartButton.jpg");
  gameOverImg = loadImage("gameOver.png");
  
}

function setup() {
  createCanvas(600, 338);
  
  backGround = createSprite(300,169);
  backGround.addAnimation("ground11",backGroundImg1);
  backGround.addAnimation("ground22",backGroundImg2);
  backGround.addAnimation("ground33",backGroundImg3);
  backGround.addAnimation("ground44",backGroundImg4);
  backGround2 = createSprite(900,169);
  backGround2.addAnimation("ground1",backGroundImg1);
  backGround2.addAnimation("ground2",backGroundImg2);
  backGround2.addAnimation("ground3",backGroundImg3);
  backGround2.addAnimation("ground4",backGroundImg4);

  pumpkin_boy = createSprite(50,260);
  pumpkin_boy.addAnimation("running", pumpkin_boy_running);
  pumpkin_boy.addAnimation("jumping", pumpkin_boy_jumping)
  pumpkin_boy.addAnimation("collided", pumpkin_boy_collided);
  pumpkin_boy.addAnimation("dead", pumpkin_boy_dead);
  pumpkin_boy.scale = 0.1;
  
  gameOver = createSprite(300,140);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,220);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(300,310,600,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  score = 0;
}

function draw() {
  background(220);
  
  //stop pumpkin_boy from falling down
  pumpkin_boy.collide(invisibleGround);
  
  //add gravity
  pumpkin_boy.velocityY = pumpkin_boy.velocityY + 0.8
  
  if(gameState === PLAY){
    
    //it gives velocity to background
      backGround.velocityX = -3;
      backGround2.velocityX = -3;
      
      //it creates infinite background
      if (backGround.x<-300){
        backGround.x = 897;
      }
      if (backGround2.x<-300){
        backGround2.x = 897;
      }

    gameOver.visible = false;
    restart.visible = false;
    
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    //jump when the space key is pressed
    if(keyDown("space")&& pumpkin_boy.y > 260) {
      pumpkin_boy.velocityY = -15;
    }
    
    if(pumpkin_boy.y > 266){
      pumpkin_boy.changeAnimation("running",pumpkin_boy_running);
    } else {
      pumpkin_boy.changeAnimation("jumping",pumpkin_boy_jumping);
    }
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(pumpkin_boy)){
      pumpkin_boy.changeAnimation("collided", pumpkin_boy_collided);
      
      gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
     
    //change the pumpkin_boy animation
    pumpkin_boy.changeAnimation("dead", pumpkin_boy_dead);
    
    backGround.velocityX = 0;
    backGround2.velocityX = 0;
    pumpkin_boy.velocityY = 0;
      
     
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0); 
    
    if(mousePressedOver(restart)) {
      reset();
    } 
   }
  
  drawSprites();
  
  //displaying score
  text("Score: "+ score, 500,50);
  
}

function reset(){
  obstaclesGroup.destroyEach();
  gameState = PLAY;
  score = 0;
  
  randBg = Math.round(random(1,4));
    switch(randBg) {
      case 1: backGround.changeAnimation("ground11",backGroundImg1);
        backGround2.changeAnimation("ground1",backGroundImg1);
              break;
      case 2: backGround.changeAnimation("ground22",backGroundImg2);
        backGround2.changeAnimation("ground2",backGroundImg2);
              break;
      case 3: backGround.changeAnimation("ground33",backGroundImg3);
        backGround2.changeAnimation("ground3",backGroundImg3);
              break;
      case 4: backGround.changeAnimation("ground44",backGroundImg4);
        backGround2.changeAnimation("ground4",backGroundImg4);
              break;
      default: break;
   }
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,300,10,40);
   obstacle.velocityX = -(6 + score/100);
   var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
         obstacle.scale = 0.8;
              break;
      case 2: obstacle.addImage(obstacle2);
         obstacle.scale = 0.1;
              break;
      case 3: obstacle.addImage(obstacle3);
         obstacle.scale = 0.15;
              break;
      case 4: obstacle.addImage(obstacle4);
         obstacle.scale = 0.15;
              break;
      default: break;
    }
   
   //assign scale and lifetime to the obstacle           
   obstacle.lifetime = 300;
   
  //add each obstacle to the group
   obstaclesGroup.add(obstacle);
 }
}