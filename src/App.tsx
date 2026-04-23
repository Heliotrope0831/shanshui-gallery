import React, { useState } from 'react';

// 定义作品数据类型
interface Work {
  name: string;
  id: string;
  windowType: string;
  poem: string;
  files: string[]; 
}

function App() {
  const [page, setPage] = useState<'home' | 'gallery'>('home');
  const [showUpload, setShowUpload] = useState(false);
  const [works, setWorks] = useState<Work[]>([]);

  // 处理提交
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newWork: Work = {
      name: formData.get('name') as string,
      id: formData.get('id') as string,
      windowType: formData.get('windowType') as string,
      poem: formData.get('poem') as string,
      files: ["https://picsum.photos/400/400?random=" + Math.random()]
    };
    setWorks([newWork, ...works]);
    setShowUpload(false);
  };

  // --- 首页布局 ---
  if (page === 'home') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f7f5', fontFamily: 'serif', position: 'relative', zIndex: 1 }}>
        <div style={{ flex: '4.5', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 60px', zIndex: 10 }}>
          <h1 style={{ fontSize: '72px', letterSpacing: '8px', marginBottom: '20px' }}>山水图窗</h1>
          <p style={{ fontSize: '18px', marginBottom: '8px', textAlign: 'center' }}>《艺术与设计思维专题5：中国传统山水的意象与空间》</p>
          <p style={{ fontSize: '14px', color: '#888', marginBottom: '40px' }}>Topic 5: The Imagery and Space of Chinese Traditional Landscape</p>
          <button 
            onClick={() => {
              console.log("进入按钮被触发");
              setPage('gallery');
            }}
            style={{ 
              backgroundColor: 'white', 
              border: '1px solid black', 
              padding: '12px 40px', 
              fontSize: '16px', 
              cursor: 'pointer',
              position: 'relative',
              zIndex: 100 // 确保按钮在最上层，不被挡住
            }}
          >
            点击进入
          </button>
        </div>
        <div style={{ flex: '5.5', backgroundColor: '#fff' }}>
          <img src="/long-cover.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="封面" />
        </div>
      </div>
    );
  }

  // --- 展示页布局 ---
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* 左侧侧边栏 */}
      <div style={{ width: '300px', borderRight: '1px solid #eee', padding: '40px 20px', position: 'fixed', height: '100vh', backgroundColor: '#fff', zIndex: 20 }}>
        <h1 style={{ fontSize: '48px', marginBottom: '40px', borderBottom: '2px solid #333' }}>山水图窗</h1>
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '24px', fontStyle: 'italic', marginBottom: '15px' }}>基本信息</h3>
          <p style={{ fontSize: '14px' }}>● 《艺术与设计思维专题5》</p>
          <p style={{ fontSize: '14px' }}>● 2026年 春季学期</p>
          <p style={{ fontSize: '14px' }}>● 指导教师：邵星宇</p>
        </div>
        <div>
          <h3 style={{ fontSize: '24px', fontStyle: 'italic', marginBottom: '15px' }}>成果&展示</h3>
          <p 
            onClick={() => setShowUpload(true)} 
            style={{ color: 'blue', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ● 作业提交
          </p>
        </div>
      </div>

      {/* 右侧主展示区 */}
      <div style={{ marginLeft: '300px', flex: 1, padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          <span style={{ fontSize: '18px' }}>共 <strong>{works.length}</strong> 件作品</span>
          <button style={{ backgroundColor: '#999', color: '#fff', border: 'none', padding: '8px 40px', borderRadius: '20px' }}>检索</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
          {works.map((work, index) => (
            <div key={index} style={{ textAlign: 'left', border: '1px solid #eee', padding: '10px' }}>
              <div style={{ 
                width: '100%', 
                aspectRatio: '1.5', 
                backgroundColor: '#f5f5f5',
                overflow: 'hidden',
                borderRadius: work.windowType === 'circle' ? '50%' : '0'
              }}>
                <img src={work.files[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="作品" />
              </div>
              <p style={{ fontSize: '12px', marginTop: '10px' }}>姓名/学号：{work.name} {work.id}</p>
              <p style={{ fontSize: '12px' }}>窗格类型：{work.windowType}</p>
              <p style={{ fontSize: '12px', fontStyle: 'italic' }}>诗句：{work.poem}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 提交弹窗 */}
      {showUpload && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', width: '400px', borderRadius: '8px' }}>
            <h2>作业提交</h2>
            <form onSubmit={handleSubmit}>
              <input name="name" placeholder="姓名" style={inputStyle} required />
              <input name="id" placeholder="学号" style={inputStyle} required />
              <select name="windowType" style={inputStyle}>
                <option value="square">方窗</option>
                <option value="circle">圆窗</option>
              </select>
              <textarea name="poem" placeholder="诗句" style={{ ...inputStyle, height: '60px' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowUpload(false)} style={{ flex: 1 }}>取消</button>
                <button type="submit" style={{ flex: 1, backgroundColor: '#333', color: '#fff' }}>提交</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' as 'border-box' };

export default App;