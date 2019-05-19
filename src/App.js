import React, { Component } from 'react';
import './App.css';
import Game from './containers/Game';
import MainUI from './components/MainUI';
import io from 'socket.io-client'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {socket: null, connected: false, gamemode: 'none'};
    this.url = 'http://localhost:3001';
    this.name = 'Anonymous';
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
      this.setState({connected: false});
      console.log('disconnect: ' + reason);
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

    //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
    socket.on('getMessage', message => {
      console.log(message)
    });
    socket.on('addRoom', message => {
      console.log(message)
    });
    socket.on('leaveRoom', message => {
      console.log(message)
    });
  }

  functions = {
    connectSocket: (url) => {
      this.setState((state) => {
        if (state.socket === null)
          return {socket: io(url)};
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
      this.room = text;
    },
    enterRoom: () => {
      if (this.state.socket) {
        this.state.socket.emit('addRoom', {'room': this.room, 'player': this.name});
      }
    },
    leaveRoom: () => {
      if (this.state.socket) {
        this.state.socket.emit('leaveRoom');
      }
    },
    setName: (text) => {
      this.name = text;
    },
    randomRoom: () => {
      if (this.state.socket) {
        this.state.socket.emit('randomRoom', this.name);
      }
    }
  }
  render() {
    return (
      <MainUI functions={ this.functions } url={ this.url } connected={this.state.connected} />
    );
  }
}

export default App;
