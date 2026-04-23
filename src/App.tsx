import React from 'react';
import './App.css'; // 确保引入了 CSS指挥官

// 准备长幅封面图 (建议命名为 landscape-scroll.png 并放入 public/ 文件夹)
import landscapeScroll from '/landscape-scroll.png'; 

function App() {
  return (
    // 整个页面的最外层容器，使用新的不对称布局类名
    <div className="shanshui-landing-page">
      
      {/* --- 左侧：简洁文字与引导区域 (大留白) --- */}
      <div className="left-info-area">
        <header className="page-header">
          {/* 1. 精准标题：大字体，有呼吸感 */}
          <h1 className="main-title">山水图窗</h1>
          
          {/* 2. 精准副标题：对齐，字号适中 */}
          <p className="zh-sub-title">《艺术与设计思维专题5：中国传统山水的意象与空间》</p>
          <p className="en-sub-title">Topic 5: The Imagery and Space of Chinese Traditional Landscape</p>
        </header>

        {/* --- 3. 核心修改：只保留“点击进入”按钮，去掉其他所有内容 --- */}
        <div className="enter-btn-wrapper">
          <button className="plain-enter-btn">
            点击进入
          </button>
        </div>
      </div>

      {/* --- 右侧：全幅长图 (画卷主体) --- */}
      <div className="right-image-area">
        {/* 精准图片：使用截图里那张具有意境的长幅画卷 */}
        <img 
          src={landscapeScroll} 
          alt="中国传统山水画卷引导图" 
          className="shanshui-scroll-image"
        />
      }
      </div>

    </div>
  );
}

export default App;