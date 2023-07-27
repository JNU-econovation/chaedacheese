import "./styles.css";
import html2canvas from "html2canvas";
import saveAs from "file-saver";
import { useRef } from "react";

export default function Screenshot() {
  const divRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!divRef.current) return;

    try {
      const div = divRef.current;
      const canvas = await html2canvas(div, { scale: 2 });
      canvas.toBlob((blob) => {
        if (blob !== null) {
          saveAs(blob, "result.png");
        }
      });
    } catch (error) {
      console.error("Error converting div to image:", error);
    }
  };

  return (
    <div className="App">
      <div
        ref={divRef}
        style={{
          backgroundColor: "lime",
          width: "300px",
          height: "100px"
        }}
      >
        <h1>용뇽 블로그</h1>
        <h2>화면 캡쳐, 저장 예제 </h2>
      </div>
      <button onClick={handleDownload}>다운로드</button>
    </div>
  );
}


