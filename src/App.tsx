import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// ==========================================
// 1. 样式锁定区
// ==========================================
const sh: React.CSSProperties = { fontSize: '16px', marginBottom: '15px', borderLeft: '4px solid #000', paddingLeft: '10px' };
const imgBox: React.CSSProperties = { backgroundColor: '#fff', padding: '30px', border: '1px solid #ddd', marginBottom: '20px' };
const pageH: React.CSSProperties = { fontSize: '20px', fontWeight: 'bold', fontStyle: 'italic', marginBottom: '30px', color: '#000', borderBottom: '2px solid #000', display: 'inline-block' };
const iS: React.CSSProperties = { width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' };
const uB: React.CSSProperties = { marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px', fontSize: '11px' };

const flipBtnS: React.CSSProperties = {
  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
  backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff', border: 'none',
  padding: '20px 10px', cursor: 'pointer', fontSize: '24px', zIndex: 10,
  borderRadius: '4px', transition: 'background 0.3s'
};

// ==========================================
// 2. 课程内容锁定区
// ==========================================
const BASIC_INFO = (
  <ul style={{ listStyle: 'none', padding: 0, fontSize: '12px', lineHeight: '1.8', color: '#666', marginLeft: '5px' }}>
    <li style={{ color: '#666', fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap' }}>《艺术与设计思维专题5：中国传统山水的意象与空间》</li>
    <li style={{ color: '#999', fontSize: '10px', marginBottom: '5px' }}>Topic 5: The Imagery and Space of Chinese Traditional Landscape</li>
    <li>2026春季学期</li>
    <li>指导教师：邵星宇 | 助教：张羽欣 李亚文</li>
  </ul>
);

const COURSE_GOAL = (
  <div style={{ backgroundColor: '#fff', padding: '40px 50px', borderRadius: '4px', maxWidth: '1000px', lineHeight: '2.2', fontSize: '15px', color: '#333', textAlign: 'justify' }}>
    <p style={{ marginBottom: '20px' }}><b>1. 知识方面：</b>建立对于中国传统山水的基本元素、构图原则，以及中国古典园林空间特征、组织方式的初步认识。</p>
    <p style={{ marginBottom: '20px' }}><b>2. 操作方面：</b>通过“设计工作室”式教学法，强调“从做中学”。</p>
    <p style={{ marginBottom: '20px' }}><b>3. 技法方面：</b>掌握基本的中国传统山水构图技巧，模型制作和摄影方法。</p>
    <p><b>5. 课程思政方面：</b>增强学生对于中国传统山水文化的理解，提升中华文化自信。</p>
  </div>
);

// 🌟 核心修正：自动生成 30 张图片路径 (对应您 public 文件夹下的 manual_01.jpg 到 manual_30.jpg)
const MANUAL_IMAGES = Array.from({ length: 30 }, (_, i) => 
  `/manual_${(i + 1).toString().padStart(2, '0')}.jpg`
);

// ==========================================
// 3. 主程序逻辑
// ==========================================
interface Work {
  id?: number;
  name: string;
  student_id: string;
  window_type: string;
  poem: string;
  image_url: string; 
  video_url: string; 
  album_images: string[]; 
}

function App() {
  const [page, setPage] = useState<'home' | 'gallery'>('home');
  const [contentMode, setContentMode] = useState<'works' | 'topic' | 'goal' | 'manual-view'>('works');
  const [currentManualPage, setCurrentManualPage] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [works, setWorks] = useState<Work[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [filterName, setFilterName] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('全部');

  const fetchWorks = async () => {
    const { data } = await supabase.from('works').select('*').order('created_at', { ascending: false });
    if (data) setWorks(data);
  };

  useEffect(() => { fetchWorks(); }, []);

  const filteredWorks = works.filter(work => {
    const nameMatch = filterName ? work.name === filterName : true;
    const typeMatch = filterType === '全部' ? true : work.window_type === filterType;
    return nameMatch && typeMatch;
  });

  const studentNames = Array.from(new Set(works.map(w => w.name)));

  const changeManualPage = (direction: number) => {
    setCurrentManualPage((prev) => {
      const nextP = prev + direction;
      if (nextP < 0) return MANUAL_IMAGES.length - 1;
      if (nextP >= MANUAL_IMAGES.length) return 0;
      return nextP;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    // ... (此处保持您原有的 Supabase 上传逻辑)
    setIsSubmitting(false);
  };

  const getWindowStyle = (type: string): React.CSSProperties => {
    const baseStyle: React.CSSProperties = { overflow: 'hidden', backgroundColor: '#000', border: '1px solid #eee' };
    switch (type) {
      case '圆形团扇': return { ...baseStyle, borderRadius: '50%', width: '150px', height: '150px' };
      case '扇面': return { ...baseStyle, width: '200px', height: '120px', borderRadius: '8px' };
      case '纵长立轴': return { ...baseStyle, width: '120px', height: '180px', borderRadius: '2px' };
      case '横长册页': return { ...baseStyle, width: '200px', height: '130px', borderRadius: '4px' };
      default: return { ...baseStyle, width: '150px', height: '150px', borderRadius: '4px' };
    }
  };

  if (page === 'home') {
    return (
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#fff', overflow: 'hidden' }}>
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 8%' }}>
          <h1 style={{ fontSize: '100px', fontWeight: 'bold', margin: '0 0 20px 0', letterSpacing: '10px' }}>山水图窗</h1>
          {BASIC_INFO}
          <button onClick={() => { setPage('gallery'); setContentMode('works'); }} style={{ marginTop:'60px', width: 'fit-content', padding: '12px 50px', backgroundColor: '#f5f5f5', border: 'none', fontSize: '20px', cursor: 'pointer' }}>点击进入</button>
        </div>
        <div style={{ flex: '1.2' }}><img src="/long-cover.png" alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff', fontFamily: 'sans-serif' }}>
      {/* 左侧菜单 */}
      <div style={{ width: '25%', padding: '30px', position: 'fixed', height: '100vh', borderRight: '1px solid #eee', overflowY: 'auto', boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: '32px', margin: '0 0 25px 0', fontWeight: 'bold', cursor: 'pointer', borderBottom: '1px solid #000', paddingBottom:'10px' }} onClick={() => setContentMode('works')}>山水图窗</h1>
        <section style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '20px', fontStyle: 'italic', fontWeight: 'bold', marginBottom: '10px' }}>基本信息</h2>
          {BASIC_INFO}
        </section>
        <section style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '20px', fontStyle: 'italic', fontWeight: 'bold', marginBottom: '8px' }}>课程介绍</h2>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '12px', lineHeight: '2', color: '#666' }}>
            <li onClick={() => setContentMode('topic')} style={{ cursor: 'pointer', textDecoration: contentMode === 'topic' ? 'underline' : 'none' }}>• 选题依据</li>
            <li onClick={() => setContentMode('goal')} style={{ cursor: 'pointer', textDecoration: contentMode === 'goal' ? 'underline' : 'none' }}>• 课程目标</li>
          </ul>
        </section>
        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />
        <section style={{ marginBottom: '25px' }}>
          <h2 onClick={() => { setContentMode('manual-view'); setCurrentManualPage(0); }} style={{ fontSize: '20px', fontStyle: 'italic', fontWeight: 'bold', cursor: 'pointer', textDecoration: contentMode === 'manual-view' ? 'underline' : 'none' }}>山水画谱</h2>
        </section>
        <section style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '20px', fontStyle: 'italic', fontWeight: 'bold', marginBottom: '8px' }}>成果&展示</h2>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '12px', lineHeight: '2.2' }}>
            <li onClick={() => setContentMode('works')} style={{ cursor: 'pointer', textDecoration: contentMode === 'works' ? 'underline' : 'none' }}>• 作业展示</li>
            <li onClick={() => setShowUpload(true)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>• 作业提交</li>
          </ul>
        </section>
        <button onClick={() => setPage('home')} style={{ background: 'none', border: '1px solid #000', padding: '6px 15px', cursor: 'pointer', fontSize: '11px', marginTop: '20px' }}>返回封面</button>
      </div>

      {/* 右侧内容 */}
      <div style={{ marginLeft: '25%', flex: 1, height: '100vh', overflowY: 'auto', backgroundColor: '#f9f9f9', boxSizing: 'border-box' }}>
        
        {contentMode === 'manual-view' && (
          <div style={{ padding: '40px 60px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h2 style={pageH}>· 山水画谱</h2>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <button style={{ ...flipBtnS, left: '20px' }} onClick={() => changeManualPage(-1)}>&#10094;</button>
              
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  key={currentManualPage}
                  src={MANUAL_IMAGES[currentManualPage]} 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                  alt={`画谱第 ${currentManualPage + 1} 页`}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Found'; }}
                />
              </div>

              <button style={{ ...flipBtnS, right: '20px' }} onClick={() => changeManualPage(1)}>&#10095;</button>
              <div style={{ position: 'absolute', bottom: '15px', fontSize: '14px', color: '#999', fontWeight: 'bold' }}>
                {currentManualPage + 1} / {MANUAL_IMAGES.length}
              </div>
            </div>
          </div>
        )}

        {contentMode === 'works' && (
          <div style={{ padding: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '30px 15px' }}>
              {filteredWorks.map((work) => (
                <div key={work.id} onClick={() => setSelectedWork(work)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '8px' }}>
                    <div style={getWindowStyle(work.window_type)}>
                      <img src={work.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="work" />
                    </div>
                  </div>
                  <p style={{ fontWeight: 'bold', margin: '0' }}>{work.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {contentMode === 'goal' && <div style={{ padding: '40px 60px' }}><h2 style={pageH}>· 课程目标</h2>{COURSE_GOAL}</div>}
        {contentMode === 'topic' && (
          <div style={{ padding: '40px 60px' }}>
            <h2 style={pageH}>· 选题依据</h2>
            {[1, 2, 3, 4, 5].map(i => <div key={i} style={imgBox}><img src={`/topic_${i}.jpg`} style={{ width: '100%' }} alt="topic" /></div>)}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
