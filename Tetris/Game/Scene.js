var scene;

class Scene extends Phaser.Scene{

    constructor(){
        super();
    }

    preload(){
        scene = this;

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        initInput();
    }

    create(){
        new Game();
    }

    update(){
        UpdateList.update();
    }

}

var config = {
    width: window.innerWidth,
    height: window.innerHeight,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    backgroundColor: 0x000000,
    scene: Scene,

    transparent: true,

    antialias: true,

    fps: {
        target: 30,
        min: 30
    }
};