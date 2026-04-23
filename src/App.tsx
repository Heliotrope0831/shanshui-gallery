import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // 确保你已经创建了这个文件

interface Work {
  id?: number;
  name: string;
  student_id: string;
  window_type: string;
  poem: string;
  image_url: string;
}

function App() {
  const [page, setPage] = useState<'home' | 'gallery'>('home');
  const [showUpload, setShowUpload] = useState(false);
  const [works, setWorks] = useState<Work[]>([]);

  // 1. 从 Supabase 读取数据
  const fetchWorks = async () => {
    const { data, error } = await supabase
      .from('works')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setWorks(data);
    if (error) console.error('读取数据失败:', error);
  };

  useEffect(() => {
    if (page === 'gallery') fetchWorks();
  }, [page]);

  // 2. 提交数据到 Supabase
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;

    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        
        const { error } = await supabase.from('works').insert([{
          name: formData.get('name'),
          student_id: formData.get('student_id'),
          window_type: formData.get('windowType'), // 注意这里对应 select 的 name
          poem: formData.get('poem'),
          image_url: base64Data
        }]);

        if (!error) {
          fetchWorks(); // 刷新页面列表
          setShowUpload(false);
        } else {
          alert('提交失败，请检查数据库权限或字段名称');
          console.error(error);
        }
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  };

  // --- 首页视图 ---
  if (page === 'home') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f7f5', fontFamily: 'serif' }}>
        <div style={{ flex: '4.5', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 60px' }}>
          <h1 style={{ fontSize: '72px', letterSpacing: '8px' }}>山水图窗</h1>
          <p>《艺术与设计思维专题5》作品展</p>
          <button onClick={() => setPage('gallery')} style={{ marginTop: '30px', padding: '12px 40px', cursor: 'pointer', border: '1px solid #000', backgroundColor: '#fff' }}>点击进入</button>
        </div>
        <div style={{ flex: '5.5' }}>
          <img src="/long-cover.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="封面" />
        </div>
      </div>
    );
  }

  // --- 展示页视图 ---
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* 侧边栏 */}
      <div style={{ width: '300px', borderRight: '1px solid #eee', padding: '40px 20px', position: 'fixed', height: '100vh' }}>
        <h1 style={{ fontSize: '42px', borderBottom: '2px solid #333', paddingBottom: '10px' }}>山水图窗</h1>
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ fontStyle: 'italic' }}>成果&展示</h3>
          <p onClick={() => setShowUpload(true)} style={{ color: 'blue', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}>● 作业提交</p>
          <button onClick={() => setPage('home')} style={{ marginTop: '20px', cursor: 'pointer' }}>返回封面</button>
        </div>
      </div>

      {/* 核心：四种窗户形制的瀑布流展示 */}
      <div style={{ marginLeft: '300px', flex: 1, padding: '40px' }}>
        <div style={{ columnCount: 3, columnGap: '25px' }}>
          {works.map((work, index) => {
            // 精准形状逻辑
            let shapeStyle: React.CSSProperties = {
              width: '100%', overflow: 'hidden', backgroundColor: '#f0f0f0', marginBottom: '15px'
            };

            if (work.window_type === '圆形团扇') {
              shapeStyle.aspectRatio = '1/1';
              shapeStyle.borderRadius = '50%';
            } else if (work.window_type === '扇面') {
              shapeStyle.aspectRatio = '2/1';
              shapeStyle.clipPath = 'ellipse(100% 100% at 50% 100%)';
            } else if (work.window_type === '纵长立轴') {
              shapeStyle.aspectRatio = '1/2.5';
            } else if (work.window_type === '横长册页') {
              shapeStyle.aspectRatio = '16/9';
            }

            return (
              <div key={index} style={{ breakInside: 'avoid', marginBottom: '30px', border: '1px solid #f0f0f0', padding: '10px' }}>
                <div style={shapeStyle}>
                  <img src={work.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="作品" />
                </div>
                <div style={{ fontSize: '13px' }}>
                  <p><b>{work.name}</b> | {work.window_type}</p>
                  <p style={{ color: '#666', fontStyle: 'italic' }}>“{work.poem}”</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 提交弹窗 */}
      {showUpload && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', width: '400px', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center' }}>提交作业</h2>
            <form onSubmit={handleSubmit}>
              <input name="name" placeholder="姓名" required style={inputS} />
              <input name="student_id" placeholder="学号" required style={inputS} />
              <select name="windowType" style={inputS}>
                <option value="圆形团扇">圆形团扇</option>
                <option value="扇面">扇面</option>
                <option value="横长册页">横长册页</option>
                <option value="纵长立轴">纵长立轴</option>
              </select>
              <textarea name="poem" placeholder="诗句意境..." style={{ ...inputS, height: '60px' }} />
              <input type="file" accept="image/*" required style={{ marginBottom: '20px' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowUpload(false)} style={{ flex: 1 }}>取消</button>
                <button type="submit" style={{ flex: 1, backgroundColor: '#333', color: '#fff', cursor: 'pointer' }}>提交到云端</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputS = { width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' as 'border-box' };

export default App;