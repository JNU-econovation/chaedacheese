import React, { useState, useEffect } from 'react';
import FadeLoader from "react-spinners/FadeLoader";
import './Loading.css';


function Counter() {
  const [count, setCount] = useState(50);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count => count - 1);
    }, 1000);
    if (count === 0) {
      clearInterval(id);
    }
    return () => clearInterval(id);
  }, [count]);

  return count;
}

const Loading = () => {
  return (
    <div className="contentWrap">
      <h2 className='counter'>{Counter()}초 남았습니다.</h2>
      <div className="loaderWrap">
        <FadeLoader
          color="white"
          height={10}
          width={5}
          radius={5}
          margin={1}
        />
      </div>
    </div>
  )
}

export default Loading;