class Example extends Phaser.Scene
{
    preload ()
    {
        // Background and controls
        var background = this.load.image('background', 'assets/images/background.png');
        this.load.image('arrow', 'assets/images/arrow.png');

        // Animals
        // this.load.image('chicken','assets/images/chicken.png');
        // this.load.image('pig','assets/images/pig.png');
        // this.load.image('horse','assets/images/horse.png');
        // this.load.image('sheep','assets/images/sheep3.png');
        this.load.spritesheet('chicken','assets/images/chicken_spritesheet.png', {frameWidth: 131, frameHeight: 200, startFrame: 3});
        this.load.spritesheet('pig','assets/images/pig_spritesheet.png', {frameWidth: 297, frameHeight: 200, startFrame: 3});
        this.load.spritesheet('horse','assets/images/horse_spritesheet.png', {frameWidth: 212, frameHeight: 200, startFrame: 3});
        this.load.spritesheet('sheep','assets/images/sheep_spritesheet.png', {frameWidth: 244, frameHeight: 200, startFrame: 3});

        // Sound effects
        this.load.audio('chickenSound',['assets/audio/chicken.ogg','assets/audio/chicken.mp3']);
        this.load.audio('horseSound',['assets/audio/horse.ogg','assets/audio/horse.mp3']);
        this.load.audio('pigSound',['assets/audio/pig.ogg','assets/audio/pig.mp3']);
        this.load.audio('sheepSound',['assets/audio/sheep.ogg','assets/audio/sheep.mp3']);
    }

    create ()
    {
        // Place the background image
        this.background = this.add.sprite(0,0,'background');
        this.background.setOrigin(0,0);

        // Group of animals
        var animalData = [
          {key: 'chicken', text: 'CHICKEN', audio: 'chickenSound'},
          {key: 'horse', text: 'HORSE', audio: 'horseSound'},
          {key: 'pig', text: 'PIG', audio: 'pigSound'},
          {key: 'sheep', text: 'SHEEP', audio: 'sheepSound'},
        ];

        const animalGroupConfig = {
          classType: Phaser.GameObjects.Sprite,
          defaultKey: null,
          defaultFrame: null,
          active: true,
          maxSize: -1,
          runChildUpdate: false,
          createCallback: null,
          removeCallback: null,
          createMultipleCallback: null
        }

        var animalAnimationConfig = { 
          key: "animalAnimation",
          frames: [
            {key:'0', frame: 0},
            {key:'1', frame: 1},
            {key:'2', frame: 2},
            {key:'1', frame: 1},
            {key:'0', frame: 0},
            {key:'1', frame: 1},
          ],
          defaultTextureKey: null,
          startFrame: 3,
          endFrame: null,
          zeroPad: null,
          repeat: 0,
          yoyo: false,
          showOnStart: false,
          hideOnComplete: false,
          callbackScope: null,
          paused: false,
          delay: 0,
          duration: 0,
          timeScale: 1,
          repeatDelay: 0,
          rotateToFrame: false,
          originX: 0.5,
          originY: 0.5,
          anchorX: 0.5,
          anchorY: 0.5,
          flipX: false,
          flipY: false,
          frameRate: 24,
          duration: 1000,
          skipMissedFrames: true,
          delay: 0,
          repeat: -1,
          repeatDelay: 0,
          yoyo: false,
          showOnStart: false,
          hideOnComplete: false,
          paused: false,
          callbackScope: null,
          onRepeat: null,
          onComplete: null,
          onLoop: null,
          onYoyo: null
        };

        this.animals = this.add.group(animalGroupConfig);
        var self = this;
        var animal;

        animalData.forEach(function(element){
          // As we cannot use 'this' inside the forEach function, we use 'self' to refer to the scene
          animal = self.animals.create(-1000, self.worldY, element.key, 0);
          animal.customParams = {text: element.text, sound: element.audio};
          animal.anims.create(animalAnimationConfig); 

          animal.setInteractive({pixelPerfect: true,});
          // animal.events.onInputDown.add(self.animateAnimal, self);
        });

        // Place first animal in the middle of the screen
        this.currentAnimal = this.animals.getChildren()[0];
        console.log(this.currentAnimal);
        this.currentAnimal.setPosition(this.game.worldX, this.game.worldY);

        // Show animal text
        this.showText(this.currentAnimal);

        // Controls
        this.rightArrow = this.add.sprite(580, this.game.worldY, 'arrow');
        this.rightArrow.customParams = {direction: 1};

        this.leftArrow = this.add.sprite(60, this.game.worldY, 'arrow');
        this.leftArrow.customParams = {direction: -1};

        this.rightArrow.inpoutEnabled = true;
        this.rightArrow.setInteractive({pixelPerfect: true,});
        // this.rightArrow.events.onInputDown.add(this.switchAnimal, this);

        this.leftArrow.inpoutEnabled = true;
        this.leftArrow.setInteractive({pixelPerfect: true,});
        // this.leftArrow.events.onInputDown.add(this.switchAnimal, this);

    }

    switchAnimal(sprite, event)
    { 
      if (this.isMoving){
        return false;
      }
      this.isMoving = true;

      // hide text
      this.animalText.visible = false;

      var newAnimal, endX;

      if (sprite.customParams.direction > 0) {
        newAnimal = this.animals.next();
        newAnimal.x = -newAnimal.width/2;
        endX = 640 + this.currentAnimal.width/2;
      } else {
        newAnimal = this.animals.previous();
        newAnimal.x = 640 + newAnimal.width/2;
        endX = -this.currentAnimal.width/2;
      }

      // tween: smooth animation of movement, scaling, transform, rotation...
      var newAnimalMovement = this.game.add.tween(newAnimal);
      newAnimalMovement.to({x: this.game.world.centerX}, 1000);
      // Locking newAnimal until it has enter the screen.  Uses callback onComplete from tween
      newAnimalMovement.onComplete.add(function(){
        this.isMoving = false;
        this.showText(newAnimal);
      }, this);
      newAnimalMovement.start();

      var currentAnimalMovement = this.game.add.tween(this.currentAnimal);
      currentAnimalMovement.to({x: endX}, 1000);
      currentAnimalMovement.start();

      this.currentAnimal = newAnimal;
    }

    animateAnimal(sprite,event)
    {
      sprite.play('animate');
      sprite.customParams.sound.play();
    }

    showText(animal)
    {
      if(!this.animalText){
        var style = {
          font: 'bold 30pt Arial',
          fill: '#D0171B',
          align: 'center'
        };

        this.animalText = this.add.text(this.game.width/2, this.game.heigh * 0.85, '', style);
        
      }

      this.animalText.setText(animal.customParams.text);
      this.animalText.visible = true;
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 360,
    height: 640,
    scene: Example,

    //  Open the Dev Tools
    //  The version of your game appears after the title in the banner
    title: 'Shock and Awesome',
    version: '1.2b'
};

const game = new Phaser.Game(config);