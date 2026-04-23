import React from 'react';
import './App.css'; 

// 注意：刚才 Git 提示你的图片改名为了 long-cover.png
// 如果你 public 文件夹下的图叫 long-cover.png，这里就要改名字
import landscapeScroll from '/long-cover.png'; 

function App() {
  return (
    <div className="shanshui-landing-page">
      
      {/* 左侧：文字与引导区域 */}
      <div className="left-info-area">
        <header className="page-header">
          <h1 className="main-title">山水图窗</h1>
          <p className="zh-sub-title">《艺术与设计思维专题5：中国传统山水的意象与空间》</p>
          <p className="en-sub-title">Topic 5: The Imagery and Space of Chinese Traditional Landscape</p>
        </header>

        <div className="enter-btn-wrapper">
          <button className="plain-enter-btn">
            点击进入
          </button>
        </div>
      </div>

      {/* 右侧：画卷主体 */}
      <div className="right-image-area">
        <img 
          src={landscapeScroll} 
          alt="封面图" 
          className="shanshui-scroll-image"
        />
      </div>

    </div>
  );
}

export default App;