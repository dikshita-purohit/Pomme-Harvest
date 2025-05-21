import React, { useEffect } from 'react';
import './main.css';

function Main() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js";
    script.async = true;

    script.onload = () => {
      class FruitCatcher extends window.Phaser.Scene {
        constructor() {
          super();
          this.score = 0;
          this.scoreText = null;
          this.basket = null;
          this.fruits = null;
          this.spawnTimer = null;
          this.damageCount = 0;
        }

        preload() {
          this.load.image('background', 'images/landscape.jpg');
          this.load.image('basket', 'images/basket.png');
          this.load.image('ripe_fruit', 'images/ripeApple.png');
          this.load.image('raw_fruit', 'images/rawApple.png');
          this.load.image('damaged_fruit', 'images/damageApple.png');
        }

        create() {
          const background = this.add.image(400, 300, 'background');
          const scaleX = this.sys.game.config.width / background.width;
          const scaleY = this.sys.game.config.height / background.height;
          const scale = Math.max(scaleX, scaleY);
          background.setScale(scale);

          this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#000',
          });

          this.basket = this.add.image(400, 550, 'basket');
          this.basket.setScale(0.15);
          this.physics.add.existing(this.basket, false);
          this.basket.body.setCollideWorldBounds(true);
          this.basket.body.setImmovable(true);
          this.basket.body.setSize(this.basket.width * 0.8, this.basket.height * 0.5);
          this.basket.body.setOffset(this.basket.width * 0.1, this.basket.height * 0.25);

          this.fruits = this.physics.add.group();

          this.spawnTimer = this.time.addEvent({
            delay: 1500,
            callback: this.spawnFruit,
            callbackScope: this,
            loop: true,
          });

          this.physics.add.overlap(this.basket, this.fruits, this.collectFruit, null, this);

          this.cursors = this.input.keyboard.createCursorKeys();
        }

        update() {
          if (this.cursors.left.isDown) {
            this.basket.body.setVelocityX(-300);
          } else if (this.cursors.right.isDown) {
            this.basket.body.setVelocityX(300);
          } else {
            this.basket.body.setVelocityX(0);
          }

          this.fruits.getChildren().forEach(fruit => {
            if (fruit.y > 600) {
              fruit.destroy();
            }
          });
        }

        spawnFruit() {
          const x = window.Phaser.Math.Between(50, 750);
          const fruitType = window.Phaser.Math.Between(1, 10);
          let fruit;
          const fruitScale = 0.1;

          if (fruitType <= 5) {
            fruit = this.add.image(x, -20, 'ripe_fruit');
            fruit.type = 'ripe';
          } else if (fruitType <= 8) {
            fruit = this.add.image(x, -20, 'raw_fruit');
            fruit.type = 'raw';
          } else {
            fruit = this.add.image(x, -20, 'damaged_fruit');
            fruit.type = 'damaged';
          }

          fruit.setScale(fruitScale);
          this.fruits.add(fruit);
          this.physics.add.existing(fruit);
          fruit.body.setVelocityY(200);

          this.tweens.add({
            targets: fruit,
            angle: { from: -5, to: 5 },
            duration: 500,
            yoyo: true,
            repeat: -1,
          });
        }

        collectFruit(basket, fruit) {
          fruit.destroy();

          if (fruit.type === 'damaged') {
            this.damageCount++;
            this.score -= 5;
            this.showFloatingText('-5', 0xFF0000);
            if (this.damageCount > 3) {
              this.endGame();
              return;
            }
          } else if (fruit.type === 'raw') {
            this.score += 5;
            this.showFloatingText('+5', 0xFFFF00);
          } else if (fruit.type === 'ripe') {
            this.score += 10;
            this.showFloatingText('+10', 0x00FF00);
          }

          this.scoreText.setText('Score: ' + this.score);
        }

        showFloatingText(text, color) {
          const floatingText = this.add.text(this.basket.x, this.basket.y - 50, text, {
            fontSize: '24px',
            fill: '#' + color.toString(16),
          });

          this.tweens.add({
            targets: floatingText,
            y: floatingText.y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => floatingText.destroy(),
          });
        }

        endGame() {
          this.time.delayedCall(2000, () => {
            window.location.href = './gameover?score=' + this.score;
          });
        }
      }

      const config = {
        type: window.Phaser.AUTO,
        parent: 'renderDiv',
        width: 800,
        height: 600,
        scale: {
          mode: window.Phaser.Scale.FIT,
          autoCenter: window.Phaser.Scale.CENTER_BOTH,
        },
        physics: {
          default: 'arcade',
          arcade: {
            debug: false,
            gravity: { y: 0 },
          },
        },
        scene: FruitCatcher,
      };

      if (!window.__PHASER_GAME__) {
        window.__PHASER_GAME__ = new window.Phaser.Game(config);
      }
      
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="renderDiv"></div>;
}

export default Main;
