import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

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

  const fetchWorks = async () => {
    const { data, error } = await supabase
      .from('works')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setWorks(data);
  };

  useEffect(() => {
    if (page === 'gallery') fetchWorks();
  }, [page]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;

    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const { error } = await supabase.from('works').insert([{
          name: formData.get('name'),
          student_id: formData.get('student_id'),
          window_type: formData.get('window_type'),
          poem: formData.get('poem'),
          image_url: reader.result as string
        }]);
        if (!error) { fetchWorks(); setShowUpload(false); }
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  };

  if (page === 'home') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f7f5' }}>
        <div style={{ flex: '4.5', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 60px' }}>
          <h1 style={{ fontSize: '72px', letterSpacing: '8px' }}>山水图窗</h1>
          <button onClick={() => setPage('gallery')} style={{ marginTop: '30px', padding: '12px 40px', cursor: 'pointer', border: '1px solid #000', backgroundColor: '#fff' }}>点击进入</button>
        </div>
        <div style={{ flex: '5.5' }}><img src="/long-cover.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* --- 左侧侧边栏：精准还原设计稿 --- */}
      <div style={{ width: '350px', borderRight: '1px solid #ddd', padding: '40px 30px', position: 'fixed', height: '100vh', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '56px', margin: '0 0 10px 0', fontWeight: 'bold' }}>山水图窗</h1>
        <hr style={{ border: 'none', borderTop: '1px solid #000', marginBottom: '40px' }} />

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontStyle: 'italic', marginBottom: '20px' }}>基本信息</h2>
          <ul style={{ listStyle: 'none', padding: 0, lineHeight: '1.8', fontSize: '15px' }}>
            <li style={{ marginBottom: '10px' }}>● 《艺术与设计思维专题5：中国传统山水的意象与空间》</li>
            <li style={{ color: '#888', fontSize: '12px', marginBottom: '15px' }}>Topic 5: The Imagery and Space of Chinese Traditional Landscape</li>
            <li>● 2026年 春季学期</li>
            <li>● 指导教师：邵星宇</li>
          </ul>
          <hr style={{ border: 'none', borderTop: '1px solid #ddd', marginTop: '30px' }} />
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontStyle: 'italic', marginBottom: '20px' }}>课程介绍</h2>
          <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2', fontSize: '16px' }}>
            <li>● 选题依据</li>
            <li>● 课程目标</li>
            <li>● 课程安排</li>
          </ul>
          <hr style={{ border: 'none', borderTop: '1px solid #ddd', marginTop: '30px' }} />
        </section>

        <section>
          <h2 style={{ fontSize: '32px', fontStyle: 'italic', marginBottom: '20px' }}>成果&展示</h2>
          <p onClick={() => setShowUpload(true)} style={{ color: '#000', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
            ● 作业提交
          </p>
          <hr style={{ border: 'none', borderTop: '1px solid #ddd', marginTop: '30px' }} />
          <button onClick={() => setPage('home')} style={{ marginTop: '20px', padding: '5px 15px', cursor: 'pointer', background: 'none', border: '1px solid #ccc' }}>返回封面</button>
        </section>
      </div>

      {/* --- 右侧展示区 --- */}
      <div style={{ marginLeft: '350px', flex: 1, padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '18px' }}>共 <strong style={{ fontSize: '24px' }}>{works.length}</strong> 件作品</span>
          <button style={{ backgroundColor: '#999', color: '#fff', border: 'none', padding: '10px 50px', borderRadius: '25px', cursor: 'pointer' }}>检索</button>
        </div>

        <div style={{ columnCount: 3, columnGap: '20px' }}>
          {works.map((work) => (
            <div key={work.id} style={{ breakInside: 'avoid', marginBottom: '40px', textAlign: 'left' }}>
              <div style={{ 
                width: '100%', 
                aspectRatio: work.window_type === '纵长立轴' ? '1/2.5' : (work.window_type === '扇面' ? '2/1' : '1/1'),
                borderRadius: work.window_type === '圆形团扇' ? '50%' : '0',
                clipPath: work.window_type === '扇面' ? 'ellipse(100% 100% at 50% 100%)' : 'none',
                overflow: 'hidden', backgroundColor: '#f0f0f0', border: '1px solid #eee'
              }}>
                <img src={work.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#333', lineHeight: '1.6' }}>
                <p style={{ margin: 0 }}>姓名/学号：{work.name} {work.student_id}</p>
                <p style={{ margin: 0 }}>窗户类型：{work.window_type}</p>
                <p style={{ margin: 0 }}>诗句：{work.poem}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 弹窗代码保持不变... */}
      {showUpload && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', width: '400px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>提交作业</h2>
            <form onSubmit={handleSubmit}>
              <input name="name" placeholder="姓名" required style={inS} />
              <input name="student_id" placeholder="学号" required style={inS} />
              <select name="window_type" style={inS}>
                <option value="圆形团扇">圆形团扇</option>
                <option value="扇面">扇面</option>
                <option value="横长册页">横长册页</option>
                <option value="纵长立轴">纵长立轴</option>
              </select>
              <textarea name="poem" placeholder="诗句" style={{ ...inS, height: '60px' }} />
              <input type="file" accept="image/*" required style={{ marginBottom: '20px' }} />
              <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#333', color: '#fff', cursor: 'pointer' }}>提交并保存到云端</button>
              <button type="button" onClick={() => setShowUpload(false)} style={{ width: '100%', marginTop: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>取消</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inS = { width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' as 'border-box' };

export default App;