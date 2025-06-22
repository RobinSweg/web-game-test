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
  mode: Phaser.Scale.RESIZE,
  autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

let fish;
let bubbles; // Group for beers
let bombs;   // Group for bombs
const speed = 200;
let score = 0;
let scoreCounter;
let timeLeft = 30; // e.g. 30 seconds
let timerText;
let timedEvent;


function preload() {
  this.load.image('fish', 'assets/rohan.png');
  this.load.image('bubble', 'assets/beer.png');
  this.load.image('bomb', 'assets/bomb.png');
}

function create() {
  score = 0;
  scoreCounter = this.add.text(300, 0, score, {
    fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
    fontSize: '32px',
    color: '#fff'
  });


  timerText = this.add.text(500, 0, 'Time: ' + timeLeft, {
    fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
    fontSize: '32px',
    color: '#fff'
  });

  let fsButton = this.add.text(700, 20, '🔳', { fontSize: '32px', fill: '#fff' })
  .setInteractive()
  .on('pointerup', () => {
    if (!this.scale.isFullscreen) {
      this.scale.startFullscreen();
    } else {
      this.scale.stopFullscreen();
    }
  });

  // Create a timed event that calls `onEvent` every second:
  timedEvent = this.time.addEvent({
    delay: 1000,       // 1000 ms = 1 second
    callback: onEvent,
    callbackScope: this,
    loop: true
  });

  fish = this.physics.add.sprite(100, 300, 'fish');
  fish.setScale(0.1);
  fish.setCollideWorldBounds(true);

  // Create Groups
  bubbles = this.physics.add.group();
  bombs = this.physics.add.group();

  // Spawn initial bubbles & bombs
  for (let i = 0; i < 4; i++) {
    spawnBubble.call(this);
    spawnBomb.call(this);
  }

  // Add overlaps
  this.physics.add.overlap(fish, bubbles, collectBubble, null, this);
  this.physics.add.overlap(fish, bombs, hitBomb, null, this);
}

function update() {
  // Gravity-like falling
  fish.body.setVelocityY(speed);

  // Flap up on click/tap
  if (this.input.activePointer.isDown) {
    fish.body.setVelocityY(-400);
  }

  // Recycle bubbles that go off screen
  Phaser.Actions.Call(bubbles.getChildren(), function(bubble) {
    if (bubble.x < -50) {
      bubble.destroy();
      spawnBubble.call(this);
    }
  }, this);

  // Recycle bombs that go off screen
  Phaser.Actions.Call(bombs.getChildren(), function(bomb) {
    if (bomb.x < -50) {
      bomb.destroy();
      spawnBomb.call(this);
    }
  }, this);
}

function spawnBomb() {
  const x = Phaser.Math.Between(this.scale.width, this.scale.width + 200);
  const y = Phaser.Math.Between(50, this.scale.height - 50);
  const bomb = bombs.create(x, y, "bomb");
  bomb.setScale(0.2);
  bomb.setVelocityX(-speed);
}

function spawnBubble() {
  const x = Phaser.Math.Between(this.scale.width, this.scale.width + 200);
  const y = Phaser.Math.Between(50, this.scale.height - 50);
  const bubble = bubbles.create(x, y, "bubble");
  bubble.setScale(0.2);
  bubble.setVelocityX(-speed);
}

function collectBubble(fish, bubble) {
  bubble.destroy();
  spawnBubble.call(this);
  score += 1;
  scoreCounter.setText(score);
}

function hitBomb(fish, bomb) {
  bomb.destroy();
  spawnBomb.call(this);
  score -= 2;
  if (score < 0) score = 0;
  scoreCounter.setText(score);
}

function onEvent() {
  timeLeft -= 1;
  timerText.setText('Time: ' + timeLeft);

  if (timeLeft <= 0) {
    this.physics.pause(); // stop physics
    fish.setTint(0xff0000); // optional: tint the player red
    timedEvent.remove(); // stop the timer event
    timerText.setText('Game Over');
  }
}

new Phaser.Game(config);
