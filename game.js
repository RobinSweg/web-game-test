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
let bubbles; // Group for beers
let bombs;   // Group for bombs
const speed = 200;
let score = 0;
let scoreCounter;
let timeLeft = 30; // seconds
let timerText;
let timedEvent;

// ✅ NEW: use a different name for your client instance!
const SUPABASE_URL = "https://qifqauvkjaeaarmcpufd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZnFhdXZramFlYWFybWNwdWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1OTU2NTgsImV4cCI6MjA2NjE3MTY1OH0.gFWchzjxEM5AvTJYEAnpa0ItR0OEDhqSGzqAkD-2kxg";
const supaClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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

  timedEvent = this.time.addEvent({
    delay: 1000,
    callback: onEvent,
    callbackScope: this,
    loop: true
  });

  fish = this.physics.add.sprite(100, 300, 'fish');
  fish.setScale(0.1);
  fish.setCollideWorldBounds(true);

  bubbles = this.physics.add.group();
  bombs = this.physics.add.group();

  for (let i = 0; i < 4; i++) {
    spawnBubble.call(this);
    spawnBomb.call(this);
  }

  this.physics.add.overlap(fish, bubbles, collectBubble, null, this);
  this.physics.add.overlap(fish, bombs, hitBomb, null, this);
}

function update() {
  fish.body.setVelocityY(speed);

  if (this.input.activePointer.isDown) {
    fish.body.setVelocityY(-400);
  }

  Phaser.Actions.Call(bubbles.getChildren(), function (bubble) {
    if (bubble.x < -50) {
      bubble.destroy();
      spawnBubble.call(this);
    }
  }, this);

  Phaser.Actions.Call(bombs.getChildren(), function (bomb) {
    if (bomb.x < -50) {
      bomb.destroy();
      spawnBomb.call(this);
    }
  }, this);
}

function spawnBubble() {
  const x = Phaser.Math.Between(800, 1000);
  const y = Phaser.Math.Between(50, 550);
  const bubble = bubbles.create(x, y, "bubble");
  bubble.setScale(0.2);
  bubble.setVelocityX(-speed);
}

function spawnBomb() {
  const x = Phaser.Math.Between(800, 1000);
  const y = Phaser.Math.Between(50, 550);
  const bomb = bombs.create(x, y, "bomb");
  bomb.setScale(0.2);
  bomb.setVelocityX(-speed);
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
  const playerName = document.getElementById('playerName').value || 'Anonymous';
  if (timeLeft <= 0) {
    this.physics.pause();
    fish.setTint(0xff0000);
    timedEvent.remove();
    timerText.setText('Game Over');
    
    // ✅ Only save ONCE and then show leaderboard
    saveScore(playerName, score).then(() => {
      getLeaderboard().then(scores => {
        let leaderboardText = 'Leaderboard:\n';
        scores.forEach((row, i) => {
          leaderboardText += `${i + 1}. ${row.player}: ${row.score}\n`;
        });

        this.add.text(300, 200, leaderboardText, {
          fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
          fontSize: '28px',
          color: '#fff'
        });
      });
    });
  }
}

// ✅ Use the correct supaClient
async function saveScore(playerName, score) {
  const { data, error } = await supaClient
    .from('leaderboard')
    .insert([{ player: playerName, score: score }]);

  if (error) {
    console.error('Error saving score:', error);
  } else {
    console.log('Score saved:', data);
  }
}

async function getLeaderboard() {
  const { data, error } = await supaClient
    .from('leaderboard')
    .select()
    .order('score', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  return data;
}

function startGame() {
  document.getElementById('playerName').style.display = 'none';
  document.getElementById('startButton').style.display = 'none';

  new Phaser.Game(config);
}

document.getElementById('startButton').addEventListener('click', startGame);