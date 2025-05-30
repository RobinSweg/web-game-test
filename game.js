const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#1e1e1e",
    physics: {
      default: "arcade",
      arcade: {
        debug: false
      }
    },
    scene: {
      create,
      update
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
  };
  
  let box;
  let keys;
  
  function create() {
    box = this.add.rectangle(400, 300, 50, 50, 0xff0000);
    this.physics.add.existing(box);
    box.body.setCollideWorldBounds(true);
  
    //keys = this.input.keyboard.addKeys("W,A,S,D");
  }
  
  function update() {
    const speed = 200;
    box.body.setVelocityY(speed);
    // Go up on press
    if (this.input.activePointer.isDown) {
        box.body.setVelocityY(-400);
      }
  }
  
  new Phaser.Game(config);
  