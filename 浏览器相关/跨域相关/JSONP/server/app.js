const express = require('express');
const router = express.Router();
const app = express();

app.use(router);

router.get('/test', (req, res, next) => {
  let data = { // 返回给前端的数据
    name: "Horace",
    age: 20
  }
  const { msg, callback } = req.query;
  console.log(msg, '-----msg');
  console.log(callback, '----callback name');
  res.end(`${callback}(${JSON.stringify(data)})`); // 把数据交给回调返回前端调用
})

app.listen(3000, () => {
  console.log('listening on port 3000');
});

