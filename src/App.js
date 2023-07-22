import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Route, BrowserRouter, Routes, Switch, Link } from 'react-router-dom';
import axios from 'axios';
import Loading2 from './Loading/Loading';

import './App.css';

import bg from './ui/web background.jpg';
import img from './ui/btn.png';
import imgFrame from './ui/imgFrame.svg'


function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);


  const scrollbarWidth = window.innerWidth - document.body.clientWidth;
  document.getElementsByClassName("App").width = scrollbarWidth


  // 이미지 선택 시 이벤트 핸들러
  const handleImageSelect = async (event) => {

    setSelectedImage(event.target.files[0]);

    const preview = document.querySelector(".previewImg")
    const preds = document.querySelector(".preds")
    if (preview !== null && preds !== null) {
      preview.remove();
      preds.remove();
    }

  };

  // 이미지 업로드 및 예측 요청
  const handleImageUpload = async () => {

    const fileReader = new FileReader();
    const formData = new FormData();

    formData.append('image', selectedImage);

    if (selectedImage) {

      const usrImg = document.querySelector('.usrImg');
      const new_imgTag = document.createElement('img');

      new_imgTag.setAttribute('class', 'previewImg');
      usrImg.appendChild(new_imgTag)

      fileReader.readAsDataURL(selectedImage);
      fileReader.onload = function () {
        document.querySelector(".previewImg").src = fileReader.result;
      };
    } else {
      return;
    };

    setLoading(true);

    try {
      const response = await fetch('/api', {
        method: 'POST',
        body: formData,
      });

      // console.log(response.body)
      const data = await response.json();
      // console.log(response)
      setPrediction(data.prediction);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
    }

  };

  const handlePredict = async () => {
    if (prediction) {
      console.log('prediction ', prediction)

      const app = document.querySelector('.App');
      const new_pTag = document.createElement('div');

      new_pTag.setAttribute('class', 'preds');
      
      new_pTag.className = 'preds';
      new_pTag.innerText = prediction;

      // document.querySelector(".preds").innerHTML = prediction;

      app.appendChild(new_pTag)

    }
  }

  useEffect(() => {
    handlePredict();
  }, []);



  return (

    <div className='App'>

      <img src={bg} className='bg'></img>

      <div className='btns'>

        <span className='btn'>
          <img src={img} className='btnDeco'></img>
          <label onChange={handleImageSelect} htmlFor='select' className='btnLbl'>
            <p className='btnText'>내 사진 선택</p>
          </label>
          <input type="file" onChange={handleImageSelect} id='select' hidden />
        </span>

        <span className='btn'>
          <img src={img} className='btnDeco'></img>
          <label onClick={handleImageUpload} htmlFor='upload' className='btnLbl'>
            <p className='btnText'>AI 세계로 전송</p>
          </label>
        </span>

      </div>

      <div className='usrImg'>
        <img src={imgFrame} className='imgFrame'></img>
      </div>
      <div className='loader'>
        {loading ? <Loading2 /> : null}
      </div>
      <div className='preds'>
        {prediction && <p>Prediction: {prediction}</p>}
      </div>
    </div>
  );
}

export default App;