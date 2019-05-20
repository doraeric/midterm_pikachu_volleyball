// https://medium.com/enjoy-life-enjoy-coding/react-%E5%9C%A8-react-%E4%B8%AD%E4%BD%BF%E7%94%A8-websocket-feat-socket-io-%E5%9F%BA%E6%9C%AC%E6%95%99%E5%AD%B8-2e3483ad5c80
// https://medium.freecodecamp.org/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0
const express = require('express');
const app = express();

//將 express 放進 http 中開啟 Server 的 3000 port ，正確開啟後會在 console 中印出訊息
const server = require('http').Server(app)
  .listen(3001,()=>{console.log('open server!')});

//將啟動的 Server 送給 socket.io 處理
const io = require('socket.io')(server);

let random = undefined;
//監聽 Server 連線後的所有事件，並捕捉事件 socket 執行
io.on('connection', socket => {
  //經過連線後在 console 中印出訊息
  console.log('success connect! ' + socket.id);
  //監聽透過 connection 傳進來的事件
  socket.on('getMessage', message => {
    //回傳 message 給發送訊息的 Client
    socket.emit('getMessage', message);
  });
  socket.on('addRoom', ({room, player}) => {
    addRoom(socket, room, player);
  });
  //送出中斷申請時先觸發此事件
  socket.on('leaveRoom', () => {
    leaveRoom(socket);
  })
  socket.on('randomRoom', (player) => {
    if (random && io.sockets.adapter.rooms[random]) {
      addRoom(socket, random, player);
      random = undefined;
    } else {
      random = Math.random();
      addRoom(socket, random, player);
    }
  });
  socket.on('room', (data) => {
    socket.to(socket.gameRoom).emit('room', data);
  });
  socket.on('score', data => {
    socket.to(socket.gameRoom).emit('score', data);
  });
  socket.on('round-start', () => {
    socket.to(socket.gameRoom).emit('round-start');
  });
  socket.on('round-end', () => {
    socket.to(socket.gameRoom).emit('round-end');
  });

  socket.on('disconnecting', () => {
    leaveRoom(socket);
  })
  socket.on('disconnect', () => {
    console.log('disconnection');
  })

  addRoom = (socket, room, player) => {
    const rooms = Object.keys(socket.rooms).find(r =>{
      return r !== socket.id && r !== room;
    })
    //有的話要先離開
    if (rooms){
      socket.to(rooms).emit('leaveRoom', `${player} 已離開聊天！`);
      socket.leave(rooms);
    }

    if (io.sockets.adapter.sids[socket.id][room]) {
      socket.emit('addRoom', '你已在聊天室！');
    } else {
      if (io.sockets.adapter.rooms[room] && io.sockets.adapter.rooms[room].length >= 2) {
        socket.emit('addRoom', '人數已滿');
      } else {
        socket.join(room);
        socket.name = player;
        socket.gameRoom = room;
        io.sockets.in(room).emit('addRoom', `${player} 已加入聊天室！`);
        const len = io.sockets.adapter.rooms[room].length;
        io.sockets.in(room).emit('addRoom', `目前 ${len} 人`);
        if (len === 1) {
          io.sockets.adapter.rooms[room].host = socket;
        } else {
          let host = io.sockets.adapter.rooms[room].host;
          host.to(room).emit('loadGame', 'online-player2');
          host.emit('loadGame', 'online-player1');
        }
      }
    }
  };
  leaveRoom = (socket) => {
    const rooms = Object.keys(socket.rooms).find(room => {
      return room !== socket.id;
    })
    //先通知同一 room 的其他 Client
    if(rooms){
      socket.to(rooms).emit('leaveRoom', `${socket.name} 已離開聊天！`);
      socket.emit('leaveRoom', '你已離開聊天室！');
      socket.leave(rooms);
    }
  };
})
