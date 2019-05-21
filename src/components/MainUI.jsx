import React from 'react';
import Dot from './Dot.jsx';

function MainUI(props) {
    const {connectSocket, sendMessage, setUrl, setRoom, setName, enterRoom, leaveRoom, randomRoom } = props.functions;
    const { socket, connected, inroom, room, name } = props;
    let color = 'grey';
    if (socket) {
      color = 'yellow';
      if (connected)
        color = 'green';
    }
    const connVal = socket? '離線': '多人連線';
    const connClick = socket? props.functions.disconnect: connectSocket;
    return (
      <div className="main-ui">
        <div>
          <Dot color={color}/>
          <input type='url' onChange={ e => setUrl(e.target.value) } defaultValue={props.url}/>
          <input type='button' value={connVal} onClick={ connClick } />
          { /*<input type='button' value='送出訊息' onClick={sendMessage} /> */ }
        </div>
        { connected ? (inroom? showRoom(): inputRoom()) : undefined }
      </div>
    );
    function inputRoom() {
      return <div>
        <input type='text' onChange={ e => setRoom(e.target.value) } placeholder='房號' defaultValue={room} />
        <input type='text' onChange={ e => setName(e.target.value) } placeholder='暱稱' defaultValue={name} />
        <input type='button' value='進入房間' onClick={enterRoom} />
        <input type='button' value='隨機配對' onClick={randomRoom} />
      </div>;
    }
    function showRoom() {
      return <div>
        <span>房號: { room }, 玩家: { name }</span>
        <button onClick={leaveRoom} >離開房間</button>
      </div>;
    }
}
export default MainUI;
