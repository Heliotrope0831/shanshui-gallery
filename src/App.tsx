import React, { useState } from 'react';

// 定义作品数据类型
interface Work {
  name: string;
  id: string;
  windowType: string;
  poem: string;
  files: string[]; // 存储图片/视频的预览链接
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
      // 演示版：随机给一个占位图，模拟提交后的效果
      files: ["https://picsum.photos/400/400?random=" + Math.random()]
    };

    setWorks([newWork, ...works]);
    setShowUpload(false);
  };

  // 首页
  if (page === 'home') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f7f5', fontFamily: 'serif' }}>
        <div style={{ flex: '4.5', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 60px' }}>
          <h1 style={{ fontSize: '72px', letterSpacing: '8px', marginBottom: '20px' }}>山水图窗</h1>
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>《艺术与设计思维专题5：中国传统山水的意象与空间》</p>
          <p style={{ fontSize: '14px', color: '#888', marginBottom: '40px' }}>Topic 5: The Imagery and Space of Chinese Traditional Landscape</p>
          <button 
            onClick={() => setPage('gallery')}
            style={{ backgroundColor: 'white', border: '1px solid black', padding: '12px 40px', fontSize: '16px', cursor: 'pointer' }}
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

  // 展示页
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* 左侧侧边栏 */}
      <div style={{ width: '300px', borderRight: '1px solid #eee', padding: '40px 20px', position: 'fixed', height: '100vh' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '40px', borderBottom: '2px solid #333' }}>山水图窗</h1>
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '24px', fontStyle: 'italic', marginBottom: '15px' }}>基本信息</h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6' }}>● 《艺术与设计思维专题5》</p>
          <p style={{ fontSize: '14px', lineHeight: '1.6' }}>● 2026年 春季学期</p>
          <p style={{ fontSize: '14px', lineHeight: '1.6' }}>● 指导教师：邵星宇</p>
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

      {/* 右侧展示区 */}
      <div style={{ marginLeft: '300px', flex: