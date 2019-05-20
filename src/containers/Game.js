import React from 'react';
import * as PIXI from "pixi.js";
import { keyboard, toRect, rectCollide } from './utils.js'
import cfg from './config.js'
import { Vector2 } from './Vector2.js'

// Thanks to https://medium.com/@peeyush.pathak18/pixijs-with-react-3cd40738180
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.pixiRoot = null;
    let resolution = Math.min((window.innerWidth-200)/432, (window.innerHeight-200)/304);
    this.state = {
      app: new PIXI.Application({width: 432, height: 304, resolution: resolution})
    };
    this.pos = {
      'pika': {x: this.props.player === 'online-player1' ? 36: 394, y: 232, vx: 0, vy: 0},
      'pika2': {x: this.props.player === 'online-player2' ? 36: 394, y: 232},
      'ball' : {x: 36, y: cfg.ballh/2, vx: 0, vy: 0, ax: 0, ay: .1}
    };
    this.props.setupPos(this.pos);
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
    this.left = 0;
    this.right = 0;
    let left = keyboard("ArrowLeft");
    let up = keyboard("ArrowUp");
    let right = keyboard("ArrowRight");
    let down = keyboard("ArrowDown");
    left.press = () => {
      this.left = -1;
      this.pos.pika.vx = this.left + this.right;
    }
    left.release = () => {
      this.left = 0;
      this.pos.pika.vx = this.left + this.right;
    }
    right.press = () => {
      this.right = 1;
      this.pos.pika.vx = this.left + this.right;
    }
    right.release = () => {
      this.right = 0;
      this.pos.pika.vx = this.left + this.right;
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
    bg = new PIXI.Sprite(textures.bg07);
    bg.x = cfg.appw/2-4;
    bg.y = 156;
    app.stage.addChild(bg);
    bg = new PIXI.TilingSprite(textures.bg08, 8, 13.5*8);
    bg.x = cfg.appw/2-4;
    bg.y = 164;
    app.stage.addChild(bg);

    pikas.forEach(i => {
      let p1 = new PIXI.AnimatedSprite(animations[i]);
      let p2 = new PIXI.AnimatedSprite(animations[i]);
      p2.scale.x = -1;
      p1.animationSpeed = 0.3;
      p2.animationSpeed = 0.3;
      p1.play();
      p2.play();
      p1.visible = false;
      p2.visible = false;
      app.stage.addChild(p1);
      app.stage.addChild(p2);
      if (this.props.player === 'online-player1') {
        this.pikas[i] = p1;
        this.pikas[i].other = p2;
      } else {
        this.pikas[i] = p2;
        this.pikas[i].other = p1;
      }
    });
    this.pika = this.pikas['pika_walk'];
    this.pika.visible = true;
    this.pika2 = this.pikas['pika_walk'].other;
    this.pika2.visible = true;

    this.ball = new PIXI.AnimatedSprite(animations['ball']);
    this.ball.animationSpeed = 0.1;
    this.ball.play();
    app.stage.addChild(this.ball)


    app.ticker.add(delta => this.gameLoop(delta));
  };

  gameLoop = () => {
    let {pika, pika2, ball} = this.pos;
    pika.x += pika.vx*5;
    if (this.props.player === 'online-player1') {
      if (pika.x < cfg.pikaw/2)
        pika.x = cfg.pikaw/2;
      else if (pika.x > cfg.appw/2-cfg.pikaw/2)
        pika.x = cfg.appw/2-cfg.pikaw/2;
      ball.vx += ball.ax;
      ball.vy += ball.ay;
      ball.x += ball.vx;
      ball.y += ball.vy;
      if (ball.x < cfg.ballw/2) {
        ball.vx *= -.9;
        ball.x = cfg.ballw/2;
      } else if (ball.x > cfg.appw-cfg.ballw/2) {
        ball.vx *= -.9;
        ball.x = cfg.appw-cfg.ballw/2;
      }
      if (ball.y < cfg.ballh/2) {
        ball.vy *= -.9;
        ball.y = cfg.ballh/2;
      } else if (ball.y > cfg.ground-cfg.ballh/2) {
        ball.vy *= -.9;
        ball.y = cfg.ground-cfg.ballh/2;
      }
      let pole_ball = new Vector2(ball.x-cfg.appw, ball.y-cfg.poleTop);
      if (pole_ball.length < cfg.ballw/2 && ball.y < cfg.poleTop) {
        let ballVel = new Vector2(ball.vx, ball.vy);
        let newVel = ballVel.length * pole_ball.normalize();
        ball.vx = newVel.x;
        ball.vy = newVel.y;
      }
      else if (ball.y+cfg.ballh/2 > cfg.poleTop) {
        if (ball.x+cfg.ballw/2 > cfg.appw/2 && ball.x < cfg.appw/2) {
          ball.x = cfg.appw/2-cfg.ballw/2;
          ball.vx *= -1;
        } else if (ball.x-cfg.ballw/2 < cfg.appw/2 && ball.x > cfg.appw/2) {
          ball.x = cfg.appw/2+cfg.ballw/2;
          ball.vx *= -1;
        }
      }
      let pikaRect = toRect(pika, cfg.pikaw, cfg.pikah);
      let pika2Rect = toRect(pika2, cfg.pikaw, cfg.pikah);
      let ballRect = toRect(ball, cfg.ballw, cfg.ballh);
      if (rectCollide(pikaRect, ballRect) || rectCollide(pika2Rect, ballRect)) {
        let vec = rectCollide(pikaRect, ballRect) ?
          new Vector2(ball.x-pika.x, ball.y-pika.y) : new Vector2(ball.x-pika2.x, ball.y-pika2.y);
        vec.normalize().multiplyScalar(6);
        ball.vx = vec.x;
        ball.vy = vec.y;
      }
    }
    else if (this.props.player === 'online-player2') {
      if (pika.x < cfg.appw/2+cfg.pikaw/2)
        pika.x = cfg.appw/2+cfg.pikaw/2;
      else if (pika.x > cfg.appw-cfg.pikaw/2)
        pika.x = cfg.appw-cfg.pikaw/2;
    }
    this.pika.x = pika.x;
    this.pika.y = pika.y;
    this.pika2.x = pika2.x;
    this.pika2.y = pika2.y;
    this.ball.x = ball.x;
    this.ball.y = ball.y
    if (this.props.player === 'online-player2') {
      this.props.socket.emit('room', {x: pika.x, y: pika.y});
    } else if (this.props.player === 'online-player1') {
      this.props.socket.emit('room', {pika2: pika, ball: ball});
    }
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
