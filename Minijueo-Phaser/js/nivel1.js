import { nivel3 } from "./nivel3.js";
export class nivel1 extends Phaser.Scene{
    constructor(){
        super({key: 'nivel1'})       
    }    

    FloatBetween = Phaser.Math;
    Between = Phaser.Math;
    player;
    stars;
    bombs;
    platforms;
    cursors;
    score = 0;
    gameOver = false;
    scoreText;
    crevasse;
    finale;
    overlap1 = false;
    overlap2 = false;

    preload ()
    {   
        this.load.image('sky', 'assets/forest.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('background1', 'assets/background_layer_1.png')
        this.load.image('background2', 'assets/forest.png')
        this.load.image('final', 'assets/final.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('dude2', 'assets/dude2.png', { frameWidth: 32, frameHeight: 48 });
        this.load.audio('salto', 'assets/salto.wav');
    }

    create ()
    {
        this.physics.world.checkCollision.down = false;
    
        this.crevasse = this.add.zone(600, 3200, 3200, 600);
        this.physics.world.enable(this.crevasse, Phaser.Physics.Arcade.STATIC_BODY);
        //  A simple background for our game
        this.add.image(400, 300, 'sky').setScrollFactor(0, 0);
    
        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = this.physics.add.staticGroup(
            {classType: Phaser.Physics.Arcade.Image,
            defaultKey: 'ground'
        });
    
        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    
        //  Now let's create some ledges
        this.platforms.create(0, 300, 'ground'); 
        this.platforms.create(200, 500, 'ground');
        this.platforms.create(400, 150, 'ground');
        this.platforms.create(600, 350, 'ground');
        this.platforms.create(1000, 400, 'ground');
        this.platforms.create(1600, 250, 'ground');
        this.platforms.create(1400, 550, 'ground');
        this.platforms.create(1950, 500, 'ground');
        this.platforms.create(2200, 300, 'ground');
        this.platforms.create(2400, 550, 'ground');
        this.platforms.create(2700, 450, 'ground');
        this.platforms.create(2900, 300, 'ground');
        this.platforms.create(3000, 200, 'ground');
        
        let audio = this.sound.add('salto', {loop: false});
        this.input.keyboard.on('keydown_UP', () => {
            audio.play();});
    
        this.player2 = this.physics.add.sprite(50, 50, 'dude2');
        this.player2.setBounce(0.2);
        this.player2.setCollideWorldBounds(true);
        
        // The player and its settings
        this.player = this.physics.add.sprite(50, 50, 'dude')
    
        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
    
        this.cameras.main.setBounds(0, 0, 3200, 600, true, true, true, false);
        this.physics.world.setBounds(0, 0, 3200, 600, true, true, true, false)
        this.cameras.main.startFollow(this.player);
    
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
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    
    
        //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 5, stepX: 70 }
        });
        
        this.finale = this.physics.add.group({
            key: 'final',
            setXY: {x: 3000, y: 200}
        })

        this.stars.children.iterate(function (child) {
            //  Give each star a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
    
        this.bombs = this.physics.add.group();
    
        //  The score
        this.scoreText = this.add.text(16, 16, 'Puntuacion: 0', { fontSize: '32px', fill: '#FFFF' });
    
        //  Collide the player and the stars with the platforms
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.finale, this.platforms);
        this.physics.add.collider(this.player2, this.platforms);
    
        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
        this.physics.add.overlap(this.player, this.finale, this.endLevel, null, this);
           
        this.physics.add.overlap(this.player2, this.stars, this.collectStar, null, this);
        this.physics.add.collider(this.player2, this.bombs, this.hitBomb, null, this);
        this.physics.add.overlap(this.player2, this.finale, this.endLevel, null, this);
    }
    
    update ()
    {
        if (this.gameOver) {
            return;
        }

        if(this.overlap === true && this.overlap2 === true) {
            this.scene.start('nivel3');
        }
        
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
    
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
    
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
    
            this.player.anims.play('turn');
        }
    
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);            
        }
           
        if (this.keyA.isDown) {
            this.player2.setVelocityX(-160);
    
            this.player2.anims.play('A', true);
        } else if (this.keyD.isDown) {
            this.player2.setVelocityX(160);
    
            this.player2.anims.play('D', true);
        } else {
            this.player2.setVelocityX(0);
    
            this.player2.anims.play('W');
        }
    
        if (this.keyW.isDown && this.player2.body.touching.down) {
            this.player2.setVelocityY(-330);           
        }

    }
    
    collectStar (player, star)
    {
        star.disableBody(true, true);
    
        //  Add and update the score
        this.score += 1;
        this.scoreText.setText('Puntuacion: ' + score);
    
        if (this.stars.countActive(true) === 0)
        {
            //  A new batch of stars to collect
            this.stars.children.iterate(function (child) {
    
                child.enableBody(true, child.x, 0, true, true);
    
            });
    
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            
    
            var bomb = this.bombs.create(x, 16, 'bomb');
            this.bomb.setBounce(1);
            this.bomb.setCollideWorldBounds(true);
            this.bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            this.bomb.allowGravity = false;
    
        }
    }
    
    collectStar (player2, star)
    {
        star.disableBody(true, true);
    
        //  Add and update the score
        this.score += 1;
        this.scoreText.setText('Puntuacion: ' + this.score);
    
        if (this.stars.countActive(true) === 0)
        {
            //  A new batch of stars to collect
            this.stars.children.iterate(function (child) {
    
                child.enableBody(true, child.x, 0, true, true);
    
            });
    
        
            var x = (player2.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    
            var bomb = this.bombs.create(x, 16, 'bomb');
            this.bomb.setBounce(1);
            this.bomb.setCollideWorldBounds(true);
            this.bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            this.bomb.allowGravity = false;
    
        }
    }
    
    hitBomb (player2, bomb)
    {
        this.physics.pause();
        player2.setTint(0xff0000);
        player2.anims.play('turn');
     
        this.gameOver = true;
    }
    
    hitBomb (player, bomb)
    {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
     
        this.gameOver = true;
    }

    endLevel(x, final) {
        if(x === this.player) {
            this.overlap1 = true;
            this.player.disableBody(true, false);
        }else if(x === this.player2) {
            this.overlap2 = true;
            this.player.disableBody(true, false);
        }
    }
}