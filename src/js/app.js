(function(Phaser) {
    var GameData = {
        game: null,
        canSpin: true,
        wheelSlices: 6,
        rotationTime: 3000,
        sprites: {
            wheel: null,
            revealer: null
        },
        audio: {
            beep: null
        },
        inputKeys: null,
    };

    var blinkRevealer = function() {
        var animatedTweens = [];
        for (var i = 0; i < 10; i++) {
            animatedTweens.push({
                targets: [GameData.sprites.revealer],
                duration: 1,
                alpha: (i % 2),
                offset: (i * 150)
            });
        }
        GameData.game.tweens.timeline({
            tweens: animatedTweens,
            onComplete: function() {
                GameData.canSpin = true;
            }
        });
    };
    
    var spinWheel = function() {
        if (GameData.canSpin) {
            GameData.canSpin = false;
            GameData.sprites.revealer.alpha = 0;
            var rounds = Phaser.Math.Between(2, 4);
            var degrees = Phaser.Math.Between(0, 360);
            var angle = (360 * rounds) + degrees;
            var revealerAngle = degrees;
            while (revealerAngle > 30) {
                revealerAngle -= 60;
            }

            var previousAngle = 0;
            GameData.game.tweens.add({
                targets: [GameData.sprites.wheel],
                angle: angle,
                duration: GameData.rotationTime,
                ease: "Cubic.easeOut",
                onComplete: function(tween) {
                    GameData.sprites.revealer.angle = revealerAngle;
                    blinkRevealer();
                },
                onUpdate: function(tween, target) {
                    var currentAngle = Math.floor(target.angle) + 389; // 389 = 360 + 30 (starting wedge offset) - 1 so we don't play sound when landing on the line but don't count the next number as the answer
                    while (currentAngle > 360) {
                        currentAngle -= 360;
                    }
                    currentAngle = Math.floor(currentAngle / 60) * 60;
                    
                    if (currentAngle != previousAngle) {
                        GameData.audio.beep.play();
                        previousAngle = currentAngle;
                    }
                }
            });
        }
    };

    var preload = function() {
        GameData.game = this;

        GameData.game.load.image('background', 'assets/img/bg.jpg');
        GameData.game.load.image('spinner', 'assets/img/spinner.png');
        GameData.game.load.image('revealer', 'assets/img/revealer.png');
        GameData.game.load.image('arrow', 'assets/img/arrow.png');

        GameData.game.load.audio({
            key: 'beep',
            url: ['assets/audio/mixkit-tech-break-fail-2947.wav']
        });
    };

    var create = function() {
        var screenCenterX = GameData.game.cameras.main.worldView.x + (GameData.game.cameras.main.width/2);
        var screenCenterY = GameData.game.cameras.main.worldView.y + (GameData.game.cameras.main.height/2);
        GameData.game.add.image(screenCenterX, screenCenterY, 'background');

        GameData.sprites.wheel = GameData.game.add.image(screenCenterX, screenCenterY, 'spinner');
        GameData.sprites.revealer = GameData.game.add.image(screenCenterX, screenCenterY, 'revealer');
        GameData.sprites.revealer.alpha = 0;
        GameData.game.add.image(screenCenterX, screenCenterY, 'arrow');

        GameData.audio.beep = GameData.game.sound.add('beep');

        GameData.game.input.on("pointerdown", spinWheel);
        GameData.game.input.keyboard.on("keydown-SPACE",  spinWheel);
    };

    var config = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.RESIZE
        },
        parent: 'game',
        backgroundColor: '#fff2e8',
        scene: {
            preload: preload,
            create: create
        }
    };

    var game = new Phaser.Game(config);
    
})(Phaser);