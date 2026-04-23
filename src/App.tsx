import React, { useState } from 'react';

function App() {
  // 1. 定义一个状态：'home' 表示首页，'gallery' 表示展示页
  const [page, setPage] = useState<'home' | 'gallery'>('home');

  // --- 首页布局 (你之前的首页) ---
  if (page === 'home') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f7f5' }}>
        <div style={{ flex: '4.5', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 60px' }}>
          <h1 style={{ fontSize: '64px', margin: '0 0 20px 0' }}>山水图窗</h1>
          <p style={{ fontSize: '18px', textAlign: 'center' }}>《艺术与设计思维专题5：中国传统山水的意象与空间》</p>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '40px' }}>Topic 5: The Imagery and Space of Chinese Traditional Landscape</p>
          <button 
            onClick={() => setPage('gallery')} // 点击切换到展示页
            style={{ backgroundColor: 'white', border: '2px solid black', padding: '12px 30px', fontSize: '16px', cursor: 'pointer' }}
          >
            点击进入
          </button>
        </div>
        <div style={{ flex: '5.5', backgroundColor: '#fff' }}>
          <img src="/long-cover.png" alt="封面" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    );
  }

  // --- 展示页布局 (根据你最新截图做的空架子) ---
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff', color: '#333' }}>
      
      {/* 2. 左侧侧边栏 (目录区) */}
      <div style={{ width: '300px', borderRight: '1px solid #ddd', padding: '40px 20px', position: 'fixed', height: '100vh' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '40px', borderBottom: '2px solid #333' }}>山水图窗</h1>
        
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', fontStyle: 'italic', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>基本信息</h2>
          <ul style={{ listStyle: 'disc', paddingLeft: '20px', lineHeight: '1.8', fontSize: '14px' }}>
            <li>《艺术与设计思维专题5：中国传统山水的意象与空间》</li>
            <li>2026年 春季学期</li>
            <li>指导教师：邵星宇</li>
          </ul>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', fontStyle: 'italic', borderBottom: '1px solid #eee' }}>课程介绍</h2>
          <ul style={{ listStyle: 'disc', paddingLeft: '20px', lineHeight: '2' }}>
            <li>选题依据</li>
            <li>课程目标</li>
            <li>课程安排</li>
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: '28px', fontStyle: 'italic', borderBottom: '1px solid #eee' }}>成果&展示</h2>
          <p style={{ paddingLeft: '20px', color: 'blue', cursor: 'pointer', marginTop: '10px' }}>● 作业提交</p>
        </div>
      </div>

      {/* 3. 右侧主展区 */}
      <div style={{ marginLeft: '300px', flex: 1, padding: '40px' }}>
        
        {/* 顶部工具栏 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <span style={{ fontSize: '18px' }}>共 <strong style={{fontSize:'24px'}}>__</strong> 件作品</span>
          <button style={{ backgroundColor: '#999', color: '#fff', border: 'none', padding: '10px 60px', borderRadius: '20px', fontSize: '16px' }}>检索</button>
        </div>

        {/* 作品网格 (占位符) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2px', border: '1px solid #eee' }}>
          {[1, 2, 3, 4, 5, 6, 7].map((item) => (
            <div key={item} style={{ border: '1px solid #eee', paddingBottom: '15px' }}>
              {/* 图片占位图 */}
              <div style={{ width: '100%', aspectRatio: '1.5', backgroundColor: '#f5f5f5', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                 <div style={{ border: '1px solid #ccc', padding: '10px' }}>
                   <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                 </div>
              </div>
              {/* 文字信息栏 */}
              <div style={{ padding: '10px', fontSize: '12px', color: '#666', lineHeight: '1.5' }}>
                <p>姓名/学号：</p>
                <p>窗户类型：</p>
                <p>诗句：</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default App;