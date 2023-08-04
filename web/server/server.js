const express = require('express');
const app = express();
const api = require('./router/index');

app.use('/api', api);

const port = 3001; //node 서버가 사용할 포트 번호, 리액트의 포트번호(3000)와 충돌하지 않게 다른 번호로 할당
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});