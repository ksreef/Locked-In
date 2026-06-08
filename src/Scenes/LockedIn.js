class LockedIn extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 400;
        this.DRAG = 500;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 3;
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("Level-1", 18, 18, 45, 25);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");
        this.tileset2 = this.map.addTilesetImage("stone_packed", "tilemap_stone");
        this.tileset3 = this.map.addTilesetImage("industrial_tilemap_packed", "tilemap_industrial");
        this.tileset4 = this.map.addTilesetImage("food_tilemap_packed", "tilemap_food");
        this.tileset5 = this.map.addTilesetImage("farm_tilemap_packed", "tilemap_farm");

        // Create a layer
        this.firstKey = this.map.createLayer("key1", this.tileset, 0, 0);
        this.firstKeyHole = this.map.createLayer("keyhole1", this.tileset, 0, 0);
        this.pixelLayer = this.map.createLayer("Blocks", this.tileset2, 0, 0);
        this.groundLayer = this.map.createLayer("Pixel-packed", this.tileset, 0, 0);
        this.uncollidableindustrialLayer = this.map.createLayer("uncolliable industrial", this.tileset3, 0, 0);
        this.industrialLayer = this.map.createLayer("Industrial", this.tileset3, 0, 0);
        this.foodLayer = this.map.createLayer("Food", this.tileset4, 0, 0);
        this.farmLayer = this.map.createLayer("Farm", this.tileset5, 0, 0);
        this.uncollidableLayer = this.map.createLayer("uncollidable pixel-packed", this.tileset, 0, 0);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.pixelLayer.setCollisionByProperty({
            collides: true
        });

        this.industrialLayer.setCollisionByProperty({
            collides: true
        });

        this.foodLayer.setCollisionByProperty({
            collides: true
        });

        this.farmLayer.setCollisionByProperty({
            collides: true
        });

        this.firstKeyHole.setCollisionByProperty({
            collides: true
        });

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(30, 200, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.pixelLayer);
        this.physics.add.collider(my.sprite.player, this.industrialLayer);
        this.physics.add.collider(my.sprite.player, this.foodLayer);
        this.physics.add.collider(my.sprite.player, this.farmLayer);

        
        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // TODO: Add movement vfx here
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            // TODO: Try: add random: true
            scale: {start: 0.03, end: 0.1},
            // TODO: Try: maxAliveParticles: 8,
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.walking.stop();
        

        // TODO: add camera code here
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);



        //first room Key 
        this.hasKey = false;

        this.physics.add.overlap(my.sprite.player, this.firstKey, (player, tile) => {
            if (tile.index !== -1) {
                this.hasKey = true;
                this.firstKey.removeTileAt(tile.x, tile.y);
            }
        }, null, this);

        this.physics.add.collider(my.sprite.player, this.firstKeyHole, (player, tile) => {
            if (this.hasKey && tile.index !== -1) {
                tile.setCollision(false);
                this.firstKeyHole.removeTileAt(tile.x, tile.y);
            }
        }, null, this);

        

    }

    update() {
        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }

        } else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, -my.sprite.player.displayWidth/2+10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(-this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            // TODO: have the vfx stop playing
            my.vfx.walking.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }



        //first room key
       
    }
}

 