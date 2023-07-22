const express = require('express');
const app = express();
const api = require('./router/index');

app.use('/api', api);

const port = 3001; //node 서버가 사용할 포트 번호, 리액트의 포트번호(3000)와 충돌하지 않게 다른 번호로 할당
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

// const express = require('express');
// const app = express();
// const port = 3001; // 사용할 포트 번호

// // 이미지 업로드를 위한 multer 설정
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

// // face_recognition 모델을 불러오는 파이썬 코드 실행을 위한 child_process 설정
// const { spawn } = require('child_process');
// const cors  = require("cors");

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3001'); // 허용할 도메인
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // 허용할 HTTP 메서드
//     res.header('Access-Control-Allow-Headers', 'Content-Type'); // 허용할 헤더
//     next();
//   });

// // 서버 시작
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });

// // app.use('/', (req, res) => {
// //     res.json('server connected!!');
// // });

// // 이미지 업로드 및 모델 실행 라우트 설정
// app.post('/upload', upload.single('image'), (req, res) => {
//   const imagePath = req.file.path;

//   // face_recognition 모델 실행
//   const pythonProcess = spawn('python', ['./model/predict.py', imagePath]);

//   pythonProcess.stdout.on('data', (data) => {
//     const prediction = data.toString().trim(); // 예측값 출력
//     console.log(prediction)
//     // 프론트엔드로 예측값 전송
//     res.json({ prediction });
//   });
// });




// app.use(cors({
//     origin: "*",                // 출처 허용 옵션
//     credentials: true,          // 응답 헤더에 Access-Control-Allow-Credentials 추가
//     optionsSuccessStatus: 200,  // 응답 상태 200으로 설정
// }))