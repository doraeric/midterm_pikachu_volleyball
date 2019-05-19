import React from 'react';
import Dot from './Dot.jsx';

function MainUI(props) {
  const {connectSocket, sendMessage, setUrl, setRoom, setName, enterRoom, leaveRoom, randomRoom } = props.functions;
  const color = props.connected ? 'green': 'grey';
  return (
    <div className="main-ui">
      <div>
        <Dot color={color}/>
        <input type='url' onChange={ e => setUrl(e.target.value) } defaultValue='http://localhost:3001' />
        <input type='button' value='多人連線' onClick={ () => connectSocket(props.url) } />
        <input type='button' value='送出訊息' onClick={sendMessage} />
      </div>
      <div>
        <input type='text' onChange={ e => setRoom(e.target.value) } placeholder='房號' />
        <input type='text' onChange={ e => setName(e.target.value) } placeholder='暱稱' />
        <input type='button' value='進入房間' onClick={enterRoom} />
        <input type='button' value='離開房間' onClick={leaveRoom} />
        <input type='button' value='隨機配對' onClick={randomRoom} />
      </div>
    </div>
  );
}
export default MainUI;
