class LockedIn extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        this.ACCELERATION = 300;
        this.DRAG = 1000;
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -500;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.5;
    }

    preload() {
        //audio
        this.load.audio("enemyClose", "assets/thrusterFire_002.ogg");
        this.load.audio("jumpScare", "assets/spaceEngineLarge_002.ogg");

        //puzzle 3 kenny
        this.load.image("monster1", "assets/tile_0341.png");
        this.load.image("monster2", "assets/tile_0361.png");    
        this.load.image("monster3", "assets/tile_0381.png");
        this.load.image("avatar", "assets/tile_0100.png");
    }


    create() {
        this.pKey = this.input.keyboard.addKey('P');

        this.map = this.add.tilemap("Level-1", 18, 18, 100, 30);

        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");
        this.tileset2 = this.map.addTilesetImage("stone_packed", "tilemap_stone");
        this.tileset3 = this.map.addTilesetImage("industrial_tilemap_packed", "tilemap_industrial");
        this.tileset4 = this.map.addTilesetImage("food_tilemap_packed", "tilemap_food");
        this.tileset5 = this.map.addTilesetImage("farm_tilemap_packed", "tilemap_farm");

        this.pixelLayer = this.map.createLayer("Blocks", this.tileset2, 0, 0);
        this.groundLayer = this.map.createLayer("Pixel-packed", this.tileset, 0, 0);
        this.uncollidableindustrialLayer = this.map.createLayer("uncolliable industrial", this.tileset3, 0, 0);
        this.industrialLayer = this.map.createLayer("Industrial", this.tileset3, 0, 0);
        this.foodLayer = this.map.createLayer("Food", this.tileset4, 0, 0);
        this.farmLayer = this.map.createLayer("Farm", this.tileset5, 0, 0);
        this.uncollidableLayer = this.map.createLayer("uncollidable pixel-packed", this.tileset, 0, 0);
        this.uncollidablefarmLayers = this.map.createLayer("uncollidable farm", this.tileset5, 0, 0);
        this.firstInfoPad = this.map.createLayer("infopad1", this.tileset3, 0, 0);

        // key layers
        this.firstKey = this.map.createLayer("key1", this.tileset, 0, 0);
        this.firstKeyHole = this.map.createLayer("keyhole1", this.tileset, 0, 0);

        // first puzzle
        this.firstRespawnPad = this.map.createLayer("respawnpad1", this.tileset5, 0, 0);
        this.firstPuzzleKey1 = this.map.createLayer("key-1", this.tileset, 0, 0);
        this.firstPuzzleKey2 = this.map.createLayer("key-2", this.tileset, 0, 0);
        this.firstPuzzleKey3 = this.map.createLayer("key-3", this.tileset, 0, 0);
        this.firstGate = this.map.createLayer("gate1", this.tileset5, 0, 0);

        //third puzzle
        this.thirdPuzzleBegin = this.map.createLayer("ThirdPuzzleStart", this.tileset3, 0, 0);
        this.thirdPuzzleBegin.setCollisionByExclusion([-1]);
        this.lastRespawnPad = this.map.createLayer("respawnPad2", this.tileset3, 0, 0);

        // collision
        this.groundLayer.setCollisionByProperty({ collides: true });
        this.pixelLayer.setCollisionByProperty({ collides: true });
        this.industrialLayer.setCollisionByProperty({ collides: true });
        this.foodLayer.setCollisionByProperty({ collides: true });
        this.farmLayer.setCollisionByProperty({ collides: true });
        this.firstKeyHole.setCollisionByProperty({ collides: true });
        this.firstGate.setCollisionByProperty({ collides: true });
        this.firstRespawnPad.setCollisionByProperty({ collides: true });
        this.lastRespawnPad.setCollisionByProperty({ collides: true });

        // one way platforms
        const setupOneWay = (layer) => {
            layer.forEachTile(tile => {
                if (tile.properties && tile.properties.oneWay) {
                    tile.setCollision(false, false, true, false);
                }
            });
        };

        setupOneWay(this.groundLayer);
        setupOneWay(this.pixelLayer);
        setupOneWay(this.industrialLayer);
        setupOneWay(this.foodLayer);
        setupOneWay(this.farmLayer);

        const oneWayCallback = (player, tile) => {
            if (tile.properties && tile.properties.oneWay) {
                return player.body.prev.y + player.body.height <= tile.pixelY + tile.height;
            }
            return true;
        };

        // player
        my.sprite.player = this.physics.add.sprite(30, 200, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        my.sprite.player.setCollideWorldBounds(true);

        // tile colliders
        this.physics.add.collider(my.sprite.player, this.groundLayer, null, oneWayCallback, this);
        this.physics.add.collider(my.sprite.player, this.pixelLayer, null, oneWayCallback, this);
        this.physics.add.collider(my.sprite.player, this.industrialLayer, null, oneWayCallback, this);
        this.physics.add.collider(my.sprite.player, this.foodLayer, null, oneWayCallback, this);
        this.physics.add.collider(my.sprite.player, this.farmLayer, null, oneWayCallback, this);
        this.physics.add.collider(my.sprite.player, this.firstGate);
        this.physics.add.collider(my.sprite.player, this.firstRespawnPad);
        this.physics.add.collider(my.sprite.player, this.lastRespawnPad);

        this.uncollidableLayer.setCollision([]);
        this.uncollidablefarmLayers.setCollision([]);
        this.uncollidableindustrialLayer.setCollision([]);

        // input
        cursors = this.input.keyboard.createCursorKeys();
        this.rKey = this.input.keyboard.addKey('R');
        this.hKey = this.input.keyboard.addKey('H');
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true;
            this.physics.world.debugGraphic.clear();
        }, this);

        // particles
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: 0,
            scale: { start: 0.03, end: 0.1 },
            lifespan: 350,
            alpha: { start: 1, end: 0.1 },
        });
        my.vfx.walking.stop();

        // camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        // info pad text
        this.infoPadText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            '"The shortest, the tallest, then a fake."',
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                color: '#ffffff',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 3.8,
            }
        ).setOrigin(0.5, 0.5).setScrollFactor(0).setVisible(false);

        this.onInfoPad = false;

        // first room key
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

        // first puzzle
        this.puzzleKeyOrder = [];
        this.puzzleComplete = false;
        this.puzzleKeyPositions = {};

        const storeKeyPositions = (layer, keyName) => {
            this.puzzleKeyPositions[keyName] = [];
            layer.forEachTile(tile => {
                if (tile.index !== -1) {
                    this.puzzleKeyPositions[keyName].push({ x: tile.x, y: tile.y, index: tile.index });
                }
            });
        };

        storeKeyPositions(this.firstPuzzleKey1, 'key1');
        storeKeyPositions(this.firstPuzzleKey2, 'key2');
        storeKeyPositions(this.firstPuzzleKey3, 'key3');

        this.physics.add.overlap(my.sprite.player, this.firstPuzzleKey1, (player, tile) => {
            if (tile.index !== -1 && !this.puzzleComplete) {
                this.puzzleKeyOrder.push(1);
                this.firstPuzzleKey1.removeTileAt(tile.x, tile.y);
                this.checkPuzzleState();
            }
        }, null, this);

        this.physics.add.overlap(my.sprite.player, this.firstPuzzleKey2, (player, tile) => {
            if (tile.index !== -1 && !this.puzzleComplete) {
                this.puzzleKeyOrder.push(2);
                this.firstPuzzleKey2.removeTileAt(tile.x, tile.y);
                this.checkPuzzleState();
            }
        }, null, this);

        this.physics.add.overlap(my.sprite.player, this.firstPuzzleKey3, (player, tile) => {
            if (tile.index !== -1 && !this.puzzleComplete) {
                this.puzzleKeyOrder.push(3);
                this.firstPuzzleKey3.removeTileAt(tile.x, tile.y);
                this.checkPuzzleState();
            }
        }, null, this);

        //third puzzle stuff
        this.bKey = this.input.keyboard.addKey('B');

        this.fnafMode = false;
        this.fnafStarted = false;
        this.fnafCooldown = false;

        this.thirdPuzzleCheckpoint = {
            x: 0,
            y: 0
        };

        //objects
        this.signs = this.map.createFromObjects("Objects", {
            name: "question_1",
            key: "tilemap_sheet",
            frame: 86
        });

        this.signs2 = this.map.createFromObjects("Objects", {
            name: "question_2",
            key: "tilemap_sheet",
            frame: 86
        });

        this.signs3 = this.map.createFromObjects("Objects", {
            name: "question_3",
            key: "tilemap_sheet",
            frame: 86
        });

        this.wrong = this.map.createFromObjects("Objects", {
            name: "wrong",
            key: "food_tilemap_sheet",
            frame: 31
        });

        this.correct = this.map.createFromObjects("Objects", {
            name: "correct",
            key: "food_tilemap_sheet",
            frame: 31
        });

        this.questionText = this.add.text(0, 0, '', {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#ffffff',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2,
        }).setOrigin(0.5, 1).setScrollFactor(1).setVisible(false).setDepth(100);

        this.questionMessages = {
            'question_1': 'How many keys have you correctly collected?',
            'question_2': 'How many lolipops were in the last room?',
            'question_3': 'Which question is this?',
        };
    }

    update() {

        if (!this.fnafStarted && !this.fnafCooldown) {
            const tileX = this.thirdPuzzleBegin.worldToTileX(my.sprite.player.x);
            const tileY = this.thirdPuzzleBegin.worldToTileY(my.sprite.player.y);

            const tile = this.thirdPuzzleBegin.getTileAt(tileX, tileY);

            if (tile) {
                this.startThirdPuzzle();
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.pKey)) {
            this.startThirdPuzzle();
        }

        //third puzzle
        if (this.fnafMode) {
            this.updateThirdPuzzle();
            return;
        }


        this.activeQuestion = null;
        const checkDist = 20;

        this.signs.forEach(sign => {
            const dist = Phaser.Math.Distance.Between(
                my.sprite.player.x, my.sprite.player.y,
                sign.x, sign.y
            );
            if (dist < checkDist) {
                this.activeQuestion = 'question_1';
            }
        });

        this.signs2.forEach(sign => {
            const dist = Phaser.Math.Distance.Between(
                my.sprite.player.x, my.sprite.player.y,
                sign.x, sign.y
            );
            if (dist < checkDist) {
                this.activeQuestion = 'question_2';
            }
        });

        this.signs3.forEach(sign => {
            const dist = Phaser.Math.Distance.Between(
                my.sprite.player.x, my.sprite.player.y,
                sign.x, sign.y
            );
            if (dist < checkDist) {
                this.activeQuestion = 'question_3';
            }
        });

        this.wrong.forEach(sign => {
            const dist = Phaser.Math.Distance.Between(
                my.sprite.player.x, my.sprite.player.y,
                sign.x, sign.y
            );
            if (dist < checkDist) {
                my.sprite.player.setPosition(1431, 875);
                my.sprite.player.setVelocity(0, 0);
                my.sprite.player.setAcceleration(0, 0);
            }
        });

        if (this.activeQuestion && this.questionMessages[this.activeQuestion]) {
            this.questionText.setText(this.questionMessages[this.activeQuestion]);
            this.questionText.setPosition(
                my.sprite.player.x,
                my.sprite.player.y - my.sprite.player.displayHeight / 2 - 4
            );
            this.questionText.setVisible(true);
        } else {
            this.questionText.setVisible(false);
        }

        if (Phaser.Input.Keyboard.JustDown(this.hKey)) {
            my.sprite.player.setPosition(1431, 875);
        }

        if (this.activeQuestion && this.questionMessages[this.activeQuestion]) {
            this.questionText.setText(this.questionMessages[this.activeQuestion]);
            this.questionText.setPosition(
                my.sprite.player.x,
                my.sprite.player.y - my.sprite.player.displayHeight / 2 - 4
            );
            this.questionText.setVisible(true);
            this.lastActiveQuestion = this.activeQuestion;
        } else if (this.lastActiveQuestion) {
            this.questionText.setVisible(false);
            this.lastActiveQuestion = null;
        } else {
            this.questionText.setVisible(false);
        }

        this.activeQuestion = null;

        if (cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }
        } else if (cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, -my.sprite.player.displayWidth/2+10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(-this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }
        } else {
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
        }

        if (!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if (my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.sound.play("jump");
        }

        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }

        // info pad
        const playerTileX = this.firstInfoPad.worldToTileX(my.sprite.player.x);
        const playerTileY = this.firstInfoPad.worldToTileY(my.sprite.player.y);
        const infoTile = this.firstInfoPad.getTileAt(playerTileX, playerTileY);
        this.infoPadText.setVisible(infoTile !== null && infoTile.index !== -1);
    }

    checkPuzzleState() {
        const order = this.puzzleKeyOrder;
        const totalKeys = 3;

        if (order.length === totalKeys) {
            const isCorrect = order[0] === 1 && order[1] === 2 && order[2] === 3;

            if (isCorrect) {
                this.puzzleComplete = true;
                this.firstGate.forEachTile(tile => {
                    if (tile.index !== -1) {
                        tile.setCollision(false);
                    }
                });
            } else {
                this.puzzleKeyOrder = [];

                const respawn = (layer, keyName) => {
                    this.puzzleKeyPositions[keyName].forEach(({ x, y, index }) => {
                        layer.putTileAt(index, x, y);
                    });
                };

                respawn(this.firstPuzzleKey1, 'key1');
                respawn(this.firstPuzzleKey2, 'key2');
                respawn(this.firstPuzzleKey3, 'key3');

                let padLeftX = null;
                let padY = null;
                this.firstRespawnPad.forEachTile(tile => {
                    if (tile.index !== -1) {
                        const worldX = this.firstRespawnPad.tileToWorldX(tile.x);
                        const worldY = this.firstRespawnPad.tileToWorldY(tile.y);
                        if (padLeftX === null || worldX < padLeftX) {
                            padLeftX = worldX;
                            padY = worldY;
                        }
                    }
                });

                if (padLeftX !== null) {
                    my.sprite.player.setPosition(padLeftX - my.sprite.player.displayWidth, padY);
                    my.sprite.player.setVelocity(0, 0);
                    my.sprite.player.setAcceleration(0, 0);
                }
            }
        }
    }

    startThirdPuzzle() {
        console.log("FNAF STARTED");
        this.fnafMode = true;
        this.fnafStarted = true;
        this.fnafJumpscarePending = false;
        
        this.thirdPuzzleCheckpoint.x = my.sprite.player.x;
        this.thirdPuzzleCheckpoint.y = my.sprite.player.y;

        my.sprite.player.setVelocity(0, 0);
        my.sprite.player.setAcceleration(0, 0); 
        my.sprite.player.body.enable = false;

        this.cameras.main.stopFollow();
        this.cameras.main.setZoom(1);
        this.cameras.main.removeBounds();   
        this.cameras.main.setScroll(0, 0);

        const cx = this.cameras.main.width / 2;
        const cy = this.cameras.main.height / 2;

        this.fnafTimer = 30000;

        this.blackScreen = this.add.rectangle(
            0,
            0,
            5000,
            5000,
            0x000000
        )
        .setOrigin(0)
        .setScrollFactor(0)
        .setDepth(500);

        this.fnafText = this.add.text(
            cx,
            20,
            "SURVIVE",
            {
                fontSize: "24px",
                color: "#ffffff"
            }
        )
        .setScrollFactor(0)
        .setDepth(501)
        .setOrigin(0.5, 0);

        this.fnafPlayer = this.add.sprite(cx, cy, "avatar")
        .setScale(6).setScrollFactor(0).setDepth(502);

        this.fnafControls = this.add.text(
            cx,
            cy + 80,
            "  Z, X, C — FLASHLIGHTS\n\n     B — SEND THEM AWAY",
            {
                fontSize: "40px",
                color: "#aaaaaa",
                align: "center"
            }
        ).setScrollFactor(0).setDepth(502).setOrigin(0.5, 0);

        this.monsters = [];
        this.spawnTimer = 3000;
        this.spawnInterval = Phaser.Math.Between(4000, 8000);

        this.shieldSprite = this.add.rectangle(0, 0, 500, 60, 0xffffff)
        .setScrollFactor(0).setDepth(503).setVisible(false);

        this.zKey = this.input.keyboard.addKey('Z');
        this.xKey = this.input.keyboard.addKey('X');
        this.cKey = this.input.keyboard.addKey('C');

        this.flashlightL = this.add.circle(cx - 160, cy - 140, 100, 0xffffff, 0.15)
        .setScrollFactor(0).setDepth(503).setVisible(false);

        this.flashlightM = this.add.circle(cx, cy - 140, 100, 0xffffff, 0.15)
        .setScrollFactor(0).setDepth(503).setVisible(false);

        this.flashlightR = this.add.circle(cx + 160, cy - 140, 100, 0xffffff, 0.15)
        .setScrollFactor(0).setDepth(503).setVisible(false);

    }


    updateThirdPuzzle() {
        if (this.fnafJumpscarePending) return;

        this.fnafTimer -= this.game.loop.delta;

        this.fnafText.setText(
            "Survive: " +
            Math.ceil(this.fnafTimer / 1000) + "s"
        );

        if (Phaser.Input.Keyboard.JustDown(this.bKey)) {
            const cx = this.cameras.main.width / 2;
            const cy = this.cameras.main.height / 2;

            this.shieldSprite.setPosition(cx, cy - 80).setVisible(true);

            this.time.delayedCall(400, () => {
                if (this.shieldSprite) this.shieldSprite.setVisible(false);
            });

            this.monsters.forEach(enemy => {
                if (enemy.dead) return;
                if (enemy.sprite.y >= enemy.targetY - 100) {
                    enemy.dead = true;
                    enemy.sprite.setVisible(false);
                    if (enemy.closeSound && enemy.closeSound.isPlaying) enemy.closeSound.stop();
                }
            });
        }

        this.monsters.forEach((enemy, index) => {
            if (enemy.dead) return;

            enemy.distance -= 0.15;

            if (enemy.sprite.y < enemy.targetY) {
                enemy.sprite.y += 0.8;
            }

            const flashlights = [this.flashlightL, this.flashlightM, this.flashlightR];
            const myFlashlight = flashlights[enemy.flashlightIndex !== undefined ? enemy.flashlightIndex : index];
            const inRange = enemy.sprite.y >= enemy.targetY - 200;
            const flashOn = myFlashlight && myFlashlight.visible;
            enemy.sprite.setAlpha(flashOn && inRange ? 1 : 0);

            const scale = Phaser.Math.Clamp(4 + (400 - enemy.distance) / 80, 4, 10);
            enemy.sprite.setScale(scale);

            if (flashOn && inRange && !enemy.warned) {
                enemy.warned = true;
                enemy.closeSound = this.sound.add("enemyClose");
                enemy.closeSound.play();
            }

            if (enemy.sprite.y >= enemy.targetY && !this.fnafJumpscarePending && !enemy.dead) {
                this.triggerJumpScare(enemy);
            }
        });

        if (Phaser.Input.Keyboard.JustDown(this.zKey)) {
            this.flashlightL.setVisible(true);
            this.time.delayedCall(400, () => { if (this.flashlightL) this.flashlightL.setVisible(false); });
        }

        if (Phaser.Input.Keyboard.JustDown(this.xKey)) {
            this.flashlightM.setVisible(true);
            this.time.delayedCall(400, () => { if (this.flashlightM) this.flashlightM.setVisible(false); });
        }

        if (Phaser.Input.Keyboard.JustDown(this.cKey)) {
            this.flashlightR.setVisible(true);
            this.time.delayedCall(400, () => { if (this.flashlightR) this.flashlightR.setVisible(false); });
        }

        this.spawnTimer += this.game.loop.delta;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            this.spawnInterval = Phaser.Math.Between(4000, 8000);

            const cx = this.cameras.main.width / 2;
            const cy = this.cameras.main.height / 2;
            const keys = ["monster1", "monster2", "monster3"];
            const slots = [cx - 160, cx, cx + 160];
            const flashlights = [this.flashlightL, this.flashlightM, this.flashlightR];

            const randomIndex = Phaser.Math.Between(0, 2);
            const key = keys[randomIndex];
            const x = slots[randomIndex];

            const newEnemy = {
                sprite: this.add.image(x, 200, key)
                .setScale(6)
                .setScrollFactor(0)
                .setDepth(501)
                .setAlpha(0),

                targetY: cy - 80,
                distance: 900,
                warned: false,
                dead: false,
                flashlightIndex: randomIndex,
            };

            this.monsters.push(newEnemy);
        }

        if (this.fnafTimer <= 0) {
            this.endThirdPuzzle();
        }

        if (this.fnafTimer <= 0) {
            this.endThirdPuzzle();
        }
    }


    triggerJumpScare(enemy) {
        this.fnafJumpscarePending = true;
        enemy.dead = true;

        this.cameras.main.shake(500);
        enemy.sprite.setScale(20).setDepth(503);    
        enemy.sprite.setAlpha(1);

        const scareSound = this.sound.add("jumpScare");
        scareSound.play();

        setTimeout(() => {
            if (this.blackScreen) this.blackScreen.destroy();
            if (this.fnafText) this.fnafText.destroy();
            if (this.fnafPlayer) this.fnafPlayer.destroy();
            if (this.shieldSprite) this.shieldSprite.destroy();
            if (this.flashlightL) this.flashlightL.destroy();
            if (this.flashlightM) this.flashlightM.destroy();
            if (this.flashlightR) this.flashlightR.destroy();
            if (this.fnafControls) this.fnafControls.destroy();

            if (enemy.sprite && enemy.sprite.active) enemy.sprite.destroy();

            this.monsters.forEach(m => {
                if (m.sprite && m.sprite.active) m.sprite.destroy();
            });
            this.monsters = [];

            this.fnafMode = false;
            this.fnafJumpscarePending = false;
            my.sprite.player.body.enable = true;
            this.cameras.main.setZoom(this.SCALE);
            this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

            let padX = null;
            let padY = null;
            this.lastRespawnPad.forEachTile(tile => {
                if (tile.index !== -1 && padX === null) {
                    padX = this.lastRespawnPad.tileToWorldX(tile.x);
                    padY = this.lastRespawnPad.tileToWorldY(tile.y);
                }
            });

            if (padX !== null) {
                my.sprite.player.setPosition(padX, padY - my.sprite.player.displayHeight);
                this.cameras.main.centerOn(padX, padY);
            }

            my.sprite.player.setVelocity(0, 0);
            my.sprite.player.setAcceleration(0, 0);
            this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);

            this.fnafStarted = true;
            this.fnafCooldown = true;
            setTimeout(() => {
                this.fnafCooldown = false;
                this.fnafStarted = false;
            }, 1000);
        }, 800);
    }

    endThirdPuzzle() {
        this.fnafMode = false;
        this.fnafJumpscarePending = false;

        if (this.blackScreen) this.blackScreen.destroy();
        if (this.fnafText) this.fnafText.destroy();
        if (this.fnafPlayer) this.fnafPlayer.destroy();
        if (this.shieldSprite) this.shieldSprite.destroy();
        if (this.flashlightL) this.flashlightL.destroy();
        if (this.flashlightM) this.flashlightM.destroy();
        if (this.flashlightR) this.flashlightR.destroy();
        if (this.fnafControls) this.fnafControls.destroy();

        this.monsters.forEach(enemy => {
            if (enemy.sprite && enemy.sprite.active) {
                enemy.sprite.destroy();
            }
        });
        this.monsters = [];

        my.sprite.player.body.enable = true;
        this.cameras.main.setZoom(this.SCALE);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);

        this.cameras.main.centerOn(
            my.sprite.player.x,
            my.sprite.player.y
        );
    }


    endThirdPuzzleFail() {
    }
}
 