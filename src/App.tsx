import React, { useState, useEffect } from 'react';

// 定义作品的类型
interface Work {
  name: string;
  windowType: string;
  poem: string;
  image?: string;
}

function App() {
  const [page, setPage] = useState<'home' | 'gallery'>('home');
  const [showUpload, setShowUpload] = useState(false);
  const [works, setWorks] = useState<Work[]>([]);

  // 提交表单的处理函数
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newWork: Work = {
      name: formData.get('name') as string,
      windowType: formData.get('windowType') as string,
      poem: formData.get('poem') as string,
      // 演示版暂时用占位图，后续对接真实上传
      image: "https://via.placeholder.com/300x200?text=Work" 
    };
    setWorks([newWork, ...works]);
    setShowUpload(false);
  };

  // --- 首页 ---
  if (page === 'home') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f7f5' }}>
        <div style={{ flex: '4.5', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 60px' }}>
          <h1 style={{ fontSize: '64px', margin: '0 0 20px 0' }}>山水图窗</h1>
          <p style={{ fontSize: '18px', textAlign: 'center' }}>《艺术与设计思维专题5：中国传统山水的意象与空间》</p>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '40px' }}>Topic 5: The Imagery and Space of Chinese Traditional Landscape</p>
          <button 
            onClick={() => setPage('gallery')} // 【关键修复】绑定点击事件
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

  // --- 展示页 ---
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff', color: '#333' }}>
      
      {/* 侧边栏 */}
      <div style={{ width: '300px', borderRight: '1px solid #ddd', padding: '40px 20px', position: 'fixed', height: '100vh' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '40px', borderBottom: '2px solid #333' }}>山水图窗</h1>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', fontStyle: 'italic', borderBottom: '1px solid #eee' }}>基本信息</h2>
          <ul style={{ listStyle: 'none', padding: 0, lineHeight: '1.8', fontSize: '14px' }}>
            <li>● 《艺术与设计思维专题5》</li>
            <li>● 2026年 春季学期</li>
            <li>● 指导教师：邵星宇</li>
          </ul>
        </div>
        <div>
          <h2 style={{ fontSize: '28px', fontStyle: '