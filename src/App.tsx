import React from 'react';

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f8f7f5', 
      margin: 0, 
      fontFamily: 'serif' 
    }}>
      {/* 左侧：文字与引导区域 */}
      <div style={{ 
        flex: '4.5', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '0 60px' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '64px', margin: '0 0 20px 0' }}>山水图窗</h1>
          <p style={{ fontSize: '18px', margin: '0 0 8px 0' }}>《艺术与设计思维专题5：中国传统山水的意象与空间》</p>
          <p style={{ fontSize: '14px', color: '#666', margin: '0 0 40px 0' }}>Topic 5: The Imagery and Space of Chinese Traditional Landscape</p>
          
          <button style={{ 
            backgroundColor: 'white', 
            border: '2px solid black', 
            padding: '12px 30px', 
            fontSize: '16px', 
            cursor: 'pointer' 
          }}>
            点击进入
          </button>
        </div>
      </div>

      {/* 右侧：全幅长图 */}
      <div style={{ 
        flex: '5.5', 
        backgroundColor: '#fff', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        {/* 注意：这里的图片名字必须和你 public 文件夹里的一模一样 */}
        <img 
          src="/long-cover.png" 
          alt="封面图" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>
    </div>
  );
}

export default App;