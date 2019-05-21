# Pikachu Volleyball
## 簡介
這是個重現經典小遊戲的專案 - 皮卡丘打排球

## Reposity Link
[GitHub](https://github.com/doraeric/midterm_pikachu_volleyball)

## Installation
```
git clone https://github.com/doraeric/midterm_pikachu_volleyball
cd midterm_pikachu_volleyball
yarn || npm install
```

## Start the Server
有兩個伺服器，一個是 React，另一個是 socket.io，因為是線上版的，所以要連上 socker 的伺服器並配對完成才會進入遊戲。

start react: `yarn start` or `npm start`

預設在 [http://localhost:3000](http://localhost:3000) 開啟 react 伺服器

start socket: `node server.js`

預設在 [http://localhost:3001](http://localhost:3001) 開啟 socket.io 伺服器

## Demo
[Game Link](http://homepage.ntu.edu.tw/~b04501002/pikachu/)

此位置的預設連到私人伺服器上的 socket.io server，所以伺服器關閉時得在本地開啟才能使用。

![screenshot](https://user-images.githubusercontent.com/16789570/58094562-9058de00-7c03-11e9-83de-fea1d9555ac8.png)

## 操作方式
起始畫面很陽春，先連上 socket.io 伺服器，灰色表示沒有連線，黃色是連線中，綠色是連上

連上後可以輸入房間代碼及玩家名稱，或選擇隨機加入，配對完成會開始遊戲

進入遊戲後，使用上、左、右控制，只有簡單的碰撞，沒有殺球，打到其中一方得九分完結

## 使用與參考之框架
- 前端
  - React
  - [pixi.js](https://www.pixijs.com/): 繪製遊戲畫面
- 後端
  - express
  - [socket.io](https://socket.io/): 即時連線

參考文章:
- [PixiJS with React](https://medium.com/@peeyush.pathak18/pixijs-with-react-3cd40738180)
- [React | 在 React 中使用 WebSocket - feat. Socket.io 基本教學](https://medium.com/enjoy-life-enjoy-coding/react-%E5%9C%A8-react-%E4%B8%AD%E4%BD%BF%E7%94%A8-websocket-feat-socket-io-%E5%9F%BA%E6%9C%AC%E6%95%99%E5%AD%B8-2e3483ad5c80)

## 我的貢獻
將原始資源從執行檔中拿出，並重新製作成可以使用的格式(spritesheet)，這些資源位在 public/assets 中

socker.io server 端主要是控制開房間的邏輯，並將資料傳遞，基本架構是參考網路上的教學，再新增自己需要的功能上去，自己主要是在寫開房間的邏輯部份

其餘的程式碼皆在 src/ 中，也就是 React 的部份。最一開始如何在 React 中使用 pixi 及 socket 是參考別人的寫法才會，鍵盤按壓偵測是使用別人的程式碼，Vector2 是從 three.js 複製來的，剩餘的遊戲架構、碰撞偵測與網頁界面為自己手刻

## 心得
要將不同的東西一起使用其實不太容易，像是把 pixi 掛到 React 上，而且也要清楚 React 傳遞資料的方式，要不然就會遇到應該更新畫面時不更新的狀況

主要是為了效能的考慮而選擇了使用 pixi，花了很多時間寫遊戲的部份，反而看不太到網頁的特徵，而且真心覺得 css 很難

socket 內部的某些狀態改變時也要使用 setState 才能讓 React 確實更新也是這次特別注意到的

沒時間串資料庫，有資料庫的話或許可以做個排行榜，但是也沒想到應該要用什麼排名次

~原本看皮卡丘打排球檔案很小，想要逆向完後再改寫，達到幾乎一樣的操作手感與判定，但時間不夠，而且似乎是用 visual C++ 寫的，看到許多像是 vtable pointer 的東西，要靜態分析有點難度，所以只好就提取資源而已~

## Default Scripts with create-react-app
- `npm start`
- `npm test`
- `npm run build`
- `npm run eject`
