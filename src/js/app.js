(function(Phaser) {
    var GameData = {
        game: null,
        canSpin: true,
        wheelSlices: 6,
        rotationTime: 3000,
        wheelSprite: null,
        revealerSprite: null
    };
    
    var spinWheel = function() {
        if (GameData.canSpin) {
            GameData.revealerSprite.alpha = 0;
            var rounds = Phaser.Math.Between(2, 4);
            var degrees = Phaser.Math.Between(0, 360);
            var angle = (360 * rounds) + degrees;
            GameData.canSpin = false;

            GameData.game.tweens.add({
                targets: [GameData.wheelSprite],
                angle: angle,
                duration: GameData.rotationTime,
                ease: "Cubic.easeOut",
                onComplete: function(tween) {
                    GameData.canSpin = true;
                }
            });
            GameData.revealerSprite.angle = (degrees % 60);
            // GameData.revealerSprite.alpha = 1;
        }
    };

    var preload = function() {
        GameData.game = this;

        GameData.game.load.image('background', 'assets/img/bg.jpg');
        GameData.game.load.image('spinner', 'assets/img/spinner.png');
        GameData.game.load.image('revealer', 'assets/img/revealer.png');
        GameData.game.load.image('arrow', 'assets/img/arrow.png');
    };

    var create = function() {
        var screenCenterX = GameData.game.cameras.main.worldView.x + (GameData.game.cameras.main.width/2);
        var screenCenterY = GameData.game.cameras.main.worldView.y + (GameData.game.cameras.main.height/2);
        GameData.game.add.image(screenCenterX, screenCenterY, 'background');

        GameData.wheelSprite = GameData.game.add.image(screenCenterX, screenCenterY, 'spinner');
        GameData.revealerSprite = GameData.game.add.image(screenCenterX, screenCenterY, 'revealer');
        GameData.revealerSprite.alpha = 0;
        GameData.game.add.image(screenCenterX, screenCenterY, 'arrow');

        GameData.game.input.on("pointerdown", spinWheel);
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