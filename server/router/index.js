const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const iconv = require('iconv-lite');

const upload = multer({
  storage: multer.diskStorage({
    // set a localstorage destination
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    // convert a file name
    filename: (req, file, cb) => {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    },
  }),
});

// router.get("/", (req, res) => {
//     res.send({test : "hi"});
// });

// 이미지 업로드 및 모델 실행 라우트 설정
router.post('/', upload.single('image'), (req, res) => {
  const start = Date.now()
  const imagePath = req.file.path;

  const path = 'C:/Users/user/Desktop/summerdev/summerdev/server/' + imagePath.split('\\')[0] + '/' + imagePath.split('\\')[1]
  
  // console.log(path)
  // // face_recognition 모델 실행
  const pythonProcess = spawn('C:/Users/user/anaconda3/envs/chaeda/python', ['C:/Users/user/Desktop/summerdev/summerdev/server/model/predict.py', path]);

    pythonProcess.stdout.on('data', (data) => {
      const prediction = iconv.decode(data, 'euc-kr').toString();
      console.log('prediction ', prediction);
      // 프론트엔드로 예측값 전송  
      res.json({ prediction });
      
      const millis = Date.now() - start;
  	  console.log(`seconds elapsed = ${Math.floor(millis / 1000)}`);
    });

    pythonProcess.stderr.on('data', function(data) {
      console.log("err", data.toString());
});
});


module.exports = router;