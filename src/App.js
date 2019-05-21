import React, { Component } from 'react';
import './App.css';
import Game from './containers/Game';
import MainUI from './components/MainUI';
import io from 'socket.io-client'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {socket: null, connected: false, gamemode: 'none', inroom: false, room: undefined, name: 'Anonymous'};
    this.url = 'http://localhost:3001';
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("Component update");
    if (prevState.socket === null && this.state.socket) {
      this.initSocket();
    }
  }

  initSocket = () => {
    let socket = this.state.socket;
    socket.on('connect', () => {
      this.setState({connected: true});
      console.log('connect');
    });
    socket.on('disconnect', (reason) => {
      console.log('disconnect: ' + reason);
      if (!(reason === 'io client disconnect'))
        this.setState({connected: false});
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        socket.connect();
      }
      // else the socket will automatically try to reconnect
    });
    socket.on('connect_error', (error) => {
      console.log("connect_error: " + error);
    });
    socket.on('connect_timeout', (timeout) => {
      console.log("connect_timeout: " + timeout);
      socket.close();
    });
    socket.on('error', (error) => {
      console.log("error: " + error);
    });
    socket.on('reconnecting', (attemptNumber) => {
      console.log('reconnecting: ' + attemptNumber);
    });
    socket.on('reconnect_failed', () => {
      console.log('reconnect_failed');
    });

    // Custom situation
    socket.on('getMessage', message => {
      console.log(message)
    });
    socket.on('addRoom', message => {
      this.setState({inroom: true});
      console.log(message)
    });
    socket.on('leaveRoom', message => {
      console.log(message)
      this.setState({gamemode: 'none', inroom: false});
    });
    socket.on('loadGame', message => {
      this.setState({'gamemode': message});
    });
    socket.on('room', data => {
      if (this.state.gamemode === 'online-player1') {
        this.pos.pika2 = data;
      } else if (this.state.gamemode === 'online-player2') {
        this.pos.pika2 = data.pika2;
        this.pos.ball = data.ball;
      }
    });
    socket.on('score', data => {
      this.setScore(data);
    });
    socket.on('round-start', () => {
      this.resetPos(this.pos);
    });
  }

  setupGame =  (pos, resetPos, setScore) => {
    this.pos = pos;
    this.resetPos = resetPos;
    this.setScore = setScore;
  }
  functions = {
    connectSocket: () => {
      this.setState((state) => {
        if (state.socket === null)
          return {socket: io(this.url)};
        else {
          state.socket.disconnect();
          return {socket: io(this.url)};
        }
      });
    },
    disconnect: () => {
      this.setState(state => {
        if (state.socket) {
          state.socket.disconnect();
          return {socket: null, connected: false, inroom: false};
        }
        return {};
      });
    },
    sendMessage: () => {
      //以 emit 送訊息，並以 getMessage 為名稱送給 server 捕捉
      this.state.socket.emit('getMessage', '只回傳給發送訊息的 client')
    },
    setUrl: (url) => {
      this.url = url;
    },
    setRoom: (text) => {
      this.setState({room: text});
    },
    enterRoom: () => {
      if (this.state.socket) {
        this.state.socket.emit('addRoom', {'room': this.state.room, 'player': this.state.name});
      }
    },
    leaveRoom: () => {
      if (this.state.socket) {
        this.state.socket.emit('leaveRoom');
      }
    },
    setName: (text) => {
      this.setState({name: text});
    },
    randomRoom: () => {
      if (this.state.socket) {
        this.state.socket.emit('randomRoom', this.state.name);
      }
    }
  }
  render() {
    if (this.state.gamemode.includes('online-player')) {
      return <div>
        <Game player={this.state.gamemode} socket={this.state.socket} setupGame={this.setupGame} />
        <button onClick={ this.functions.leaveRoom } >離開</button>
      </div>;
    } else {
      return <MainUI functions={ this.functions } socket={this.state.socket} connected={this.state.connected} inroom={this.state.inroom}
        room={this.state.room} name={this.state.name} url={this.url} />;
    }
  }
}

export default App;
