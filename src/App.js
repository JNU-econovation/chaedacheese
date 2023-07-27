import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Route, BrowserRouter, Routes, Switch, Link } from 'react-router-dom';
import axios from 'axios';
import Loading2 from './Loading/Loading';
import html2canvas from "html2canvas";
import { QRCodeSVG } from 'qrcode.react'

import './App.css';

import bg from './ui/web background.jpg';
import img from './ui/btn.png';
import imgFrame from './ui/imgFrame.svg';

let predict = '';
let predJSON = '';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predjson, setpredjson] = useState(false);

  const scrollbarWidth = window.innerWidth - document.body.clientWidth;
  document.getElementsByClassName("App").width = scrollbarWidth
  const bgHeight = document.getElementsByClassName("bg").height


  // 이미지 선택 시 이벤트 핸들러
  const handleImageSelect = async (event) => {

    setSelectedImage(event.target.files[0]);

    // 이전 사용자의 이미지 및 예측 결과 삭제
    const preds = document.querySelector(".preds")
    const preview = document.querySelector(".previewImg")
    if (preds !== null && preview !== null) {
      preds.remove();
      preview.remove();
    }
  };

  // 이미지 업로드 및 예측 요청
  const handleImageUpload = async () => {

    const fileReader = new FileReader();
    const formData = new FormData();

    formData.append('image', selectedImage);

    // 사용자가 이미지를 선택하여 업로드하면, 해당 이미지를 출력
    if (selectedImage) {

      // 태그 설정 및 추가
      const usrImg = document.querySelector('.usrImg');
      const new_imgTag = document.createElement('img');
      new_imgTag.className = 'previewImg';
      usrImg.appendChild(new_imgTag)

      // fileReader 모듈을 사용하여 img 태그의 src 설정
      fileReader.readAsDataURL(selectedImage);
      fileReader.onload = function () {
        document.querySelector(".previewImg").src = fileReader.result;
      };

    } else {
      return;
    };

    // api와의 통신 전 loading = true로 변경하여 스피너가 출력되도록 함
    setLoading(true);

    try {
      const response = await fetch('/api', {
        method: 'POST',
        body: formData,
      });

      // predict.py의 실행 결과를 수신받고, JSON 형태로 parse 진행
      const data = await response.json();
      predict = data.prediction;
      predJSON = JSON.parse(predict);

      setPrediction(data.prediction);
      setpredjson(predJSON);

      // api로부터 정보 수신이 완료되면 스피너가 숨겨지도록 함
      setLoading(false);

      handlePredict();
    } catch (error) {
      console.error('Error:', error);
    }

  };


  const handlePredict = async () => {

    if (prediction) {
      // 사용자의 이미지를 업로드하면 .preds 태그가 삭제되므로, 다음 사용자를 위해 해당 태그를 재생성 
      const app = document.querySelector('.App');
      const predsTag = document.createElement('div');

      predsTag.className = 'preds';
      app.appendChild(predsTag);

      const preds = document.querySelector('.preds');

      for (let i = 0; i < 3; i++) {
        const results = document.createElement('span');
        results.className = `resultSpan${i + 1}`;
        results.width = '300px';
        results.height = '400px';
        results.overflow = 'hidden';
        results.padding = '0px 15px'
        preds.appendChild(results)
      }

      for (let i = 0; i < 3; i++) {

        const resultSpan = document.querySelector(`.resultSpan${i + 1}`);
        const new_imgTag = document.createElement('img');
        const gradeTag = document.createElement('h2')
        const nameTag = document.createElement('h3')


        new_imgTag.className = 'result';
        new_imgTag.src = `/crop_celeb/${predJSON[i].name}1.jpg`;
        new_imgTag.backgroundSize = 'cover';
        new_imgTag.width = '100%'
        new_imgTag.display = 'flex'
        new_imgTag.alignItems = 'center'  

        gradeTag.className = 'grade';
        gradeTag.innerText = `· ${i + 1}위 ·`

        nameTag.className = 'name'
        nameTag.style = "font-weight: bold;"
        nameTag.innerText = `${predJSON[i].name}`

        resultSpan.appendChild(new_imgTag)
        resultSpan.appendChild(gradeTag)
        resultSpan.appendChild(nameTag)

      }

      // const capture = document.querySelector('#root')
      // capture.style.height = String(bgHeight)
      // html2canvas(capture, { scale: 4 }).then(
      //   canvas => {
      //     saveAs(canvas.toDataURL('image/jpg'), 'result.png')
      //   }
      // )


      // const saveAs = (uri, filename) => {
      //   console.log('onSaveAs');
      //   let link = document.createElement('a');
      //   document.body.appendChild(link);
      //   link.href = uri;
      //   link.download = filename;
      //   link.click();
      //   document.body.removeChild(link);
      // };

      // capture.style.height = 'auto'

    }
  }

  const onHtmlToPng = () => {
    const capture = document.querySelector('.App')
    capture.style.height = String(bgHeight)
    html2canvas(capture, { scale: 4 }).then(
      canvas => {
        saveAs(canvas.toDataURL('image/jpg'), 'result.png')
      }
    )

    capture.style.height = 'auto'
  }

  const saveAs = (uri, filename) => {
    console.log('onSaveAs');
    let link = document.createElement('a');
    document.body.appendChild(link);
    link.href = uri;
    link.download = filename;
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div>

      <div className='App'>

        <img src={bg} className='bg'></img>

        <div className='btns'>

          <span className='btn'>
            <img src={img} className='btnDeco'></img>
            <label onChange={handleImageSelect} htmlFor='select' className='btnLbl'>
              <p className='btnText'>· 내 사진 선택 ·</p>
            </label>
            <input type="file" onChange={handleImageSelect} id='select' hidden />
          </span>

          <span className='btn'>
            <img src={img} className='btnDeco'></img>
            <label onClick={handleImageUpload} htmlFor='upload' className='btnLbl'>
              <p className='btnText'>· AI 세계로 전송 ·</p>
            </label>
          </span>

        </div>

        <div className='usrImg'>
          <img src={imgFrame} className='imgFrame'></img>
        </div>
        <div className='loader'>
          {loading ? <Loading2 /> : null}

        </div>
        {prediction &&
          <div className='preds'>
            <span className='resultSpan1'>
              <img className='result' src={`/crop_celeb/${predjson[0].name}1.jpg`}></img>
              <h2 className='grade'>· 1위 ·</h2>
              <h3 className='name'>{predjson[0].name}</h3>
            </span>
            <span className='resultSpan2'>
              <img className='result' src={`/crop_celeb/${predjson[1].name}1.jpg`}></img>
              <h2 className='grade'>· 2위 ·</h2>
              <h3 className='name'>{predjson[1].name}</h3>
            </span>
            <span className='resultSpan3'>
              <img className='result' src={`/crop_celeb/${predjson[2].name}1.jpg`}></img>
              <h2 className='grade'>· 3위 ·</h2>
              <h3 className='name'>{predjson[2].name}</h3>
            </span>
          </div>}
      </div>
      <button onClick={onHtmlToPng}>다운로드</button>
    </div>
  );
}


export default App;