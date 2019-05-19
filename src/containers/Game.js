import React from 'react';
import * as PIXI from "pixi.js";
import { keyboard } from './utils.js'

// Thanks to https://medium.com/@peeyush.pathak18/pixijs-with-react-3cd40738180
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.pixiRoot = null;
    let resolution = Math.min((window.innerWidth-200)/432, (window.innerHeight-200)/304);
    this.state = {
      app: new PIXI.Application({width: 432, height: 304, resolution: resolution})
    };
  }

  updatePixiRoot = (element) => {
    // the element is the DOM object that we will use as container to add pixi stage(canvas)
    this.pixiRoot = element;

    //now we are adding the application to the DOM element which we got from the Ref.
    if (this.pixiRoot && this.pixiRoot.children.length <= 0) {
      this.pixiRoot.appendChild(this.state.app.view);

      //The setup function is a custom function that we created to add the sprites. We will this below
      this.setup();
    }
  };
  setup = () => {
    PIXI.Loader.shared
      .add('spritesheet', 'assets/spritesheet.json')
      .load(this.onAssetsLoaded);
    this.x = 0;
    this.vx = 0;
    this.y = 0;
    this.vy = 0;
    let left = keyboard("ArrowLeft");
    let up = keyboard("ArrowUp");
    let right = keyboard("ArrowRight");
    let down = keyboard("ArrowDown");
    left.press = () => {
      this.vx = -1;
    }
    left.release = () => {
      this.vx = 0;
    }
    right.press = () => {
      this.vx = 1;
    }
    right.release = () => {
      this.vx = 0;
    }
    up.press = () => {
      this.pika.visible = false;
      this.pika = this.pikas["pika_jump"];
      this.pika.visible = true;
    }
    up.release = () => {
      this.pika.visible = false;
      this.pika = this.pikas["pika_walk"];
      this.pika.visible = true;
    }
  }

  onAssetsLoaded = (loader, resources) => {
    // We will create a sprite and then add it to stage and (0,0) position
    const textures = resources.spritesheet.textures;
    const animations = resources.spritesheet.spritesheet.animations;
    const app = this.state.app;
    const pikas = ["pika_walk", "pika_jump", "pika_attack", "pika_dive", "pika_win", "pika_lose"];
    this.pikas = {};
    const width = app.screen.width;
    const height = app.screen.height;

    // background
    let bg = new PIXI.TilingSprite(textures.bg00, width, 32);
    bg.y = height - 16*2;
    app.stage.addChild(bg);
    const left = new PIXI.Sprite(textures.bg01a);
    left.y = height - 16*3;
    app.stage.addChild(left);
    bg = new PIXI.TilingSprite(textures.bg01b, width-32, 16);
    bg.y = height - 16*3;
    bg.x = 16;
    app.stage.addChild(bg);
    const right = new PIXI.Sprite(textures.bg01c);
    right.y = height - 16*3;
    right.x = 16*26;
    app.stage.addChild(right);
    bg = new PIXI.TilingSprite(textures.bg02, app.screen.width, 16);
    bg.y = height - 16*4;
    app.stage.addChild(bg);
    bg = new PIXI.Sprite(textures.bg03);
    bg.y = height - 16*4 -72;
    app.stage.addChild(bg);
    bg = new PIXI.TilingSprite(textures.bg04, width, height - 16*4 -72);
    app.stage.addChild(bg);

    pikas.forEach(i => {
      let p = new PIXI.AnimatedSprite(animations[i]);
      p.animationSpeed = 0.3;
      p.play();
      p.visible = false;
      app.stage.addChild(p);
      this.pikas[i] = p;
    });
    this.pika = this.pikas['pika_walk'];
    this.pika.visible = true;

    this.ball = new PIXI.AnimatedSprite(animations['ball']);
    this.ball.animationSpeed = 0.1;
    this.ball.play();
    app.stage.addChild(this.ball)


    app.ticker.add(delta => this.gameLoop(delta));
  };

  gameLoop = () => {
    this.x += this.vx;
    this.pika.x = this.x;
  }

  render() {
    return (
      <div className="game-page">
        <div id="pixi-game" ref={this.updatePixiRoot} />
      </div>
      );
  }
}
export default Game;
