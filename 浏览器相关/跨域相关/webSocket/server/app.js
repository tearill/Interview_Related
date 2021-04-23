let express = require('express');
let app = express();
let WebSocket = require('ws');
let wss = new WebSocket.Server({ port: 4000 })


// 定义数据
let Data = {
  name: 'Horace',
  age: 20
}

wss.on('connection', function (ws) {
  ws.on('message', function (data) {
    console.log(JSON.parse(data))
    ws.send(JSON.stringify(Data))
  })
})