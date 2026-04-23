import React, { useState, ChangeEvent } from 'react';

// 1. 定义作品数据类型
interface Work {
  name: string;
  id: string;
  windowType: string;
  poem: string;
  previewUrls: string[]; 
}

function App() {
  const [page, setPage] = useState<'home' | 'gallery'>('home');
  const [showUpload, setShowUpload] = useState(false);
  const [works, setWorks] = useState<Work[]>([]);

  // 2. 处理图片选择与提交逻辑
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    
    const selectedFiles = fileInput.files ? Array.from(fileInput.files) : [];
    const previewUrls = selectedFiles.map(file => URL.createObjectURL(file));

    const newWork: Work = {
      name: formData.get('name') as string,
      id: formData.get('id') as string,
      windowType: formData.get('windowType') as string,
      poem: formData.get('poem') as string,
      previewUrls: previewUrls.length > 0 ? previewUrls : ["https://via.placeholder.com/400x300?text=No+Image"]
    };

    setWorks([newWork, ...works]);
    setShowUpload(false);
  };

  // --- 首页视图 ---
  if (page === 'home') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f7f5', fontFamily: '"Microsoft YaHei", serif' }}>
        <div style={{ flex: '4.5', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 60px', zIndex: 10 }}>
          <h1 style={{ fontSize: '72px', letterSpacing: '8px', marginBottom: '20px', color: '#333' }}>山水图窗</h1>
          <p style={{ fontSize: '18px', marginBottom: '8px', textAlign: 'center' }}>《艺术与设计思维专题5：中国传统山水的意象与空间》</p>
          <p style={{ fontSize: '14px', color: '#888', marginBottom: '40px' }}>Topic 5: The Imagery and Space of Chinese Traditional Landscape</p>
          <button 
            onClick={() => setPage('gallery')}
            style={{ backgroundColor: 'white', border: '1px solid black', padding: '12px 50px', fontSize: '18px', cursor: 'pointer', transition: '0.3s' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          >
            点击进入
          </button>
        </div>
        <div style={{ flex: '5.5', backgroundColor: '#fff' }}>
          <img src="/long-cover.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="封面图" />
        </div>
      </div>
    );
  }

  // --- 展示页视图 ---
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff', fontFamily: '"Microsoft YaHei", sans-serif' }}>
      
      {/* 侧边栏 */}
      <div style={{ width: '320px', borderRight: '1px solid #eee', padding: '40px 25px', position: 'fixed', height: '100vh', backgroundColor: '#fff', zIndex: 100 }}>
        <h1 style={{ fontSize: '42px', marginBottom: '40px', borderBottom: '3px solid #333', paddingBottom: '10px' }}>山水图窗</h1>
        
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '22px', fontStyle: 'italic', color: '#555', marginBottom: '15px' }}>基本信息</h3>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', lineHeight: '2' }}>
            <li>● 《艺术与设计思维专题5》</li>
            <li>● 2026年 春季学期</li>
            <li>● 指导教师：邵星宇</li>
          </ul>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '22px', fontStyle: 'italic', color: '#555', marginBottom: '15px' }}>成果&展示</h3>
          <p 
            onClick={() => setShowUpload(true)} 
            style={{ color: '#0055ff', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', textDecoration: 'underline' }}
          >
            ● 作业提交
          </p>
        </div>
        
        <button onClick={() => setPage('home')} style={{ marginTop: '50px', padding: '8px 20px', cursor: 'pointer', border: '1px solid #ccc', background: 'none' }}>返回封面</button>
      </div>

      {/* 右侧作品瀑布流展示区 */}
      <div style={{ marginLeft: '320px', flex: 1, padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #f0f0f0', paddingBottom: '20px' }}>
          <span style={{ fontSize: '16px', color: '#666' }}>当前展厅内共有 <strong style={{ fontSize: '24px', color: '#333' }}>{works.length}</strong> 件作品</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input placeholder="搜索学生姓名..." style={{ padding: '8px 15px', borderRadius: '20px', border: '1px solid #ddd' }} />
            <button style={{ backgroundColor: '#333', color: '#fff', border: 'none', padding: '8px 25px', borderRadius: '20px', cursor: 'pointer' }}>检索</button>
          </div>
        </div>

        {/* 瀑布流布局容器 */}
        <div style={{ columnCount: 3, columnGap: '30px', width: '100%' }}>
          {works.map((work, index) => {
            // 根据窗户类型计算形状样式
            let shapeStyle: React.CSSProperties = {
              width: '100%',
              backgroundColor: '#f9f9f9',
              overflow: 'hidden',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            };

            if (work.windowType === '扇面') {
              shapeStyle.aspectRatio = '2/1';
              shapeStyle.clipPath = 'ellipse(100% 100% at 50% 100%)'; // 模拟扇形
            } else if (work.windowType === '圆形团扇') {
              shapeStyle.aspectRatio = '1/1';
              shapeStyle.borderRadius = '50%';
            } else if (work.windowType === '横长册页') {
              shapeStyle.aspectRatio = '16/9';
              shapeStyle.borderRadius = '2px';
            } else if (work.windowType === '纵长立轴') {
              shapeStyle.aspectRatio = '1/2.5';
              shapeStyle.borderRadius = '2px';
            }

            return (
              <div key={index} style={{ marginBottom: '40px', breakInside: 'avoid', border: '1px solid #eee', padding: '15px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={shapeStyle}>
                  <img src={work.previewUrls[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="学生作品" />
                </div>
                <div style={{ marginTop: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{work.name}</span>
                    <span style={{ fontSize: '12px', color: '#999', backgroundColor: '#f0f0f0', padding: '2px 8px' }}>{work.windowType}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>“{work.poem}”</p>
                  <p style={{ fontSize: '11px', color: '#ccc', marginTop: '10px' }}>学号：{work.id}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {works.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '100px', color: '#ccc' }}>
            <p style={{ fontSize: '24px' }}>暂无作品展示</p>
            <p>点击左侧“作业提交”开始上传</p>
          </div>
        )}
      </div>

      {/* 4. 提交表单弹窗 */}
      {showUpload && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '40px', width: '480px', borderRadius: '4px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            <h2 style={{ margin: '0 0 25px 0', textAlign: 'center', letterSpacing: '2px' }}>作业提交系统</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>学生姓名</label>
                <input name="name" placeholder="请输入真实姓名" style={inputStyle} required />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>学号</label>
                <input name="id" placeholder="请输入学号" style={inputStyle} required />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>窗棂形制</label>
                <select name="windowType" style={inputStyle}>
                  <option value="圆形团扇">圆形团扇 (1:1)</option>
                  <option value="扇面">扇面 (弧形)</option>
                  <option value="横长册页">横长册页 (横向)</option>
                  <option value="纵长立轴">纵长立轴 (纵向)</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>对应诗句</label>
                <textarea name="poem" placeholder="输入与画面意境相符的诗词句..." style={{ ...inputStyle, height: '80px', resize: 'none' }} />
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={labelStyle}>上传作品文件 (可多选)</label>
                <input type="file" multiple accept="image/*,video/*" style={{ fontSize: '13px' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <button type="button" onClick={() => setShowUpload(false)} style={{ flex: 1, padding: '12px', background: 'none', border: '1px solid #ddd', cursor: 'pointer' }}>取消</button>
                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#333', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>确认提交</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 样式常量
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', boxSizing: 'border-box' };
const labelStyle: React.CSSProperties = { fontSize: '13px', fontWeight: 'bold', color: '#666' };

export default App;