const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "0f5e9c",
    physics: {
      default: "arcade",
      arcade: {
        debug: false
      }
    },
    scene: {
      preload,
      create,
      update
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
  };
  
  let fish;
  let keys;
  let bubble;
  const speed = 200;
  let score = 0;
  let scoreCounter;

  function preload() {
    this.load.image('fish', 'assets/fish_green.png');
    this.load.image("bubble", "assets/bubble_a.png");
  }


  function create() {
    score = 0;
    scoreCounter = this.add.text(300, 0, score, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });


    fish = this.physics.add.sprite(100, 300, 'fish');
    this.physics.add.existing(fish);
    fish.body.setCollideWorldBounds(true);

    bubble = this.physics.add.sprite(700, 400, "bubble");
    this.physics.add.existing(bubble);
    //bubble.body.setCollideWorldBounds(true);
    
    bubble.body.setVelocityX(-speed);
    //keys = this.input.keyboard.addKeys("W,A,S,D");
  }
  
  function update() {
    
    fish.body.setVelocityY(speed);
    // Go up on press
    if (this.input.activePointer.isDown) {
        fish.body.setVelocityY(-400);
      }
    updatebubble();
    
    this.physics.collide(bubble, fish, collisionCallback);

  }
  

  function updatebubble(){
    if (bubble.x < 0) {
        bubble.x = 830;
        bubble.y =  Math.random() * (config.height - bubble.height);
        console.log(bubble.x, bubble.y, bubble.height);
    }
  }

  function collisionCallback(){
    console.log("collision detected");
    
    bubble.x = 830;
        bubble.y =  Math.random() * (config.height - bubble.height);
        console.log(bubble.x, bubble.y, bubble.height);
    bubble.setVelocityX(-speed);
    bubble.setVelocityY(0);

    fish.setVelocityX(0);
    fish.setVelocityY(0);
    fish.x = 100;

    score += 1;
    scoreCounter.setText(score);
  }

  new Phaser.Game(config);
  