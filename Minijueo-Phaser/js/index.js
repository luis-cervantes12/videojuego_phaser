import { nivel1 } from "./nivel1.js";
import { nivel3 } from "./nivel3.js";

var config = {
    type: Phaser.AUTO,
    //cameras: [{bounds: {x: 0, y: 0, width: 1200, height: 600} }],
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false,
            width: 3200,
            height: 600
        }
    },
    scene: [nivel1, nivel3]/*{
        preload: preload,
        create: create,
        update: update
    }*/
};

/*const { Between, FloatBetween } = Phaser.Math;
var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var crevasse;*/

var game = new Phaser.Game(config);


/*function preload ()
{
    this.load.image('sky', 'assets/forest.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('background1', 'assets/background_layer_1.png')
    this.load.image('background2', 'assets/forest.png')
    this.load.spritesheet('dude', 'assets/dude2.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('dude2', 'assets/marioSmall.png', { frameWidth: 34, frameHeight: 34 });
}

function create ()
{
    this.physics.world.checkCollision.down = false;

    crevasse = this.add.zone(600, 3200, 3200, 600);
    this.physics.world.enable(crevasse, Phaser.Physics.Arcade.STATIC_BODY);
    //  A simple background for our game
    this.add.image(400, 300, 'sky').setScrollFactor(0, 0);

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup(
        {classType: Phaser.Physics.Arcade.Image,
        defaultKey: 'ground'
    });

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)

    //  Now let's create some ledges
    platforms.create(0, 300, 'ground'); 
    platforms.create(200, 500, 'ground');
    platforms.create(400, 150, 'ground');
    platforms.create(600, 350, 'ground');
    platforms.create(1000, 400, 'ground');
    platforms.create(1600, 250, 'ground');
    platforms.create(1400, 550, 'ground');
    platforms.create(1950, 500, 'ground');
    platforms.create(2200, 300, 'ground');
    platforms.create(2400, 550, 'ground');
    platforms.create(2700, 450, 'ground');
    platforms.create(2900, 300, 'ground');
    platforms.create(3000, 200, 'ground');

    player2 = this.physics.add.sprite(50, 50, 'dude2');
    player2.setBounce(0.2);
    player2.setCollideWorldBounds(true);
    
    // The player and its settings
    player = this.physics.add.sprite(50, 50, 'dude')

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.cameras.main.setBounds(0, 0, 3200, 600, true, true, true, false);
    this.physics.world.setBounds(0, 0, 3200, 600, true, true, true, false)
    this.cameras.main.startFollow(player);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'A',
        frames: this.anims.generateFrameNumbers('dude2', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'W',
        frames: [ { key: 'dude2', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'D',
        frames: this.anims.generateFrameNumbers('dude2', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    }); 

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);


    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 5, stepX: 70 }
    });

    stars.children.iterate(function (child) {
        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, 'Puntuacion: 0', { fontSize: '32px', fill: '#FFFF' });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    this.physics.add.collider(player2, platforms);
    this.physics.add.overlap(player2, stars, collectStar, null, this);
    this.physics.add.collider(player2, bombs, hitBomb, null, this);
}

function update ()
{
    if (gameOver) {
        return;
    }
    
    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
        
    }
       
    if (keyA.isDown) {
        player2.setVelocityX(-160);

        player2.anims.play('A', true);
    } else if (keyD.isDown) {
        player2.setVelocityX(160);

        player2.anims.play('D', true);
    } else {
        player2.setVelocityX(0);

        player2.anims.play('W');
    }

    if (keyW.isDown && player2.body.touching.down) {
        player2.setVelocityY(-330);
        
    }
}

function collectStar (player, star)
{
    star.disableBody(true, true);

    //  Add and update the score
    score += 1;
    scoreText.setText('Puntuacion: ' + score);

    if (stars.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

function collectStar (player2, star)
{
    star.disableBody(true, true);

    //  Add and update the score
    score += 1;
    scoreText.setText('Puntuacion: ' + score);

    if (stars.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

    
        var x = (player2.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

function hitBomb (player2, bomb)
{
    this.physics.pause();
    player2.setTint(0xff0000);
    player2.anims.play('turn');
 
    gameOver = true;
}

function hitBomb (player, bomb)
{
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
 
    gameOver = true;
}
*/